import { request, tokenStore } from './client';
import type {
  ApiEvent,
  ApiPolicy,
  ApiPurchase,
  ApiPurchaseStatus,
  ApiUser,
  CalendarResponse,
  LegalCheckResponse,
  NotificationSettings,
  PurchaseCreateBody,
  PurchaseUpdateBody,
  TokenResponse,
  UpcomingResponse,
} from './types';

export { ApiError, tokenStore } from './client';
export type * from './types';

export const authApi = {
  signup: (email: string, password: string) =>
    request<ApiUser>('/api/auth/signup', { method: 'POST', body: { email, password }, redirectOn401: false }),
  login: async (email: string, password: string) => {
    const res = await request<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      redirectOn401: false,
    });
    tokenStore.set(res.accessToken);
    return res;
  },
  logout: async () => {
    try {
      await request<void>('/api/auth/logout', { method: 'POST', redirectOn401: false });
    } finally {
      tokenStore.clear();
    }
  },
  me: () => request<ApiUser>('/api/auth/me'),
  withdraw: async (password: string) => {
    await request<void>('/api/auth/withdraw', { method: 'POST', body: { password }, redirectOn401: false });
    tokenStore.clear();
  },
};

export const policyApi = {
  list: (sourceType?: ApiPolicy['sourceType']) => request<ApiPolicy[]>('/api/policies', { query: { sourceType } }),
  get: (id: string) => request<ApiPolicy>(`/api/policies/${encodeURIComponent(id)}`),
};

export const purchaseApi = {
  list: (status?: ApiPurchaseStatus) => request<ApiPurchase[]>('/api/purchases', { query: { status } }),
  get: (id: string) => request<ApiPurchase>(`/api/purchases/${encodeURIComponent(id)}`),
  create: (body: PurchaseCreateBody) => request<ApiPurchase>('/api/purchases', { method: 'POST', body }),
  update: (id: string, body: PurchaseUpdateBody) =>
    request<ApiPurchase>(`/api/purchases/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  remove: (id: string) => request<void>(`/api/purchases/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export const eventApi = {
  create: (body: { title: string; date: string; memo?: string | null }) =>
    request<ApiEvent>('/api/events', { method: 'POST', body }),
  remove: (id: string) => request<void>(`/api/events/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export const calendarApi = {
  /** month: YYYY-MM */
  month: (month: string) => request<CalendarResponse>('/api/calendar', { query: { month } }),
  upcoming: (limit = 10) => request<UpcomingResponse>('/api/deadlines/upcoming', { query: { limit } }),
};

export const notificationApi = {
  get: () => request<NotificationSettings>('/api/notifications/settings'),
  put: (body: NotificationSettings) =>
    request<NotificationSettings>('/api/notifications/settings', { method: 'PUT', body }),
};

export const chatApi = {
  legalCheck: (question: string, policyId?: string | null) =>
    request<LegalCheckResponse>('/api/chat/legal-check', { method: 'POST', body: { question, policyId } }),
};
