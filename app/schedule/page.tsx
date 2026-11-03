'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CHAMPIONSHIP_ROUNDS_2026, CircuitInfo } from '@/lib/data/circuits-data';
import { CircuitCard } from '@/components/calendar/CircuitCard';

// Direct Mapbox GL JS map
const RealMapboxView = dynamic(
  () => import('@/components/calendar/RealMapboxView').then((mod) => mod.RealMapboxView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#05070E] text-neutral-400 font-sans text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-ping" />
          <span>Loading Mapbox map...</span>
        </div>
      </div>
    ),
  }
);

export default function SchedulePage() {
  // Default to CURRENT round or first UPCOMING round
  const activeRound =
    CHAMPIONSHIP_ROUNDS_2026.find((c) => c.status === 'CURRENT') ||
    CHAMPIONSHIP_ROUNDS_2026.find((c) => c.status === 'UPCOMING') ||
    CHAMPIONSHIP_ROUNDS_2026[0];

  const [selectedCircuit, setSelectedCircuit] = useState<CircuitInfo>(activeRound);

  // When accessing calendar, center the cards list on the active circuit
  useEffect(() => {
    const timer = setTimeout(() => {
      const cardEl = document.getElementById(`circuit-card-${activeRound.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [activeRound.id]);

  const handleSelectCircuit = (circuit: CircuitInfo) => {
    setSelectedCircuit(circuit);
  };

  return (
    <div className="relative w-full -mt-12 h-[100dvh] overflow-hidden bg-[#05070E] text-white font-sans select-none">
      {/* =========================================================================
          FULL-SCREEN MAPBOX MAP (100% viewport fill, extends behind topnav)
         ========================================================================= */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <RealMapboxView
          selectedCircuit={selectedCircuit}
          onSelectCircuit={handleSelectCircuit}
        />
      </div>

      {/* =========================================================================
          OVERLAYED OVER THE MAP: FLOATING CIRCUIT CARDS
          (Reaches from top: 0 to bottom: 0, slides behind topnav, scrolls off screen)
         ========================================================================= */}
      <div className="absolute z-20 left-4 sm:left-6 top-0 bottom-0 w-[340px] sm:w-[380px] xl:w-[410px] pointer-events-none">
        <div className="w-full h-full pointer-events-auto overflow-y-auto pt-[64px] pb-16 space-y-5 sm:space-y-6 pr-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CHAMPIONSHIP_ROUNDS_2026.map((round) => (
            <div
              key={round.id}
              id={`circuit-card-${round.id}`}
              className="h-[155px] sm:h-[160px] rounded-2xl overflow-hidden cursor-pointer border-none ring-0 shadow-none select-none transition-transform duration-200 hover:-translate-y-0.5"
            >
              <CircuitCard
                circuit={round}
                isSelected={selectedCircuit.id === round.id}
                onSelect={handleSelectCircuit}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
