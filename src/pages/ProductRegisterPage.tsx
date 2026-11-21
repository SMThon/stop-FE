import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Toggle from '@/components/common/Toggle';
import PrimaryButton from '@/components/common/PrimaryButton';
import { PurchaseTypeTabs, SiteSelector, sitesFor } from '@/components/common/PurchaseSelectors';
import { DateField, FieldLabel, TextField } from '@/components/common/FormFields';
import { BellLineIcon, CameraIcon, CheckIcon, ClockIcon } from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { SITE_PLATFORM } from '@/constants/sites';
import { mockSites } from '@/mocks';
import type { PurchaseType, SiteId } from '@/types';
import { diffDays, formatDDay, formatFullDate, todayISO } from '@/utils/date';
import { BASE_DATE_LABEL, computeDeadline } from '@/utils/policy';
import { ApiError, policyApi, purchaseApi } from '@/api';
import { useAsync } from '@/hooks/useAsync';

const MAX_PHOTOS = 5;
const norm = (s: string) => s.toLowerCase().replace(/\s/g, '');
const isSiteId = (v: string | null): v is SiteId => !!v && mockSites.some((s) => s.id === v);

/** Figma: 07 · 상품 등록 */
export default function ProductRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSite = searchParams.get('site');
  const [photos, setPhotos] = useState<string[]>([]);
  const [productName, setProductName] = useState('');
  const [siteId, setSiteId] = useState<SiteId>(isSiteId(initialSite) ? initialSite : 'coupang');
  const [customPlatform, setCustomPlatform] = useState('');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('general');
  const changePurchaseType = (type: PurchaseType) => {
    setPurchaseType(type);
    // 유형마다 사이트 목록이 달라서 첫 사이트로 맞춘다
    if (!sitesFor(type).some((s) => s.id === siteId)) setSiteId(sitesFor(type)[0].id);
  };
  const [price, setPrice] = useState('');
  const [purchasedAt, setPurchasedAt] = useState(todayISO());
  const [receivedAt, setReceivedAt] = useState(searchParams.get('receivedAt') ?? '');
  const [notify, setNotify] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 미리보기용: 서버에 등록된 규정 중 같은 쇼핑몰 규정을 찾아 마감일을 계산 (서버도 같은 규칙으로 저장)
  const { data: policies } = useAsync(() => policyApi.list(), []);
  const platform = siteId === 'etc' ? customPlatform.trim() : SITE_PLATFORM[siteId];
  const policy = platform
    ? policies?.find((p) => norm(p.platform) === norm(platform) || p.id === siteId)
    : undefined;

  // 화면을 벗어날 때만 미리보기 URL 해제 (추가할 때마다 해제하면 표시 중인 이미지가 깨짐)
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const handlePhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - photos.length);
    setPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const deadline = policy ? computeDeadline(policy, purchasedAt, receivedAt || null) : null;
  const datesInvalid = !!receivedAt && !!purchasedAt && receivedAt < purchasedAt;
  const canSubmit = productName.trim() !== '' && !!platform && !!purchasedAt && !!receivedAt && !datesInvalid && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      // 사진·알림 토글은 아직 백엔드 API가 없어 저장하지 않는다 (알림은 설정 > 알림 설정의 전체 설정을 따름)
      await purchaseApi.create({
        platform,
        productName: productName.trim(),
        price: Number(price || 0),
        orderDate: purchasedAt,
        receivedDate: receivedAt || null,
      });
      navigate(ROUTES.schedule);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '등록하지 못했어요. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header variant="back" title="상품 등록" />

      <form onSubmit={handleSubmit} className="px-gutter pt-8 pb-7">
        <section className="px-0.5">
          <p className="text-10 font-black tracking-label text-green-500">NEW ITEM</p>
          <h2 className="mt-3 text-26 leading-[1.38] font-medium tracking-[-0.02em] text-ink">
            구매한 상품을
            <br />
            등록해 주세요
          </h2>
          <p className="mt-2.5 text-13 text-gray-500">등록하면 환불 마감일을 자동으로 계산해 알려드려요.</p>
        </section>

        {/* 사진 */}
        <div className="mt-6 flex items-center gap-3">
          <label className="flex size-[84px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-tile border-[1.5px] border-dashed border-gray-300 text-gray-600">
            <CameraIcon size={24} />
            <span className="text-11">
              {photos.length}/{MAX_PHOTOS}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotos}
              disabled={photos.length >= MAX_PHOTOS}
              className="sr-only"
            />
          </label>
          {photos.length === 0 ? (
            <span aria-hidden className="flex size-[84px] shrink-0 items-center justify-center rounded-tile bg-surface-sunken text-gray-300">
              <CameraIcon size={24} />
            </span>
          ) : (
            photos.slice(0, 1).map((url) => (
              <img key={url} src={url} alt="첨부한 사진" className="size-[84px] shrink-0 rounded-tile object-cover" />
            ))
          )}
          <div className="flex flex-col gap-1">
            <p className="text-13 font-bold text-ink">상품·영수증 사진</p>
            <p className="text-11 text-gray-400">주문 내역 캡처도 괜찮아요</p>
          </div>
        </div>

        <Card as="section" className="mt-6 flex flex-col gap-6 px-5 pt-6 pb-6">
          <div className="flex flex-col gap-2.5">
            <FieldLabel required>상품명</FieldLabel>
            <TextField
              label="상품명"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="상품명을 입력하세요"
              required
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>구매 사이트</FieldLabel>
            <SiteSelector value={siteId} onChange={setSiteId} purchaseType={purchaseType} className="pt-1.5" />
            {siteId === 'etc' && (
              <TextField
                label="쇼핑몰 이름"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="쇼핑몰 이름 (예: G마켓, Amazon)"
                maxLength={100}
              />
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel>서비스 유형</FieldLabel>
            <PurchaseTypeTabs value={purchaseType} onChange={changePurchaseType} />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel>결제 금액</FieldLabel>
            <TextField
              label="결제 금액"
              inputMode="numeric"
              value={price ? Number(price).toLocaleString('ko-KR') : ''}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="0"
              suffix="원"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel required>구매 · 수령일</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-11 text-gray-500">구매일</span>
                <DateField label="구매일" value={purchasedAt} onChange={setPurchasedAt} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-11 text-gray-500">수령일</span>
                <DateField label="수령일" value={receivedAt} onChange={setReceivedAt} />
              </div>
            </div>
            {datesInvalid && <p className="text-11 text-coral-600">수령일은 구매일보다 빠를 수 없어요.</p>}
          </div>
        </Card>

        {/* 예상 환불 마감일 */}
        {policy && deadline && (
          <section className="mt-6 flex items-center gap-3.5 rounded-card bg-green-75 px-4.5 py-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-surface text-green-600">
              <ClockIcon size={22} />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-11 text-gray-500">예상 환불 마감일</p>
              <p className="text-16 font-bold text-green-600">
                {formatFullDate(deadline)}까지 · {formatDDay(diffDays(deadline, todayISO()))}
              </p>
              <p className="text-10 text-gray-500">
                {policy.platform} 규정 · {BASE_DATE_LABEL[policy.baseDate]} 기준 {policy.returnDays}일
              </p>
            </div>
          </section>
        )}

        <Card as="section" className="mt-6 flex items-center gap-3.5 px-4.5 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-icon bg-green-100 text-green-600">
            <BellLineIcon size={20} />
          </span>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-15 font-bold text-ink">마감일 알림 받기</p>
            <p className="text-11 text-gray-400">D-3, D-1, 당일에 알려드려요</p>
          </div>
          <Toggle label="마감일 알림 받기" checked={notify} onChange={setNotify} />
        </Card>

        {platform && policies && (!policy || policy.returnDays == null) && (
          <p className="mt-6 rounded-card bg-surface-muted px-4.5 py-4 text-12 leading-[19px] text-gray-500">
            {platform}의 반품 기간은 아직 확인되지 않아 마감일을 자동으로 계산할 수 없어요. 등록은 할 수 있어요.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 text-center text-12 text-coral-600">
            {error}
          </p>
        )}

        <PrimaryButton type="submit" disabled={!canSubmit} className="mt-6" leadingIcon={<CheckIcon size={18} />}>
          {submitting ? '등록 중…' : '등록하기'}
        </PrimaryButton>
      </form>
    </>
  );
}
