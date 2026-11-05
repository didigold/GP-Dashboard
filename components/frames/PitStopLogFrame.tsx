'use client';

import React, { useMemo } from 'react';
import { getPitStops } from '@/lib/utils/snapshot-store';
import { FrameContentProps } from './types';

export function PitStopLogFrame({ ctx }: FrameContentProps) {
  const { riders } = ctx;

  const stops = useMemo(() => getPitStops(), [riders]);

  const riderLookup = useMemo(() => {
    const map: Record<string, { code: string; color: string }> = {};
    for (const r of riders) {
      map[r.rider_number] = {
        code: r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase(),
        color: r.color || '#E10600',
      };
    }
    return map;
  }, [riders]);

  if (stops.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div className="text-xs text-neutral-500 leading-relaxed">
          No pit stops recorded yet.
          <br />
          <span className="text-neutral-600">Detected automatically from live pit status.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin]">
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {stops.map((s, idx) => {
          const info = riderLookup[s.rider] || { code: s.rider, color: '#666' };
          const dur = s.duration;
          const tone =
            dur === null
              ? 'text-amber-400'
              : dur >= 8
              ? 'text-rose-400'
              : dur >= 5
              ? 'text-amber-400'
              : 'text-white';
          return (
            <div
              key={`${s.rider}-${s.entryT}-${idx}`}
              className="flex items-center justify-between px-3 py-1.5 text-[11px]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-4 min-w-[26px] px-1 rounded-[3px] text-[10px] font-black flex items-center justify-center shrink-0"
                  style={{ backgroundColor: info.color, color: '#fff' }}
                >
                  {s.rider}
                </span>
                <span className="font-bold text-white truncate">{info.code}</span>
                <span className="text-neutral-500">L{s.lap}</span>
              </div>
              <span className={`font-black tabular-nums ${tone}`}>
                {dur === null ? 'IN PIT' : `${dur.toFixed(1)}s`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
