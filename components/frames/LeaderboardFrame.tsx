'use client';

import React, { useMemo } from 'react';
import { LiveTimingRider } from '@/lib/types/motogp';
import { getSnapshots } from '@/lib/utils/snapshot-store';
import { FrameContentProps } from './types';

function readableText(hex?: string): string {
  if (!hex) return '#FFFFFF';
  const value = hex.replace('#', '').trim();
  if (value.length !== 6) return '#FFFFFF';
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if ([r, g, b].some((c) => Number.isNaN(c))) return '#FFFFFF';
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#0A0A0A' : '#FFFFFF';
}

function isOutStatus(rider: LiveTimingRider): boolean {
  const status = (rider.status || '').toUpperCase();
  return status.includes('OUT') || status.includes('NOTFINISH') || status.includes('DNF');
}

export function LeaderboardFrame({ ctx }: FrameContentProps) {
  const { riders, currentLap, totalLaps, remainingSeconds, sessionType } = ctx;

  const sorted = useMemo(() => [...riders].sort((a, b) => a.pos - b.pos), [riders]);

  const deltas = useMemo(() => {
    const snaps = getSnapshots();
    const map: Record<string, number | null> = {};
    if (snaps.length < 2) return map;
    const first = snaps[0];
    const last = snaps[snaps.length - 1];
    for (const r of sorted) {
      const a = first.riders.find((x) => x.n === r.rider_number)?.p;
      const b = last.riders.find((x) => x.n === r.rider_number)?.p;
      if (a && b && a > 0 && b > 0) map[r.rider_number] = a - b;
      else map[r.rider_number] = null;
    }
    return map;
  }, [sorted]);

  const isTimed = /^(FP|PR|Q|WUP)/i.test(sessionType);

  const formatClock = (secs: number) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.floor(Math.max(0, secs) % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Session clock / lap counter */}
      <div className="px-3 pb-1.5 flex items-center justify-between text-[11px] shrink-0">
        <span className="uppercase tracking-wider text-neutral-500 font-semibold">Session</span>
        <span className="font-black text-white tabular-nums text-sm">
          {isTimed ? (
            formatClock(remainingSeconds)
          ) : (
            <>
              LAP {currentLap}
              <span className="text-neutral-500 text-xs">/{totalLaps || '—'}</span>
            </>
          )}
        </span>
      </div>

      <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-neutral-500 text-[10px] font-semibold uppercase tracking-wider sticky top-0 z-10 bg-[#0D0D0E]">
              <th className="py-1.5 px-2 w-8 text-center">POS</th>
              <th className="py-1.5 px-2">RIDER</th>
              <th className="py-1.5 px-2 w-10 text-center">Δ</th>
              <th className="py-1.5 px-2 text-right">GAP</th>
              <th className="py-1.5 px-2 text-right">INT</th>
              <th className="py-1.5 px-2.5 text-right">LAST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {sorted.map((rider) => {
              const out = isOutStatus(rider);
              const inPit = rider.trac_status === 'B';
              const shortName =
                rider.rider_shortname || rider.rider_surname.slice(0, 3).toUpperCase();
              const delta = deltas[rider.rider_number];
              const isPoints = rider.pos <= 10 && rider.pos > 0;

              return (
                <tr
                  key={rider.rider_number}
                  className={`h-[34px] font-sans ${out ? 'opacity-40' : 'hover:bg-white/[0.03]'}`}
                >
                  <td className="py-1 px-2 text-center">
                    <span
                      className={`text-xs font-extrabold tabular-nums ${
                        isPoints ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {rider.pos > 50 ? '—' : rider.pos}
                    </span>
                  </td>

                  <td className="py-1 px-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="h-4 min-w-[26px] px-1 rounded-[3px] text-xs font-black flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: rider.color || '#E10600',
                          color: readableText(rider.color),
                        }}
                      >
                        {rider.rider_number}
                      </span>
                      <span className="font-bold text-white text-xs tracking-tight truncate">
                        {rider.rider_name.charAt(0)} {shortName}
                      </span>
                      {inPit && !out && (
                        <span className="text-[9px] font-black text-amber-400 shrink-0">PIT</span>
                      )}
                      {out && (
                        <span className="text-[9px] font-black text-rose-400 shrink-0">OUT</span>
                      )}
                    </div>
                  </td>

                  <td className="py-1 px-2 text-center tabular-nums text-[10px] font-bold">
                    {delta === null || delta === undefined ? (
                      <span className="text-neutral-600">—</span>
                    ) : delta === 0 ? (
                      <span className="text-neutral-500">0</span>
                    ) : delta > 0 ? (
                      <span className="text-emerald-400">▲{delta}</span>
                    ) : (
                      <span className="text-rose-400">▼{Math.abs(delta)}</span>
                    )}
                  </td>

                  <td className="py-1 px-2 text-right tabular-nums text-[11px] font-semibold">
                    {rider.pos === 1 ? (
                      <span className="text-neutral-500">—</span>
                    ) : (
                      <span className="text-neutral-200">{rider.gap_first || '—'}</span>
                    )}
                  </td>

                  <td className="py-1 px-2 text-right tabular-nums text-[11px] font-medium text-neutral-400">
                    {rider.pos === 1 || out ? '—' : rider.gap_prev || '—'}
                  </td>

                  <td className="py-1 px-2.5 text-right tabular-nums text-[11px] font-bold">
                    <span className={rider.pos === 1 ? 'text-purple-400' : 'text-white'}>
                      {rider.lap_time || '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="p-6 text-center text-xs text-neutral-500">No timing data available.</div>
        )}
      </div>
    </div>
  );
}
