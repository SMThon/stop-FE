import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ChipTabs from '@/components/common/ChipTabs';
import SiteChip from '@/components/common/SiteChip';
import { ErrorMessage, LoadingMessage } from '@/components/common/StatusMessage';
import { ROUTES } from '@/constants/routes';
import { siteForPlatform } from '@/constants/sites';
import { purchaseApi, type ApiPurchase, type ApiPurchaseStatus } from '@/api';
import { useAsync } from '@/hooks/useAsync';
import { formatDDay, formatShortDate } from '@/utils/date';
import { formatWon } from '@/utils/format';

type Filter = 'all' | ApiPurchaseStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: '보관 중', label: '환불 가능' },
  { id: '반품 신청', label: '반품 신청' },
  { id: '환불 완료', label: '환불 완료' },
  { id: '기한 지남', label: '기간 만료' },
];

const STATUS_STYLE: Record<ApiPurchaseStatus, string> = {
  '보관 중': 'bg-green-100 text-green-600',
  '반품 신청': 'bg-amber-50 text-amber-700',
  '환불 완료': 'bg-surface-muted text-gray-600',
  '기한 지남': 'bg-surface-muted text-gray-400',
};

function statusLabel(p: ApiPurchase) {
  switch (p.status) {
    case '보관 중':
      return p.dday != null ? `${formatDDay(p.dday)} 환불 가능` : '기한 미확인';
    case '기한 지남':
      return '기간 만료';
    default:
      return p.status;
  }
}

function PurchaseCard({ purchase }: { purchase: ApiPurchase }) {
  const site = siteForPlatform(purchase.platform);
  const meta = purchase.receivedDate
    ? `${site.name} · ${formatShortDate(purchase.receivedDate)} 수령`
    : `${site.name} · ${formatShortDate(purchase.orderDate)} 주문`;
  return (
    <Link to={ROUTES.schedulePolicy(purchase.id)}>
      <Card className="flex items-center gap-3.5 px-4.5 py-[22px]">
        <SiteChip siteId={site.id} label={site.initial} size="list" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-11 text-gray-400">{meta}</p>
          <p className="truncate text-16 font-bold text-ink">{purchase.productName}</p>
          <p className="text-13 text-gray-700">{formatWon(purchase.price)}</p>
        </div>
        <span className={`shrink-0 rounded-chip px-2.5 py-1.5 text-11 font-bold ${STATUS_STYLE[purchase.status]}`}>
          {statusLabel(purchase)}
        </span>
      </Card>
    </Link>
  );
}

/** Figma: 06-2 · 구매내역 */
export default function PurchaseHistoryPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const { data: purchases, error, loading, reload } = useAsync(() => purchaseApi.list(), []);

  const all = purchases ?? [];
  const refundable = all.filter((p) => p.status === '보관 중' && p.deadline);
  const summary = [
    { label: '전체 구매', value: `${all.length}` },
    { label: '환불 가능', value: `${refundable.length}` },
    { label: '환불 가능 금액', value: formatWon(refundable.reduce((sum, p) => sum + p.price, 0)) },
  ];

  const groups = useMemo(() => {
    const list = all.filter((p) => filter === 'all' || p.status === filter);
    const byMonth = new Map<string, ApiPurchase[]>();
    list.forEach((p) => {
      const month = (p.receivedDate ?? p.orderDate).slice(0, 7);
      byMonth.set(month, [...(byMonth.get(month) ?? []), p]);
    });
    return [...byMonth.entries()].sort(([a], [b]) => b.localeCompare(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchases, filter]);

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

        <ChipTabs tabs={FILTERS} value={filter} onChange={setFilter} label="구매내역 필터" className="mt-4 overflow-x-auto" />

        {loading && !purchases && <LoadingMessage />}
        {error && <ErrorMessage error={error} onRetry={reload} />}
        {purchases && groups.length === 0 && (
          <p className="pt-12 text-center text-13 text-gray-400">해당하는 구매내역이 없어요.</p>
        )}

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
