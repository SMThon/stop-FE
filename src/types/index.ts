/** 쇼핑몰/서비스 */
export type SiteId = 'coupang' | 'naver' | '11st' | 'etc';

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

/** 일정 종류: 환불 마감 / 구독 결제 */
export type ScheduleKind = 'refund' | 'subscription';

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

export type LawTip = {
  label: string;
  before: string;
  highlight: string;
  after: string;
};

export type User = {
  name: string;
};
