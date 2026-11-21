import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import CautionCard from '@/components/common/CautionCard';
import { TextField } from '@/components/common/FormFields';
import { CheckIcon } from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { ApiError, authApi, purchaseApi } from '@/api';
import { useAsync } from '@/hooks/useAsync';
import { useUser } from '@/app/auth';
import { chatHistory } from '@/utils/chatHistory';

const REASONS = ['사용할 일이 많지 않아요', '원하는 기능이 없어요', '알림이 너무 많아요', '기타'];

/** Figma: 06-5 · 회원 탈퇴 */
export default function WithdrawPage() {
  const navigate = useNavigate();
  const [reason, setReason] = useState<string | null>(REASONS[0]);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const user = useUser();
  const { data: purchases } = useAsync(() => purchaseApi.list(), []);
  const count = purchases?.length ?? 0;

  const deletedItems = [
    `등록한 상품 ${count}건과 환불 일정`,
    `구매내역 ${count}건`,
    `AI 상담 기록 ${chatHistory.count()}건`,
    '계정 정보 (이메일)',
  ];

  const handleWithdraw = async () => {
    if (!agreed || !password || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      // 탈퇴 사유는 백엔드 API가 받지 않아 전송하지 않는다
      await authApi.withdraw(password);
      chatHistory.clear();
      navigate(ROUTES.login, { replace: true });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '탈퇴하지 못했어요. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header variant="back" title="회원 탈퇴" />

      <main className="px-gutter pt-8 pb-7">
        <h2 className="px-0.5 text-26 leading-[1.38] font-bold text-ink">
          {user.name}님,
          <br />
          정말 떠나시나요?
        </h2>
        <p className="mt-3 px-0.5 text-13 text-gray-500">탈퇴하면 아래 정보가 모두 삭제되고 복구할 수 없어요.</p>

        <div className="mt-6">
          <CautionCard title="삭제되는 정보" items={deletedItems} />
        </div>

        <Card as="section" className="mt-6 px-5 pt-6 pb-3">
          <h3 className="flex items-baseline gap-1.5 text-15 font-bold text-ink">
            떠나시는 이유를 알려주세요
            <span className="text-12 font-normal text-gray-400">선택</span>
          </h3>
          <div role="radiogroup" aria-label="탈퇴 이유" className="mt-3 flex flex-col">
            {REASONS.map((r) => {
              const active = reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setReason(active ? null : r)}
                  className={`flex h-12 items-center gap-3 text-left text-14 ${active ? 'font-bold text-ink' : 'text-gray-600'}`}
                >
                  <span
                    aria-hidden
                    className={`size-5 shrink-0 rounded-full bg-surface ${
                      active ? 'border-[6px] border-green-400' : 'border-[1.5px] border-gray-300'
                    }`}
                  />
                  {r}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mt-6 flex flex-col gap-2.5">
          <p className="px-1 text-14 font-bold text-ink">비밀번호 확인</p>
          <TextField
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p role="alert" className="px-1 text-12 text-coral-600">
              {error}
            </p>
          )}
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-2.5 px-1 text-14 font-bold text-ink">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer sr-only" />
          <span
            aria-hidden
            className={`flex size-[22px] items-center justify-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-green-300 ${
              agreed ? 'bg-green-500 text-white' : 'border-[1.5px] border-gray-300 bg-surface text-transparent'
            }`}
          >
            <CheckIcon size={14} />
          </span>
          안내 사항을 모두 확인했어요
        </label>

        <button
          type="button"
          onClick={handleWithdraw}
          disabled={!agreed || !password || submitting}
          className="mt-6 h-[54px] w-full rounded-control bg-danger text-16 font-bold text-white disabled:bg-gray-200 disabled:text-gray-500"
        >
          {submitting ? '처리 중…' : '탈퇴하기'}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="mt-4 w-full text-14 text-gray-500">
          조금 더 써볼게요
        </button>
      </main>
    </>
  );
}
