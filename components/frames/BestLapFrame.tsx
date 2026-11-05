'use client';

import React, { useEffect, useState } from 'react';
import { FrameContentProps } from './types';

interface BestLapRecord {
  type: string;
  time: string;
  rider: string;
  year?: number | null;
}

interface BestLapsResponse {
  sessionBest: BestLapRecord | null;
  pole: BestLapRecord | null;
  circuitRecord: BestLapRecord | null;
  previousEdition: BestLapRecord | null;
}

function toSeconds(time: string): number | null {
  if (!time || time === '--') return null;
  const parts = time.split(':');
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseFloat(parts[1]);
    if (Number.isFinite(m) && Number.isFinite(s)) return m * 60 + s;
  }
  const n = parseFloat(time);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function Row({
  label,
  record,
  baseSeconds,
  hint,
}: {
  label: string;
  record: BestLapRecord | null;
  baseSeconds: number | null;
  hint?: string;
}) {
  const sec = record ? toSeconds(record.time) : null;
  const delta = sec !== null && baseSeconds !== null ? sec - baseSeconds : null;

  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-2.5 py-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
          {label}
        </span>
        {delta !== null && Math.abs(delta) > 0.0005 && (
          <span
            className={`text-[9px] font-black px-1 rounded ${
              delta < 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
            }`}
          >
            {delta > 0 ? '+' : ''}
            {delta.toFixed(3)}
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between mt-0.5">
        <span className="text-base font-black text-white tabular-nums">
          {record?.time || '—'}
        </span>
        {record && (
          <span className="text-[10px] text-neutral-400 truncate ml-2 text-right">
            {record.rider.split(' ').slice(-1)[0]}
            {record.year ? ` · ${record.year}` : ''}
          </span>
        )}
      </div>
      {hint && <div className="text-[9px] text-neutral-600 mt-0.5">{hint}</div>}
    </div>
  );
}

export function BestLapFrame({ ctx }: FrameContentProps) {
  const { eventId } = ctx;
  const [data, setData] = useState<BestLapsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const url = eventId ? `/api/best-laps?eventUuid=${eventId}` : '/api/best-laps';
    fetch(url, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json && !json.error) setData(json);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-neutral-500">
        Loading benchmarks…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-neutral-500 text-center px-4">
        Benchmarks unavailable for this event.
      </div>
    );
  }

  const base = toSeconds(data.sessionBest?.time || '');

  return (
    <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin] p-1.5 space-y-1.5">
      <Row label="Session Best" record={data.sessionBest} baseSeconds={base} />
      <Row label="Pole Lap" record={data.pole} baseSeconds={base} />
      <Row
        label="Circuit Record"
        record={data.circuitRecord}
        baseSeconds={base}
        hint={data.circuitRecord?.year ? `Set in ${data.circuitRecord.year}` : undefined}
      />
      {data.previousEdition && (
        <Row
          label="Previous Edition"
          record={data.previousEdition}
          baseSeconds={base}
          hint="Fastest lap one year ago"
        />
      )}
    </div>
  );
}
