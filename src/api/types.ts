/** 백엔드 응답 타입 (stop-BE/backend-fastapi/app/schemas 와 1:1, camelCase) */

export type Level = 'red' | 'yellow' | 'green' | 'gray';

export type ApiUser = { id: string; email: string; createdAt: string };

export type TokenResponse = { accessToken: string; tokenType: 'bearer' };

export type ReturnFee = {
  basicFee: number | null;
  roundTripFee: number | null;
  currency: 'KRW' | 'USD';
  note: string;
};

export type Defect = {
  fromReceiptMonths: number | null;
  fromDiscoveryDays: number | null;
  note: string;
};

export type ApiPolicy = {
  id: string;
  platform: string;
  siteUrl: string | null;
  /** null = 미확인 */
  returnDays: number | null;
  baseDate: 'receivedDate' | 'orderDate';
  includeStartDay: boolean;
  holidayAdjustment: 'not-applied';
  returnFee: ReturnFee;
  exclusions: string[];
  howTo: string | null;
  defect: Defect;
  sourceUrl: string | null;
  collectedAt: string | null;
  evidenceNote: string;
  sourceType: 'built-in' | 'user-input';
  verificationStatus: 'verified' | 'unverified';
};

export type ApiPurchaseStatus = '보관 중' | '반품 신청' | '환불 완료' | '기한 지남';
export type EditablePurchaseStatus = Exclude<ApiPurchaseStatus, '기한 지남'>;

export type ApiPurchase = {
  id: string;
  platform: string;
  policyId: string | null;
  productName: string;
  price: number;
  orderDate: string;
  receivedDate: string | null;
  status: ApiPurchaseStatus;
  /** 규정이 없거나 기간 미확인이면 null */
  deadline: string | null;
  dday: number | null;
  level: Level | null;
  policy: ApiPolicy | null;
  createdAt: string;
};

export type PurchaseCreateBody = {
  platform: string;
  policyId?: string | null;
  productName: string;
  price: number;
  orderDate: string;
  receivedDate?: string | null;
};

export type PurchaseUpdateBody = Partial<PurchaseCreateBody> & { status?: EditablePurchaseStatus };

export type CalendarEvent = {
  date: string;
  type: 'refund' | 'custom';
  /** refund → 구매 id, custom → 일정 id */
  refId: string;
  title: string;
  dday: number;
  level: Level;
};

export type CalendarResponse = { month: string; events: CalendarEvent[]; imminentCount: number };
export type UpcomingResponse = { items: CalendarEvent[]; imminentCount: number };

export type ApiEvent = { id: string; title: string; date: string; memo: string | null };

export type NotificationSettings = { enabled: boolean; daysBefore: number[] };

export type LegalCheckResponse = { answer: string; basis: string[]; disclaimer: string };
