'use client';

import { Header } from '../../components/navigation/Header';
import { SectorDeltaBar } from '../../components/charts/SectorDeltaBar';
import { GitCompare, Award, Gauge, Zap } from 'lucide-react';

export default function HeadToHeadPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName="Head-to-Head Rider Sector Telemetry" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-racing-cyan">
            <GitCompare className="w-4 h-4" />
            <span>RIDER COMPARISON TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Head-to-Head Sector Breakdown
          </h1>
          <p className="text-xs text-slate-400">
            Compare mini-sector performance, speed trap maximums, and season qualifying tallies between any two riders.
          </p>
        </div>

        {/* Sector Delta Visualizer Component */}
        <SectorDeltaBar />
      </main>
    </div>
  );
}
