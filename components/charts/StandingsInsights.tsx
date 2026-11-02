'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { EvolutionDataset } from '@/lib/data/standings-evolution';
import { ChartShell, EmptyChart, roundLabel } from './StandingsCharts';

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '').trim();
  if (value.length !== 6) return `rgba(225, 6, 0, ${alpha})`;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ------------------------------------------------------------------ */
/* Points heatmap                                                      */
/* ------------------------------------------------------------------ */

interface HeatmapHover {
  entityId: string;
  name: string;
  color: string;
  round: number;
  points: number;
}

export function StandingsPointsHeatmap({
  dataset,
  topN = 12,
  label = 'Driver',
  className,
}: {
  dataset: EvolutionDataset;
  topN?: number;
  label?: string;
  className?: string;
}) {
  const [hover, setHover] = useState<HeatmapHover | null>(null);

  const shown = useMemo(() => dataset.drivers.slice(0, topN), [dataset.drivers, topN]);
  const rounds = dataset.roundCount;
  const maxPoints = Math.max(
    1,
    ...shown.flatMap((entity) => dataset.perRound[entity.id] ?? [])
  );

  const gridTemplate = `minmax(84px, 120px) repeat(${rounds}, minmax(0, 1fr))`;

  return (
    <ChartShell
      title={`${label} Points Heatmap`}
      description="Points scored per round"
      className={className}
      badge={
        <span className="font-sans text-xs text-neutral-400">
          Intensity = points
        </span>
      }
    >
      {shown.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="space-y-3 font-sans">
          <div className="overflow-x-auto pb-1">
            <div className="min-w-[540px]">
              <div
                className="grid items-center gap-1"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <span className="font-sans text-xs text-neutral-400">
                  Round
                </span>
                {Array.from({ length: rounds }, (_, round) => (
                  <span
                    key={round}
                    className="text-center font-sans text-xs tabular-nums text-neutral-400"
                  >
                    {round % 2 === 0 ? roundLabel(round) : ''}
                  </span>
                ))}
              </div>

              {shown.map((entity) => (
                <div
                  key={entity.id}
                  className="mt-1 grid items-center gap-1"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  <span className="flex items-center gap-1.5 truncate font-sans text-xs text-neutral-300">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: entity.color }}
                    />
                    <span className="truncate">{entity.shortName}</span>
                  </span>
                  {Array.from({ length: rounds }, (_, round) => {
                    const points = dataset.perRound[entity.id]?.[round] ?? 0;
                    const intensity = points / maxPoints;
                    return (
                      <div
                        key={round}
                        className={cn(
                          'h-6 rounded-[2px] transition-transform',
                          points > 0 && 'hover:scale-110'
                        )}
                        style={{
                          backgroundColor:
                            points > 0
                              ? hexToRgba(entity.color, 0.16 + intensity * 0.84)
                              : '#151515',
                        }}
                        onMouseEnter={() =>
                          setHover({
                            entityId: entity.id,
                            name: entity.shortName,
                            color: entity.color,
                            round,
                            points,
                          })
                        }
                        onMouseLeave={() => setHover(null)}
                        title={`${entity.shortName} · ${roundLabel(round)} · ${points} pts`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-6 items-center border-t border-white/[0.06] pt-2 font-sans text-xs text-neutral-400">
            {hover ? (
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: hover.color }}
                />
                <span className="text-neutral-200">{hover.name}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-400">{roundLabel(hover.round)}</span>
                <span className="text-neutral-500">·</span>
                <span className="font-bold text-white">{hover.points} pts</span>
              </span>
            ) : (
              <span className="text-neutral-500">Hover a cell to inspect round points</span>
            )}
          </div>
        </div>
      )}
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* Form guide                                                          */
/* ------------------------------------------------------------------ */

export function StandingsFormGuide({
  dataset,
  topN = 10,
  label = 'Driver',
  className,
}: {
  dataset: EvolutionDataset;
  topN?: number;
  label?: string;
  className?: string;
}) {
  const rounds = dataset.roundCount;
  const lastRound = rounds - 1;

  const rows = useMemo(() => {
    const drivers = dataset.drivers.slice(0, topN).map((entity) => {
      const perRound = dataset.perRound[entity.id] ?? [];
      const last5 = perRound.slice(-5);
      const total = last5.reduce((sum, value) => sum + value, 0);
      const rankNow = dataset.rankings[entity.id]?.[lastRound] ?? 0;
      const rankBefore = dataset.rankings[entity.id]?.[Math.max(0, lastRound - 5)] ?? rankNow;
      return {
        entity,
        last5,
        total,
        delta: rankBefore - rankNow,
        rankNow,
      };
    });

    return drivers.sort((a, b) => b.total - a.total || a.rankNow - b.rankNow);
  }, [dataset, topN, lastRound]);

  const maxTotal = Math.max(1, ...rows.flatMap((row) => row.last5));

  return (
    <ChartShell
      title="Form Guide"
      description={`${label} momentum · last 5 rounds`}
      className={className}
      badge={
        <span className="font-sans text-xs text-neutral-400">
          Sorted by form
        </span>
      }
    >
      {rows.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="space-y-1.5 font-sans">
          {rows.map(({ entity, last5, total, delta, rankNow }) => (
            <div
              key={entity.id}
              className="flex items-center gap-3 border-b border-white/[0.04] pb-1.5 last:border-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entity.color }}
                />
                <span className="truncate font-sans text-xs text-neutral-200">
                  {entity.shortName}
                </span>
                <span className="shrink-0 font-sans text-xs text-neutral-400">P{rankNow}</span>
              </div>

              <div className="flex h-7 items-end gap-1" aria-hidden="true">
                {last5.map((points, index) => (
                  <span
                    key={index}
                    className="w-2 rounded-t-[1px]"
                    style={{
                      height: `${Math.max(8, (points / maxTotal) * 100)}%`,
                      backgroundColor: entity.color,
                      opacity: 0.4 + (index / Math.max(1, last5.length - 1)) * 0.6,
                    }}
                    title={`${roundLabel(lastRound - last5.length + 1 + index)} · ${points} pts`}
                  />
                ))}
              </div>

              <div className="flex w-20 shrink-0 items-center justify-end gap-1.5">
                <span className="font-sans text-sm font-bold tabular-nums text-white">
                  {total}
                </span>
                <span className="font-sans text-xs text-neutral-400">pts</span>
                {delta === 0 ? (
                  <span className="w-8 text-right font-sans text-xs text-neutral-500">—</span>
                ) : (
                  <span
                    className={cn(
                      'w-8 text-right font-sans text-xs font-bold',
                      delta > 0 ? 'text-emerald-400' : 'text-red-400'
                    )}
                    title={`${Math.abs(delta)} place${Math.abs(delta) === 1 ? '' : 's'} ${
                      delta > 0 ? 'gained' : 'lost'
                    } in the last 5 rounds`}
                  >
                    {delta > 0 ? '▲' : '▼'}
                    {Math.abs(delta)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* Points share donut                                                  */
/* ------------------------------------------------------------------ */

export function StandingsPointsShare({
  dataset,
  topN = 8,
  label = 'Constructor',
  className,
}: {
  dataset: EvolutionDataset;
  topN?: number;
  label?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const shown = useMemo(() => dataset.drivers.slice(0, topN), [dataset.drivers, topN]);
  const total = shown.reduce((sum, entity) => sum + entity.points, 0) || 1;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const slices = shown.map((entity) => {
    const share = entity.points / total;
    const dash = share * circumference;
    const slice = {
      entity,
      share,
      dash,
      offset,
    };
    offset += dash;
    return slice;
  });

  const active = shown.find((entity) => entity.id === activeId);

  return (
    <ChartShell
      title={`${label} Points Share`}
      description={`Share of top ${Math.min(shown.length, topN)} points`}
      className={className}
      badge={
        <span className="font-sans text-xs text-neutral-400">
          {shown.length} entries
        </span>
      }
    >
      {shown.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="space-y-4 font-sans">
          <div className="mx-auto h-[150px] w-[150px]">
            <svg viewBox="0 0 140 140" className="h-full w-full" role="img" aria-label={`${label} points share`}>
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#181818"
                strokeWidth="18"
              />
              {slices.map(({ entity, dash, offset: sliceOffset }) => {
                const isActive = activeId === entity.id;
                return (
                  <circle
                    key={entity.id}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={entity.color}
                    strokeWidth={isActive ? 22 : 18}
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-sliceOffset}
                    transform="rotate(-90 70 70)"
                    className="cursor-pointer transition-[stroke-width]"
                    onMouseEnter={() => setActiveId(entity.id)}
                    onMouseLeave={() => setActiveId(null)}
                  >
                    <title>{`${entity.shortName} · ${entity.points} pts · ${(
                      (entity.points / total) *
                      100
                    ).toFixed(1)}%`}</title>
                  </circle>
                );
              })}
              <text
                x="70"
                y="64"
                textAnchor="middle"
                className="fill-white font-sans"
                style={{ fontSize: 20, fontWeight: 700 }}
              >
                {active ? `${((active.points / total) * 100).toFixed(1)}%` : total}
              </text>
              <text
                x="70"
                y="82"
                textAnchor="middle"
                className="fill-neutral-400 font-sans"
                style={{ fontSize: 10, fontWeight: 500 }}
              >
                {active ? active.shortName : 'Total Pts'}
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {slices.map(({ entity, share }) => (
              <button
                key={entity.id}
                type="button"
                onMouseEnter={() => setActiveId(entity.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(entity.id)}
                onBlur={() => setActiveId(null)}
                className={cn(
                  'flex items-center justify-between gap-2 border-b border-white/[0.04] pb-1 text-left transition-opacity',
                  activeId && activeId !== entity.id ? 'opacity-40' : 'opacity-100'
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: entity.color }}
                  />
                  <span className="truncate font-sans text-xs text-neutral-300">
                    {entity.shortName}
                  </span>
                </span>
                <span className="shrink-0 font-sans text-xs tabular-nums text-neutral-400">
                  {(share * 100).toFixed(1)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </ChartShell>
  );
}
