'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AllGridDuels } from '@/components/head-to-head/AllGridDuels';
import { DualDuelComparison } from '@/components/head-to-head/DualDuelComparison';
import { TriDuelComparison } from '@/components/head-to-head/TriDuelComparison';
import { MOTOGP_RIDERS, MOTOGP_TEAMS, getTeamRiders } from '@/lib/data/motogp-grid';
import { ALL_GRID_HEAD_TO_HEAD } from '@/lib/data/head-to-head-data';
import { LayoutGrid, GitCompare, Users, Sparkles } from 'lucide-react';

function HeadToHeadContent() {
  const searchParams = useSearchParams();
  const [activeMode, setActiveMode] = useState<'grid' | 'dual' | 'tri'>('grid');
  const [selectedRiderA, setSelectedRiderA] = useState<string>('marquez-93');
  const [selectedRiderB, setSelectedRiderB] = useState<string>('bagnaia-63');
  const [selectedRiderC, setSelectedRiderC] = useState<string>('martin-89');

  useEffect(() => {
    const rider1Param = searchParams.get('rider1');
    const rider2Param = searchParams.get('rider2');

    if (rider1Param) {
      const r1 = MOTOGP_RIDERS.find(
        (r) =>
          String(r.number) === rider1Param ||
          r.id === rider1Param ||
          r.slug === rider1Param
      );
      if (r1) {
        setSelectedRiderA(r1.id);
        if (rider2Param) {
          const r2 = MOTOGP_RIDERS.find(
            (r) =>
              String(r.number) === rider2Param ||
              r.id === rider2Param ||
              r.slug === rider2Param
          );
          if (r2) {
            setSelectedRiderB(r2.id);
          }
        } else {
          // Default to teammate or title rival
          const teammate = MOTOGP_RIDERS.find(
            (r) => r.team_id === r1.team_id && r.id !== r1.id
          );
          if (teammate) {
            setSelectedRiderB(teammate.id);
          } else {
            setSelectedRiderB(r1.id === 'marquez-93' ? 'bagnaia-63' : 'marquez-93');
          }
        }
        setActiveMode('dual');
      }
    }
  }, [searchParams]);

  const handleSelectTeamDuel = (riderAId: string, riderBId: string) => {
    setSelectedRiderA(riderAId);
    setSelectedRiderB(riderBId);
    setActiveMode('dual');
  };

  const handleAddThirdRider = (riderAId: string, riderBId: string) => {
    setSelectedRiderA(riderAId);
    setSelectedRiderB(riderBId);
    // Find a reasonable third driver who isn't A or B
    if (riderAId !== 'martin-89' && riderBId !== 'martin-89') {
      setSelectedRiderC('martin-89');
    } else {
      setSelectedRiderC('acosta-37');
    }
    setActiveMode('tri');
  };

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white select-none">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Sleek Top Mode Selector (No banners, full width layout matching Overview tab) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          {/* Mode Switcher Pills */}
          <div className="flex items-center p-1 rounded-full liquid-glass-pill shadow-lg self-start">
            <button
              onClick={() => setActiveMode('grid')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeMode === 'grid'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All-Grid Teammate Duels</span>
            </button>

            <button
              onClick={() => setActiveMode('dual')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeMode === 'dual'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Dual Duel (2 Riders)</span>
            </button>

            <button
              onClick={() => setActiveMode('tri')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeMode === 'tri'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tri-Duel (3 Riders)</span>
            </button>
          </div>

          {/* Quick Context Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-[#E10600]" />
            <span>2026 MotoGP™ Telemetry &amp; Pace Benchmark Analysis</span>
          </div>
        </div>

        {/* View Mode Switching */}
        {activeMode === 'grid' && (
          <AllGridDuels onSelectTeamDuel={handleSelectTeamDuel} />
        )}

        {activeMode === 'dual' && (
          <DualDuelComparison
            initialRiderAId={selectedRiderA}
            initialRiderBId={selectedRiderB}
            onAddThirdRider={handleAddThirdRider}
          />
        )}

        {activeMode === 'tri' && (
          <TriDuelComparison
            initialRiderAId={selectedRiderA}
            initialRiderBId={selectedRiderB}
            initialRiderCId={selectedRiderC}
            onRemoveThirdRider={() => setActiveMode('dual')}
          />
        )}
      </div>
    </div>
  );
}

export default function HeadToHeadPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#07080B]" />}>
      <HeadToHeadContent />
    </Suspense>
  );
}
