import { createContext, useContext, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi, tokenStore, type ApiUser } from '@/api';
import { useAsync } from '@/hooks/useAsync';
import { ErrorMessage, LoadingMessage } from '@/components/common/StatusMessage';
import { ROUTES } from '@/constants/routes';

export type CurrentUser = ApiUser & { name: string; initial: string };

const UserContext = createContext<CurrentUser | null>(null);

function toCurrentUser(user: ApiUser): CurrentUser {
  const name = user.email.split('@')[0];
  return { ...user, name, initial: name.charAt(0).toUpperCase() };
}

/** 로그인한 사용자 정보 (RequireAuth 안에서만 사용) */
export function useUser(): CurrentUser {
  const user = useContext(UserContext);
  if (!user) throw new Error('useUser는 RequireAuth 안에서만 사용할 수 있어요.');
  return user;
}

/** 토큰이 없으면 로그인 화면으로, 있으면 /api/auth/me로 사용자 확인 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hasToken = !!tokenStore.get();
  const { data, error, loading, reload } = useAsync(() => (hasToken ? authApi.me() : Promise.resolve(null)), [hasToken]);

  if (!hasToken) return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  if (loading && !data) return <LoadingMessage />;
  if (error) return <ErrorMessage error={error} onRetry={reload} />;
  if (!data) return null;

  return <UserContext.Provider value={toCurrentUser(data)}>{children}</UserContext.Provider>;
}
