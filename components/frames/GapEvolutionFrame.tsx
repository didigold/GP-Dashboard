'use client';

import React, { useMemo, useState } from 'react';
import { getGapSeries, GapPoint } from '@/lib/utils/snapshot-store';
import { FrameContentProps } from './types';

const PAD_LEFT = 34;
const PAD_RIGHT = 46;
const PAD_TOP = 10;
const PAD_BOTTOM = 18;
const W = 420;
const H = 170;
const CHART_W = W - PAD_LEFT - PAD_RIGHT;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

export function GapEvolutionFrame({ ctx }: FrameContentProps) {
  const { riders } = ctx;
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const topRiders = useMemo(
    () => [...riders].filter((r) => r.pos > 0 && r.pos <= 10).sort((a, b) => a.pos - b.pos),
    [riders]
  );

  const series = useMemo(() => {
    return topRiders.map((r) => ({
      number: r.rider_number,
      code: r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase(),
      color: r.color || '#E10600',
      points: getGapSeries(r.rider_number, 30),
    }));
  }, [topRiders]);

  const { maxT, maxGap } = useMemo(() => {
    let mt = 0;
    let mg = 1;
    for (const s of series) {
      if (hidden.has(s.number)) continue;
      for (const p of s.points) {
        if (p.t > mt) mt = p.t;
        if (p.gap > mg) mg = p.gap;
      }
    }
    return { maxT: mt || 1, maxGap: mg };
  }, [series, hidden]);

  const x = (t: number) => PAD_LEFT + (t / maxT) * CHART_W;
  const y = (gap: number) => PAD_TOP + (gap / maxGap) * CHART_H;

  const toggle = (num: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const hasData = series.some((s) => s.points.length > 1);

  if (!hasData) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div className="text-xs text-neutral-500 leading-relaxed">
          Collecting gap data…
          <br />
          <span className="text-neutral-600">Updates every 3 seconds during a live session.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 p-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Horizontal grid + y labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const gy = PAD_TOP + f * CHART_H;
          const val = (maxGap * (1 - f)).toFixed(1);
          return (
            <g key={f}>
              <line
                x1={PAD_LEFT}
                y1={gy}
                x2={PAD_LEFT + CHART_W}
                y2={gy}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
              <text x={PAD_LEFT - 4} y={gy + 3} textAnchor="end" fontSize={8} fill="#555">
                {val}
              </text>
            </g>
          );
        })}

        {/* x-axis time labels */}
        <text x={PAD_LEFT} y={H - 5} fontSize={8} fill="#555">
          -30m
        </text>
        <text x={PAD_LEFT + CHART_W / 2} y={H - 5} textAnchor="middle" fontSize={8} fill="#555">
          -15m
        </text>
        <text x={PAD_LEFT + CHART_W} y={H - 5} textAnchor="end" fontSize={8} fill="#555">
          now
        </text>

        {/* Rider lines */}
        {series.map((s) => {
          if (hidden.has(s.number) || s.points.length < 2) return null;
          const d = s.points
            .map((p: GapPoint, i: number) => `${i === 0 ? 'M' : 'L'}${x(p.t).toFixed(1)},${y(p.gap).toFixed(1)}`)
            .join(' ');
          const last = s.points[s.points.length - 1];
          return (
            <g key={s.number}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={1.6} strokeLinejoin="round" />
              <circle cx={x(last.t)} cy={y(last.gap)} r={2.2} fill={s.color} />
              <text
                x={PAD_LEFT + CHART_W + 4}
                y={y(last.gap) + 3}
                fontSize={8.5}
                fontWeight={700}
                fill={s.color}
              >
                {s.code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Clickable legend */}
      <div className="flex flex-wrap gap-1 px-2 pb-1">
        {series.map((s) => {
          const isHidden = hidden.has(s.number);
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => toggle(s.number)}
              className="text-[9px] font-bold px-1.5 py-0.5 rounded transition-opacity cursor-pointer"
              style={{
                color: s.color,
                opacity: isHidden ? 0.35 : 1,
                backgroundColor: isHidden ? 'transparent' : 'rgba(255,255,255,0.04)',
              }}
              title={isHidden ? 'Show rider' : 'Hide rider'}
            >
              {s.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
