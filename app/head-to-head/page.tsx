'use client';

import React from 'react';
import { SectorDeltaBar } from '../../components/charts/SectorDeltaBar';
import { Badge } from '@/components/ui/badge';

export default function HeadToHeadPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">Sector Comparison</Badge>
            <Badge variant="outline">Telemetry Deltas</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            Head-to-Head Sector Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Compare mini-sector splits (T1 to T4), speed trap maximums, and corner apex speeds between any two premier class riders.
          </p>
        </div>
      </div>

      <SectorDeltaBar />
    </div>
  );
}
