import type { ApiPolicy } from '@/api';
import { addDays } from './date';

export const BASE_DATE_LABEL: Record<ApiPolicy['baseDate'], string> = {
  receivedDate: '수령일',
  orderDate: '주문일',
};

/**
 * 백엔드 deadline.py 의 compute_refund_deadline 과 같은 규칙.
 * 마감일 = 기준일 + returnDays − (includeStartDay ? 1 : 0). 기간·기준일을 모르면 null.
 */
export function computeDeadline(
  policy: Pick<ApiPolicy, 'baseDate' | 'returnDays' | 'includeStartDay'>,
  orderDate: string | null,
  receivedDate: string | null,
): string | null {
  const base = policy.baseDate === 'orderDate' ? orderDate : receivedDate;
  if (!base || policy.returnDays == null || policy.returnDays < 1) return null;
  return addDays(base, policy.returnDays - (policy.includeStartDay ? 1 : 0));
}

/** 반품비 표기. 금액이 미확인이면 null */
export function feeLabel(fee: number | null, currency: ApiPolicy['returnFee']['currency']): string | null {
  if (fee == null) return null;
  return currency === 'USD' ? `$${fee}` : `${fee.toLocaleString('ko-KR')}원`;
}
