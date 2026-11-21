import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type BaseProps = {
  children: ReactNode;
  /** 텍스트 오른쪽 아이콘 (예: ArrowRightIcon) */
  trailingIcon?: ReactNode;
  /** 텍스트 왼쪽 아이콘 */
  leadingIcon?: ReactNode;
  className?: string;
};

type PrimaryButtonProps = BaseProps &
  (({ to: string } & { onClick?: never }) | ({ to?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>));

const base =
  'flex h-[54px] w-full items-center justify-center gap-2 rounded-control bg-green-700 text-15 font-bold text-white transition-opacity active:opacity-90 disabled:bg-gray-200 disabled:text-gray-500';

/** Figma: Primary Button (3:109). `to`를 주면 라우트 링크로 렌더링됩니다. */
export default function PrimaryButton({ children, trailingIcon, leadingIcon, className = '', ...rest }: PrimaryButtonProps) {
  const content = (
    <>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </>
  );

  if (rest.to !== undefined) {
    return (
      <Link to={rest.to} className={`${base} ${className}`}>
        {content}
      </Link>
    );
  }

  const { to: _to, ...buttonProps } = rest;
  return (
    <button type="button" className={`${base} ${className}`} {...buttonProps}>
      {content}
    </button>
  );
}
