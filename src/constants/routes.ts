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
  productNew: '/products/new',
} as const;
