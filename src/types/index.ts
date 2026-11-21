/** 쇼핑몰/서비스 */
export type SiteId = 'coupang' | 'naver' | '11st' | 'netflix' | 'tving' | 'disney' | 'etc';

export type Site = {
  id: SiteId;
  name: string;
  /** 아이콘 칩에 표시할 한 글자 */
  initial: string;
  /** 로고 약자 (예: 쿠팡 → C) */
  logo: string;
};

/** 구매 유형 */
export type PurchaseType = 'general' | 'subscription';

/** 일정 종류: 환불 마감 / 구독 결제 / 직접 추가한 일정 */
export type ScheduleKind = 'refund' | 'subscription' | 'custom';

export type Schedule = {
  id: string;
  kind: ScheduleKind;
  siteId: SiteId;
  /** 일정 카드용 전체 이름 (예: 넷플릭스 스탠다드) */
  title: string;
  /** 홈 목록용 짧은 이름 (예: 넷플릭스) */
  shortTitle: string;
  /** 마감일 또는 결제일 (YYYY-MM-DD) */
  date: string;
  /** 구매일 (환불 일정만) */
  purchasedAt?: string;
  /** 일정 카드 보조 설명 */
  note: string;
  /** 환불 규정 결과(04) 화면 id */
  policyId?: string;
};

/** 처리 방식: 환불(주문 취소) / 반품 / 교환 */
export type ClaimType = 'refund' | 'return' | 'exchange';

export type FeeRow = {
  label: string;
  description: string;
  /** 처리 방식별 왕복 배송비(원) */
  fees: Record<ClaimType, number>;
};

export type ClaimSection = {
  type: ClaimType;
  title: string;
  /** 오른쪽 기한 배지 (예: 수령 후 7일 이내) */
  badge: string;
  description: string;
  items: { label: string; description: string; fee: number }[];
  note?: string;
};

/** 02-1 규정 다시보기: 일정(구매 건)별 규정 요약 */
export type PolicyReview = {
  scheduleId: string;
  siteId: SiteId;
  productName: string;
  /** 예: 판매자 배송 · 일반 구매 */
  tags: string[];
  receivedAt: string;
  deadline: string;
  /** HH:mm */
  deadlineTime: string;
  price: number;
  feeTable: FeeRow[];
  feeNote: string;
  sections: ClaimSection[];
  cautions: string[];
  /** 출처 안내 */
  source: string;
  checkedAt: string;
  originalUrl: string;
  applyUrl: string;
};

/** 04 환불 규정 결과 (쇼핑몰 + 구매 유형별) */
export type RefundPolicy = {
  id: string;
  siteId: SiteId;
  purchaseType: PurchaseType;
  /** 예시 상품명 (상품 등록 연동 전 mock) */
  productName: string;
  /** 수령일 기본값 (YYYY-MM-DD) */
  defaultReceivedAt: string;
  /** 환불 가능 기간(일) */
  periodDays: number;
  deadlineTime: string;
  periodDescription: { before: string; highlight: string; after: string };
  checklist: string[];
  law: { title: string; url: string };
  originalUrl: string;
};

/** 05 AI 상담 메시지. text 안의 **강조**는 초록 굵게 표시 */
export type ChatMessage = {
  id: string;
  role: 'ai' | 'user';
  text: string;
  time: string;
  /** AI 답변 아래 '관련 법령 확인' 링크 */
  lawUrl?: string;
  /** AI 답변의 근거 (법령 조항·규정 항목) */
  basis?: string[];
  /** 요청 실패 안내 메시지 */
  failed?: boolean;
};

/** 06-2 구매내역 */
export type PurchaseStatus = 'refundable' | 'subscribed' | 'refunded' | 'expired';

export type Purchase = {
  id: string;
  siteId: SiteId;
  productName: string;
  /** 예: 5.10 수령 / 매월 26일 */
  meta: string;
  price: number;
  /** 정기 구독이면 월 요금 표기 */
  isSubscription?: boolean;
  /** 구매(수령) 월 YYYY-MM */
  month: string;
  status: PurchaseStatus;
  /** 환불 가능일 때 마감일 */
  deadline?: string;
  /** 연결된 일정 (규정 다시보기) */
  scheduleId?: string;
};

export type LawTip = {
  label: string;
  before: string;
  highlight: string;
  after: string;
};

export type User = {
  name: string;
  email: string;
  /** 아바타에 표시할 이니셜 */
  initial: string;
};

export type MyStats = {
  products: number;
  refunding: number;
  chats: number;
  purchases: number;
};
