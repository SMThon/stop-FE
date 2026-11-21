import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import StationDot from '@/components/common/StationDot';
import { BrandMark } from '@/components/icons';
import googleLogo from '@/assets/brands/google-g.svg';
import { ROUTES } from '@/constants/routes';
import { EXTERNAL_LINKS } from '@/constants/links';

const REFUND_LINE = [
  { label: '구매', tone: 'green' },
  { label: '확인', tone: 'gray' },
  { label: '환불', tone: 'amber' },
] as const;

/** Figma: 00 · 로그인 (13:207) — Google 로그인만 지원 */
export default function LoginPage() {
  const navigate = useNavigate();

  // TODO: Google OAuth 연동. 지금은 mock 로그인 후 홈으로 이동
  const handleGoogleLogin = () => navigate(ROUTES.home, { replace: true });

  return (
    <main className="flex min-h-dvh flex-col px-7 pt-[135px] pb-11">
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
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-control border border-google-border bg-surface text-15 font-medium text-google-text shadow-soft"
        >
          <img src={googleLogo} alt="" width={20} height={20} />
          Google 계정으로 계속하기
        </button>
        <p className="mt-[15px] text-12 text-gray-500">처음이라면 Google 계정으로 바로 가입돼요.</p>
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
