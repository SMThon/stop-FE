import type { LawTip, MyStats, Schedule, Site, User } from '@/types';

/** mock 기준 '오늘' (Figma 시안 날짜: 2025-05-14). 실제 연동 시 new Date()로 교체 */
export const MOCK_TODAY = '2025-05-14';

export const mockUser: User = {
  name: '정거장',
  email: 'jeonggeojang@gmail.com',
  initial: 'J',
};

export const mockMyStats: MyStats = {
  products: 3,
  refunding: 1,
  chats: 12,
  purchases: 4,
};

export const APP_VERSION = '1.0.0';

export const mockSites: Site[] = [
  { id: 'coupang', name: '쿠팡', initial: '쿠', logo: 'C' },
  { id: 'naver', name: '네이버', initial: '네', logo: 'N' },
  { id: '11st', name: '11번가', initial: '1', logo: '11' },
  { id: 'etc', name: '기타', initial: '+', logo: '+' },
];

/** 정기 구독 탭에서 노출하는 구독 서비스 */
export const mockSubscriptionSites: Site[] = [
  { id: 'netflix', name: '넷플릭스', initial: 'N', logo: 'N' },
  { id: 'tving', name: '티빙', initial: 'T', logo: 'T' },
  { id: 'disney', name: '디즈니+', initial: 'D+', logo: 'D+' },
];

/** 구독 서비스까지 포함한 전체 서비스 목록 */
export const mockAllSites: Site[] = [...mockSites, ...mockSubscriptionSites];

export const mockSchedules: Schedule[] = [
  {
    id: 's-0',
    kind: 'refund',
    siteId: 'naver',
    title: '네이버 블루투스 이어폰',
    shortTitle: '네이버 블루투스 이어폰',
    date: '2025-05-06',
    purchasedAt: '2025-04-29',
    note: '23:59까지 환불 신청 가능',
    policyId: 'naver-general',
  },
  {
    id: 's-1',
    kind: 'refund',
    siteId: 'coupang',
    title: '쿠팡 에어프라이어',
    shortTitle: '쿠팡 에어프라이어',
    date: '2025-05-17',
    purchasedAt: '2025-05-10',
    note: '23:59까지 환불 신청 가능',
    policyId: 'coupang-general',
  },
  {
    id: 's-2',
    kind: 'subscription',
    siteId: 'netflix',
    title: '넷플릭스 스탠다드',
    shortTitle: '넷플릭스',
    date: '2025-05-26',
    note: '월 13,500원 정기 결제 예정',
  },
];

export const mockLawTip: LawTip = {
  label: '알아두면 좋은 소비자 법령',
  before: '전자상거래 상품은 수령 후 ',
  highlight: '7일 이내',
  after: '청약철회가 가능해요.',
};
