import { useState, type ComponentType, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import SiteChip from '@/components/common/SiteChip';
import PrimaryButton from '@/components/common/PrimaryButton';
import OutlineButton from '@/components/common/OutlineButton';
import ChipTabs from '@/components/common/ChipTabs';
import CautionCard from '@/components/common/CautionCard';
import { ErrorMessage, LoadingMessage } from '@/components/common/StatusMessage';
import { BoxIcon, CardIcon, InfoIcon, LinkIcon, TruckIcon, type IconProps } from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { siteForPlatform } from '@/constants/sites';
import { ApiError, purchaseApi, type ApiPolicy, type ApiPurchase, type EditablePurchaseStatus } from '@/api';
import { useAsync } from '@/hooks/useAsync';
import { formatDDay, formatMonthDay } from '@/utils/date';
import { formatWon } from '@/utils/format';
import { BASE_DATE_LABEL, feeLabel } from '@/utils/policy';

type Tab = 'all' | 'return' | 'defect';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: '한눈에 보기' },
  { id: 'return', label: '반품' },
  { id: 'defect', label: '하자·오배송' },
];

const UNKNOWN = '미확인';

function SectionCard({
  icon: Icon,
  title,
  badge,
  children,
}: {
  icon: ComponentType<IconProps>;
  title: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <Card as="section" className="px-5 pt-5 pb-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-15 font-bold text-ink">
          <span className="flex size-[34px] items-center justify-center rounded-icon bg-green-100 text-green-600">
            <Icon size={20} />
          </span>
          {title}
        </h2>
        <span className="flex h-6 shrink-0 items-center rounded-lg bg-surface-muted px-2.5 text-11 font-bold text-green-600">
          {badge}
        </span>
      </div>
      {children}
    </Card>
  );
}

function InfoRow({ label, description, value }: { label: string; description?: string; value: string }) {
  const known = value !== UNKNOWN;
  return (
    <li className="flex min-h-[52px] items-center justify-between gap-3 rounded-control bg-green-100 px-3.5 py-2">
      <span className="flex flex-col gap-0.5">
        <span className="text-12 font-bold text-ink">{label}</span>
        {description && <span className="text-10 text-gray-500">{description}</span>}
      </span>
      <span className={`shrink-0 text-14 font-bold ${known ? 'text-green-600' : 'text-gray-400'}`}>{value}</span>
    </li>
  );
}

function returnBadge(p: ApiPolicy) {
  return p.returnDays == null ? '기간 미확인' : `${BASE_DATE_LABEL[p.baseDate]} 후 ${p.returnDays}일 이내`;
}

const NEXT_STATUS: Partial<Record<ApiPurchase['status'], { to: EditablePurchaseStatus; label: string }>> = {
  '보관 중': { to: '반품 신청', label: '반품 신청했어요' },
  '기한 지남': { to: '반품 신청', label: '반품 신청했어요' },
  '반품 신청': { to: '환불 완료', label: '환불 완료로 표시' },
};

/** Figma: 02-1 · 규정 다시보기 — 내 일정의 '규정 다시보기'에서 진입 (경로 id = 구매 id) */
export default function PolicyReviewPage() {
  const { scheduleId = '' } = useParams();
  const [tab, setTab] = useState<Tab>('all');
  const [saving, setSaving] = useState(false);
  const { data: purchase, error, loading, reload, setData } = useAsync(() => purchaseApi.get(scheduleId), [scheduleId]);

  const header = <Header variant="back" title="규정 다시보기" />;

  if (loading && !purchase) return <>{header}<LoadingMessage /></>;
  if (error || !purchase) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <>
        {header}
        {notFound || !error ? (
          <p className="px-gutter pt-10 text-center text-14 text-gray-500">규정 정보를 찾을 수 없어요.</p>
        ) : (
          <ErrorMessage error={error} onRetry={reload} />
        )}
      </>
    );
  }

  const site = siteForPlatform(purchase.platform);
  const policy = purchase.policy;
  const next = NEXT_STATUS[purchase.status];

  const changeStatus = async (status: EditablePurchaseStatus) => {
    setSaving(true);
    try {
      setData(await purchaseApi.update(purchase.id, { status }));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '상태를 바꾸지 못했어요.');
    } finally {
      setSaving(false);
    }
  };

  const heroStats = [
    { label: '수령일', value: purchase.receivedDate ? formatMonthDay(purchase.receivedDate) : '미입력' },
    { label: '신청 마감', value: purchase.deadline ? `${formatMonthDay(purchase.deadline)} 23:59` : UNKNOWN },
    { label: '결제 금액', value: formatWon(purchase.price) },
  ];
  const tags = [
    purchase.status,
    policy ? (policy.verificationStatus === 'verified' ? '공식 규정 확인' : '직접 입력 규정') : '규정 없음',
  ];

  return (
    <>
      {header}

      <main className="flex flex-col gap-3.5 px-gutter pt-5 pb-7">
        {/* 구매 요약 */}
        <section className="rounded-card bg-green-800 p-5">
          <div className="flex items-center gap-3">
            <SiteChip siteId={site.id} label={site.logo} size="lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-11 text-on-dark-400">{[site.name, ...tags].join(' · ')}</p>
              <h2 className="truncate text-17 font-bold text-white">{purchase.productName}</h2>
            </div>
            {purchase.dday != null && (
              <span className="shrink-0 rounded-chip bg-coral-50 px-2.5 py-1 text-12 font-bold text-coral-600">
                {formatDDay(purchase.dday)}
              </span>
            )}
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

        {!policy ? (
          <div className="flex flex-col items-center gap-4 pt-8 text-center">
            <p className="text-15 font-bold text-ink">연결된 환불 규정이 없어요</p>
            <p className="text-13 text-gray-500">
              {site.name}의 규정은 아직 준비 중이에요.
              <br />
              AI 상담에서 상황을 알려주시면 대신 찾아드릴게요.
            </p>
            <OutlineButton to={ROUTES.chat}>AI에게 물어보기</OutlineButton>
          </div>
        ) : (
          <>
            <ChipTabs tabs={TABS} value={tab} onChange={setTab} label="규정 보기 방식" />

            {/* 반품비 */}
            {tab === 'all' && (
              <Card as="section" className="px-5 py-5">
                <h2 className="flex items-center gap-2 text-15 font-bold text-ink">
                  <TruckIcon size={18} className="text-green-600" />
                  한눈에 보는 반품비 (단순 변심)
                </h2>
                <ul className="mt-4 flex flex-col gap-2">
                  <InfoRow
                    label="편도 반품비"
                    value={feeLabel(policy.returnFee.basicFee, policy.returnFee.currency) ?? UNKNOWN}
                  />
                  <InfoRow
                    label="왕복 반품비"
                    description="무료배송 상품 반품 시"
                    value={feeLabel(policy.returnFee.roundTripFee, policy.returnFee.currency) ?? UNKNOWN}
                  />
                </ul>
                {policy.returnFee.note && (
                  <p className="mt-3 flex items-start gap-1.5 text-10 leading-[16px] text-gray-400">
                    <InfoIcon size={14} className="mt-px shrink-0" />
                    {policy.returnFee.note}
                  </p>
                )}
              </Card>
            )}

            {tab !== 'defect' && (
              <SectionCard icon={BoxIcon} title="반품 (단순 변심)" badge={returnBadge(policy)}>
                <p className="mt-3 text-12 leading-[20px] text-gray-600">
                  {policy.returnDays == null
                    ? '판매처 규정에서 반품 가능 기간을 확인하지 못했어요. 원문 규정을 꼭 확인하세요.'
                    : `단순 변심은 ${BASE_DATE_LABEL[policy.baseDate]}로부터 ${policy.returnDays}일 이내에 신청할 수 있어요.`}
                </p>
                {policy.howTo && (
                  <ul className="mt-3 flex flex-col gap-2">
                    <InfoRow label="신청 방법" description={policy.howTo} value="" />
                  </ul>
                )}
              </SectionCard>
            )}

            {tab !== 'return' && (
              <SectionCard
                icon={CardIcon}
                title="상품 하자·오배송"
                badge={
                  policy.defect.fromReceiptMonths != null ? `수령 후 ${policy.defect.fromReceiptMonths}개월` : '기간 미확인'
                }
              >
                {policy.defect.note && (
                  <p className="mt-3 text-12 leading-[20px] text-gray-600">{policy.defect.note}</p>
                )}
                <ul className="mt-3 flex flex-col gap-2">
                  <InfoRow
                    label="수령일 기준"
                    value={policy.defect.fromReceiptMonths != null ? `${policy.defect.fromReceiptMonths}개월 이내` : UNKNOWN}
                  />
                  <InfoRow
                    label="하자를 안 날 기준"
                    value={policy.defect.fromDiscoveryDays != null ? `${policy.defect.fromDiscoveryDays}일 이내` : UNKNOWN}
                  />
                </ul>
              </SectionCard>
            )}

            {tab !== 'defect' && policy.exclusions.length > 0 && (
              <CautionCard title="이런 경우엔 반품이 어려워요" items={policy.exclusions} />
            )}

            {/* 출처 */}
            <p className="flex items-start gap-3 rounded-box bg-olive-50 px-4 pt-2.5 pb-3.5 text-11 leading-[19px] text-olive-900">
              <InfoIcon size={16} className="mt-[5px] shrink-0 text-olive-700" />
              <span>
                {policy.evidenceNote || '판매처가 공개한 환불 안내 기준이에요.'}
                {policy.collectedAt && ` · ${formatMonthDay(policy.collectedAt)} 확인`}
              </span>
            </p>

            {policy.sourceUrl && (
              <OutlineButton href={policy.sourceUrl} leadingIcon={<LinkIcon size={18} />}>
                {site.name} 원문 규정 보기
              </OutlineButton>
            )}
          </>
        )}

        {next && (
          <OutlineButton onClick={() => !saving && changeStatus(next.to)}>
            {saving ? '저장 중…' : next.label}
          </OutlineButton>
        )}
        {policy?.siteUrl && purchase.status !== '환불 완료' && (
          <PrimaryButton href={policy.siteUrl}>{site.name}에서 반품 신청하기</PrimaryButton>
        )}
      </main>
    </>
  );
}
