'use client';

import React, { useState, useMemo } from 'react';
import {
  RiderSeasonStats,
  DRIVER_SEASON_STATS,
  getGridAverageRadar,
} from '@/lib/data/driver-stats-data';
import { ChartShell } from './StandingsCharts';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  Zap,
  Gauge,
  Trophy,
  Flag,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* 1. HORIZONTAL RIDER SELECTOR BAR                                   */
/* ------------------------------------------------------------------ */

interface RiderSelectorBarProps {
  selectedRiderId: string;
  onSelectRider: (riderId: string) => void;
}

export function RiderSelectorBar({
  selectedRiderId,
  onSelectRider,
}: RiderSelectorBarProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0C] p-3 sm:p-4 shadow-xl backdrop-blur-xl font-sans">
      <div className="flex items-center justify-between px-2 pb-2.5 border-b border-white/[0.06] mb-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E10600] animate-pulse" />
          <span className="text-xs font-bold text-white">
            Select Rider Profile
          </span>
          <span className="text-xs text-neutral-400 font-normal">
            (22 Official MotoGP™ Competitors)
          </span>
        </div>
        <span className="hidden sm:inline-block text-xs text-neutral-400">
          Click any rider to load telemetry &amp; race stats
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {DRIVER_SEASON_STATS.map((rider) => {
          const isSelected = rider.id === selectedRiderId;
          return (
            <button
              key={rider.id}
              onClick={() => onSelectRider(rider.id)}
              className={cn(
                'group flex shrink-0 items-center gap-2.5 rounded-full px-3.5 py-1.5 transition-all text-left border font-sans',
                isSelected
                  ? 'bg-white text-black font-semibold shadow-lg scale-100 border-white'
                  : 'bg-white/[0.03] text-neutral-300 hover:bg-white/[0.08] hover:text-white border-white/[0.06]'
              )}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: rider.color }}
              />
              <span
                className={cn(
                  'text-xs font-bold',
                  isSelected ? 'text-black' : 'text-neutral-400 group-hover:text-white'
                )}
              >
                #{rider.number}
              </span>
              <span className="text-xs font-medium whitespace-nowrap">
                {rider.fullName}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px]',
                  isSelected
                    ? 'bg-black/10 text-neutral-800 font-semibold'
                    : 'bg-white/[0.06] text-neutral-400'
                )}
              >
                P{rider.rank}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. RIDER HERO SPOTLIGHT CARD                                       */
/* ------------------------------------------------------------------ */

interface RiderSpotlightHeroProps {
  rider: RiderSeasonStats;
}

export function RiderSpotlightHero({ rider }: RiderSpotlightHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0C] p-5 lg:p-7 shadow-2xl font-sans">
      {/* Background Glow matching team color */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-[110px] opacity-25"
        style={{ backgroundColor: rider.color }}
      />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-[120px] opacity-15 bg-[#E10600]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Rider Cutout, Number, Team & Machine Identity */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            {/* Ambient Aura Frame */}
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-0.5 shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${rider.color}, rgba(255,255,255,0.1))`,
              }}
            >
              <div className="w-full h-full bg-[#111215] rounded-[14px] overflow-hidden flex items-center justify-center">
                <img
                  src={rider.photoUrl}
                  alt={rider.fullName}
                  className="w-full h-full object-cover object-top filter contrast-105"
                />
              </div>
            </div>
            {/* Number Pill Overlay */}
            <div
              className="absolute -bottom-2 -right-2 rounded-lg px-2.5 py-0.5 text-xs font-bold text-white shadow-md border border-white/20 font-sans"
              style={{ backgroundColor: rider.color }}
            >
              #{rider.number}
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.08] text-white border border-white/10">
                {rider.country.name} ({rider.country.iso})
              </span>
              <Badge variant="motogp">2026 Season</Badge>
              <span className="text-xs text-neutral-400">
                Rank #{rider.rank}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {rider.fullName}
            </h2>

            <div className="space-y-0.5 text-xs text-neutral-400">
              <p className="text-neutral-200 font-semibold">{rider.teamName}</p>
              <p className="text-neutral-400 text-xs">{rider.bikeName}</p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-white">
                <strong className="text-white font-bold">{rider.totalPoints}</strong> Pts
              </span>
              <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-neutral-400">
                {rider.pointsPerWeekend} pts / GP
              </span>
              {rider.gapToLeader > 0 ? (
                <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-red-400">
                  -{rider.gapToLeader} to leader
                </span>
              ) : (
                <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1 text-amber-300 font-bold">
                  Championship Leader
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 6 Tactical Metric Bento Tiles */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Tile 1: Wins & Podiums */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E0E12] p-3 shadow-md space-y-1 hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
              <span>Victories &amp; Podiums</span>
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {rider.sundayWins + rider.sprintWins}{' '}
              <span className="text-xs font-normal text-neutral-400">wins</span>
            </div>
            <div className="text-xs text-neutral-400 flex items-center gap-1.5">
              <span className="text-amber-400">{rider.sundayWins} GP</span> ·{' '}
              <span className="text-orange-400">{rider.sprintWins} Sprint</span> ·{' '}
              <span className="text-cyan-300">{rider.distribution.podiums} Pod</span>
            </div>
          </div>

          {/* Tile 2: Sprint vs Sunday Split */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E0E12] p-3 shadow-md space-y-1 hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
              <span>Sprint Dynamic</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {rider.sprintReliancePct}%
            </div>
            <div className="text-xs text-neutral-400">
              {rider.sprintPoints} Sprint / {rider.sundayPoints} GP pts
            </div>
          </div>

          {/* Tile 3: Qualifying & Poles */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E0E12] p-3 shadow-md space-y-1 hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
              <span>Qualifying Pace</span>
              <Flag className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {rider.poles}{' '}
              <span className="text-xs font-normal text-neutral-400">poles</span>
            </div>
            <div className="text-xs text-neutral-400">
              {rider.avgGridPosition} avg grid · {rider.frontRowStarts} front row
            </div>
          </div>

          {/* Tile 4: Laps Led */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E0E12] p-3 shadow-md space-y-1 hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
              <span>Front-Running</span>
              <Flame className="w-3.5 h-3.5 text-[#E10600]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {rider.totalLapsLed}{' '}
              <span className="text-xs font-normal text-neutral-400">laps led</span>
            </div>
            <div className="text-xs text-neutral-400">
              {rider.lapsLedSunday} Sunday / {rider.lapsLedSprint} Sprint
            </div>
          </div>

          {/* Tile 5: Telemetry Limits */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E0E12] p-3 shadow-md space-y-1 hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
              <span>Peak Gyro Lean</span>
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {rider.peakLeanAngle}°
            </div>
            <div className="text-xs text-neutral-400">
              {rider.maxBrakingG}G brake · {rider.topSpeedKmh} km/h
            </div>
          </div>

          {/* Tile 6: Sunday Net Gain & Reliability */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E0E12] p-3 shadow-md space-y-1 hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
              <span>Race Reliability</span>
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {rider.distribution.dnf}{' '}
              <span className="text-xs font-normal text-neutral-400">DNFs</span>
            </div>
            <div className="text-xs text-neutral-400">
              {rider.positionsGainedNet >= 0
                ? `+${rider.positionsGainedNet} places gained on Sunday`
                : `${rider.positionsGainedNet} grid delta`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. SPRINT VS SUNDAY GRAND PRIX BREAKDOWN                           */
/* ------------------------------------------------------------------ */

interface SprintVsSundayChartProps {
  selectedRider: RiderSeasonStats;
}

export function SprintVsSundayChart({ selectedRider }: SprintVsSundayChartProps) {
  const [viewMode, setViewMode] = useState<'selected' | 'grid'>('grid');

  const top10 = useMemo(() => DRIVER_SEASON_STATS.slice(0, 10), []);
  const maxPoints = Math.max(...top10.map((r) => r.totalPoints));

  return (
    <ChartShell
      title="Sprint vs Sunday Grand Prix Split"
      description="Modern MotoGP dual-race dynamic: Saturday Sprint points vs Sunday GP points"
      actions={
        <div className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-sans transition-all',
              viewMode === 'grid'
                ? 'bg-white font-semibold text-black shadow'
                : 'text-neutral-400 hover:text-white'
            )}
          >
            Top 10 Grid
          </button>
          <button
            onClick={() => setViewMode('selected')}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-sans transition-all',
              viewMode === 'selected'
                ? 'bg-white font-semibold text-black shadow'
                : 'text-neutral-400 hover:text-white'
            )}
          >
            #{selectedRider.number} Season Rounds
          </button>
        </div>
      }
      badge={
        <div className="hidden sm:flex items-center gap-3 font-sans text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#F59E0B]" />
            Sprint (12 pts max)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#22D3EE]" />
            Sunday GP (25 pts max)
          </span>
        </div>
      }
    >
      {viewMode === 'grid' ? (
        <div className="space-y-3 pt-2 font-sans">
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Comparison of total championship points derived from Saturday Sprints vs
            Sunday Feature Races. Demonstrates whether a rider relies heavily on
            Sprint aggression or long-distance Sunday endurance.
          </p>

          <div className="space-y-2.5 pt-2">
            {top10.map((rider) => {
              const sprintPct = (rider.sprintPoints / rider.totalPoints) * 100;
              const sundayPct = (rider.sundayPoints / rider.totalPoints) * 100;
              const widthPct = (rider.totalPoints / maxPoints) * 100;
              const isSelected = rider.id === selectedRider.id;

              return (
                <div
                  key={rider.id}
                  className={cn(
                    'p-2.5 rounded-xl transition-all',
                    isSelected
                      ? 'bg-white/[0.07] border border-white/20 shadow-md'
                      : 'hover:bg-white/[0.02]'
                  )}
                >
                  <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: rider.color }}
                      />
                      <span className="font-bold text-white">
                        #{rider.number}
                      </span>
                      <span className="font-semibold text-neutral-200">
                        {rider.fullName}
                      </span>
                      <span className="text-xs text-neutral-400">
                        ({rider.constructorName})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#F59E0B]">
                        {rider.sprintPoints} Sprint ({sprintPct.toFixed(0)}%)
                      </span>
                      <span className="text-[#22D3EE]">
                        {rider.sundayPoints} GP ({sundayPct.toFixed(0)}%)
                      </span>
                      <span className="font-bold text-white">{rider.totalPoints} pts</span>
                    </div>
                  </div>

                  {/* Dual Split Horizontal Bar */}
                  <div className="h-4 w-full bg-white/[0.04] rounded-md overflow-hidden flex">
                    <div
                      className="h-full flex overflow-hidden rounded-md transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all hover:brightness-125"
                        style={{ width: `${sprintPct}%` }}
                        title={`${rider.fullName}: ${rider.sprintPoints} Sprint pts`}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all hover:brightness-125"
                        style={{ width: `${sundayPct}%` }}
                        title={`${rider.fullName}: ${rider.sundayPoints} Sunday GP pts`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Round by round breakdown for selected rider */
        <div className="space-y-4 pt-2 font-sans">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              20 Rounds Point Distribution for{' '}
              <strong className="text-white font-bold">{selectedRider.fullName}</strong>
            </span>
            <span className="text-neutral-300">
              Sprint: {selectedRider.sprintPoints} pts · GP: {selectedRider.sundayPoints} pts
            </span>
          </div>

          <div className="h-64 w-full relative pt-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 220"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              {[0, 10, 20, 30, 37].map((val) => {
                const y = 200 - (val / 37) * 180;
                return (
                  <g key={val}>
                    <line
                      x1="40"
                      y1={y}
                      x2="780"
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="10"
                      y={y + 4}
                      fill="rgba(255,255,255,0.4)"
                      fontSize="10"
                      fontFamily="sans-serif"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Bars per round */}
              {selectedRider.rounds.map((rnd, i) => {
                const colWidth = 32;
                const x = 50 + i * 36;
                const maxPts = 37;
                const sprintPts = rnd.sprintPos > 0 && rnd.sprintPos <= 9
                  ? [0, 12, 9, 7, 6, 5, 4, 3, 2, 1][rnd.sprintPos]
                  : 0;
                const sundayPts = rnd.sundayPos > 0 && rnd.sundayPos <= 15
                  ? [0, 25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1][rnd.sundayPos]
                  : 0;

                const sprintHeight = (sprintPts / maxPts) * 180;
                const sundayHeight = (sundayPts / maxPts) * 180;

                const ySunday = 200 - sundayHeight;
                const ySprint = ySunday - sprintHeight;

                return (
                  <g key={rnd.round} className="group cursor-pointer">
                    {sundayHeight > 0 && (
                      <rect
                        x={x}
                        y={ySunday}
                        width={colWidth - 4}
                        height={sundayHeight}
                        fill="#22D3EE"
                        rx="2"
                        className="transition-opacity group-hover:opacity-80"
                      />
                    )}
                    {sprintHeight > 0 && (
                      <rect
                        x={x}
                        y={ySprint}
                        width={colWidth - 4}
                        height={sprintHeight}
                        fill="#F59E0B"
                        rx="2"
                        className="transition-opacity group-hover:opacity-80"
                      />
                    )}
                    <text
                      x={x + (colWidth - 4) / 2}
                      y="215"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="9"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      R{rnd.round}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 4. FINISH POSITION DISTRIBUTION                                    */
/* ------------------------------------------------------------------ */

interface FinishDistributionChartProps {
  rider: RiderSeasonStats;
}

export function FinishDistributionChart({ rider }: FinishDistributionChartProps) {
  const dist = rider.distribution;
  const totalRaces = 20;

  const categories = [
    { label: 'Victory (P1)', count: dist.wins, color: '#F59E0B' },
    { label: 'Podium (P2–P3)', count: dist.podiums, color: '#06B6D4' },
    { label: 'Top 5 (P4–P5)', count: dist.top5, color: '#10B981' },
    { label: 'Top 10 (P6–P10)', count: dist.top10, color: '#3B82F6' },
    { label: 'Points (P11–P15)', count: dist.points, color: '#64748B' },
    { label: 'Gravel Trap (DNF)', count: dist.dnf, color: '#E10600' },
  ];

  return (
    <ChartShell
      title="Finish Position Distribution"
      description="Sunday Grand Prix finish classification and podium conversion rate"
      badge={
        <span className="font-sans text-xs text-neutral-400">
          20 Grand Prix Starts
        </span>
      }
    >
      <div className="space-y-4 pt-1 font-sans">
        <div className="h-7 w-full bg-white/[0.04] rounded-xl overflow-hidden flex p-1 gap-1">
          {categories.map((cat) => {
            const pct = (cat.count / totalRaces) * 100;
            if (cat.count === 0) return null;
            return (
              <div
                key={cat.label}
                className="h-full rounded-lg transition-transform hover:scale-105"
                style={{
                  width: `${pct}%`,
                  backgroundColor: cat.color,
                }}
                title={`${cat.label}: ${cat.count} races (${pct.toFixed(0)}%)`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {categories.map((cat) => {
            const pct = ((cat.count / totalRaces) * 100).toFixed(0);
            return (
              <div
                key={cat.label}
                className="rounded-xl border border-white/[0.06] bg-[#0E0E12] p-2.5 text-center space-y-1 hover:border-white/[0.14] transition-all"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-400 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.label}</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {cat.count}
                </div>
                <div className="text-xs text-neutral-400">
                  {pct}% of rounds
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 5. QUALIFYING GRID VS RACE FINISH                                  */
/* ------------------------------------------------------------------ */

interface GridToFinishDeltaChartProps {
  rider: RiderSeasonStats;
}

export function GridToFinishDeltaChart({ rider }: GridToFinishDeltaChartProps) {
  const rounds = rider.rounds;

  return (
    <ChartShell
      title="Qualifying Grid vs Race Finish"
      description="Round-by-round start position vs checkered flag finish (positions gained or lost)"
      badge={
        <div className="flex items-center gap-3 font-sans text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Gained Places
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <ArrowDownRight className="w-3.5 h-3.5" /> Lost Places
          </span>
        </div>
      }
    >
      <div className="space-y-4 pt-1 font-sans">
        <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400">
          <span>
            Evaluating racecraft, launch efficiency, and tyre preservation from start to finish.
          </span>
          <span className="text-white">
            Net Positions Climbed:{' '}
            <strong
              className={
                rider.positionsGainedNet >= 0 ? 'text-emerald-400' : 'text-red-400'
              }
            >
              {rider.positionsGainedNet >= 0
                ? `+${rider.positionsGainedNet}`
                : rider.positionsGainedNet}
            </strong>
          </span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="min-w-[700px] space-y-1.5">
            <div className="grid grid-cols-12 gap-1 text-xs font-semibold text-neutral-400 pb-1.5 border-b border-white/[0.06]">
              <span className="col-span-3">Round &amp; Grand Prix</span>
              <span className="col-span-2 text-center">Grid Position</span>
              <span className="col-span-2 text-center">Sunday Finish</span>
              <span className="col-span-2 text-center">Position Delta</span>
              <span className="col-span-3 text-right">Points Earned</span>
            </div>

            {rounds.slice(0, 10).map((rnd) => {
              const gained = rnd.delta > 0;
              const lost = rnd.delta < 0;
              const isDnf = rnd.status === 'DNF';

              return (
                <div
                  key={rnd.round}
                  className="grid grid-cols-12 gap-1 items-center py-2 px-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-xs font-sans"
                >
                  <div className="col-span-3 flex items-center gap-2 truncate">
                    <span className="font-bold text-neutral-400 text-xs">
                      R{String(rnd.round).padStart(2, '0')}
                    </span>
                    <span className="font-medium text-white truncate">
                      {rnd.circuitName}
                    </span>
                  </div>

                  <div className="col-span-2 text-center font-bold text-neutral-300">
                    P{rnd.gridPos}
                  </div>

                  <div className="col-span-2 text-center">
                    {isDnf ? (
                      <span className="rounded px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-400">
                        DNF / Crash
                      </span>
                    ) : (
                      <span
                        className={cn(
                          'font-bold',
                          rnd.sundayPos === 1
                            ? 'text-amber-400'
                            : rnd.sundayPos <= 3
                            ? 'text-cyan-300'
                            : 'text-white'
                        )}
                      >
                        P{rnd.sundayPos}
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    {isDnf ? (
                      <span className="text-red-400 text-xs">Gravel Trap</span>
                    ) : gained ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +{rnd.delta}
                      </span>
                    ) : lost ? (
                      <span className="inline-flex items-center gap-0.5 text-red-400 font-bold">
                        <ArrowDownRight className="w-3.5 h-3.5" /> {rnd.delta}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-neutral-400">
                        <Minus className="w-3 h-3" /> 0
                      </span>
                    )}
                  </div>

                  <div className="col-span-3 text-right font-bold text-white">
                    {rnd.points} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 6. MOTOGP GYROSCOPIC & STYLE RADAR PROFILE                         */
/* ------------------------------------------------------------------ */

interface RiderRadarProfileChartProps {
  rider: RiderSeasonStats;
}

export function RiderRadarProfileChart({ rider }: RiderRadarProfileChartProps) {
  const avg = getGridAverageRadar();

  const metrics = [
    { key: 'qualifyingPace', label: 'Qualifying Pace', max: 100 },
    { key: 'sprintAggression', label: 'Sprint Aggression', max: 100 },
    { key: 'sundayRacecraft', label: 'Sunday Racecraft', max: 100 },
    { key: 'leanMastery', label: 'Lean Angle (66°)', max: 100 },
    { key: 'brakingForce', label: 'Braking Force (1.65G)', max: 100 },
    { key: 'consistency', label: 'Consistency', max: 100 },
  ];

  const cx = 140;
  const cy = 140;
  const radius = 95;
  const count = metrics.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const riderPoints = metrics
    .map((m, i) => {
      const val = rider.radar[m.key as keyof typeof rider.radar];
      const pt = getCoordinates(i, val);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const avgPoints = metrics
    .map((m, i) => {
      const val = avg[m.key as keyof typeof avg];
      const pt = getCoordinates(i, val);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <ChartShell
      title="MotoGP™ Telemetry Radar Profile"
      description="Gyroscopic lean, braking G-force, one-lap qualifying & racecraft vs 2026 Grid Average"
      badge={
        <div className="flex items-center gap-3 font-sans text-xs">
          <span className="flex items-center gap-1.5 text-white">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: rider.color }}
            />
            {rider.fullName}
          </span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            Grid Average
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 font-sans">
        <div className="md:col-span-7 flex justify-center">
          <div className="relative w-72 h-72">
            <svg className="w-full h-full" viewBox="0 0 280 280">
              {[0.25, 0.5, 0.75, 1.0].map((level) => {
                const pts = metrics
                  .map((_, i) => {
                    const pt = getCoordinates(i, level * 100);
                    return `${pt.x},${pt.y}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={level}
                    points={pts}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {metrics.map((_, i) => {
                const pt = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              <polygon
                points={avgPoints}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              <polygon
                points={riderPoints}
                fill={`${rider.color}35`}
                stroke={rider.color}
                strokeWidth="2.5"
              />

              {metrics.map((m, i) => {
                const val = rider.radar[m.key as keyof typeof rider.radar];
                const pt = getCoordinates(i, val);
                return (
                  <circle
                    key={m.key}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill={rider.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                );
              })}

              {metrics.map((m, i) => {
                const pt = getCoordinates(i, 118);
                return (
                  <text
                    key={m.key}
                    x={pt.x}
                    y={pt.y}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {m.label.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="md:col-span-5 space-y-3 font-sans text-xs">
          {metrics.map((m) => {
            const riderVal = rider.radar[m.key as keyof typeof rider.radar];
            const avgVal = avg[m.key as keyof typeof avg];
            const delta = riderVal - avgVal;

            return (
              <div key={m.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{riderVal}/100</span>
                    <span
                      className={cn(
                        'text-xs',
                        delta >= 0 ? 'text-emerald-400' : 'text-neutral-400'
                      )}
                    >
                      ({delta >= 0 ? `+${delta}` : delta} vs avg)
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${riderVal}%`,
                      backgroundColor: rider.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 7. LAPS LED & FRONT RUNNING DOMINANCE                              */
/* ------------------------------------------------------------------ */

export function LapsLedChart() {
  const topLapsRiders = useMemo(
    () =>
      [...DRIVER_SEASON_STATS]
        .filter((r) => r.totalLapsLed > 0)
        .sort((a, b) => b.totalLapsLed - a.totalLapsLed),
    []
  );

  const maxLaps = topLapsRiders[0]?.totalLapsLed || 1;

  return (
    <ChartShell
      title="Front-Running Dominance · Laps Led"
      description="Total racing laps led across all 2026 Saturday Sprints & Sunday Grands Prix"
      badge={
        <div className="flex items-center gap-3 font-sans text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#E10600]" />
            Sunday GP
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
            Saturday Sprint
          </span>
        </div>
      }
    >
      <div className="space-y-2.5 pt-2 font-sans">
        {topLapsRiders.slice(0, 8).map((rider) => {
          const sundayPct = (rider.lapsLedSunday / rider.totalLapsLed) * 100;
          const sprintPct = (rider.lapsLedSprint / rider.totalLapsLed) * 100;
          const totalWidthPct = (rider.totalLapsLed / maxLaps) * 100;

          return (
            <div key={rider.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: rider.color }}
                  />
                  <span className="font-bold text-white">
                    #{rider.number}
                  </span>
                  <span className="font-semibold text-neutral-200">
                    {rider.fullName}
                  </span>
                  <span className="text-xs text-neutral-400">
                    ({rider.constructorName})
                  </span>
                </div>

                <div className="text-xs font-bold text-white">
                  {rider.totalLapsLed}{' '}
                  <span className="font-normal text-neutral-400">
                    ({rider.lapsLedSunday} GP / {rider.lapsLedSprint} Sprint)
                  </span>
                </div>
              </div>

              <div className="h-3 w-full bg-white/[0.04] rounded-md overflow-hidden flex">
                <div
                  className="h-full flex overflow-hidden rounded-md transition-all duration-500"
                  style={{ width: `${totalWidthPct}%` }}
                >
                  <div
                    className="h-full bg-[#E10600]"
                    style={{ width: `${sundayPct}%` }}
                    title={`${rider.fullName}: ${rider.lapsLedSunday} Sunday laps led`}
                  />
                  <div
                    className="h-full bg-[#F59E0B]"
                    style={{ width: `${sprintPct}%` }}
                    title={`${rider.fullName}: ${rider.lapsLedSprint} Sprint laps led`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ChartShell>
  );
}
