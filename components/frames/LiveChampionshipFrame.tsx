'use client';

import React, { useMemo } from 'react';
import { FrameContentProps } from './types';

interface StandingItem {
  position?: number;
  riderNumber?: number | string;
  riderName?: string;
  teamName?: string;
  constructorName?: string;
  points?: number;
}

export function LiveChampionshipFrame({ ctx }: FrameContentProps) {
  const { standings, riders } = ctx;

  const rows = useMemo(() => {
    const list: StandingItem[] = Array.isArray(standings) && standings.length > 0 ? standings : [];
    return list.slice(0, 10);
  }, [standings]);

  const colorFor = (num?: number | string): string => {
    if (num === undefined || num === null) return '#E10600';
    const r = riders.find((x) => x.rider_number === String(num));
    return r?.color || '#E10600';
  };

  if (rows.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div className="text-xs text-neutral-500">Championship standings unavailable.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin]">
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {rows.map((item, idx) => {
          const name = item.riderName || '—';
          const surname = name.split(' ').slice(-1)[0];
          const num = item.riderNumber;
          return (
            <div
              key={`${num ?? idx}`}
              className="flex items-center justify-between px-3 py-1.5 text-[11px]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 text-right text-neutral-500 font-bold tabular-nums">
                  {item.position ?? idx + 1}
                </span>
                {num !== undefined && num !== null && (
                  <span
                    className="h-4 min-w-[24px] px-1 rounded-[3px] text-[9px] font-black flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colorFor(num), color: '#fff' }}
                  >
                    {num}
                  </span>
                )}
                <span className="font-bold text-white truncate">
                  {name.charAt(0)} {surname}
                </span>
              </div>
              <span className="font-black text-white tabular-nums">{item.points ?? 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
