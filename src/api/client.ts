/**
 * 백엔드(stop-BE/backend-fastapi) 호출 공통 클라이언트.
 * - 개발: VITE_API_BASE_URL 미설정 시 '' → vite 프록시(/api → localhost:8000) 사용
 * - 배포: VITE_API_BASE_URL=https://<railway-도메인>
 * - 에러 응답 형식: { code, message } (FastAPI 검증 오류는 { detail: [...] })
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const TOKEN_KEY = 'refund-station.token';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* 저장 불가 환경 무시 */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* 무시 */
    }
  },
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  /** false면 401이어도 로그인 화면으로 보내지 않음 (로그인 요청 자체 등) */
  redirectOn401?: boolean;
};

function parseError(status: number, data: unknown): ApiError {
  if (data && typeof data === 'object') {
    const d = data as { code?: string; message?: string; detail?: unknown };
    if (d.message) return new ApiError(status, d.code ?? 'ERROR', d.message);
    if (Array.isArray(d.detail) && d.detail[0]?.msg) {
      return new ApiError(status, 'VALIDATION_ERROR', String(d.detail[0].msg).replace(/^Value error, /, ''));
    }
  }
  return new ApiError(status, 'ERROR', '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.');
}

export async function request<T>(path: string, { method = 'GET', body, query, redirectOn401 = true }: RequestOptions = {}): Promise<T> {
  const qs = query
    ? '?' +
      new URLSearchParams(
        Object.entries(query).flatMap(([k, v]) => (v === undefined ? [] : [[k, String(v)]])),
      ).toString()
    : '';

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}${qs}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', '서버에 연결할 수 없어요. 네트워크를 확인해 주세요.');
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && redirectOn401) {
      tokenStore.clear();
      if (!window.location.pathname.startsWith('/login')) window.location.replace('/login');
    }
    throw parseError(res.status, data);
  }
  return data as T;
}
