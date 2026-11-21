import SiteChip from './SiteChip';
import { CheckIcon } from '@/components/icons';
import { mockSites, mockSubscriptionSites } from '@/mocks';
import type { PurchaseType, SiteId } from '@/types';

const PURCHASE_TYPES: { id: PurchaseType; label: string }[] = [
  { id: 'general', label: '일반 구매' },
  { id: 'subscription', label: '정기 구독' },
];

type Props<T> = { value: T; onChange: (value: T) => void; className?: string };

/** 구매 유형별로 선택 가능한 사이트 (정기 구독 → OTT 서비스 + 기타) */
const ETC_SITE = mockSites.find((s) => s.id === 'etc')!;
const SUBSCRIPTION_SITES = [...mockSubscriptionSites, ETC_SITE];
export const sitesFor = (type: PurchaseType) => (type === 'subscription' ? SUBSCRIPTION_SITES : mockSites);

/** 일반 구매 / 정기 구독 세그먼트 (Figma: 01 Type Tabs, 03 STEP 1) */
export function PurchaseTypeTabs({ value, onChange, className = '' }: Props<PurchaseType>) {
  return (
    <div role="radiogroup" aria-label="구매 유형" className={`flex gap-1 rounded-control bg-surface-muted p-1 ${className}`}>
      {PURCHASE_TYPES.map(({ id, label }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-icon text-13 font-medium ${
              active ? 'bg-surface text-green-600 shadow-tab' : 'text-gray-600'
            }`}
          >
            <span
              aria-hidden
              className={`size-4 rounded-full bg-surface ${
                active ? 'border-[5px] border-green-400' : 'border-[1.5px] border-gray-400'
              }`}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** 구매 사이트 선택 타일 (Figma: 01 Site Grid, 03 STEP 2) */
export function SiteSelector({
  value,
  onChange,
  purchaseType = 'general',
  className = '',
}: Props<SiteId> & { purchaseType?: PurchaseType }) {
  return (
    <div role="radiogroup" aria-label="구매처" className={`flex gap-2 ${className}`}>
      {sitesFor(purchaseType).map((site) => {
        const active = value === site.id;
        return (
          <button
            key={site.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(site.id)}
            className={`relative flex h-[88px] min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-control text-12 ${
              active
                ? 'border-[1.5px] border-green-300 bg-green-50 font-bold text-green-600'
                : 'border border-line font-medium text-gray-600'
            }`}
          >
            <SiteChip siteId={site.id} label={site.initial} />
            {site.name}
            {active && (
              <span
                aria-hidden
                className="absolute -top-[9.5px] -right-[6.5px] flex size-[22px] items-center justify-center rounded-full border-2 border-white bg-green-400 text-white"
              >
                <CheckIcon size={12} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
