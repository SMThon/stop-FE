type ChipTabsProps<T extends string> = {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/** 둥근 칩 형태의 탭/필터 (Figma: 02-1 보기 탭, 06-2 구매내역 필터) */
export default function ChipTabs<T extends string>({ tabs, value, onChange, label, className = '' }: ChipTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={`flex gap-1.5 ${className}`}>
      {tabs.map(({ id, label: text }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`h-8 shrink-0 rounded-full px-3.5 text-12 ${
              active ? 'bg-green-700 font-bold text-white' : 'border border-line-strong bg-surface font-medium text-gray-600'
            }`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
