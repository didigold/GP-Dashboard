'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { DriverNumber } from '@/components/ui/driver-number';
import { resolveRiderColor, resolveTeamLogo, StandingItem, standingId } from '@/lib/data/standings';
import { EvolutionDataset } from '@/lib/data/standings-evolution';
import { cn } from '@/lib/utils';

interface DriverStandingsTableProps {
  standings: StandingItem[];
  evolution: EvolutionDataset;
  isLoading: boolean;
  className?: string;
}

function positionClass(position: number): string {
  if (position === 1) return 'text-amber-400 font-bold';
  if (position === 2) return 'text-slate-200 font-bold';
  if (position === 3) return 'text-amber-600 font-bold';
  return 'text-neutral-400';
}

export function DriverStandingsTable({
  standings,
  evolution,
  isLoading,
  className,
}: DriverStandingsTableProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return standings;
    return standings.filter((item) => {
      const name = item.rider?.full_name?.toLowerCase() ?? '';
      const team = item.team?.name?.toLowerCase() ?? '';
      const constructor = item.constructor?.name?.toLowerCase() ?? '';
      const number = String(item.rider?.number ?? '');
      return (
        name.includes(q) ||
        team.includes(q) ||
        constructor.includes(q) ||
        number.includes(q)
      );
    });
  }, [standings, query]);

  const leaderPoints = standings[0]?.points ?? 0;
  const lastRound = evolution.roundCount - 1;

  return (
    <section
      id="driver-standings"
      className={cn(
        'w-full flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0C] shadow-2xl relative',
        className
      )}
    >
      {/* Table Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E10600]/10 border border-[#E10600]/20 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-[#E10600]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-sans text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>Driver Classification</span>
              <span className="text-xs font-normal text-neutral-400">
                ({filtered.length} riders)
              </span>
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Official 2026 World Championship standings and position deltas
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <label htmlFor="driver-standings-search" className="sr-only">
            Search riders
          </label>
          <input
            id="driver-standings-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search riders…"
            className="h-9 w-48 sm:w-60 rounded-full border border-white/[0.08] bg-white/[0.04] pl-9 pr-3 text-xs text-white placeholder:text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E10600] font-sans"
          />
        </div>
      </div>

      {/* Full-width Responsive Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left font-sans text-sm">
          <thead className="sticky top-0 z-10 bg-[#0E0E12]/95 backdrop-blur-xl border-b border-white/[0.08]">
            <tr className="text-xs font-semibold text-neutral-400">
              <th scope="col" className="w-16 px-4 py-3 text-center">
                Pos
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Rider
              </th>
              <th scope="col" className="w-28 px-4 py-3 text-center">
                Team
              </th>
              <th scope="col" className="w-20 px-3 py-3 text-center">
                #
              </th>
              <th scope="col" className="w-32 px-5 py-3 text-right">
                Points
              </th>
              <th scope="col" className="w-32 px-5 py-3 text-right">
                Diff
              </th>
              <th scope="col" className="w-28 px-4 py-3 text-center">
                Evo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {isLoading && standings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-400 font-sans">
                  Loading championship standings…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-400 font-sans">
                  No riders match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const key = standingId(item);
                const number = item.rider?.number ?? 0;
                const color = resolveRiderColor(
                  number,
                  item.team?.name,
                  item.constructor?.name
                );
                const teamLogo = resolveTeamLogo(
                  item.team?.name,
                  item.constructor?.name,
                  number
                );
                const series = evolution.rankings[key];
                const currentRank = series?.[lastRound] ?? item.position;
                const priorRank = series?.[Math.max(0, lastRound - 1)] ?? currentRank;
                const evo = priorRank - currentRank;
                const gap = leaderPoints - (item.points ?? 0);

                return (
                  <tr
                    key={key}
                    className="transition-colors hover:bg-white/[0.04] group"
                  >
                    {/* 1. Pos */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={cn('text-sm font-bold', positionClass(item.position))}>
                        {item.position}
                      </span>
                    </td>

                    {/* 2. Rider */}
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/driver-stats`}
                        className="flex items-center gap-2.5 group-hover:text-[#FF2A24] transition-colors"
                      >
                        <span
                          className="w-1.5 h-6 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-white text-sm block truncate group-hover:text-[#FF2A24]">
                            {item.rider?.full_name}
                          </span>
                          {item.rider?.country && (
                            <span className="text-[11px] text-neutral-400 block font-normal">
                              {item.rider.country.name}
                            </span>
                          )}
                        </div>
                      </Link>
                    </td>

                    {/* 3. Team with logo and NO text */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center h-8 w-24 mx-auto">
                        {teamLogo ? (
                          <img
                            src={teamLogo}
                            alt=""
                            className="max-h-7 max-w-[84px] object-contain filter contrast-105 opacity-90 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                          />
                        ) : (
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        )}
                      </div>
                    </td>

                    {/* 4. # (Driver Number) */}
                    <td className="px-3 py-3.5 text-center">
                      <div className="inline-flex justify-center">
                        <DriverNumber
                          number={number || '—'}
                          color={color}
                          size="md"
                          title={item.rider?.full_name}
                        />
                      </div>
                    </td>

                    {/* 5. Points */}
                    <td className="px-5 py-3.5 text-right font-bold text-white text-base">
                      {item.points}
                    </td>

                    {/* 6. Diff */}
                    <td className="px-5 py-3.5 text-right text-xs">
                      {item.position === 1 || gap === 0 ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          Leader
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-medium">
                          -{gap}
                        </span>
                      )}
                    </td>

                    {/* 7. Evo */}
                    <td className="px-4 py-3.5 text-center">
                      {evo === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                          <Minus className="w-3.5 h-3.5" /> 0
                        </span>
                      ) : evo > 0 ? (
                        <span
                          className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                          title={`+${evo} place${evo === 1 ? '' : 's'} gained`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" /> +{evo}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-400 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20"
                          title={`${evo} place${evo === -1 ? '' : 's'} lost`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" /> {evo}
                        </span>
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
