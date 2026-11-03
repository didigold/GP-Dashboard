'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CircuitInfo } from '@/lib/data/circuits-data';
import { Globe, MapPin } from 'lucide-react';

const GlobeCalendarView = dynamic(
  () => import('./GlobeCalendarView').then((mod) => mod.GlobeCalendarView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#05070E] text-neutral-400 font-sans text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-ping" />
          <span>Rendering globe...</span>
        </div>
      </div>
    ),
  }
);

const RealMapboxView = dynamic(
  () => import('./RealMapboxView').then((mod) => mod.RealMapboxView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#05070E] text-neutral-400 font-sans text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-ping" />
          <span>Loading satellite map...</span>
        </div>
      </div>
    ),
  }
);

interface UnifiedCalendarMapProps {
  selectedCircuit: CircuitInfo;
  onSelectCircuit: (circuit: CircuitInfo) => void;
  onOpenModal?: (circuit: CircuitInfo) => void;
  mapMode: 'globe' | 'track';
  onToggleMapMode: (mode: 'globe' | 'track') => void;
}

export function UnifiedCalendarMap({
  selectedCircuit,
  onSelectCircuit,
  onOpenModal,
  mapMode,
  onToggleMapMode,
}: UnifiedCalendarMapProps) {
  const isGlobe = mapMode === 'globe';

  return (
    <div className="relative w-full h-full bg-[#05070E] overflow-hidden select-none">
      {isGlobe ? (
        <GlobeCalendarView
          selectedCircuit={selectedCircuit}
          onSelectCircuit={onSelectCircuit}
          onOpenModal={onOpenModal}
        />
      ) : (
        <RealMapboxView
          selectedCircuit={selectedCircuit}
          onSelectCircuit={onSelectCircuit}
          onOpenModal={onOpenModal}
        />
      )}

      {/* Icon-only view switch */}
      <button
        onClick={() => onToggleMapMode(isGlobe ? 'track' : 'globe')}
        className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/70 backdrop-blur-xl text-neutral-300 hover:text-white border border-white/15 hover:border-white/30 transition-colors shadow-xl"
        title={isGlobe ? 'Switch to satellite track map' : 'Switch to 3D globe'}
        aria-label={isGlobe ? 'Switch to satellite track map' : 'Switch to 3D globe'}
      >
        {isGlobe ? <MapPin className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
      </button>
    </div>
  );
}
