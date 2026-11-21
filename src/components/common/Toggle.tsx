type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 스크린리더용 이름 */
  label: string;
  disabled?: boolean;
};

/** Figma: Toggle (12:248) — 50×30, 노브 24px */
export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        checked ? 'bg-green-500' : 'bg-gray-200'
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-[3px] left-[3px] size-6 rounded-full bg-white shadow-knob transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
