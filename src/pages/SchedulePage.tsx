import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import IconButton from '@/components/common/IconButton';
import Card from '@/components/common/Card';
import { SCHEDULE_DOT, SCHEDULE_LABEL, SCHEDULE_TEXT } from '@/components/common/DDayBadge';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { MOCK_TODAY, mockSchedules } from '@/mocks';
import type { ScheduleKind } from '@/types';
import { WEEKDAYS, buildMonthGrid, diffDays, formatDDay, parseDate, toISODate, weekdayLabel } from '@/utils/date';

const LEGEND: ScheduleKind[] = ['refund', 'subscription'];

export default function SchedulePage() {
  const navigate = useNavigate();
  const today = parseDate(MOCK_TODAY);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(MOCK_TODAY);

  const cells = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor]);
  const kindByDate = useMemo(() => new Map(mockSchedules.map((s) => [s.date, s.kind])), []);
  const upcoming = useMemo(
    () =>
      mockSchedules
        .filter((s) => diffDays(s.date, MOCK_TODAY) >= 0)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [],
  );

  const selectedDate = parseDate(selected);
  const selectedCount = mockSchedules.filter((s) => s.date === selected).length;

  const moveMonth = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <>
      <Header
        variant="title"
        title="내 일정"
        right={
          <IconButton label="상품 등록" onClick={() => navigate(ROUTES.productNew)}>
            <PlusIcon size={22} />
          </IconButton>
        }
      />

      <main className="px-gutter pt-5 pb-7">
        {/* 월간 캘린더 */}
        <Card as="section" className="px-4 pt-5.5 pb-4.5">
          <div className="flex items-center justify-between px-1 text-gray-600">
            <button type="button" aria-label="이전 달" onClick={() => moveMonth(-1)}>
              <ChevronLeftIcon size={20} />
            </button>
            <h2 className="text-17 font-bold text-ink">
              {cursor.year}년 {cursor.month + 1}월
            </h2>
            <button type="button" aria-label="다음 달" onClick={() => moveMonth(1)}>
              <ChevronRightIcon size={20} />
            </button>
          </div>

          <div className="pt-5">
            <div className="grid grid-cols-7 pb-2 text-11 font-medium">
              {WEEKDAYS.map((w, i) => (
                <span key={w} className={`flex h-5 items-center justify-center ${i === 0 ? 'text-coral-500' : 'text-gray-500'}`}>
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map(({ date, inMonth }) => {
                const iso = toISODate(date);
                const isSelected = inMonth && iso === selected;
                const kind = inMonth ? kindByDate.get(iso) : undefined;
                const tone = isSelected
                  ? 'bg-green-700 font-bold text-white'
                  : !inMonth
                    ? 'text-gray-300'
                    : date.getDay() === 0
                      ? 'text-coral-500'
                      : 'text-gray-700';
                return (
                  <div key={iso} className="flex h-[52px] flex-col items-center justify-center gap-[3px]">
                    <button
                      type="button"
                      disabled={!inMonth}
                      aria-pressed={isSelected}
                      aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일${kind ? `, ${SCHEDULE_LABEL[kind]}` : ''}`}
                      onClick={() => setSelected(iso)}
                      className={`flex size-9 items-center justify-center rounded-full text-13 ${tone}`}
                    >
                      {date.getDate()}
                    </button>
                    <span aria-hidden className={`size-[5px] rounded-full ${kind ? SCHEDULE_DOT[kind] : ''}`} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-6 border-t border-line-soft pt-3.5">
            {LEGEND.map((kind) => (
              <span key={kind} className="flex items-center gap-1.5 text-11 text-gray-500">
                <span aria-hidden className={`size-[7px] rounded-full ${SCHEDULE_DOT[kind]}`} />
                {SCHEDULE_LABEL[kind]}
              </span>
            ))}
          </div>
        </Card>

        {/* 선택 날짜 */}
        <div className="flex items-end justify-between px-1 pt-[26px] pb-3.5">
          <div className="flex flex-col gap-0.5 font-bold">
            <span className="text-11 text-green-500">
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
            </span>
            <h2 className="text-22 text-ink">
              {selected === MOCK_TODAY ? '오늘' : `${weekdayLabel(selectedDate)}요일`}
            </h2>
          </div>
          <span className="text-11 text-gray-400">
            {selectedCount === 0 ? '등록된 일정이 없어요' : `일정 ${selectedCount}개`}
          </span>
        </div>

        {/* 다가오는 일정 목록 */}
        <ul className="flex flex-col gap-3">
          {upcoming.map((s, i) => {
            const date = parseDate(s.date);
            const isLast = i === upcoming.length - 1;
            return (
              <li key={s.id}>
                <Card as="article" radius="sm" className="flex items-start gap-3.5 px-4.5 py-5.5">
                  <span className="flex w-9 shrink-0 flex-col items-center gap-0.5">
                    <span className="text-11 text-gray-500">{weekdayLabel(date)}</span>
                    <span className="text-25 font-bold text-ink">{date.getDate()}</span>
                  </span>

                  <span aria-hidden className="flex w-2 shrink-0 flex-col items-center self-stretch">
                    <span className={`mt-1 size-2 rounded-full ${SCHEDULE_DOT[s.kind]}`} />
                    {!isLast && <span className="mt-1.5 w-[1.5px] flex-1 bg-line-strong" />}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p className={`text-11 font-bold ${SCHEDULE_TEXT[s.kind]}`}>
                      {SCHEDULE_LABEL[s.kind]} · {formatDDay(diffDays(s.date, MOCK_TODAY))}
                    </p>
                    <h3 className="truncate text-15 font-bold text-ink">{s.title}</h3>
                    <p className="text-12 text-gray-500">{s.note}</p>
                    {s.policyId && (
                      <Link
                        to={ROUTES.refundResult(s.policyId)}
                        className="flex w-fit items-center gap-0.5 pt-1.5 text-11 font-bold text-green-600"
                      >
                        규정 다시보기
                        <ChevronRightIcon size={14} />
                      </Link>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
