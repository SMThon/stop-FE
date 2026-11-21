import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Toggle from '@/components/common/Toggle';
import SettingsSection from '@/components/common/SettingsSection';
import { BellLineIcon, ChevronRightIcon } from '@/components/icons';
import {
  MARKETING_ITEM,
  NOTIFICATION_GROUPS,
  mockNotificationSettings,
  type NotificationItem,
  type NotificationKey,
} from '@/mocks/notifications';
import { notificationApi, type NotificationSettings } from '@/api';
import { useAsync } from '@/hooks/useAsync';
import { ErrorMessage, LoadingMessage } from '@/components/common/StatusMessage';

/** 백엔드에 저장되는 항목: 전체 on/off + 환불 마감 며칠 전(daysBefore) */
const DAYS_BY_KEY: Partial<Record<NotificationKey, number>> = { refundD3: 3, refundD1: 1, refundDDay: 0 };

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${String(m).padStart(2, '0')}`;
}

/** Figma: 06-1 · 알림 설정 */
export default function NotificationSettingsPage() {
  const { data, error, loading, reload, setData } = useAsync(() => notificationApi.get(), []);
  const [enabled, setEnabled] = useState(mockNotificationSettings.enabled);
  // 구독 결제·마케팅·알림 시간은 아직 백엔드 필드가 없어 화면 상태로만 유지
  const [items, setItems] = useState<Record<NotificationKey, boolean>>(mockNotificationSettings.items);
  const [time, setTime] = useState(mockNotificationSettings.time);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setEnabled(data.enabled);
    setItems((prev) => {
      const next = { ...prev };
      (Object.keys(DAYS_BY_KEY) as NotificationKey[]).forEach((k) => {
        next[k] = data.daysBefore.includes(DAYS_BY_KEY[k]!);
      });
      return next;
    });
  }, [data]);

  const save = async (body: NotificationSettings) => {
    const prev = data;
    setData(body);
    setSaveError(null);
    try {
      setData(await notificationApi.put(body));
    } catch (e) {
      if (prev) setData(prev);
      setSaveError(e instanceof Error ? e.message : '저장하지 못했어요.');
    }
  };

  const daysFrom = (next: typeof items) =>
    (Object.keys(DAYS_BY_KEY) as NotificationKey[]).filter((k) => next[k]).map((k) => DAYS_BY_KEY[k]!);

  const toggleItem = (key: NotificationKey) => (checked: boolean) => {
    const next = { ...items, [key]: checked };
    setItems(next);
    if (key in DAYS_BY_KEY) void save({ enabled, daysBefore: daysFrom(next) });
  };

  const toggleAll = (checked: boolean) => {
    setEnabled(checked);
    void save({ enabled: checked, daysBefore: daysFrom(items) });
  };

  const renderRow = ({ key, label, description }: NotificationItem) => (
    <div key={key} className="flex h-[66px] items-center gap-3 px-5">
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-15 font-bold text-ink">{label}</p>
        <p className="text-12 text-gray-400">{description}</p>
      </div>
      <Toggle label={label} checked={enabled && items[key]} disabled={!enabled} onChange={toggleItem(key)} />
    </div>
  );

  return (
    <>
      <Header variant="back" title="알림 설정" />

      <main className="px-gutter pt-5 pb-7">
        <section className="flex items-center gap-3.5 rounded-card bg-green-800 px-5 py-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-tile bg-white/8 text-green-200">
            <BellLineIcon size={24} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="text-16 font-bold text-white">전체 알림</h2>
            <p className="text-12 text-on-dark-300">환불 마감과 결제일을 놓치지 않게 알려드려요</p>
          </div>
          <Toggle label="전체 알림" checked={enabled} onChange={toggleAll} disabled={!data} />
        </section>

        {loading && !data && <LoadingMessage />}
        {error && <ErrorMessage error={error} onRetry={reload} />}
        {saveError && (
          <p role="alert" className="mt-3 text-center text-12 text-coral-600">
            {saveError}
          </p>
        )}

        <div className="mt-6 flex flex-col">
          {NOTIFICATION_GROUPS.map((group) => (
            <SettingsSection key={group.title} title={group.title}>
              {group.items.map(renderRow)}
            </SettingsSection>
          ))}

          <SettingsSection title="알림 받는 시간">
            <label className="relative flex h-[66px] cursor-pointer items-center gap-3 px-5">
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-15 font-bold text-ink">알림 시간</p>
                <p className="text-12 text-gray-400">설정한 시간에 한 번에 모아 보내드려요</p>
              </div>
              <span className="text-15 font-bold text-green-600">{formatTime(time)}</span>
              <ChevronRightIcon size={18} className="text-gray-400" />
              <input
                type="time"
                aria-label="알림 시간"
                value={time}
                disabled={!enabled}
                onChange={(e) => e.target.value && setTime(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full"
              />
            </label>
          </SettingsSection>

          <SettingsSection title="기타">{renderRow(MARKETING_ITEM)}</SettingsSection>
        </div>
      </main>
    </>
  );
}
