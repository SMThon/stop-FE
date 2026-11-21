export const ROUTES = {
  login: '/login',
  home: '/',
  schedule: '/schedule',
  refundSearch: '/refund',
  refundResult: (policyId: string | number = ':policyId') => `/refund/${policyId}`,
  chat: '/chat',
  settings: '/settings',
  notificationSettings: '/settings/notifications',
  purchases: '/settings/purchases',
  withdraw: '/settings/withdraw',
  productNew: '/products/new',
} as const;
