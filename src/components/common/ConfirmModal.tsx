import { useEffect, type ReactNode } from 'react';

type ConfirmModalProps = {
  open: boolean;
  icon: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** danger = 코랄(삭제·탈퇴), primary = 초록(로그아웃 등) */
  tone?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
};

const TONE = {
  danger: { icon: 'bg-coral-50 text-coral-600', button: 'bg-danger' },
  primary: { icon: 'bg-green-100 text-green-600', button: 'bg-green-700' },
} as const;

/** Figma: 06-3 AI 챗봇 기록 삭제 / 06-4 로그아웃 확인 모달 */
export default function ConfirmModal({
  open,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  tone = 'primary',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/45 px-[34px]" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[322px] flex-col items-center rounded-modal bg-surface px-5.5 pt-7 pb-5 text-center"
      >
        <span className={`flex size-14 items-center justify-center rounded-full ${TONE[tone].icon}`}>{icon}</span>
        <h2 id="confirm-modal-title" className="mt-3.5 text-18 font-bold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-13 leading-[21px] text-gray-500">{description}</p>
        <div className="mt-6 grid w-full grid-cols-[1fr_1.07fr] gap-2">
          <button type="button" onClick={onCancel} className="h-[52px] rounded-control bg-surface-muted text-14 font-bold text-gray-700">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-[52px] rounded-control text-14 font-bold text-white ${TONE[tone].button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
