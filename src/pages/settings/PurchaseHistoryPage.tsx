import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ChipTabs from '@/components/common/ChipTabs';
import SiteChip from '@/components/common/SiteChip';
import { ROUTES } from '@/constants/routes';
import { MOCK_TODAY, mockAllSites } from '@/mocks';
import { mockPurchases } from '@/mocks/purchases';
import type { Purchase, PurchaseStatus } from '@/types';
import { diffDays, formatDDay } from '@/utils/date';
import { formatWon } from '@/utils/format';

type Filter = 'all' | Exclude<PurchaseStatus, 'subscribed'>;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'refundable', label: '환불 가능' },
  { id: 'refunded', label: '환불 완료' },
  { id: 'expired', label: '기간 만료' },
];

const STATUS_STYLE: Record<PurchaseStatus, string> = {
  refundable: 'bg-green-100 text-green-600',
  subscribed: 'bg-amber-50 text-amber-700',
  refunded: 'bg-surface-muted text-gray-600',
  expired: 'bg-surface-muted text-gray-400',
};

function statusLabel(p: Purchase) {
  switch (p.status) {
    case 'refundable':
      return `${formatDDay(diffDays(p.deadline ?? MOCK_TODAY, MOCK_TODAY))} 환불 가능`;
    case 'subscribed':
      return '구독 중';
    case 'refunded':
      return '환불 완료';
    case 'expired':
      return '기간 만료';
  }
}

function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const site = mockAllSites.find((s) => s.id === purchase.siteId)!;
  const body = (
    <Card className="flex items-center gap-3.5 px-4.5 py-[22px]">
      <SiteChip siteId={site.id} label={site.initial} size="list" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-11 text-gray-400">{purchase.meta}</p>
        <p className="truncate text-16 font-bold text-ink">{purchase.productName}</p>
        <p className="text-13 text-gray-700">
          {purchase.isSubscription ? `월 ${formatWon(purchase.price)}` : formatWon(purchase.price)}
        </p>
      </div>
      <span className={`shrink-0 rounded-chip px-2.5 py-1.5 text-11 font-bold ${STATUS_STYLE[purchase.status]}`}>
        {statusLabel(purchase)}
      </span>
    </Card>
  );
  return purchase.scheduleId ? <Link to={ROUTES.schedulePolicy(purchase.scheduleId)}>{body}</Link> : body;
}

/** Figma: 06-2 · 구매내역 */
export default function PurchaseHistoryPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const refundable = mockPurchases.filter((p) => p.status === 'refundable');
  const summary = [
    { label: '전체 구매', value: `${mockPurchases.length}` },
    { label: '환불 가능', value: `${refundable.length}` },
    { label: '환불 가능 금액', value: formatWon(refundable.reduce((sum, p) => sum + p.price, 0)) },
  ];

  const groups = useMemo(() => {
    const list = mockPurchases.filter((p) => filter === 'all' || p.status === filter);
    const byMonth = new Map<string, Purchase[]>();
    list.forEach((p) => byMonth.set(p.month, [...(byMonth.get(p.month) ?? []), p]));
    return [...byMonth.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, [filter]);

  return (
    <>
      <Header variant="back" title="구매내역" />

      <main className="px-gutter pt-5 pb-7">
        <section aria-label="구매 요약" className="grid grid-cols-3 rounded-card bg-green-75 py-4 text-center">
          {summary.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-18 font-bold text-green-600">{value}</span>
              <span className="text-11 text-gray-500">{label}</span>
            </div>
          ))}
        </section>

        <ChipTabs tabs={FILTERS} value={filter} onChange={setFilter} label="구매내역 필터" className="mt-4" />

        {groups.length === 0 && <p className="pt-12 text-center text-13 text-gray-400">해당하는 구매내역이 없어요.</p>}

        {groups.map(([month, items]) => {
          const [y, m] = month.split('-').map(Number);
          return (
            <section key={month} className="mt-6">
              <h2 className="mb-3 px-0.5 text-13 font-bold text-gray-600">
                {y}년 {m}월
              </h2>
              <ul className="flex flex-col gap-3">
                {items.map((p) => (
                  <li key={p.id}>
                    <PurchaseCard purchase={p} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </>
  );
}
