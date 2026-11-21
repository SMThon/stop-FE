import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandMark, ChevronLeftIcon } from '@/components/icons';
import IconButton from './IconButton';

type HeaderProps =
  /** 홈: 브랜드 마크 + '환불정거장' 로고타입 */
  | { variant: 'brand'; right?: ReactNode }
  /** 탭 화면: 왼쪽 브랜드 마크, 가운데 제목 */
  | { variant: 'title'; title: string; right?: ReactNode }
  /** 하위 화면: 왼쪽 뒤로가기, 가운데 제목 */
  | { variant: 'back'; title: string; right?: ReactNode; onBack?: () => void };

/** Figma: 01 Header(3:15) / 02 Header(4:50) / 04 Header(4:416) */
export default function Header(props: HeaderProps) {
  const navigate = useNavigate();

  if (props.variant === 'brand') {
    return (
      <header className="flex items-center justify-between px-gutter pt-2 pb-3">
        <div className="flex items-center gap-2.5">
          <BrandMark size={36} className="text-green-600" />
          <h1 className="text-20 font-bold tracking-brand text-green-900">환불정거장</h1>
        </div>
        {props.right}
      </header>
    );
  }

  const left =
    props.variant === 'back' ? (
      <IconButton label="뒤로 가기" onClick={props.onBack ?? (() => navigate(-1))}>
        <ChevronLeftIcon size={22} />
      </IconButton>
    ) : (
      <div className="flex size-11 items-center justify-center">
        <BrandMark size={34} className="text-green-600" />
      </div>
    );

  return (
    <header className="relative flex items-center justify-between border-b border-line px-gutter pt-2 pb-3">
      {left}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-16 font-bold text-ink">{props.title}</h1>
      {props.right ?? <div className="size-11" aria-hidden />}
    </header>
  );
}
