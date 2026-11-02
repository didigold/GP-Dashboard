'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvolutionDataset, EvolutionDriver } from '@/lib/data/standings-evolution';

const RACE_PALETTE = [
  '#22D3EE',
  '#A855F7',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#EC4899',
  '#84CC16',
  '#F97316',
  '#14B8A6',
  '#8B5CF6',
  '#EAB308',
];

function roundLabel(round: number): string {
  return `R${String(round + 1).padStart(2, '0')}`;
}

export { roundLabel };

interface ChartShellProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function ChartShell({
  title,
  description,
  badge,
  actions,
  className,
  children,
}: ChartShellProps) {
  return (
    <section className={cn('flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0C] shadow-2xl hover:border-white/[0.14] transition-all font-sans', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3.5">
        <div className="flex items-start gap-2.5">
          <Activity className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300" aria-hidden="true" />
          <div>
            <h3 className="font-sans text-sm font-bold tracking-tight text-white">{title}</h3>
            <p className="mt-0.5 font-sans text-xs text-neutral-400">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {badge}
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function EmptyChart() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm font-sans text-neutral-500">
      No standings data yet.
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Points evolution · points vs gap-to-leader                          */
/* ------------------------------------------------------------------ */

type EvolutionMode = 'points' | 'gap';

export function StandingsPointsEvolution({
  dataset,
  topN = 8,
  label = 'Driver',
  className,
}: {
  dataset: EvolutionDataset;
  topN?: number;
  label?: string;
  className?: string;
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<number | null>(null);
  const [mode, setMode] = useState<EvolutionMode>('points');
  const plotRef = useRef<HTMLDivElement>(null);

  const ranked = useMemo(() => dataset.drivers.slice(0, topN), [dataset.drivers, topN]);
  const visible = ranked.filter((driver) => !hidden.has(driver.id));
  const rounds = dataset.roundCount;

  const leaderByRound = useMemo(
    () =>
      Array.from({ length: rounds }, (_, round) =>
        Math.max(...dataset.drivers.map((driver) => dataset.cumulative[driver.id]?.[round] ?? 0))
      ),
    [dataset, rounds]
  );

  const maxValue = useMemo(() => {
    if (mode === 'points') {
      return Math.max(
        1,
        ...visible.map((driver) => dataset.cumulative[driver.id]?.[rounds - 1] ?? 0)
      );
    }
    return Math.max(
      1,
      ...visible.flatMap((driver) =>
        (dataset.cumulative[driver.id] ?? []).map(
          (value, round) => (leaderByRound[round] ?? 0) - value
        )
      )
    );
  }, [mode, visible, dataset, rounds, leaderByRound]);

  const valueAt = (driverId: string, round: number): number => {
    const cumulative = dataset.cumulative[driverId]?.[round] ?? 0;
    if (mode === 'points') return cumulative;
    return (leaderByRound[round] ?? 0) - cumulative;
  };

  const axisMax =
    mode === 'points'
      ? Math.max(50, Math.ceil(maxValue / 50) * 50)
      : Math.max(10, Math.ceil(maxValue / 10) * 10);

  const yPct = (value: number) =>
    mode === 'points'
      ? 6 + (1 - value / axisMax) * 88
      : 6 + (value / axisMax) * 88;

  const xPct = (round: number) => (rounds > 1 ? (round / (rounds - 1)) * 100 : 0);

  const toggle = (id: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect || rounds < 2) return;
    const pct = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setHover(Math.round(pct * (rounds - 1)));
  }

  const hoverDrivers =
    hover === null
      ? []
      : [...visible].sort((a, b) =>
          mode === 'points'
            ? valueAt(b.id, hover) - valueAt(a.id, hover)
            : valueAt(a.id, hover) - valueAt(b.id, hover)
        );

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(axisMax * ratio));
  const xTicks = [0, 1, 2, 3, 4].map((index) =>
    Math.round((index / 4) * Math.max(0, rounds - 1))
  );

  return (
    <ChartShell
      title={`${label} Points Evolution`}
      description="Cumulative points by round"
      className={className}
      actions={
        <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] p-0.5">
          {(['points', 'gap'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={cn(
                'px-3 py-1 font-sans text-xs font-medium rounded-full transition-colors',
                mode === option
                  ? 'bg-white font-semibold text-black'
                  : 'text-neutral-400 hover:text-white'
              )}
            >
              {option === 'points' ? 'Points' : 'Gap'}
            </button>
          ))}
        </div>
      }
      badge={
        <span className="font-sans text-xs text-neutral-400">
          {rounds} rounds
        </span>
      }
    >
      {ranked.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="space-y-3 font-sans">
          <div
            ref={plotRef}
            className="relative h-[210px] w-full select-none"
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
          >
            {yTicks.map((value) => (
              <div
                key={value}
                className="pointer-events-none absolute inset-x-0 border-t border-white/[0.06]"
                style={{ top: `${yPct(value)}%` }}
              >
                <span className="absolute -top-2.5 left-0 bg-[#0A0A0C] pr-1 font-sans text-xs tabular-nums text-neutral-400">
                  {mode === 'gap' && value > 0 ? `-${value}` : value}
                </span>
              </div>
            ))}

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {visible.map((driver) => {
                const points = (dataset.cumulative[driver.id] ?? [])
                  .map((_, round) => `${xPct(round)},${yPct(valueAt(driver.id, round))}`)
                  .join(' ');
                return (
                  <polyline
                    key={driver.id}
                    points={points}
                    fill="none"
                    stroke={driver.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    opacity={0.95}
                  />
                );
              })}
            </svg>

            {visible.map((driver) =>
              (dataset.cumulative[driver.id] ?? []).map((_, round) => {
                const active = hover === round;
                return (
                  <span
                    key={`${driver.id}-${round}`}
                    className={cn(
                      'pointer-events-none absolute rounded-full transition-transform',
                      active ? 'z-10 h-2.5 w-2.5 ring-2 ring-black' : 'h-1.5 w-1.5'
                    )}
                    style={{
                      left: `${xPct(round)}%`,
                      top: `${yPct(valueAt(driver.id, round))}%`,
                      backgroundColor: driver.color,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })
            )}

            {hover !== null && (
              <div
                className="pointer-events-none absolute inset-y-[6%] w-px bg-white/30"
                style={{ left: `${xPct(hover)}%` }}
              />
            )}

            {hover !== null && (
              <div
                className="pointer-events-none absolute top-0 z-20 max-h-[190px] w-44 overflow-y-auto rounded-lg border border-white/[0.1] bg-[#0B0B0C]/95 p-2 shadow-2xl backdrop-blur"
                style={{ left: `clamp(13%, ${xPct(hover)}%, 87%)`, transform: 'translateX(-50%)' }}
              >
                <div className="mb-1.5 font-sans text-xs text-neutral-400 font-semibold">
                  {roundLabel(hover)}
                </div>
                <div className="space-y-1">
                  {hoverDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between gap-2 font-sans text-xs"
                    >
                      <span className="flex items-center gap-1.5 text-neutral-300">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: driver.color }}
                        />
                        {driver.shortName}
                      </span>
                      <span className="tabular-nums text-white font-medium">
                        {mode === 'gap'
                          ? `-${valueAt(driver.id, hover)}`
                          : valueAt(driver.id, hover)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between font-sans text-xs text-neutral-500">
            {xTicks.map((round) => (
              <span key={round}>{roundLabel(round)}</span>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {ranked.map((driver) => {
              const isHidden = hidden.has(driver.id);
              return (
                <button
                  key={driver.id}
                  type="button"
                  onClick={() => toggle(driver.id)}
                  aria-pressed={!isHidden}
                  className={cn(
                    'flex items-center gap-1.5 font-sans text-xs transition-opacity',
                    isHidden ? 'opacity-30' : 'opacity-100 hover:opacity-80'
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: driver.color }}
                  />
                  <span className="text-neutral-300">{driver.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* Ranking evolution (bump chart)                                      */
/* ------------------------------------------------------------------ */

export function StandingsRankingEvolution({
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
  const [hover, setHover] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  const drivers = useMemo(() => dataset.drivers.slice(0, topN), [dataset.drivers, topN]);
  const rounds = dataset.roundCount;

  const ranks = useMemo(() => {
    const map: Record<string, number[]> = {};
    drivers.forEach((driver) => {
      map[driver.id] = new Array(rounds).fill(0);
    });
    for (let round = 0; round < rounds; round += 1) {
      const order = [...drivers].sort(
        (a, b) =>
          (dataset.cumulative[b.id]?.[round] ?? 0) -
            (dataset.cumulative[a.id]?.[round] ?? 0) || a.fullName.localeCompare(b.fullName)
      );
      order.forEach((driver, index) => {
        map[driver.id][round] = index + 1;
      });
    }
    return map;
  }, [dataset, drivers, rounds]);

  const count = drivers.length;
  const xPct = (round: number) => (rounds > 1 ? (round / (rounds - 1)) * 100 : 0);
  const yPct = (rank: number) => (count > 1 ? 4 + ((rank - 1) / (count - 1)) * 90 : 50);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect || rounds < 2) return;
    const pct = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setHover(Math.round(pct * (rounds - 1)));
  }

  const orderAtHover =
    hover === null
      ? []
      : [...drivers].sort((a, b) => (ranks[a.id]?.[hover] ?? 0) - (ranks[b.id]?.[hover] ?? 0));

  return (
    <ChartShell
      title={`${label} Ranking Evolution`}
      description="Championship position by round"
      className={className}
      badge={
        <span className="font-sans text-xs text-neutral-400">
          Top {Math.min(count, topN)}
        </span>
      }
    >
      {count === 0 ? (
        <EmptyChart />
      ) : (
        <div className="flex font-sans">
          <div
            ref={plotRef}
            className="relative h-[220px] flex-1 select-none"
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
          >
            {Array.from({ length: count }, (_, index) => index + 1).map((rank) => (
              <div
                key={rank}
                className="pointer-events-none absolute inset-x-0 flex items-center gap-2 border-t border-white/[0.04]"
                style={{ top: `${yPct(rank)}%` }}
              >
                <span className="bg-[#0A0A0C] pr-1 font-sans text-xs tabular-nums text-neutral-500">
                  {rank}
                </span>
              </div>
            ))}

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {drivers.map((driver) => {
                const points = (ranks[driver.id] ?? [])
                  .map((rank, round) => `${xPct(round)},${yPct(rank)}`)
                  .join(' ');
                return (
                  <polyline
                    key={driver.id}
                    points={points}
                    fill="none"
                    stroke={driver.color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    opacity={0.9}
                  />
                );
              })}
            </svg>

            {drivers.map((driver) => {
              const finalRank = ranks[driver.id]?.[rounds - 1] ?? 0;
              return (
                <span
                  key={driver.id}
                  className="pointer-events-none absolute h-2 w-2 rounded-full"
                  style={{
                    left: '100%',
                    top: `${yPct(finalRank)}%`,
                    backgroundColor: driver.color,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              );
            })}

            {hover !== null && (
              <div
                className="pointer-events-none absolute inset-y-0 w-px bg-white/30"
                style={{ left: `${xPct(hover)}%` }}
              />
            )}

            {hover !== null && (
              <div
                className="pointer-events-none absolute top-0 z-20 max-h-[190px] w-44 overflow-y-auto rounded-lg border border-white/[0.1] bg-[#0B0B0C]/95 p-2 shadow-2xl backdrop-blur"
                style={{ left: `clamp(13%, ${xPct(hover)}%, 87%)`, transform: 'translateX(-50%)' }}
              >
                <div className="mb-1.5 font-sans text-xs text-neutral-400 font-semibold">
                  {roundLabel(hover)}
                </div>
                <div className="space-y-1">
                  {orderAtHover.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between gap-2 font-sans text-xs"
                    >
                      <span className="flex items-center gap-1.5 text-neutral-300">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: driver.color }}
                        />
                        {driver.shortName}
                      </span>
                      <span className="tabular-nums text-white font-medium">
                        P{ranks[driver.id]?.[hover] ?? '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative h-[220px] w-20 shrink-0 font-sans">
            {drivers.map((driver) => {
              const finalRank = ranks[driver.id]?.[rounds - 1] ?? 0;
              return (
                <span
                  key={driver.id}
                  className="absolute left-1.5 max-w-[72px] -translate-y-1/2 truncate font-sans text-xs"
                  style={{ top: `${yPct(finalRank)}%`, color: driver.color }}
                  title={driver.fullName}
                >
                  {driver.shortName}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* Season stats                                                        */
/* ------------------------------------------------------------------ */

export function StandingsSeasonStats({
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
  const shown = dataset.drivers.slice(0, topN);
  const max = Math.max(1, ...shown.flatMap((driver) => [driver.wins, driver.podiums]));

  return (
    <ChartShell
      title={`${label} Season Stats`}
      description="Wins and podium finishes"
      className={className}
      badge={
        <div className="flex items-center gap-3 font-sans text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[2px] bg-amber-500" aria-hidden="true" />
            Wins
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[2px] bg-cyan-400" aria-hidden="true" />
            Podiums
          </span>
        </div>
      }
    >
      {shown.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="flex h-[210px] items-stretch gap-2 font-sans">
          {shown.map((driver) => (
            <div
              key={driver.id}
              className="group relative flex h-full flex-1 flex-col justify-end"
            >
              <div className="flex flex-1 items-end justify-center gap-1">
                <div
                  className="w-2.5 rounded-t-[2px] bg-amber-500/80 transition-colors group-hover:bg-amber-400"
                  style={{ height: `${(driver.wins / max) * 100}%` }}
                />
                <div
                  className="w-2.5 rounded-t-[2px] bg-cyan-400/70 transition-colors group-hover:bg-cyan-300"
                  style={{ height: `${(driver.podiums / max) * 100}%` }}
                />
              </div>
              <span className="mt-1.5 w-full truncate text-center font-sans text-xs text-neutral-400">
                {driver.shortName}
              </span>

              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/[0.1] bg-[#0A0A0C] px-2.5 py-1 font-sans text-xs shadow-xl group-hover:block">
                <span className="text-neutral-300">{driver.shortName}</span> ·{' '}
                <span className="text-amber-400">{driver.wins}W</span> ·{' '}
                <span className="text-cyan-300">{driver.podiums}P</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* Points by race (stacked bars)                                       */
/* ------------------------------------------------------------------ */

interface SegmentHover {
  entity: string;
  round: number;
  points: number;
  x: number;
  y: number;
}

export function StandingsPointsByRace({
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
  const [hover, setHover] = useState<SegmentHover | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shown = useMemo(() => dataset.drivers.slice(0, topN), [dataset.drivers, topN]);
  const maxTotal = Math.max(1, ...shown.map((driver) => driver.points));

  function handleSegmentMove(
    event: React.MouseEvent<HTMLDivElement>,
    entity: EvolutionDriver,
    round: number
  ) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({
      entity: entity.shortName,
      round,
      points: dataset.perRound[entity.id]?.[round] ?? 0,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  return (
    <ChartShell
      title={`${label} Points by Race`}
      description="Round-by-round points contribution"
      className={className}
      badge={
        <span className="font-sans text-xs text-neutral-400">
          Top {Math.min(shown.length, topN)} · colour = round
        </span>
      }
    >
      {shown.length === 0 ? (
        <EmptyChart />
      ) : (
        <div ref={containerRef} className="relative space-y-2 font-sans">
          {shown.map((entity) => {
            const total = Math.max(1, entity.points);
            const perRound = dataset.perRound[entity.id] ?? [];
            return (
              <div key={entity.id} className="flex items-center gap-3">
                <span className="w-20 shrink-0 truncate font-sans text-xs text-neutral-300 font-medium">
                  {entity.shortName}
                </span>
                <div className="flex h-6 flex-1 items-stretch">
                  <div
                    className="flex h-full overflow-hidden rounded-[2px]"
                    style={{ width: `${(total / maxTotal) * 100}%` }}
                  >
                    {perRound.map((points, round) => {
                      if (points <= 0) return null;
                      return (
                        <div
                          key={round}
                          className="h-full transition-opacity hover:opacity-80"
                          style={{
                            width: `${(points / total) * 100}%`,
                            backgroundColor: RACE_PALETTE[round % RACE_PALETTE.length],
                          }}
                          onMouseMove={(event) => handleSegmentMove(event, entity, round)}
                          onMouseLeave={() => setHover(null)}
                          title={`${roundLabel(round)} · ${points} pts`}
                        />
                      );
                    })}
                  </div>
                </div>
                <span className="w-12 shrink-0 text-right font-sans text-xs tabular-nums text-white font-bold">
                  {entity.points}
                </span>
              </div>
            );
          })}

          {hover && (
            <div
              className="pointer-events-none absolute z-20 -translate-y-full rounded-lg border border-white/[0.1] bg-[#0A0A0C] px-2.5 py-1 font-sans text-xs text-white shadow-xl"
              style={{
                left: `clamp(48px, ${hover.x}px, calc(100% - 48px))`,
                top: hover.y,
              }}
            >
              <span className="text-neutral-400">{hover.entity}</span> ·{' '}
              <span className="text-neutral-400">{roundLabel(hover.round)}</span> ·{' '}
              <span className="font-bold">{hover.points} pts</span>
            </div>
          )}
        </div>
      )}
    </ChartShell>
  );
}
