'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CircuitInfo } from '@/lib/data/circuits-data';

const RealMapboxView = dynamic(
  () => import('./RealMapboxView').then((mod) => mod.RealMapboxView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#05070E] text-neutral-400 font-sans text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-ping" />
          <span>Loading Mapbox satellite map...</span>
        </div>
      </div>
    ),
  }
);

interface UnifiedCalendarMapProps {
  selectedCircuit: CircuitInfo;
  onSelectCircuit: (circuit: CircuitInfo) => void;
  onOpenModal?: (circuit: CircuitInfo) => void;
}

export function UnifiedCalendarMap({
  selectedCircuit,
  onSelectCircuit,
  onOpenModal,
}: UnifiedCalendarMapProps) {
  return (
    <div className="relative w-full h-full bg-[#05070E] overflow-hidden select-none">
      <RealMapboxView
        selectedCircuit={selectedCircuit}
        onSelectCircuit={onSelectCircuit}
        onOpenModal={onOpenModal}
      />
    </div>
  );
}
