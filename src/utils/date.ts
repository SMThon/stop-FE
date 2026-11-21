const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** 'YYYY-MM-DD' → 로컬 Date (시간대 영향 없이) */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** target - base 일수 (D-day 계산용) */
export function diffDays(target: string, base: string): number {
  const ms = parseDate(target).getTime() - parseDate(base).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatDDay(days: number): string {
  if (days === 0) return 'D-Day';
  return days > 0 ? `D-${days}` : `D+${-days}`;
}

export function weekdayLabel(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

export { WEEKDAYS };

/** 해당 월의 달력 칸(앞쪽 이전 달 날짜 포함, 7의 배수)을 반환 */
export function buildMonthGrid(year: number, month: number): { date: Date; inMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = first.getDay(); i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, next++), inMonth: false });
  }
  return cells;
}

/** 'YYYY-MM-DD' → '5월 10일' */
export function formatMonthDay(iso: string): string {
  const d = parseDate(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** 'YYYY-MM-DD' + n일 → 'YYYY-MM-DD' */
export function addDays(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** 'YYYY-MM-DD' → '5.10' */
export function formatShortDate(iso: string): string {
  const d = parseDate(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

/** 'YYYY-MM-DD' → '2025년 5월 17일' */
export function formatFullDate(iso: string): string {
  const d = parseDate(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
