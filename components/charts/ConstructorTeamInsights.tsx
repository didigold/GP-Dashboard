'use client';

import React from 'react';
import { ChartShell } from './StandingsCharts';
import { MOTOGP_TEAMS } from '@/lib/data/motogp-grid';
import { DRIVER_SEASON_STATS } from '@/lib/data/driver-stats-data';
import { cn } from '@/lib/utils';
import { Gauge, ShieldCheck, Users } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* 1. CONSTRUCTOR RIDER CONTRIBUTION CHART                            */
/* ------------------------------------------------------------------ */

interface ConstructorBreakdown {
  name: string;
  color: string;
  totalPoints: number;
  riders: {
    name: string;
    number: number;
    points: number;
    pct: number;
  }[];
}

export function ConstructorRiderContributionChart() {
  const constructors: Record<string, { color: string; riders: { name: string; number: number; points: number }[] }> = {
    Ducati: {
      color: '#CC0000',
      riders: [],
    },
    Aprilia: {
      color: '#800020',
      riders: [],
    },
    KTM: {
      color: '#FF6600',
      riders: [],
    },
    Yamaha: {
      color: '#001968',
      riders: [],
    },
    Honda: {
      color: '#E10600',
      riders: [],
    },
  };

  DRIVER_SEASON_STATS.forEach((rider) => {
    const cName = rider.constructorName;
    if (constructors[cName]) {
      constructors[cName].riders.push({
        name: rider.shortName,
        number: rider.number,
        points: rider.totalPoints,
      });
    }
  });

  const breakdowns: ConstructorBreakdown[] = Object.entries(constructors).map(([name, data]) => {
    const totalPoints = data.riders.reduce((sum, r) => sum + r.points, 0);
    const sortedRiders = [...data.riders]
      .sort((a, b) => b.points - a.points)
      .map((r) => ({
        ...r,
        pct: totalPoints > 0 ? (r.points / totalPoints) * 100 : 0,
      }));

    return {
      name,
      color: data.color,
      totalPoints,
      riders: sortedRiders,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  const maxTotal = breakdowns[0]?.totalPoints || 1;
  const RIDER_PALETTE = ['#22D3EE', '#F59E0B', '#10B981', '#EC4899', '#A855F7', '#3B82F6'];

  return (
    <ChartShell
      title="Rider Contribution to Manufacturer Points"
      description="Breakdown of championship points scored by each rider for their factory"
      badge={
        <span className="font-sans text-xs text-neutral-400">
          5 Official Manufacturers
        </span>
      }
    >
      <div className="space-y-4 pt-1 font-sans">
        <p className="text-xs text-neutral-400 leading-relaxed">
          Shows whether a factory relies predominantly on a single superstar rider or
          benefits from distributed scoring across multiple riders and satellite machines.
        </p>

        <div className="space-y-3 pt-2">
          {breakdowns.map((item) => {
            const widthPct = (item.totalPoints / maxTotal) * 100;

            return (
              <div key={item.name} className="space-y-1.5 p-2.5 rounded-xl bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-white text-sm">{item.name}</span>
                    <span className="text-xs text-neutral-400">
                      ({item.riders.length} bikes)
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white">
                    {item.totalPoints} Pts
                  </div>
                </div>

                {/* Stacked Rider Bar */}
                <div className="h-4 w-full bg-white/[0.04] rounded-md overflow-hidden flex">
                  <div
                    className="h-full flex overflow-hidden rounded-md transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  >
                    {item.riders.map((r, i) => (
                      <div
                        key={r.number}
                        className="h-full transition-all hover:brightness-125"
                        style={{
                          width: `${r.pct}%`,
                          backgroundColor: RIDER_PALETTE[i % RIDER_PALETTE.length],
                        }}
                        title={`${r.name}: ${r.points} pts (${r.pct.toFixed(0)}%)`}
                      />
                    ))}
                  </div>
                </div>

                {/* Legend Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  {item.riders.map((r, i) => (
                    <span
                      key={r.number}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-0.5 text-neutral-300"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: RIDER_PALETTE[i % RIDER_PALETTE.length] }}
                      />
                      <span>{r.name}</span>
                      <strong className="text-white">{r.points}</strong>
                      <span className="text-neutral-400">({r.pct.toFixed(0)}%)</span>
                    </span>
                  ))}
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
/* 2. CONSTRUCTOR TECHNICAL SPECS & TOP SPEED COMPARISON             */
/* ------------------------------------------------------------------ */

export function ConstructorSpecsComparison() {
  const specs = [
    {
      constructor: 'Ducati',
      model: 'Desmosedici GP25',
      engine: '1000cc 90° V4 Desmodromic DOHC',
      power: '> 300 hp @ 18,500 rpm',
      topSpeed: '366.1 km/h',
      brakes: 'Brembo 355mm Carbon',
      color: '#CC0000',
    },
    {
      constructor: 'KTM',
      model: 'RC16',
      engine: '1000cc 90° V4 Pneumatic Valves',
      power: '> 300 hp @ 18,500 rpm',
      topSpeed: '366.1 km/h',
      brakes: 'Brembo 355mm Carbon',
      color: '#FF6600',
    },
    {
      constructor: 'Aprilia',
      model: 'RS-GP25',
      engine: '1000cc 90° V4 Aero ground-effect',
      power: '> 295 hp @ 18,300 rpm',
      topSpeed: '361.2 km/h',
      brakes: 'Brembo 355mm Carbon',
      color: '#800020',
    },
    {
      constructor: 'Yamaha',
      model: 'YZR-M1',
      engine: '1000cc Crossplane Inline-4',
      power: '> 285 hp @ 18,000 rpm',
      topSpeed: '354.5 km/h',
      brakes: 'Brembo 340mm/355mm Carbon',
      color: '#001968',
    },
    {
      constructor: 'Honda',
      model: 'RC213V',
      engine: '1000cc 90° V4 Revised Firing Order',
      power: '> 290 hp @ 18,200 rpm',
      topSpeed: '358.0 km/h',
      brakes: 'Brembo 355mm Carbon',
      color: '#E10600',
    },
  ];

  return (
    <ChartShell
      title="Manufacturer Technical Benchmark"
      description="Engine architecture, horsepower output, and official speed trap records"
      badge={
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>FIM 157 kg dry limit</span>
        </div>
      }
    >
      <div className="overflow-x-auto pb-1 pt-1 font-sans">
        <table className="w-full min-w-[620px] text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] text-xs font-semibold text-neutral-400 text-left">
              <th className="py-2.5 px-3">Manufacturer</th>
              <th className="py-2.5 px-3">Engine Config</th>
              <th className="py-2.5 px-3">Power</th>
              <th className="py-2.5 px-3">Top Speed Record</th>
              <th className="py-2.5 px-3">Braking Discs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {specs.map((s) => (
              <tr key={s.constructor} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{s.constructor}</div>
                      <div className="text-xs text-neutral-400">{s.model}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-neutral-300 text-xs">
                  {s.engine}
                </td>
                <td className="py-3 px-3 text-neutral-300 text-xs">
                  {s.power}
                </td>
                <td className="py-3 px-3">
                  <span className="font-bold text-white px-2.5 py-1 rounded-full bg-white/[0.06] text-xs">
                    {s.topSpeed}
                  </span>
                </td>
                <td className="py-3 px-3 text-neutral-400 text-xs">
                  {s.brakes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 3. TEAMMATE HEAD-TO-HEAD POINTS SPLIT (11 TEAMS)                   */
/* ------------------------------------------------------------------ */

export function TeammateHeadToHeadChart() {
  const teamSplits = MOTOGP_TEAMS.map((team) => {
    const riders = team.rider_ids
      .map((id) => DRIVER_SEASON_STATS.find((r) => r.id === id))
      .filter(Boolean) as typeof DRIVER_SEASON_STATS;

    const rider1 = riders[0] || {
      fullName: 'Rider 1',
      shortName: 'R1',
      number: 0,
      totalPoints: 0,
      color: team.color,
    };
    const rider2 = riders[1] || {
      fullName: 'Rider 2',
      shortName: 'R2',
      number: 0,
      totalPoints: 0,
      color: '#FFFFFF',
    };

    const teamPoints = (rider1.totalPoints || 0) + (rider2.totalPoints || 0);
    const r1Pct = teamPoints > 0 ? (rider1.totalPoints / teamPoints) * 100 : 50;
    const r2Pct = teamPoints > 0 ? (rider2.totalPoints / teamPoints) * 100 : 50;

    return {
      id: team.id,
      name: team.name,
      shortName: team.short_name,
      type: team.type,
      color: team.color,
      teamPoints,
      rider1,
      rider2,
      r1Pct,
      r2Pct,
    };
  }).sort((a, b) => b.teamPoints - a.teamPoints);

  return (
    <ChartShell
      title="Teammate Head-to-Head Points Contribution"
      description="Intra-team rivalry: championship points split between teammates across all 11 squads"
      badge={
        <div className="flex items-center gap-2 font-sans text-xs text-neutral-400">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>11 Official Teams</span>
        </div>
      }
    >
      <div className="space-y-3 pt-1 font-sans">
        <p className="text-xs text-neutral-400 leading-relaxed">
          In the Team Championship, both riders score points towards the team trophy.
          Below is the points distribution between teammate pairs (Rider 1 vs Rider 2).
        </p>

        <div className="space-y-2.5 pt-2">
          {teamSplits.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-bold text-white text-sm">{item.shortName}</span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full border',
                      item.type === 'Factory'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                    )}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="text-xs font-bold text-white">
                  {item.teamPoints} Pts
                </div>
              </div>

              {/* Split Teammate Bar */}
              <div className="h-4 w-full bg-white/[0.04] rounded-md overflow-hidden flex">
                <div
                  className="h-full bg-cyan-400 transition-all hover:brightness-125"
                  style={{ width: `${item.r1Pct}%` }}
                  title={`${item.rider1.fullName}: ${item.rider1.totalPoints} pts (${item.r1Pct.toFixed(0)}%)`}
                />
                <div
                  className="h-full bg-amber-500 transition-all hover:brightness-125"
                  style={{ width: `${item.r2Pct}%` }}
                  title={`${item.rider2.fullName}: ${item.rider2.totalPoints} pts (${item.r2Pct.toFixed(0)}%)`}
                />
              </div>

              {/* Teammates Labels */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <span>#{item.rider1.number} {item.rider1.shortName}</span>
                  <strong className="text-white">{item.rider1.totalPoints} pts</strong>
                  <span className="text-neutral-400">({item.r1Pct.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <span className="text-neutral-400">({item.r2Pct.toFixed(0)}%)</span>
                  <strong className="text-white">{item.rider2.totalPoints} pts</strong>
                  <span>#{item.rider2.number} {item.rider2.shortName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 4. FACTORY VS SATELLITE (INDEPENDENT) TEAMS COMPARISON             */
/* ------------------------------------------------------------------ */

export function FactoryVsIndependentComparison() {
  const factoryTeams = MOTOGP_TEAMS.filter((t) => t.type === 'Factory');
  const satelliteTeams = MOTOGP_TEAMS.filter((t) => t.type === 'Independent');

  const getPointsForTeams = (teams: typeof MOTOGP_TEAMS) => {
    return teams.reduce((acc, t) => {
      const riders = t.rider_ids
        .map((id) => DRIVER_SEASON_STATS.find((r) => r.id === id))
        .filter(Boolean) as typeof DRIVER_SEASON_STATS;
      return acc + riders.reduce((sum, r) => sum + r.totalPoints, 0);
    }, 0);
  };

  const getWinsForTeams = (teams: typeof MOTOGP_TEAMS) => {
    return teams.reduce((acc, t) => {
      const riders = t.rider_ids
        .map((id) => DRIVER_SEASON_STATS.find((r) => r.id === id))
        .filter(Boolean) as typeof DRIVER_SEASON_STATS;
      return acc + riders.reduce((sum, r) => sum + r.sundayWins + r.sprintWins, 0);
    }, 0);
  };

  const factoryPoints = getPointsForTeams(factoryTeams);
  const satellitePoints = getPointsForTeams(satelliteTeams);
  const total = factoryPoints + satellitePoints;
  const factoryPct = total > 0 ? (factoryPoints / total) * 100 : 50;
  const satellitePct = total > 0 ? (satellitePoints / total) * 100 : 50;

  const factoryWins = getWinsForTeams(factoryTeams);
  const satelliteWins = getWinsForTeams(satelliteTeams);

  return (
    <ChartShell
      title="Factory vs Independent (Satellite) Teams Battle"
      description="Official Manufacturer Works teams vs Customer / Satellite teams"
      badge={
        <span className="font-sans text-xs text-neutral-400">
          5 Factory · 6 Satellite
        </span>
      }
    >
      <div className="space-y-4 pt-1 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Factory Works Card */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                Factory Works Teams
              </span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {factoryPoints} <span className="text-xs font-normal text-neutral-400">pts ({factoryPct.toFixed(0)}%)</span>
            </div>
            <p className="text-xs text-neutral-400">
              Ducati Lenovo, Aprilia Racing, Red Bull KTM, Monster Yamaha, Repsol Honda.
            </p>
            <div className="pt-1 text-xs text-amber-300">
              {factoryWins} combined victories
            </div>
          </div>

          {/* Satellite Teams Card */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">
                Independent Teams
              </span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {satellitePoints} <span className="text-xs font-normal text-neutral-400">pts ({satellitePct.toFixed(0)}%)</span>
            </div>
            <p className="text-xs text-neutral-400">
              Trackhouse, VR46, Tech3, Gresini, Pramac, LCR.
            </p>
            <div className="pt-1 text-xs text-cyan-300">
              {satelliteWins} combined victories
            </div>
          </div>
        </div>

        {/* Aggregate Ratio Bar */}
        <div className="space-y-1">
          <div className="h-4 w-full bg-white/[0.04] rounded-md overflow-hidden flex">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${factoryPct}%` }}
              title={`Factory Teams: ${factoryPoints} pts`}
            />
            <div
              className="h-full bg-cyan-400"
              style={{ width: `${satellitePct}%` }}
              title={`Independent Teams: ${satellitePoints} pts`}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="text-amber-400">Factory: {factoryPct.toFixed(1)}%</span>
            <span className="text-cyan-300">Independent: {satellitePct.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </ChartShell>
  );
}
