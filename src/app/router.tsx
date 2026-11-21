import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import AppLayout from '@/layouts/AppLayout';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import SchedulePage from '@/pages/SchedulePage';
import RefundSearchPage from '@/pages/refund/RefundSearchPage';
import RefundResultPage from '@/pages/refund/RefundResultPage';
import ChatPage from '@/pages/ChatPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import NotificationSettingsPage from '@/pages/settings/NotificationSettingsPage';
import PurchaseHistoryPage from '@/pages/settings/PurchaseHistoryPage';
import WithdrawPage from '@/pages/settings/WithdrawPage';
import ProductRegisterPage from '@/pages/ProductRegisterPage';

// TODO: 로그인 연동 시 RequireAuth 가드 추가
export const router = createBrowserRouter([
  {
    element: <AppLayout withNav={false} />,
    children: [{ path: ROUTES.login, element: <LoginPage /> }],
  },
  {
    // Figma 확인: 탭 화면뿐 아니라 04 같은 하위 화면도 하단 탭바가 있음
    element: <AppLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.schedule, element: <SchedulePage /> },
      { path: ROUTES.refundSearch, element: <RefundSearchPage /> },
      { path: ROUTES.refundResult(), element: <RefundResultPage /> },
      { path: ROUTES.chat, element: <ChatPage /> },
      { path: ROUTES.settings, element: <SettingsPage /> },
      { path: ROUTES.notificationSettings, element: <NotificationSettingsPage /> },
      { path: ROUTES.purchases, element: <PurchaseHistoryPage /> },
      { path: ROUTES.withdraw, element: <WithdrawPage /> },
      { path: ROUTES.productNew, element: <ProductRegisterPage /> },
    ],
  },
]);
