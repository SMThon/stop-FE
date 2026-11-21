import { NavLink } from 'react-router-dom';
import type { ComponentType } from 'react';
import { CalendarIcon, ChatIcon, HomeIcon, SearchIcon, SettingsIcon, type IconProps } from '@/components/icons';
import { ROUTES } from '@/constants/routes';

type Tab = { label: string; to: string; icon: ComponentType<IconProps>; end?: boolean };

const TABS: Tab[] = [
  { label: '홈', to: ROUTES.home, icon: HomeIcon, end: true },
  { label: '일정', to: ROUTES.schedule, icon: CalendarIcon },
  { label: '규정 찾기', to: ROUTES.refundSearch, icon: SearchIcon },
  { label: 'AI 상담', to: ROUTES.chat, icon: ChatIcon },
  { label: '설정', to: ROUTES.settings, icon: SettingsIcon },
];

/** Figma: Bottom Nav (2:114) */
export default function BottomNav() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 border-t border-line bg-surface px-2 pt-2.5 pb-[calc(22px+env(safe-area-inset-bottom))]"
    >
      <ul className="flex">
        {TABS.map(({ label, to, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-11 ${
                  isActive ? 'font-bold text-green-600' : 'font-medium text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} />
                  <span>{label}</span>
                  <span
                    aria-hidden
                    className={`size-1 rounded-full ${isActive ? 'bg-green-400' : 'bg-transparent'}`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
