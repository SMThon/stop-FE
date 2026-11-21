import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import IconButton from '@/components/common/IconButton';
import Card from '@/components/common/Card';
import PrimaryButton from '@/components/common/PrimaryButton';
import { PurchaseTypeTabs, SiteSelector, sitesFor } from '@/components/common/PurchaseSelectors';
import { DateField } from '@/components/common/FormFields';
import { ArrowRightIcon, CheckIcon, PlusIcon } from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { refundPolicyIdFor } from '@/constants/sites';
import type { PurchaseType, SiteId } from '@/types';
import { todayISO } from '@/utils/date';

function StepTitle({ step, title, right }: { step: number; title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-3">
        <span className="text-11 font-black tracking-label text-green-500">STEP {step}</span>
        <span className="text-15 font-bold text-ink">{title}</span>
      </h3>
      {right}
    </div>
  );
}

/** Figma: 03 · 환불 규정 찾기 */
export default function RefundSearchPage() {
  const navigate = useNavigate();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('general');
  const changePurchaseType = (type: PurchaseType) => {
    setPurchaseType(type);
    // 유형마다 사이트 목록이 달라서 첫 사이트로 맞춘다
    if (!sitesFor(type).some((s) => s.id === siteId)) setSiteId(sitesFor(type)[0].id);
  };
  const [siteId, setSiteId] = useState<SiteId>('coupang');
  const [receivedAt, setReceivedAt] = useState(todayISO());

  const handleSubmit = () => {
    const query = receivedAt ? `?receivedAt=${receivedAt}` : '';
    // 백엔드에 내장 규정이 없는 조합은 결과 화면에서 '준비 중'으로 안내된다
    const policyId = refundPolicyIdFor(siteId, purchaseType) ?? `${siteId}-${purchaseType}`;
    navigate(`${ROUTES.refundResult(policyId)}${query}`);
  };

  return (
    <>
      <Header
        variant="title"
        title="환불 규정 찾기"
        right={
          <IconButton label="상품 등록" onClick={() => navigate(ROUTES.productNew)}>
            <PlusIcon size={22} />
          </IconButton>
        }
      />

      <main className="px-gutter pt-8 pb-7">
        <section className="px-0.5">
          <p className="text-10 font-black tracking-label text-green-500">REFUND POLICY</p>
          <h2 className="mt-3 text-28 leading-display font-medium tracking-[-0.02em] text-ink">
            어디에서 무엇을
            <br />
            구매하셨나요?
          </h2>
          <p className="mt-3 text-13 leading-[24px] text-gray-500">
            구매 정보를 선택하면 적용되는 환불 규정을
            <br />
            쉽게 정리해서 알려드려요.
          </p>
        </section>

        <Card as="section" className="mt-8 px-5 pt-6 pb-6">
          <StepTitle step={1} title="서비스 유형" />
          <PurchaseTypeTabs value={purchaseType} onChange={changePurchaseType} className="mt-3" />

          <div className="mt-8">
            <StepTitle step={2} title="구매 사이트" />
            <SiteSelector value={siteId} onChange={setSiteId} purchaseType={purchaseType} className="mt-3" />
          </div>

          <div className="mt-8">
            <StepTitle step={3} title="상품 수령일" right={<span className="text-11 text-gray-400">선택사항</span>} />
            <DateField label="상품 수령일" value={receivedAt} onChange={setReceivedAt} className="mt-3" />
          </div>

          <PrimaryButton onClick={handleSubmit} className="mt-7" trailingIcon={<ArrowRightIcon size={20} />}>
            환불 규정 확인하기
          </PrimaryButton>
        </Card>

        <p className="mt-6 flex gap-3 px-2 text-12 leading-[18px] text-gray-500">
          <CheckIcon size={16} className="mt-px shrink-0 text-green-500" />
          <span>
            입력한 정보는 환불 규정 확인에만 사용되며
            <br />
            별도로 저장되지 않아요.
          </span>
        </p>
      </main>
    </>
  );
}
