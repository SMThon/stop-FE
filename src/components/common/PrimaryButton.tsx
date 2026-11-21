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
  (
    | { to: string; href?: never }
    | { href: string; to?: never }
    | ({ to?: undefined; href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

const base =
  'flex h-[54px] w-full items-center justify-center gap-2 rounded-control bg-green-700 text-15 font-bold text-white transition-opacity active:opacity-90 disabled:bg-gray-200 disabled:text-gray-500';

/**
 * Figma: Primary Button (3:109).
 * `to` → 앱 내부 라우트 링크, `href` → 외부 링크(새 탭), 둘 다 없으면 button.
 */
export default function PrimaryButton({ children, trailingIcon, leadingIcon, className = '', ...rest }: PrimaryButtonProps) {
  const content = (
    <>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </>
  );
  const cls = `${base} ${className}`;

  if (rest.to !== undefined) {
    return (
      <Link to={rest.to} className={cls}>
        {content}
      </Link>
    );
  }
  if (rest.href !== undefined) {
    return (
      <a href={rest.href} target="_blank" rel="noreferrer" className={cls}>
        {content}
      </a>
    );
  }

  const { to: _to, href: _href, ...buttonProps } = rest;
  return (
    <button type="button" className={cls} {...buttonProps}>
      {content}
    </button>
  );
}
