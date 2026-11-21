import type { SiteId } from '@/types';
import { PlusIcon } from '@/components/icons';

/** 쇼핑몰별 칩 색 (토큰 클래스만 사용) */
const TONE: Record<SiteId, string> = {
  coupang: 'bg-site-coupang-bg text-site-coupang',
  naver: 'bg-site-naver text-white',
  '11st': 'bg-site-11st text-white',
  etc: 'bg-surface-sunken text-gray-600',
};

const SIZE = {
  md: 'size-[34px] rounded-icon text-13',
  lg: 'size-[46px] rounded-control text-20',
} as const;

type SiteChipProps = {
  siteId: SiteId;
  /** 칩 안 글자 (site.initial 또는 site.logo) */
  label: string;
  /** md = 34px(기본), lg = 46px(규정 다시보기 상단) */
  size?: keyof typeof SIZE;
};

/** 쇼핑몰 아이콘 칩 (Figma: site/* 의 Frame, c-logo) */
export default function SiteChip({ siteId, label, size = 'md' }: SiteChipProps) {
  return (
    <span aria-hidden className={`flex shrink-0 items-center justify-center font-bold ${SIZE[size]} ${TONE[siteId]}`}>
      {siteId === 'etc' ? <PlusIcon size={size === 'md' ? 18 : 22} /> : label}
    </span>
  );
}
