'use client';

import React, { useMemo } from 'react';
import { getPitStops, getSnapshots } from '@/lib/utils/snapshot-store';
import { FrameContentProps } from './types';

function clock(secs: number): string {
  const s = Math.max(0, Math.floor(secs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export function SessionTimelineFrame({ ctx }: FrameContentProps) {
  const { remainingSeconds, totalDurationSeconds, currentLap, totalLaps, sessionType, riders } = ctx;

  const markers = useMemo(() => {
    const snaps = getSnapshots();
    const stops = getPitStops();
    if (snaps.length === 0 || totalDurationSeconds <= 0) return [];
    return stops.slice(0, 40).map((stop) => {
      // Find snapshot closest to the pit entry time
      let best = snaps[0];
      let bestDiff = Infinity;
      for (const snap of snaps) {
        const diff = Math.abs(snap.t - stop.entryT);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = snap;
        }
      }
      const elapsed = totalDurationSeconds - best.remaining;
      const pct = Math.min(100, Math.max(0, (elapsed / totalDurationSeconds) * 100));
      const r = riders.find((x) => x.rider_number === stop.rider);
      return { pct, color: r?.color || '#E10600', rider: stop.rider };
    });
  }, [totalDurationSeconds, riders, remainingSeconds]);

  const progressPct =
    totalDurationSeconds > 0
      ? Math.min(100, Math.max(0, ((totalDurationSeconds - remainingSeconds) / totalDurationSeconds) * 100))
      : 0;

  const isTimed = /^(FP|PR|Q|WUP)/i.test(sessionType);

  return (
    <div className="flex-1 flex flex-col justify-center gap-3 px-3 py-2">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
          {isTimed ? 'Time Remaining' : 'Race Clock'}
        </div>
        <div className="text-4xl font-black tabular-nums text-white leading-none mt-1">
          {totalDurationSeconds > 0 ? clock(remainingSeconds) : '—'}
        </div>
        {!isTimed && (
          <div className="text-[11px] text-neutral-400 mt-1 tabular-nums">
            Lap {currentLap}
            {totalLaps ? ` / ${totalLaps}` : ''}
          </div>
        )}
      </div>

      {/* Progress bar with pit markers */}
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {markers.map((m, i) => (
          <span
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-black/40"
            style={{ left: `${m.pct}%`, backgroundColor: m.color }}
            title={`Pit stop #${m.rider}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px] text-neutral-500 uppercase tracking-wider">
        <span>Start</span>
        <span>
          {totalDurationSeconds > 0 ? `${Math.round(progressPct)}% complete` : 'Awaiting session'}
        </span>
        <span>End</span>
      </div>
    </div>
  );
}
