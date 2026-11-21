import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '@/components/common/Header';
import IconButton from '@/components/common/IconButton';
import Card from '@/components/common/Card';
import SiteChip from '@/components/common/SiteChip';
import PrimaryButton from '@/components/common/PrimaryButton';
import OutlineButton from '@/components/common/OutlineButton';
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  LawIcon,
  LinkIcon,
  PlusIcon,
} from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { MOCK_TODAY, mockSites } from '@/mocks';
import { mockRefundPolicies } from '@/mocks/refundPolicies';
import { addDays, diffDays, formatFullDate, formatShortDate } from '@/utils/date';

const PURCHASE_TYPE_LABEL = { general: '일반 구매', subscription: '정기 구독' } as const;

/** Figma: 04 · 환불 규정 결과 (4:403) */
export default function RefundResultPage() {
  const navigate = useNavigate();
  const { policyId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const policy = mockRefundPolicies[policyId];

  const header = (
    <Header
      variant="back"
      title="환불 규정"
      right={
        <IconButton label="상품 등록" onClick={() => navigate(ROUTES.productNew)}>
          <PlusIcon size={22} />
        </IconButton>
      }
    />
  );

  if (!policy) {
    return (
      <>
        {header}
        <div className="flex flex-col items-center gap-4 px-gutter pt-16 text-center">
          <p className="text-15 font-bold text-ink">아직 준비 중인 규정이에요</p>
          <p className="text-13 text-gray-500">AI 상담에서 상황을 알려주시면 대신 찾아드릴게요.</p>
          <OutlineButton to={ROUTES.chat}>AI에게 물어보기</OutlineButton>
        </div>
      </>
    );
  }

  const site = mockSites.find((s) => s.id === policy.siteId)!;
  const receivedAt = searchParams.get('receivedAt') ?? policy.defaultReceivedAt;
  const deadline = addDays(receivedAt, policy.periodDays);
  const remaining = diffDays(deadline, MOCK_TODAY);
  const refundable = remaining >= 0;
  const progress = Math.min(100, Math.max(0, (diffDays(MOCK_TODAY, receivedAt) / policy.periodDays) * 100));

  return (
    <>
      {header}

      <main className="flex flex-col gap-3.5 px-gutter pt-5 pb-7">
        {/* 결과 요약 */}
        <section className="rounded-card bg-green-800 px-5.5 pt-6 pb-6">
          <div className="flex items-center gap-3.5">
            <SiteChip siteId={site.id} label={site.logo} size="xl" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-11 text-on-dark-400">
                {site.name} · {PURCHASE_TYPE_LABEL[policy.purchaseType]}
              </p>
              <h2 className="truncate text-17 font-bold text-white">{policy.productName}</h2>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3.5">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                refundable ? 'bg-green-200 text-green-900' : 'bg-coral-50 text-coral-600'
              }`}
            >
              <CheckIcon size={26} />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-11 text-on-dark-400">{refundable ? '현재 환불 가능' : '환불 기간 종료'}</p>
              <p className="text-22 font-bold text-white">
                {refundable ? `앞으로 ${remaining}일 남았어요` : '신청 기간이 지났어요'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-[7px] overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-green-200" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-10 text-on-dark-400">
              <span>수령일 {formatShortDate(receivedAt)}</span>
              <span>환불 마감 {formatShortDate(deadline)}</span>
            </div>
          </div>
        </section>

        {/* 환불 가능 기간 */}
        <Card as="section" className="p-5.5">
          <h2 className="flex items-center gap-2.5 text-16 font-bold text-ink">
            <ClockIcon size={22} className="text-green-600" />
            환불 가능 기간
          </h2>
          <p className="mt-3.5 text-13 leading-[22px] whitespace-pre-line text-gray-600">
            {policy.periodDescription.before}
            <strong className="font-bold text-green-600">{policy.periodDescription.highlight}</strong>
            {policy.periodDescription.after}
          </p>
          <div className="mt-3.5 flex h-[42px] items-center justify-between rounded-control bg-green-100 px-4">
            <span className="text-12 text-gray-500">신청 가능 마감</span>
            <span className="text-13 font-bold text-green-600">
              {formatFullDate(deadline)} {policy.deadlineTime}
            </span>
          </div>
        </Card>

        {/* 꼭 확인하세요 */}
        <Card as="section" className="p-5.5">
          <h2 className="flex items-center gap-2.5 text-16 font-bold text-ink">
            <CheckIcon size={22} className="text-green-600" />
            꼭 확인하세요
          </h2>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {policy.checklist.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-12 text-gray-600">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        {/* 관련 법령 */}
        <a
          href={policy.law.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3.5 rounded-card bg-olive-50 px-4.5 py-[18px]"
        >
          <LawIcon size={26} className="shrink-0 text-olive-700" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-10 text-olive-600">관련 법령</span>
            <span className="text-13 font-bold text-olive-900">{policy.law.title}</span>
          </span>
          <ChevronRightIcon size={20} className="shrink-0 text-olive-600" />
        </a>

        <OutlineButton href={policy.originalUrl} leadingIcon={<LinkIcon size={18} />}>
          {site.name} 원문 규정 보기
        </OutlineButton>
        <PrimaryButton to={ROUTES.productNew} leadingIcon={<CalendarIcon size={20} />}>
          환불 마감일 알림 등록
        </PrimaryButton>
      </main>
    </>
  );
}
