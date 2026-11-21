import { mockAllSites } from '@/mocks';
import type { Site, SiteId } from '@/types';

/** 프론트 사이트 id → 백엔드 구매(platform) 이름 */
export const SITE_PLATFORM: Record<SiteId, string> = {
  coupang: '쿠팡',
  naver: '네이버',
  '11st': '11번가',
  netflix: '넷플릭스',
  etc: '기타',
};

/**
 * 프론트 사이트 id → 백엔드 내장 규정 id (app/data/builtin_policies.json).
 * 백엔드에 내장 규정이 없는 사이트는 null.
 */
export const SITE_POLICY_ID: Record<SiteId, string | null> = {
  coupang: 'coupang',
  '11st': '11st',
  naver: null,
  netflix: null,
  etc: null,
};

const norm = (s: string) => s.toLowerCase().replace(/\s/g, '');

/** 백엔드 platform 이름 → 화면용 사이트 (모르는 쇼핑몰은 '기타' 칩, 이름은 그대로) */
export function siteForPlatform(platform: string): Site {
  const target = norm(platform);
  const id = (Object.keys(SITE_PLATFORM) as SiteId[]).find(
    (k) => k !== 'etc' && (norm(SITE_PLATFORM[k]) === target || k === target),
  );
  const site = mockAllSites.find((s) => s.id === (id ?? 'etc'))!;
  return id ? site : { ...site, name: platform };
}

/** 환불 규정 결과 화면에 넘길 규정 id. 정기 구독·내장 규정 없음이면 null */
export function refundPolicyIdFor(siteId: SiteId, purchaseType: 'general' | 'subscription'): string | null {
  return purchaseType === 'general' ? SITE_POLICY_ID[siteId] : null;
}
