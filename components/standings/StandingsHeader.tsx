'use client';

import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Season } from '@/lib/data/standings';
import { SeasonCombobox } from './SeasonCombobox';

interface StandingsHeaderProps {
  title: string;
  description: string;
  selectedSeason: Season;
  onSeasonChange: (season: Season) => void;
  isLoading: boolean;
  lastUpdated: string;
  onRefresh: () => void;
  children?: ReactNode;
}

export function StandingsHeader({
  title,
  description,
  selectedSeason,
  onSeasonChange,
  isLoading,
  lastUpdated,
  onRefresh,
  children,
}: StandingsHeaderProps) {
  return (
    <header className="rounded-2xl liquid-glass-card p-4 sm:p-5 shadow-2xl font-sans">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="motogp">Live Dorna Feed</Badge>
            <span className="font-sans text-[11px] text-neutral-400">
              Synced {lastUpdated}
            </span>
          </div>
          <h1 className="mt-2 font-sans text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-xs font-light leading-relaxed text-neutral-400 sm:text-sm">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {children}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              aria-label="Refresh standings"
              title="Refresh standings"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full liquid-glass-circle text-neutral-300 transition-all hover:text-white disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw
                className={cn('h-4 w-4', isLoading && 'animate-spin')}
                aria-hidden="true"
              />
            </button>
            <SeasonCombobox value={selectedSeason} onChange={onSeasonChange} />
          </div>
        </div>
      </div>
    </header>
  );
}
