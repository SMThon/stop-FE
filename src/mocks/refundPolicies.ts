import type { RefundPolicy } from '@/types';

/** 04 환불 규정 결과 mock (id = `${siteId}-${purchaseType}`) */
export const mockRefundPolicies: Record<string, RefundPolicy> = {
  'coupang-general': {
    id: 'coupang-general',
    siteId: 'coupang',
    purchaseType: 'general',
    productName: '에어프라이어',
    defaultReceivedAt: '2025-05-10',
    periodDays: 7,
    deadlineTime: '23:59',
    periodDescription: {
      before: '단순 변심의 경우 상품 수령일로부터\n',
      highlight: '7일 이내',
      after: ' 환불을 신청할 수 있어요.',
    },
    checklist: [
      '상품이 훼손되지 않은 상태여야 해요.',
      '구성품과 사은품을 함께 반품해야 해요.',
      '단순 변심 시 반품 배송비가 발생할 수 있어요.',
    ],
    law: { title: '전자상거래법 제17조 청약철회', url: 'https://www.law.go.kr' },
    originalUrl: 'https://www.coupang.com',
  },
};
