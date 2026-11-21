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
import { siteForPlatform } from '@/constants/sites';
import { ApiError, policyApi } from '@/api';
import { useAsync } from '@/hooks/useAsync';
import { ErrorMessage, LoadingMessage } from '@/components/common/StatusMessage';
import { diffDays, formatFullDate, formatShortDate, todayISO } from '@/utils/date';
import { BASE_DATE_LABEL, computeDeadline } from '@/utils/policy';

const LAW = { title: '전자상거래법 제17조 청약철회', url: 'https://www.law.go.kr/법령/전자상거래등에서의소비자보호에관한법률' };
const DEFAULT_CHECKLIST = ['상품이 훼손되지 않은 상태여야 해요.', '구성품과 사은품을 함께 반품해야 해요.'];

/** Figma: 04 · 환불 규정 결과 (4:403) */
export default function RefundResultPage() {
  const navigate = useNavigate();
  const { policyId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { data: policy, error, loading, reload } = useAsync(() => policyApi.get(policyId), [policyId]);

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

  if (loading && !policy) return <>{header}<LoadingMessage /></>;
  if (error && !(error instanceof ApiError && error.status === 404)) {
    return <>{header}<ErrorMessage error={error} onRetry={reload} /></>;
  }

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

  const site = siteForPlatform(policy.platform);
  const today = todayISO();
  const receivedAt = searchParams.get('receivedAt') || today;
  const baseLabel = BASE_DATE_LABEL[policy.baseDate];
  // 기준일이 주문일인 규정은 입력한 날짜를 주문일로 간주
  const deadline = computeDeadline(policy, receivedAt, receivedAt);
  const remaining = deadline ? diffDays(deadline, today) : null;
  const refundable = remaining == null || remaining >= 0;
  const progress =
    deadline && policy.returnDays
      ? Math.min(100, Math.max(0, (diffDays(today, receivedAt) / policy.returnDays) * 100))
      : 0;
  const checklist = policy.exclusions.length > 0 ? policy.exclusions.slice(0, 4) : DEFAULT_CHECKLIST;
  const registerTo = `${ROUTES.productNew}?site=${site.id}&receivedAt=${receivedAt}`;

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
                {site.name} · 일반 구매 · {policy.verificationStatus === 'verified' ? '공식 규정 확인' : '미검증 규정'}
              </p>
              <h2 className="truncate text-17 font-bold text-white">{policy.platform} 환불 규정</h2>
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
              <p className="text-11 text-on-dark-400">
                {remaining == null ? '반품 기간 미확인' : refundable ? '현재 환불 가능' : '환불 기간 종료'}
              </p>
              <p className="text-22 font-bold text-white">
                {remaining == null
                  ? '원문 규정을 확인해 주세요'
                  : refundable
                    ? `앞으로 ${remaining}일 남았어요`
                    : '신청 기간이 지났어요'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-[7px] overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-green-200" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-10 text-on-dark-400">
              <span>
                {baseLabel} {formatShortDate(receivedAt)}
              </span>
              <span>환불 마감 {deadline ? formatShortDate(deadline) : '미확인'}</span>
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
            {policy.returnDays == null ? (
              '판매처 규정에서 반품 가능 기간을 확인하지 못했어요.'
            ) : (
              <>
                {`단순 변심의 경우 상품 ${baseLabel}로부터
`}
                <strong className="font-bold text-green-600">{policy.returnDays}일 이내</strong> 환불을 신청할 수 있어요.
              </>
            )}
          </p>
          <div className="mt-3.5 flex h-[42px] items-center justify-between rounded-control bg-green-100 px-4">
            <span className="text-12 text-gray-500">신청 가능 마감</span>
            <span className="text-13 font-bold text-green-600">
              {deadline ? `${formatFullDate(deadline)} 23:59` : '미확인'}
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
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-12 text-gray-600">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        {/* 관련 법령 */}
        <a
          href={LAW.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3.5 rounded-card bg-olive-50 px-4.5 py-[18px]"
        >
          <LawIcon size={26} className="shrink-0 text-olive-700" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-10 text-olive-600">관련 법령</span>
            <span className="text-13 font-bold text-olive-900">{LAW.title}</span>
          </span>
          <ChevronRightIcon size={20} className="shrink-0 text-olive-600" />
        </a>

        {(policy.sourceUrl ?? policy.siteUrl) && (
          <OutlineButton href={(policy.sourceUrl ?? policy.siteUrl)!} leadingIcon={<LinkIcon size={18} />}>
            {site.name} 원문 규정 보기
          </OutlineButton>
        )}
        <PrimaryButton to={registerTo} leadingIcon={<CalendarIcon size={20} />}>
          환불 마감일 알림 등록
        </PrimaryButton>
      </main>
    </>
  );
}
