import { useState, type ComponentType } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ConfirmModal from '@/components/common/ConfirmModal';
import SettingsSection from '@/components/common/SettingsSection';
import {
  BellLineIcon,
  ChevronRightIcon,
  LogOutIcon,
  ReceiptIcon,
  TrashIcon,
  UserXIcon,
  type IconProps,
} from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { APP_VERSION } from '@/mocks';
import { authApi, notificationApi, purchaseApi } from '@/api';
import { useAsync } from '@/hooks/useAsync';
import { useUser } from '@/app/auth';
import { chatHistory } from '@/utils/chatHistory';

type Row = {
  label: string;
  icon: ComponentType<IconProps>;
  value?: string;
  danger?: boolean;
} & ({ to: string; onClick?: never } | { onClick: () => void; to?: never });

function MenuRow({ label, icon: Icon, value, danger, ...action }: Row) {
  const content = (
    <>
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-icon ${
          danger ? 'bg-coral-50 text-coral-600' : 'bg-green-100 text-green-600'
        }`}
      >
        <Icon size={20} />
      </span>
      <span className={`flex-1 text-15 font-medium ${danger ? 'text-coral-600' : 'text-ink'}`}>{label}</span>
      {value && <span className="text-13 text-gray-400">{value}</span>}
      <ChevronRightIcon size={18} className="shrink-0 text-gray-400" />
    </>
  );
  const cls = 'flex h-16 w-full items-center gap-3.5 px-4 text-left';
  return action.to !== undefined ? (
    <Link to={action.to} className={cls}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={action.onClick} className={cls}>
      {content}
    </button>
  );
}

type ModalKind = 'deleteChats' | 'logout' | null;

/** Figma: 06 · 설정 (마이페이지) + 06-3 / 06-4 확인 모달 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalKind>(null);
  const user = useUser();
  const [chatCount, setChatCount] = useState(() => chatHistory.count());
  const closeModal = () => setModal(null);
  const { data: purchases } = useAsync(() => purchaseApi.list(), []);
  const { data: notification } = useAsync(() => notificationApi.get(), []);

  const productCount = purchases?.length;
  const stats = [
    { label: '등록한 상품', value: productCount ?? '-' },
    { label: '환불 진행 중', value: purchases ? purchases.filter((p) => p.status === '반품 신청').length : '-' },
    { label: 'AI 상담', value: chatCount },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      chatHistory.clear();
      navigate(ROUTES.login, { replace: true });
    }
  };

  return (
    <>
      <Header variant="title" title="설정" />

      <main className="px-gutter pt-5 pb-7">
        {/* 프로필 */}
        <Card as="section" className="flex items-center gap-4 p-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-20 font-bold text-green-600">
            {user.initial}
          </span>
          <div className="flex min-w-0 flex-col items-start gap-1">
            <p className="text-18 font-bold text-ink">{user.name}님</p>
            <p className="truncate text-13 text-gray-500">{user.email}</p>
            <span className="mt-1 flex h-6 items-center gap-1.5 rounded-lg bg-surface-muted px-2 text-11 text-gray-700">
              이메일 계정
            </span>
          </div>
        </Card>

        {/* 요약 */}
        <Card as="section" aria-label="내 활동 요약" className="mt-3.5 grid grid-cols-3 py-4 text-center">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-20 font-bold text-green-600">{value}</span>
              <span className="text-12 text-gray-500">{label}</span>
            </div>
          ))}
        </Card>

        <SettingsSection title="내 활동">
          <MenuRow label="구매내역" icon={ReceiptIcon} value={productCount === undefined ? undefined : `${productCount}건`} to={ROUTES.purchases} />
        </SettingsSection>

        <SettingsSection title="앱 설정">
          <MenuRow label="알림 설정" icon={BellLineIcon} value={notification ? (notification.enabled ? '켜짐' : '꺼짐') : undefined} to={ROUTES.notificationSettings} />
        </SettingsSection>

        <SettingsSection title="데이터 관리">
          <MenuRow
            label="AI 챗봇 기록 삭제"
            icon={TrashIcon}
            value={`대화 ${chatCount}건`}
            onClick={() => setModal('deleteChats')}
          />
        </SettingsSection>

        <SettingsSection title="계정">
          <MenuRow label="로그아웃" icon={LogOutIcon} onClick={() => setModal('logout')} />
          <MenuRow label="회원 탈퇴" icon={UserXIcon} danger to={ROUTES.withdraw} />
        </SettingsSection>

        <p className="mt-7 text-center text-12 text-gray-400">앱 버전 {APP_VERSION}</p>
      </main>

      <ConfirmModal
        open={modal === 'deleteChats'}
        tone="danger"
        icon={<TrashIcon size={24} />}
        title="AI 상담 기록을 삭제할까요?"
        description={
          <>
            지금까지 나눈 대화 {chatCount}건이 모두 삭제되며
            <br />
            삭제한 기록은 복구할 수 없어요.
          </>
        }
        confirmLabel="삭제하기"
        onCancel={closeModal}
        onConfirm={() => {
          // 상담 기록은 이 브라우저에만 저장되어 있다 (utils/chatHistory)
          chatHistory.clear();
          setChatCount(0);
          closeModal();
        }}
      />

      <ConfirmModal
        open={modal === 'logout'}
        icon={<LogOutIcon size={24} />}
        title="로그아웃 하시겠어요?"
        description={
          <>
            같은 이메일로 다시 로그인하면
            <br />
            등록한 일정과 내역을 그대로 볼 수 있어요.
          </>
        }
        confirmLabel="로그아웃"
        onCancel={closeModal}
        onConfirm={handleLogout}
      />
    </>
  );
}
