type StationTone = 'green' | 'amber' | 'gray' | 'empty';

const RING: Record<StationTone, string> = {
  green: 'border-green-400',
  amber: 'border-amber-400',
  gray: 'border-gray-500',
  empty: 'border-gray-300',
};

const DOT: Record<StationTone, string> = {
  green: 'bg-green-400',
  amber: 'bg-amber-400',
  gray: 'bg-gray-500',
  empty: '',
};

const SIZE = {
  16: { ring: 'size-4 border-[1.5px]', dot: 'size-2' },
  18: { ring: 'size-[18px] border-2', dot: 'size-2' },
  20: { ring: 'size-5 border-[1.5px]', dot: 'size-2.5' },
} as const;

type StationDotProps = {
  tone: StationTone;
  size?: keyof typeof SIZE;
};

/** '환불 라인'의 정거장 점 (Figma: 홈 Station Line, 로그인 REFUND LINE) */
export default function StationDot({ tone, size = 16 }: StationDotProps) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface ${RING[tone]} ${SIZE[size].ring}`}
    >
      {tone !== 'empty' && <span className={`rounded-full ${DOT[tone]} ${SIZE[size].dot}`} />}
    </span>
  );
}
