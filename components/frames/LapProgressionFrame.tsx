'use client';

import React, { useMemo, useState } from 'react';
import { getLapSeries } from '@/lib/utils/snapshot-store';
import { FrameContentProps } from './types';

const PAD_LEFT = 38;
const PAD_RIGHT = 42;
const PAD_TOP = 10;
const PAD_BOTTOM = 18;
const W = 420;
const H = 170;
const CHART_W = W - PAD_LEFT - PAD_RIGHT;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(2);
  return m > 0 ? `${m}:${s.padStart(5, '0')}` : s;
}

export function LapProgressionFrame({ ctx }: FrameContentProps) {
  const { riders } = ctx;
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const topRiders = useMemo(
    () => [...riders].filter((r) => r.pos > 0 && r.pos <= 5).sort((a, b) => a.pos - b.pos),
    [riders]
  );

  const series = useMemo(
    () =>
      topRiders.map((r) => ({
        number: r.rider_number,
        code: r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase(),
        color: r.color || '#E10600',
        points: getLapSeries(r.rider_number),
      })),
    [topRiders]
  );

  const { minLap, maxLap, minTime, maxTime } = useMemo(() => {
    let minL = Infinity;
    let maxL = -Infinity;
    let minT = Infinity;
    let maxT = -Infinity;
    for (const s of series) {
      if (hidden.has(s.number)) continue;
      for (const p of s.points) {
        if (p.lap < minL) minL = p.lap;
        if (p.lap > maxL) maxL = p.lap;
        if (p.time < minT) minT = p.time;
        if (p.time > maxT) maxT = p.time;
      }
    }
    if (!Number.isFinite(minL)) {
      return { minLap: 1, maxLap: 10, minTime: 100, maxTime: 120 };
    }
    return {
      minLap: minL,
      maxLap: Math.max(minL + 1, maxL),
      minTime: minT - 0.3,
      maxTime: maxT + 0.3,
    };
  }, [series, hidden]);

  const x = (lap: number) =>
    PAD_LEFT + ((lap - minLap) / Math.max(1, maxLap - minLap)) * CHART_W;
  const y = (time: number) =>
    PAD_TOP + ((time - minTime) / Math.max(0.001, maxTime - minTime)) * CHART_H;

  const toggle = (num: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const hasData = series.some((s) => s.points.length > 0);

  if (!hasData) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div className="text-xs text-neutral-500 leading-relaxed">
          Waiting for completed laps…
          <br />
          <span className="text-neutral-600">Lap times are recorded as riders cross the line.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 p-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Y grid */}
        {[0, 0.5, 1].map((f) => {
          const gy = PAD_TOP + f * CHART_H;
          const val = fmt(maxTime - f * (maxTime - minTime));
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

        {/* X labels */}
        <text x={PAD_LEFT} y={H - 5} fontSize={8} fill="#555">
          L{minLap}
        </text>
        <text x={PAD_LEFT + CHART_W} y={H - 5} textAnchor="end" fontSize={8} fill="#555">
          L{maxLap}
        </text>

        {/* Lines */}
        {series.map((s) => {
          if (hidden.has(s.number) || s.points.length === 0) return null;
          const d = s.points
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.lap).toFixed(1)},${y(p.time).toFixed(1)}`)
            .join(' ');
          const fastest = s.points.reduce((a, b) => (b.time < a.time ? b : a), s.points[0]);
          return (
            <g key={s.number}>
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
              <circle cx={x(fastest.lap)} cy={y(fastest.time)} r={2.4} fill="#fff" />
              <circle cx={x(fastest.lap)} cy={y(fastest.time)} r={1.2} fill={s.color} />
            </g>
          );
        })}
      </svg>

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
            >
              {s.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
