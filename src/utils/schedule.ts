import type { CalendarEvent } from '@/api';
import { siteForPlatform } from '@/constants/sites';
import type { ScheduleKind, Site } from '@/types';

const REFUND_SUFFIX = ' 환불 마감';

export type ScheduleView = {
  key: string;
  kind: ScheduleKind;
  /** refund → 구매 id */
  refId: string;
  date: string;
  dday: number;
  /** 예: 에어프라이어 */
  shortTitle: string;
  /** 예: 쿠팡 에어프라이어 */
  title: string;
  site: Site | null;
};

/** 백엔드 캘린더 이벤트(title: '쿠팡 · 에어프라이어 환불 마감')를 화면용으로 변환 */
export function toScheduleView(e: CalendarEvent): ScheduleView {
  const key = `${e.type}-${e.refId}`;
  if (e.type === 'custom') {
    return { key, kind: 'custom', refId: e.refId, date: e.date, dday: e.dday, shortTitle: e.title, title: e.title, site: null };
  }
  const body = e.title.endsWith(REFUND_SUFFIX) ? e.title.slice(0, -REFUND_SUFFIX.length) : e.title;
  const [platform, ...rest] = body.split(' · ');
  const product = rest.join(' · ') || platform;
  return {
    key,
    kind: 'refund',
    refId: e.refId,
    date: e.date,
    dday: e.dday,
    shortTitle: product,
    title: rest.length ? `${platform} ${product}` : product,
    site: siteForPlatform(platform),
  };
}
