'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type SectorStatus = 'purple' | 'green' | 'yellow' | 'none';

export interface SectorPillProps {
  sectors: [SectorStatus, SectorStatus, SectorStatus, SectorStatus];
  times?: [string, string, string, string];
  showTimes?: boolean;
  className?: string;
}

export function SectorPill({ sectors, times, showTimes = false, className }: SectorPillProps) {
  const statusColors = {
    purple: 'bg-apex-purple text-white shadow-glow-purple',
    green: 'bg-apex-green text-surface-base font-bold',
    yellow: 'bg-apex-amber/80 text-surface-base font-bold',
    none: 'bg-surface-subtle text-text-muted',
  };

  return (
    <div className={twMerge('inline-flex items-center gap-1 font-mono text-[10px]', className)}>
      {sectors.map((status, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div
            className={twMerge(
              'w-5 h-3.5 rounded-[2px] flex items-center justify-center font-bold text-[9px] transition-all',
              statusColors[status]
            )}
          >
            T{idx + 1}
          </div>
          {showTimes && times && times[idx] && (
            <span className="text-[9px] text-text-muted mt-0.5 tabular-nums">{times[idx]}</span>
          )}
        </div>
      ))}
    </div>
  );
}
