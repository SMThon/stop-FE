import type { Purchase } from '@/types';

export const mockPurchases: Purchase[] = [
  {
    id: 'p-1',
    siteId: 'coupang',
    productName: '에어프라이어',
    meta: '쿠팡 · 5.10 수령',
    price: 89000,
    month: '2025-05',
    status: 'refundable',
    deadline: '2025-05-17',
    scheduleId: 's-1',
  },
  {
    id: 'p-2',
    siteId: 'netflix',
    productName: '넷플릭스 스탠다드',
    meta: '정기 구독 · 매월 26일',
    price: 13500,
    isSubscription: true,
    month: '2025-05',
    status: 'subscribed',
  },
  {
    id: 'p-3',
    siteId: 'naver',
    productName: '무선 이어폰',
    meta: '네이버 · 4.18 수령',
    price: 129000,
    month: '2025-04',
    status: 'refunded',
  },
  {
    id: 'p-4',
    siteId: '11st',
    productName: '니트 가디건',
    meta: '11번가 · 4.02 수령',
    price: 39900,
    month: '2025-04',
    status: 'expired',
  },
];
