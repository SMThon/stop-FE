export type NotificationKey =
  | 'refundD3'
  | 'refundD1'
  | 'refundDDay'
  | 'paymentUpcoming'
  | 'trialEnding'
  | 'marketing';

export type NotificationItem = { key: NotificationKey; label: string; description: string };

export const NOTIFICATION_GROUPS: { title: string; items: NotificationItem[] }[] = [
  {
    title: '환불 마감 알림',
    items: [
      { key: 'refundD3', label: '마감 3일 전', description: 'D-3에 미리 알려드려요' },
      { key: 'refundD1', label: '마감 1일 전', description: '하루 전에 한 번 더 알려드려요' },
      { key: 'refundDDay', label: '마감 당일', description: '당일 오전에 마지막으로 알려드려요' },
    ],
  },
  {
    title: '구독 결제 알림',
    items: [
      { key: 'paymentUpcoming', label: '결제 예정 알림', description: '정기 결제 3일 전에 알려드려요' },
      { key: 'trialEnding', label: '무료 체험 종료 알림', description: '유료 전환 전에 알려드려요' },
    ],
  },
];

export const MARKETING_ITEM: NotificationItem = {
  key: 'marketing',
  label: '이벤트·혜택 알림',
  description: '새 기능과 소식을 알려드려요',
};

export const mockNotificationSettings = {
  enabled: true,
  time: '09:00',
  items: {
    refundD3: true,
    refundD1: true,
    refundDDay: true,
    paymentUpcoming: true,
    trialEnding: false,
    marketing: false,
  } satisfies Record<NotificationKey, boolean>,
};
