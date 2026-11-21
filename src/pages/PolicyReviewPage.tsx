import { useState, type ComponentType } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import SiteChip from '@/components/common/SiteChip';
import PrimaryButton from '@/components/common/PrimaryButton';
import OutlineButton from '@/components/common/OutlineButton';
import {
  AlertCircleIcon,
  BoxIcon,
  CardIcon,
  InfoIcon,
  LinkIcon,
  SwapIcon,
  TruckIcon,
  type IconProps,
} from '@/components/icons';
import { MOCK_TODAY, mockSites } from '@/mocks';
import { mockPolicyReviews } from '@/mocks/policyReviews';
import type { ClaimSection, ClaimType } from '@/types';
import { diffDays, formatDDay, formatMonthDay } from '@/utils/date';
import { formatWon } from '@/utils/format';

type Tab = 'all' | ClaimType;

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: '한눈에 보기' },
  { id: 'refund', label: '환불' },
  { id: 'return', label: '반품' },
  { id: 'exchange', label: '교환' },
];

const CLAIM_COLUMNS: { id: ClaimType; label: string }[] = [
  { id: 'refund', label: '환불' },
  { id: 'return', label: '반품' },
  { id: 'exchange', label: '교환' },
];

const SECTION_ICON: Record<ClaimType, ComponentType<IconProps>> = {
  refund: CardIcon,
  return: BoxIcon,
  exchange: SwapIcon,
};

/** 0원 = 초록, 유료 = 코랄 */
const feeText = (fee: number) => (fee > 0 ? 'text-coral-600' : 'text-green-600');

function ClaimSectionCard({ section }: { section: ClaimSection }) {
  const Icon = SECTION_ICON[section.type];
  return (
    <Card as="section" className={`px-5 pt-5 ${section.note ? 'pb-[18px]' : 'pb-5'}`}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-15 font-bold text-ink">
          <span className="flex size-[34px] items-center justify-center rounded-icon bg-green-100 text-green-600">
            <Icon size={20} />
          </span>
          {section.title}
        </h2>
        <span className="flex h-6 items-center rounded-lg bg-surface-muted px-2.5 text-11 font-bold text-green-600">
          {section.badge}
        </span>
      </div>

      <p className="mt-3 text-12 leading-[20px] text-gray-600">{section.description}</p>

      <ul className="mt-3 flex flex-col gap-2">
        {section.items.map((item) => (
          <li
            key={item.label}
            className={`flex h-[52px] items-center justify-between rounded-control px-3.5 ${
              item.fee > 0 ? 'bg-coral-25' : 'bg-green-100'
            }`}
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-12 font-bold text-ink">{item.label}</span>
              <span className="text-10 text-gray-500">{item.description}</span>
            </span>
            <span className={`text-15 font-bold ${feeText(item.fee)}`}>{formatWon(item.fee)}</span>
          </li>
        ))}
      </ul>

      {section.note && <p className="mt-3 text-10 leading-[16px] text-gray-400">{section.note}</p>}
    </Card>
  );
}

/** Figma: 02-1 · 규정 다시보기 — 내 일정의 '규정 다시보기'에서 진입 */
export default function PolicyReviewPage() {
  const { scheduleId = '' } = useParams();
  const [tab, setTab] = useState<Tab>('all');
  const review = mockPolicyReviews[scheduleId];

  if (!review) {
    return (
      <>
        <Header variant="back" title="규정 다시보기" />
        <p className="px-gutter pt-10 text-center text-14 text-gray-500">규정 정보를 찾을 수 없어요.</p>
      </>
    );
  }

  const site = mockSites.find((s) => s.id === review.siteId)!;
  const sections = review.sections.filter((s) => tab === 'all' || s.type === tab);
  const heroStats = [
    { label: '수령일', value: formatMonthDay(review.receivedAt) },
    { label: '신청 마감', value: `${formatMonthDay(review.deadline)} ${review.deadlineTime}` },
    { label: '결제 금액', value: formatWon(review.price) },
  ];

  return (
    <>
      <Header variant="back" title="규정 다시보기" />

      <main className="flex flex-col gap-3.5 px-gutter pt-5 pb-7">
        {/* 구매 요약 */}
        <section className="rounded-card bg-green-800 p-5">
          <div className="flex items-center gap-3">
            <SiteChip siteId={site.id} label={site.logo} size="lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-11 text-on-dark-400">{[site.name, ...review.tags].join(' · ')}</p>
              <h2 className="truncate text-17 font-bold text-white">{review.productName}</h2>
            </div>
            <span className="shrink-0 rounded-chip bg-coral-50 px-2.5 py-1 text-12 font-bold text-coral-600">
              {formatDDay(diffDays(review.deadline, MOCK_TODAY))}
            </span>
          </div>
          <dl className="mt-4 flex justify-between rounded-control bg-white/8 px-3.5 pt-[11px] pb-2.5">
            {heroStats.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-[3px]">
                <dt className="text-11 text-on-dark-400">{label}</dt>
                <dd className="text-13 font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 탭 */}
        <div role="tablist" aria-label="규정 보기 방식" className="flex gap-1.5">
          {TABS.map(({ id, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={`h-8 rounded-full px-3.5 text-12 ${
                  active ? 'bg-green-700 font-bold text-white' : 'border border-line-strong bg-surface font-medium text-gray-600'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 한눈에 보는 배송비 */}
        {tab === 'all' && (
          <Card as="section" className="px-5 py-5">
            <h2 className="flex items-center gap-2 text-15 font-bold text-ink">
              <TruckIcon size={18} className="text-green-600" />
              한눈에 보는 배송비
            </h2>
            <table className="mt-7 w-full">
              <thead>
                <tr className="text-11 font-medium text-gray-500">
                  <th className="pb-3 text-left font-medium">
                    <span className="sr-only">사유</span>
                  </th>
                  {CLAIM_COLUMNS.map((c) => (
                    <th key={c.id} className="w-[70px] pb-3 font-medium">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {review.feeTable.map((row) => (
                  <tr key={row.label} className="h-[53px] border-t border-line-soft">
                    <th scope="row" className="p-0 text-left font-normal">
                      <span className="block text-12 font-bold text-ink">{row.label}</span>
                      <span className="mt-0.5 block text-10 text-gray-400">{row.description}</span>
                    </th>
                    {CLAIM_COLUMNS.map((c) => (
                      <td key={c.id} className={`p-0 text-center text-14 font-bold ${feeText(row.fees[c.id])}`}>
                        {formatWon(row.fees[c.id])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 flex items-center gap-1.5 text-10 text-gray-400">
              <InfoIcon size={14} className="shrink-0" />
              {review.feeNote}
            </p>
          </Card>
        )}

        {sections.map((section) => (
          <ClaimSectionCard key={section.type} section={section} />
        ))}

        {/* 주의 사항 */}
        {tab !== 'refund' && (
          <section className="rounded-card border border-coral-100 bg-coral-25 px-5 pt-[21px] pb-4.5">
            <h2 className="flex items-center gap-2.5 text-14 font-bold text-coral-700">
              <AlertCircleIcon size={18} className="text-coral-600" />
              이런 경우엔 반품·교환이 어려워요
            </h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {review.cautions.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-12 text-coral-900">
                  <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-coral-400" />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 출처 */}
        <p className="flex items-start gap-3 rounded-box bg-olive-50 px-4 pt-2.5 pb-3.5 text-11 leading-[19px] text-olive-900">
          <InfoIcon size={16} className="mt-[5px] shrink-0 text-olive-700" />
          <span>
            {review.source} · {formatMonthDay(review.checkedAt)} 확인
          </span>
        </p>

        <OutlineButton href={review.originalUrl} leadingIcon={<LinkIcon size={18} />}>
          {site.name} 원문 규정 보기
        </OutlineButton>
        <PrimaryButton href={review.applyUrl}>{site.name}에서 반품 신청하기</PrimaryButton>
      </main>
    </>
  );
}
