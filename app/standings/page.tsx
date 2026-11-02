'use client';

import React, { useMemo, useState } from 'react';
import { useStandings } from '@/lib/hooks/useStandings';
import {
  Season,
  STANDINGS_ROUNDS,
  STANDINGS_SEASONS,
  buildDriverEvolutionDrivers,
} from '@/lib/data/standings';
import { buildStandingsEvolution } from '@/lib/data/standings-evolution';
import { StandingsHeader } from '@/components/standings/StandingsHeader';
import { StandingsNav } from '@/components/standings/StandingsNav';
import { StandingsKpis } from '@/components/standings/StandingsKpis';
import { DriverStandingsTable } from '@/components/standings/DriverStandingsTable';
import {
  StandingsPointsEvolution,
  StandingsRankingEvolution,
  StandingsPointsByRace,
} from '@/components/charts/StandingsCharts';
import {
  StandingsPointsHeatmap,
} from '@/components/charts/StandingsInsights';

export default function DriverStandingsPage() {
  const [season, setSeason] = useState<Season>(STANDINGS_SEASONS[0]);
  const { standings, isLoading, lastUpdated, refresh } = useStandings(season);

  const evolutionDrivers = useMemo(
    () => buildDriverEvolutionDrivers(standings),
    [standings]
  );
  const evolution = useMemo(
    () => buildStandingsEvolution(evolutionDrivers, STANDINGS_ROUNDS),
    [evolutionDrivers]
  );

  return (
    <div className="mx-auto w-full min-h-screen max-w-[1560px] space-y-5 bg-[#07080B] p-4 text-white lg:p-6 select-none font-sans">
      {/* Header & Navigation */}
      <StandingsHeader
        title="Driver Standings"
        description="Official MotoGP™ World Championship classification, points gaps, ranking evolution, and round-by-round points matrix."
        selectedSeason={season}
        onSeasonChange={setSeason}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      >
        <StandingsNav />
      </StandingsHeader>

      {/* Bento Top KPI Strip */}
      <StandingsKpis dataset={evolution} label="Driver" />

      {/* FULL-WIDTH BENTO: Official Driver Classification Table */}
      <div className="w-full">
        <DriverStandingsTable
          standings={standings}
          evolution={evolution}
          isLoading={isLoading}
          className="w-full"
        />
      </div>

      {/* Bento Row 1: Title Fight Curves (Points Evolution & Ranking Evolution) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <StandingsPointsEvolution dataset={evolution} label="Driver" />
        </div>
        <div className="xl:col-span-6">
          <StandingsRankingEvolution dataset={evolution} label="Driver" />
        </div>
      </div>

      {/* Bento Row 2: Matrix & Race Contribution */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <StandingsPointsHeatmap
            dataset={evolution}
            label="Driver"
            className="w-full"
          />
        </div>
        <div className="xl:col-span-5">
          <StandingsPointsByRace
            dataset={evolution}
            label="Driver"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
