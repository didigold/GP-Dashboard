'use client';

import React, { useMemo, useState } from 'react';
import { useStandings } from '@/lib/hooks/useStandings';
import {
  Season,
  STANDINGS_ROUNDS,
  STANDINGS_SEASONS,
  aggregateTeams,
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
  TeammateHeadToHeadChart,
  FactoryVsIndependentComparison,
} from '@/components/charts/ConstructorTeamInsights';

export default function TeamStandingsPage() {
  const [season, setSeason] = useState<Season>(STANDINGS_SEASONS[0]);
  const { standings, isLoading, lastUpdated, refresh } = useStandings(season);

  const entities = useMemo(() => aggregateTeams(standings), [standings]);

  const driverEvolution = useMemo(
    () => buildStandingsEvolution(buildDriverEvolutionDrivers(standings), STANDINGS_ROUNDS),
    [standings]
  );

  const evolution = useMemo(
    () => buildEntityEvolution(driverEvolution, entities, 'team'),
    [driverEvolution, entities]
  );

  return (
    <div className="mx-auto w-full min-h-screen max-w-[1560px] space-y-5 bg-[#07080B] p-4 text-white lg:p-6 select-none font-sans">
      <StandingsHeader
        title="Team Standings"
        description="Points per 2-rider team entry, teammate intra-squad rivalry, and Factory vs Satellite battles."
        selectedSeason={season}
        onSeasonChange={setSeason}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      >
        <StandingsNav />
      </StandingsHeader>

      <StandingsKpis dataset={evolution} label="Team" />

      {/* Row 1: Team Table & Championship Curve */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="grid content-start gap-4 xl:col-span-6">
          <EntityStandingsTable entities={entities} evolution={evolution} kind="team" />
        </div>
        <div className="grid content-start gap-4 xl:col-span-6">
          <StandingsPointsEvolution dataset={evolution} label="Team" />
          <StandingsRankingEvolution dataset={evolution} label="Team" />
        </div>
      </div>

      {/* Row 2: Intra-Team Teammate Head-to-Head Split */}
      <TeammateHeadToHeadChart />

      {/* Row 3: Factory Works vs Independent Teams Battle */}
      <FactoryVsIndependentComparison />
    </div>
  );
}
