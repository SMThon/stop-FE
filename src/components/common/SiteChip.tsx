import type { SiteId } from '@/types';
import { PlusIcon } from '@/components/icons';

/** 쇼핑몰별 칩 색 (토큰 클래스만 사용) */
const TONE: Record<SiteId, string> = {
  coupang: 'bg-site-coupang-bg text-site-coupang',
  naver: 'bg-site-naver text-white',
  '11st': 'bg-site-11st text-white',
  etc: 'bg-surface-sunken text-gray-600',
};

type SiteChipProps = {
  siteId: SiteId;
  /** 칩 안 글자 (site.initial 또는 site.logo) */
  label: string;
};

/** 34px 쇼핑몰 아이콘 칩 (Figma: site/* 의 Frame, c-logo) */
export default function SiteChip({ siteId, label }: SiteChipProps) {
  return (
    <span
      aria-hidden
      className={`flex size-[34px] shrink-0 items-center justify-center rounded-icon text-13 font-bold ${TONE[siteId]}`}
    >
      {siteId === 'etc' ? <PlusIcon size={18} /> : label}
    </span>
  );
}
