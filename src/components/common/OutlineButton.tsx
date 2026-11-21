import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type OutlineButtonProps = {
  children: ReactNode;
  leadingIcon?: ReactNode;
  className?: string;
} & ({ href: string; to?: never; onClick?: never } | { to: string; href?: never; onClick?: never } | { onClick: () => void; href?: never; to?: never });

const base =
  'flex h-[52px] w-full items-center justify-center gap-2.5 rounded-tile border border-line-strong bg-surface text-13 font-bold text-gray-800';

/** 흰 배경 + 테두리 보조 버튼 (Figma: 02-1 원문 규정 보기, 04 Outline Button) */
export default function OutlineButton({ children, leadingIcon, className = '', ...rest }: OutlineButtonProps) {
  const content = (
    <>
      {leadingIcon}
      <span>{children}</span>
    </>
  );
  const cls = `${base} ${className}`;

  if (rest.href !== undefined) {
    return (
      <a href={rest.href} target="_blank" rel="noreferrer" className={cls}>
        {content}
      </a>
    );
  }
  if (rest.to !== undefined) {
    return (
      <Link to={rest.to} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={rest.onClick} className={cls}>
      {content}
    </button>
  );
}
