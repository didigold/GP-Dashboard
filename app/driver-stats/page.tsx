'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  DRIVER_SEASON_STATS,
  getRiderStats,
} from '@/lib/data/driver-stats-data';
import { StandingsHeader } from '@/components/standings/StandingsHeader';
import { StandingsNav } from '@/components/standings/StandingsNav';
import {
  RiderSelectorBar,
  RiderSpotlightHero,
  SprintVsSundayChart,
  FinishDistributionChart,
  GridToFinishDeltaChart,
  RiderRadarProfileChart,
  LapsLedChart,
} from '@/components/charts/DriverStatsCharts';
import { Season, STANDINGS_SEASONS } from '@/lib/data/standings';

function DriverStatsContent() {
  const searchParams = useSearchParams();
  const riderParam = searchParams.get('rider');

  const [selectedSeason, setSelectedSeason] = useState<Season>(STANDINGS_SEASONS[0]);
  const [selectedRiderId, setSelectedRiderId] = useState<string>(riderParam || 'marquez-93');

  useEffect(() => {
    if (riderParam) {
      const found = getRiderStats(riderParam);
      if (found) {
        setSelectedRiderId(found.id);
      }
    }
  }, [riderParam]);

  const selectedRider = useMemo(() => {
    return getRiderStats(selectedRiderId) || DRIVER_SEASON_STATS[0];
  }, [selectedRiderId]);

  return (
    <div className="mx-auto w-full min-h-screen max-w-[1560px] space-y-5 bg-[#07080B] p-4 text-white lg:p-6 select-none font-sans">
      {/* Header with Navigation */}
      <StandingsHeader
        title="Driver Performance & Stats"
        description="Comprehensive rider telemetry ratings, Sprint vs Sunday race dynamics, finish distributions, qualifying deltas, and laps led."
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        isLoading={false}
        lastUpdated="Official Telemetry Sync"
        onRefresh={() => {}}
      >
        <StandingsNav />
      </StandingsHeader>

      {/* Horizontal Rider Selector Bar */}
      <RiderSelectorBar
        selectedRiderId={selectedRider.id}
        onSelectRider={setSelectedRiderId}
      />

      {/* Active Rider Spotlight Bento Hero */}
      <RiderSpotlightHero rider={selectedRider} />

      {/* Primary MotoGP Dynamics Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <SprintVsSundayChart selectedRider={selectedRider} />
        </div>
        <div className="xl:col-span-5">
          <FinishDistributionChart rider={selectedRider} />
        </div>
      </div>

      {/* Secondary Telemetry & Racecraft Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <GridToFinishDeltaChart rider={selectedRider} />
        </div>
        <div className="xl:col-span-5">
          <RiderRadarProfileChart rider={selectedRider} />
        </div>
      </div>

      {/* Tertiary: Laps Led & Front-Running Dominance */}
      <LapsLedChart />
    </div>
  );
}

export default function DriverStatsPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#07080B]" />}>
      <DriverStatsContent />
    </Suspense>
  );
}
