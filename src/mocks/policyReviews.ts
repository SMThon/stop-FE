import type { PolicyReview } from '@/types';

/** 02-1 규정 다시보기 mock (일정 id 기준) */
export const mockPolicyReviews: Record<string, PolicyReview> = {
  's-1': {
    scheduleId: 's-1',
    siteId: 'coupang',
    productName: '에어프라이어',
    tags: ['판매자 배송', '일반 구매'],
    receivedAt: '2025-05-10',
    deadline: '2025-05-17',
    deadlineTime: '23:59',
    price: 89000,
    feeTable: [
      { label: '단순 변심', description: '마음이 바뀐 경우', fees: { refund: 0, return: 5000, exchange: 5000 } },
      { label: '상품 하자', description: '불량·파손·오배송', fees: { refund: 0, return: 0, exchange: 0 } },
    ],
    feeNote: '환불은 출고 전 주문 취소 기준, 금액은 왕복 배송비예요.',
    sections: [
      {
        type: 'refund',
        title: '환불 (주문 취소)',
        badge: '출고 전까지',
        description: '상품이 출고되기 전이라면 바로 주문을 취소할 수 있어요. 결제 금액 89,000원이 전액 환불돼요.',
        items: [
          { label: '출고 전 취소', description: '배송 시작 전', fee: 0 },
          { label: '결제 수단 환불', description: '카드 3~5영업일 소요', fee: 0 },
        ],
        note: '이미 출고됐다면 반품으로 신청해야 해요.',
      },
      {
        type: 'return',
        title: '반품',
        badge: '수령 후 7일 이내',
        description:
          '단순 변심은 수령일로부터 7일 이내에 신청할 수 있어요. 상품 하자는 수령 후 3개월 이내, 하자를 안 날부터 30일 이내면 신청할 수 있어요.',
        items: [
          { label: '단순 변심 반품', description: '초기 배송비 2,500원 + 반품 배송비 2,500원', fee: 5000 },
          { label: '상품 하자·오배송', description: '판매자 부담', fee: 0 },
        ],
        note: '무료배송 상품을 단순 변심으로 반품하면 처음 배송비까지 왕복으로 청구돼요.',
      },
      {
        type: 'exchange',
        title: '교환',
        badge: '수령 후 7일 이내',
        description: '같은 상품의 다른 옵션(색상·용량)으로만 교환할 수 있어요. 재고가 없으면 반품으로 진행돼요.',
        items: [
          { label: '단순 변심 교환', description: '회수 2,500원 + 재발송 2,500원', fee: 5000 },
          { label: '상품 하자·오배송', description: '판매자 부담', fee: 0 },
        ],
      },
    ],
    cautions: [
      '사용하거나 훼손해서 상품 가치가 떨어진 경우',
      '포장을 훼손한 경우 (내용 확인용 개봉은 제외)',
      '시간이 지나 다시 판매하기 어려운 경우',
    ],
    source: '판매자가 상품 상세페이지에 등록한 정보와 전자상거래법 제17조 기준이에요.',
    checkedAt: '2025-05-14',
    originalUrl: 'https://www.coupang.com',
    applyUrl: 'https://www.coupang.com',
  },
};
