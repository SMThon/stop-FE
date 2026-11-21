import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import IconButton from '@/components/common/IconButton';
import Card from '@/components/common/Card';
import PrimaryButton from '@/components/common/PrimaryButton';
import SiteChip from '@/components/common/SiteChip';
import DDayBadge, { SCHEDULE_DOT } from '@/components/common/DDayBadge';
import {
  ArrowRightIcon,
  BellIcon,
  ChatIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  LawIcon,
} from '@/components/icons';
import trainArt from '@/assets/illustrations/train-art.svg';
import { ROUTES } from '@/constants/routes';
import { MOCK_TODAY, mockLawTip, mockSchedules, mockSites, mockUser } from '@/mocks';
import type { PurchaseType, Schedule, SiteId } from '@/types';
import { diffDays, formatDDay, parseDate } from '@/utils/date';

const PURCHASE_TYPES: { id: PurchaseType; label: string }[] = [
  { id: 'general', label: '일반 구매' },
  { id: 'subscription', label: '정기 구독' },
];

const UPCOMING_SUBTITLE: Record<Schedule['kind'], string> = {
  refund: '환불 신청 마감일',
  subscription: '다음 구독 결제일',
};

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <h2 className="flex items-center gap-2.5 font-bold">
      <span className="text-13 text-green-500">{index}</span>
      <span className="text-19 tracking-title text-ink">{title}</span>
    </h2>
  );
}

function MoreLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="flex items-center gap-0.5 text-12 text-gray-500">
      {children}
      <ChevronRightIcon size={14} />
    </Link>
  );
}

/** 구매 → 오늘 → 마감 진행 표시의 정거장 점 */
function StationDot({ tone, size }: { tone: 'green' | 'amber' | 'empty'; size: 16 | 20 }) {
  const ring = { green: 'border-green-400', amber: 'border-amber-400', empty: 'border-gray-300' }[tone];
  const dot = { green: 'bg-green-400', amber: 'bg-amber-400', empty: '' }[tone];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border-[1.5px] bg-surface ${ring} ${
        size === 16 ? 'size-4' : 'size-5'
      }`}
    >
      {tone !== 'empty' && <span className={`rounded-full ${dot} ${size === 16 ? 'size-2' : 'size-2.5'}`} />}
    </span>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('general');
  const [siteId, setSiteId] = useState<SiteId>('coupang');

  const upcoming = useMemo(
    () =>
      mockSchedules
        .filter((s) => diffDays(s.date, MOCK_TODAY) >= 0)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [],
  );
  const nearestRefund = upcoming.find((s) => s.kind === 'refund');
  const nearestSite = mockSites.find((s) => s.id === nearestRefund?.siteId);

  const refundTarget =
    siteId === 'etc' ? ROUTES.refundSearch : ROUTES.refundResult(`${siteId}-${purchaseType}`);

  return (
    <>
      <Header
        variant="brand"
        right={
          <IconButton label="알림 설정" badge onClick={() => navigate(ROUTES.notificationSettings)}>
            <BellIcon size={22} />
          </IconButton>
        }
      />

      <main className="flex flex-col gap-5 pb-8">
        {/* 히어로 + 가장 가까운 마감 카드 */}
        <div>
          <section className="relative h-[236px] overflow-hidden bg-green-900 px-6 pt-[30px]">
            <img
              src={trainArt}
              alt=""
              width={200}
              height={112}
              className="pointer-events-none absolute top-[82px] -right-6"
            />
            <p className="text-13 text-on-dark-400">안녕하세요, {mockUser.name}님</p>
            <h2 className="relative mt-[9px] text-28 leading-display font-bold tracking-display text-white">
              놓치기 쉬운 환불,
              <br />
              <span className="text-green-200">제때 알려드릴게요.</span>
            </h2>
          </section>

          {nearestRefund && (
            <div className="relative -mt-8 px-gutter">
              <Card elevated className="flex flex-col gap-3.5 px-5.5 pt-5 pb-4.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-12 font-medium text-gray-600">
                    <ClockIcon size={16} />
                    가장 가까운 마감
                  </span>
                  <MoreLink to={ROUTES.schedule}>전체보기</MoreLink>
                </div>

                <div className="flex items-center gap-3.5">
                  <span className="flex size-[52px] shrink-0 items-center justify-center rounded-tile bg-coral-50 text-16 font-bold text-coral-600">
                    {formatDDay(diffDays(nearestRefund.date, MOCK_TODAY))}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-15 font-bold text-ink">{nearestRefund.shortTitle}</p>
                    <p className="text-12 text-gray-500">
                      {parseDate(nearestRefund.date).getMonth() + 1}월 {parseDate(nearestRefund.date).getDate()}
                      일까지 환불 가능
                    </p>
                  </div>
                  {nearestSite && <SiteChip siteId={nearestSite.id} label={nearestSite.logo} />}
                </div>

                <div aria-hidden className="flex items-center px-1 pt-1.5">
                  <StationDot tone="green" size={16} />
                  <span className="h-0.5 flex-1 bg-line-strong" />
                  <StationDot tone="amber" size={20} />
                  <span className="h-0.5 flex-1 bg-line-strong" />
                  <StationDot tone="empty" size={16} />
                </div>
                <div className="flex justify-between text-10 text-gray-400">
                  <span>구매</span>
                  <span>오늘</span>
                  <span>마감</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 px-gutter">
          {/* 01 환불 규정 찾아보기 */}
          <Card as="section" className="p-5.5">
            <SectionTitle index="01" title="환불 규정 찾아보기" />
            <p className="mt-2 text-13 text-gray-500">구매 정보를 선택하면 바로 찾아드려요.</p>

            <div role="radiogroup" aria-label="구매 유형" className="mt-5 flex gap-1 rounded-control bg-surface-muted p-1">
              {PURCHASE_TYPES.map(({ id, label }) => {
                const active = purchaseType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPurchaseType(id)}
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

            <div role="radiogroup" aria-label="구매처" className="mt-3 flex gap-2">
              {mockSites.map((site) => {
                const active = siteId === site.id;
                return (
                  <button
                    key={site.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSiteId(site.id)}
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

            <PrimaryButton to={refundTarget} className="mt-4.5" trailingIcon={<ArrowRightIcon size={20} />}>
              환불 규정 확인하기
            </PrimaryButton>
          </Card>

          {/* 02 다가오는 일정 */}
          <Card as="section" className="flex flex-col gap-1 px-5.5 pt-5.5 pb-2.5">
            <div className="flex items-center justify-between">
              <SectionTitle index="02" title="다가오는 일정" />
              <MoreLink to={ROUTES.schedule}>캘린더 보기</MoreLink>
            </div>
            <ul>
              {upcoming.slice(0, 2).map((s) => {
                const date = parseDate(s.date);
                return (
                  <li key={s.id} className="border-b border-line-soft last:border-b-0">
                    <Link to={ROUTES.schedule} className="flex h-[76px] items-center gap-3.5">
                      <span className="flex w-9 shrink-0 flex-col items-center">
                        <span className="text-10 text-gray-400">{date.getMonth() + 1}월</span>
                        <span className="text-21 font-bold text-ink">{date.getDate()}</span>
                      </span>
                      <span aria-hidden className={`size-[7px] shrink-0 rounded-full ${SCHEDULE_DOT[s.kind]}`} />
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate text-15 font-medium text-ink">{s.shortTitle}</span>
                        <span className="text-12 text-gray-500">{UPCOMING_SUBTITLE[s.kind]}</span>
                      </span>
                      <DDayBadge kind={s.kind}>{formatDDay(diffDays(s.date, MOCK_TODAY))}</DDayBadge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* AI 배너 */}
          <Link to={ROUTES.chat} className="flex items-center gap-3.5 rounded-card bg-green-800 px-5 py-5.5">
            <span className="flex size-[52px] shrink-0 items-center justify-center rounded-tile bg-white/8 text-green-200">
              <ChatIcon size={24} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
              <span className="text-10 font-black tracking-label text-on-dark-accent">AI REFUND GUIDE</span>
              <span className="text-15 font-bold tracking-snug text-white">환불 가능한지 AI에게 물어보세요</span>
              <span className="text-12 text-on-dark-300 min-[390px]:whitespace-nowrap">상황에 맞는 규정과 대응 방법을 알려드려요.</span>
            </span>
            <ChevronRightIcon size={20} className="shrink-0 text-on-dark-200" />
          </Link>

          {/* 소비자 법령 카드 */}
          <Link
            to={ROUTES.refundSearch}
            className="flex items-center gap-3.5 rounded-card border border-olive-100 bg-olive-50 px-5 py-5.5"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-olive-200 text-olive-700">
              <LawIcon size={24} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-11 font-bold text-olive-600">{mockLawTip.label}</span>
              <span className="text-14 leading-body font-medium text-olive-900">
                {mockLawTip.before}
                <strong className="font-bold text-green-600">{mockLawTip.highlight}</strong>
                <br />
                {mockLawTip.after}
              </span>
            </span>
            <ChevronRightIcon size={18} className="shrink-0 text-olive-500" />
          </Link>
        </div>
      </main>
    </>
  );
}
