import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article';
  /** 그림자가 있는 떠 있는 카드 (Figma: 가장 가까운 마감 카드) */
  elevated?: boolean;
  /** 'md' = 20px(기본), 'sm' = 18px(일정 카드) */
  radius?: 'md' | 'sm';
};

/** 흰 배경 + 연한 테두리 + 라운드 카드. 안쪽 여백은 className으로 지정합니다. */
export default function Card({ as: Tag = 'div', elevated, radius = 'md', className = '', ...rest }: CardProps) {
  return (
    <Tag
      className={`border border-line bg-surface ${radius === 'md' ? 'rounded-card' : 'rounded-card-sm'} ${
        elevated ? 'shadow-card' : ''
      } ${className}`}
      {...rest}
    />
  );
}
