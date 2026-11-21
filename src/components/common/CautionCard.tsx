import { AlertCircleIcon } from '@/components/icons';

/** 코랄 주의 박스: 아이콘 제목 + 점 목록 (Figma: 02-1 반품·교환 주의, 06-5 삭제되는 정보) */
export default function CautionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-card border border-coral-100 bg-coral-25 px-5 pt-[21px] pb-4.5">
      <h2 className="flex items-center gap-2.5 text-14 font-bold text-coral-700">
        <AlertCircleIcon size={18} className="text-coral-600" />
        {title}
      </h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-12 text-coral-900">
            <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-coral-400" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
