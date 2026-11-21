import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 스크린리더용 이름 (아이콘만 있는 버튼이므로 필수) */
  label: string;
  /** 우상단 알림 점 표시 */
  badge?: boolean;
  children: ReactNode;
};

/** 44px 원형 아이콘 버튼 (Figma: btn/bell, btn/plus, btn/back) */
export default function IconButton({ label, badge, children, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`relative flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-gray-800 ${className}`}
      {...rest}
    >
      {children}
      {badge && (
        <span
          aria-hidden
          className="absolute top-[7px] left-[26px] size-[9px] rounded-full border-2 border-white bg-coral-400"
        />
      )}
    </button>
  );
}
