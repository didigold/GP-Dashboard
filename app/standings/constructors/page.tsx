'use client';

import React, { useMemo, useState } from 'react';
import { useStandings } from '@/lib/hooks/useStandings';
import {
  Season,
  STANDINGS_ROUNDS,
  STANDINGS_SEASONS,
  aggregateConstructors,
  buildDriverEvolutionDrivers,
  buildEntityEvolution,
} from '@/lib/data/standings';
import { buildStandingsEvolution } from '@/lib/data/standings-evolution';
import { StandingsHeader } from '@/components/standings/StandingsHeader';
import { StandingsNav } from '@/components/standings/StandingsNav';
import { StandingsKpis } from '@/components/standings/StandingsKpis';
import { EntityStandingsTable } from '@/components/standings/EntityStandingsTable';
import {
  StandingsPointsEvolution,
  StandingsRankingEvolution,
} from '@/components/charts/StandingsCharts';
import {
  StandingsPointsShare,
} from '@/components/charts/StandingsInsights';
import {
  ConstructorRiderContributionChart,
  ConstructorSpecsComparison,
} from '@/components/charts/ConstructorTeamInsights';

export default function ConstructorStandingsPage() {
  const [season, setSeason] = useState<Season>(STANDINGS_SEASONS[0]);
  const { standings, isLoading, lastUpdated, refresh } = useStandings(season);

  const entities = useMemo(() => aggregateConstructors(standings), [standings]);

  const driverEvolution = useMemo(
    () => buildStandingsEvolution(buildDriverEvolutionDrivers(standings), STANDINGS_ROUNDS),
    [standings]
  );

  const evolution = useMemo(
    () => buildEntityEvolution(driverEvolution, entities, 'constructor'),
    [driverEvolution, entities]
  );

  return (
    <div className="mx-auto w-full min-h-screen max-w-[1560px] space-y-5 bg-[#07080B] p-4 text-white lg:p-6 select-none font-sans">
      <StandingsHeader
        title="Constructor Standings"
        description="Official manufacturer title battle, points share, rider contribution, and technical benchmarks."
        selectedSeason={season}
        onSeasonChange={setSeason}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      >
        <StandingsNav />
      </StandingsHeader>

      <StandingsKpis dataset={evolution} label="Constructor" />

      {/* Row 1: Table & Points Share Donut (6 cols) + Championship Evolution (6 cols) */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="grid content-start gap-4 xl:col-span-6">
          <EntityStandingsTable entities={entities} evolution={evolution} kind="constructor" />
          <StandingsPointsShare dataset={evolution} label="Constructor" />
        </div>
        <div className="grid content-start gap-4 xl:col-span-6">
          <StandingsPointsEvolution dataset={evolution} label="Constructor" />
          <StandingsRankingEvolution dataset={evolution} label="Constructor" />
        </div>
      </div>

      {/* Row 2: Rider Contribution per Factory (MotoGP Specific) */}
      <ConstructorRiderContributionChart />

      {/* Row 3: Technical Specs & Speed Trap Benchmark */}
      <ConstructorSpecsComparison />
    </div>
  );
}
