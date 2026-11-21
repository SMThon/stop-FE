import type { ScheduleKind } from '@/types';

const TONE: Record<ScheduleKind, string> = {
  refund: 'bg-coral-50 text-coral-600',
  subscription: 'bg-amber-50 text-amber-700',
};

/** 일정 종류별 점 색 */
export const SCHEDULE_DOT: Record<ScheduleKind, string> = {
  refund: 'bg-coral-400',
  subscription: 'bg-amber-400',
};

/** 일정 종류별 라벨 텍스트 색 */
export const SCHEDULE_TEXT: Record<ScheduleKind, string> = {
  refund: 'text-coral-600',
  subscription: 'text-amber-700',
};

export const SCHEDULE_LABEL: Record<ScheduleKind, string> = {
  refund: '환불 마감',
  subscription: '구독 결제',
};

/** D-day 작은 배지 (Figma: 다가오는 일정 행 오른쪽) */
export default function DDayBadge({ kind, children }: { kind: ScheduleKind; children: string }) {
  return (
    <span className={`shrink-0 rounded-chip px-[9px] py-1 text-11 font-bold ${TONE[kind]}`}>{children}</span>
  );
}
