import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';

type AppLayoutProps = {
  /** 하단 탭바 표시 여부 (로그인 화면 등에서는 false) */
  withNav?: boolean;
};

/** 모바일 앱 프레임: 최대 폭 390px 가운데 정렬 + 하단 탭바 고정 */
export default function AppLayout({ withNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-app">
      <div
        className={`relative mx-auto min-h-dvh w-full max-w-app bg-app ${
          withNav ? 'pb-[calc(var(--spacing-nav)+env(safe-area-inset-bottom))]' : ''
        }`}
      >
        <Outlet />
      </div>
      {withNav && <BottomNav />}
    </div>
  );
}
