import { Fragment, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StationDot from '@/components/common/StationDot';
import PrimaryButton from '@/components/common/PrimaryButton';
import { TextField } from '@/components/common/FormFields';
import { BrandMark } from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { EXTERNAL_LINKS } from '@/constants/links';
import { ApiError, authApi } from '@/api';

const REFUND_LINE = [
  { label: '구매', tone: 'green' },
  { label: '확인', tone: 'gray' },
  { label: '환불', tone: 'amber' },
] as const;

type Mode = 'login' | 'signup';

/**
 * Figma: 00 · 로그인 (13:207)
 * 백엔드가 이메일/비밀번호 인증(/api/auth/login, /signup)만 제공해 Google 버튼 자리에 이메일 폼을 둔다.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.home;
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (mode === 'signup' && password.length < 8) {
      setError('비밀번호는 8자 이상이어야 해요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (mode === 'signup') await authApi.signup(email, password);
      await authApi.login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '로그인하지 못했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-dvh flex-col px-7 pt-[96px] pb-11">
      <section className="flex flex-col items-center text-center">
        <div className="flex size-[84px] items-center justify-center rounded-full border border-line bg-surface shadow-soft">
          <BrandMark size={60} className="text-green-600" />
        </div>
        <h1 className="mt-5 text-30 font-bold tracking-display text-green-900">환불정거장</h1>
        <p className="mt-2.5 text-16 leading-[25px] text-gray-600">
          놓치기 쉬운 환불,
          <br />
          제때 알려드릴게요.
        </p>
      </section>

      <section aria-label="환불 라인" className="mt-9 rounded-card bg-surface-tint px-5.5 pt-5 pb-5">
        <p className="text-10 font-black tracking-label text-green-600">REFUND LINE</p>
        <ol className="mt-3.5 flex items-start px-0.5">
          {REFUND_LINE.map(({ label, tone }, i) => (
            <Fragment key={label}>
              {i > 0 && <li aria-hidden className="mt-2 h-0.5 flex-1 bg-gray-300" />}
              <li className="flex w-[18px] flex-col items-center gap-3.5">
                <StationDot tone={tone} size={18} />
                <span className="text-11 whitespace-nowrap text-gray-600">{label}</span>
              </li>
            </Fragment>
          ))}
        </ol>
      </section>

      <div className="flex-1" />

      <section className="flex flex-col items-center text-center">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2.5" noValidate>
          <TextField
            label="이메일"
            type="email"
            autoComplete="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="비밀번호"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder={mode === 'login' ? '비밀번호' : '비밀번호 (8자 이상)'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p role="alert" className="text-left text-12 text-coral-600">
              {error}
            </p>
          )}
          <PrimaryButton type="submit" disabled={!email || !password || submitting} className="mt-1.5">
            {submitting ? '잠시만요…' : mode === 'login' ? '로그인' : '가입하고 시작하기'}
          </PrimaryButton>
        </form>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError(null);
          }}
          className="mt-[15px] text-12 text-gray-500"
        >
          {mode === 'login' ? (
            <>
              처음이신가요? <span className="font-bold text-green-600 underline">이메일로 가입하기</span>
            </>
          ) : (
            <>
              이미 계정이 있나요? <span className="font-bold text-green-600 underline">로그인</span>
            </>
          )}
        </button>
        <p className="mt-[22px] text-10 leading-[16px] text-gray-500">
          계속하면{' '}
          <a href={EXTERNAL_LINKS.terms} className="font-medium text-gray-700 underline">
            서비스 이용약관
          </a>{' '}
          및{' '}
          <a href={EXTERNAL_LINKS.privacy} className="font-medium text-gray-700 underline">
            개인정보 처리방침
          </a>
          에
          <br />
          동의하는 것으로 간주돼요.
        </p>
      </section>
    </main>
  );
}
