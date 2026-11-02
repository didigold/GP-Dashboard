'use client';

import { useMemo, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import {
  EntityKind,
  EntityStanding,
  constructorColorByName,
  teamColorByName,
} from '@/lib/data/standings';
import { EvolutionDataset } from '@/lib/data/standings-evolution';
import { cn } from '@/lib/utils';

interface EntityStandingsTableProps {
  entities: EntityStanding[];
  evolution: EvolutionDataset;
  kind: EntityKind;
  className?: string;
}

function positionClass(position: number): string {
  if (position === 1) return 'text-amber-300';
  if (position === 2) return 'text-neutral-200';
  if (position === 3) return 'text-amber-600';
  return 'text-neutral-500';
}

function formChipClass(rank: number): string {
  if (rank === 1) return 'bg-amber-400/15 text-amber-300 border-amber-400/30';
  if (rank === 2) return 'bg-slate-300/10 text-slate-200 border-slate-300/25';
  if (rank === 3) return 'bg-orange-500/10 text-orange-400 border-orange-500/25';
  return 'bg-white/[0.03] text-neutral-400 border-white/[0.06]';
}

export function EntityStandingsTable({
  entities,
  evolution,
  kind,
  className,
}: EntityStandingsTableProps) {
  const [query, setQuery] = useState('');
  const label = kind === 'constructor' ? 'Constructor' : 'Team';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entities;
    return entities.filter(
      (entity) =>
        entity.name.toLowerCase().includes(q) ||
        entity.riderNames.some((rider) => rider.toLowerCase().includes(q))
    );
  }, [entities, query]);

  const leaderPoints = entities[0]?.points ?? 0;
  const lastRound = evolution.roundCount - 1;

  return (
    <section
      id={kind === 'constructor' ? 'constructors' : 'teams'}
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0C] shadow-2xl font-sans',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-neutral-300" aria-hidden="true" />
          <h2 className="font-sans text-sm font-bold tracking-tight text-white">
            {label} Classification
          </h2>
          <span className="font-sans text-xs text-neutral-400">({filtered.length})</span>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <label htmlFor={`${kind}-standings-search`} className="sr-only">
            Search {label.toLowerCase()} standings
          </label>
          <input
            id={`${kind}-standings-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search…"
            className="h-8 w-40 rounded-full border border-white/[0.08] bg-white/[0.04] pl-8 pr-3 text-xs text-white placeholder:text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E10600] font-sans"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm font-sans">
          <caption className="sr-only">
            MotoGP {label.toLowerCase()} championship standings: position, {label.toLowerCase()},
            wins, recent form, position movement, points, and gap to the leader.
          </caption>
          <thead className="sticky top-0 z-10 bg-[#0E0E12]/95 backdrop-blur-xl">
            <tr className="border-b border-white/[0.08] text-xs font-semibold text-neutral-400">
              <th scope="col" className="w-10 px-3 py-2.5 text-center">
                Pos
              </th>
              <th scope="col" className="px-3 py-2.5 text-left">
                {label}
              </th>
              <th scope="col" className="w-12 px-2 py-2.5 text-center">
                Wins
              </th>
              <th scope="col" className="px-3 py-2.5 text-center">
                Form
              </th>
              <th scope="col" className="w-12 px-2 py-2.5 text-center">
                Evo
              </th>
              <th scope="col" className="w-16 px-3 py-2.5 text-right">
                Pts
              </th>
              <th scope="col" className="w-16 px-3 py-2.5 text-right">
                Gap
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-neutral-500">
                  No {label.toLowerCase()} entries match “{query}”.
                </td>
              </tr>
            ) : (
              filtered.map((entity, index) => {
                const color =
                  kind === 'constructor'
                    ? constructorColorByName(entity.name)
                    : teamColorByName(entity.name);
                const series = evolution.rankings[entity.name];
                const currentRank = series?.[lastRound] ?? index + 1;
                const priorRank = series?.[Math.max(0, lastRound - 5)] ?? currentRank;
                const evo = priorRank - currentRank;
                const formRounds = series
                  ? Array.from({ length: Math.min(5, evolution.roundCount) }, (_, formIndex) =>
                      evolution.roundCount - Math.min(5, evolution.roundCount) + formIndex
                    )
                  : [];
                const gap = leaderPoints - entity.points;

                return (
                  <tr key={entity.name} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={cn(
                          'font-sans text-sm font-bold tabular-nums',
                          positionClass(index + 1)
                        )}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 max-w-[260px]">
                          <div className="truncate text-xs font-semibold text-white">
                            {entity.name}
                          </div>
                          <div className="truncate text-[10px] font-light text-neutral-400">
                            {entity.riderNames.join(' · ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center font-sans text-xs font-semibold tabular-nums text-white">
                      {entity.wins}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-0.5">
                        {formRounds.map((round) => {
                          const rank = series?.[round] ?? currentRank;
                          const points = evolution.perRound[entity.name]?.[round] ?? 0;
                          return (
                            <span
                              key={round}
                              title={`R${round + 1}: P${rank} · ${points} pts`}
                              className={cn(
                                'inline-flex h-5 w-5 items-center justify-center rounded-md border text-[10px] font-bold tabular-nums',
                                formChipClass(rank)
                              )}
                            >
                              {rank}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      {evo === 0 ? (
                        <span className="text-[11px] text-neutral-500">—</span>
                      ) : (
                        <span
                          className={cn(
                            'inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums',
                            evo > 0 ? 'text-emerald-400' : 'text-red-400'
                          )}
                          title={`${Math.abs(evo)} place${Math.abs(evo) === 1 ? '' : 's'} ${
                            evo > 0 ? 'gained' : 'lost'
                          } over the last 5 rounds`}
                        >
                          {evo > 0 ? '▲' : '▼'}
                          {Math.abs(evo)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-sans text-sm font-bold tabular-nums text-white">
                      {entity.points}
                    </td>
                    <td className="px-3 py-2.5 text-right font-sans text-xs tabular-nums text-neutral-400">
                      {index === 0 || gap === 0 ? (
                        <span className="font-semibold text-emerald-400">Leader</span>
                      ) : (
                        `-${gap}`
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
