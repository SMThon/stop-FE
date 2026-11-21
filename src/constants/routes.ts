export const ROUTES = {
  login: '/login',
  home: '/',
  schedule: '/schedule',
  schedulePolicy: (scheduleId: string = ':scheduleId') => `/schedule/${scheduleId}/policy`,
  refundSearch: '/refund',
  refundResult: (policyId: string | number = ':policyId') => `/refund/${policyId}`,
  chat: '/chat',
  settings: '/settings',
  notificationSettings: '/settings/notifications',
  purchases: '/settings/purchases',
  withdraw: '/settings/withdraw',
  /** 상품 등록은 일정 탭 하위 (하단 탭 '일정' 활성) */
  productNew: '/schedule/new',
} as const;
