import type { ReactNode } from 'react';
import Card from './Card';

/** 설정 화면류의 '섹션 제목 + 행 묶음 카드' (Figma: 06, 06-1) */
export default function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="mb-2.5 px-0.5 text-12 text-gray-500">{title}</h2>
      <Card className="divide-y divide-line-soft overflow-hidden">{children}</Card>
    </section>
  );
}
