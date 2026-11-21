import type { InputHTMLAttributes, ReactNode } from 'react';
import { CalendarIcon } from '@/components/icons';

const fieldBox = 'relative flex h-[52px] items-center rounded-control border border-line bg-app px-4';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** 오른쪽 단위 (예: 원) */
  suffix?: ReactNode;
};

/** 기본 입력칸 (Figma: 07 상품명·결제 금액) */
export function TextField({ label, suffix, className = '', ...rest }: TextFieldProps) {
  return (
    <label className={`${fieldBox} gap-2 ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        className="h-full min-w-0 flex-1 bg-transparent text-14 text-ink outline-none placeholder:text-gray-400"
        {...rest}
      />
      {suffix && <span className="text-14 text-gray-500">{suffix}</span>}
    </label>
  );
}

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/** 달력 아이콘이 있는 날짜 입력칸 (Figma: 03 상품 수령일, 07 구매·수령일) */
export function DateField({ label, value, onChange, className = '' }: DateFieldProps) {
  return (
    <label className={`${fieldBox} ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full bg-transparent text-14 text-gray-700 outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
      <CalendarIcon size={20} className="pointer-events-none absolute right-4 text-gray-800" />
    </label>
  );
}

/** 입력 항목 제목 (필수 표시 포함) */
export function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <p className="text-14 font-bold text-ink">
      {children}
      {required && <span className="ml-0.5 text-coral-600">*</span>}
    </p>
  );
}
