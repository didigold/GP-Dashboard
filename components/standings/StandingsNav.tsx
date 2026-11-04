'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Driver Standings', href: '/standings' },
  { label: 'Driver Stats', href: '/driver-stats' },
  { label: 'Constructors', href: '/standings/constructors' },
  { label: 'Teams', href: '/standings/teams' },
];

export function StandingsNav() {
  const pathname = usePathname();

  return (
    <div className="inline-flex w-full items-center gap-1 rounded-full liquid-glass-pill p-1 sm:w-auto overflow-x-auto scrollbar-none">
      {TABS.map((tab) => {
        const isActive =
          tab.href === '/standings'
            ? pathname === '/standings'
            : tab.href === '/driver-stats'
            ? pathname === '/driver-stats' || pathname.startsWith('/driver-stats')
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-center text-xs font-medium transition-all sm:flex-none sm:text-sm',
              isActive
                ? 'bg-white font-semibold text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
