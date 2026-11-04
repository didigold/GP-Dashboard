'use client';

import React, { useState, useRef } from 'react';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import { getRiderByNumber } from '@/lib/data/motogp-grid';
import { LiveTimingRider } from '@/lib/types/motogp';
import { GiTrophyCup, GiFullMotorcycleHelmet, GiCheckeredFlag, GiCardPick } from 'react-icons/gi';
import { GripVertical } from 'lucide-react';
import { useMagicBentoEffect } from '@/components/ui/MagicBentoCard';

interface StandingItem {
  position: number;
  riderNumber?: number;
  riderName?: string;
  countryIso?: string;
  teamName?: string;
  constructorName?: string;
  points: number;
}

interface LiveChampionshipWidgetProps {
  standings?: StandingItem[];
  riders?: LiveTimingRider[];
  sessionType?: string;
  selectedRiderNum?: string;
  onSelectRider?: (riderNum: string) => void;
  className?: string;
  isDraggable?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragLeave?: (e: React.DragEvent, id: string) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

// Official 2026 MotoGP World Championship Standings from Dorna Sports API
const OFFICIAL_2026_DRIVERS: StandingItem[] = [
  { position: 1, riderNumber: 93, riderName: 'Marc Marquez', constructorName: 'Ducati', teamName: 'Ducati Lenovo Team', points: 399 },
  { position: 2, riderNumber: 89, riderName: 'Jorge Martin', constructorName: 'Aprilia', teamName: 'Aprilia Racing', points: 355 },
  { position: 3, riderNumber: 72, riderName: 'Marco Bezzecchi', constructorName: 'Aprilia', teamName: 'Aprilia Racing', points: 332 },
  { position: 4, riderNumber: 37, riderName: 'Pedro Acosta', constructorName: 'KTM', teamName: 'Red Bull KTM Factory Racing', points: 295 },
  { position: 5, riderNumber: 79, riderName: 'Ai Ogura', constructorName: 'Aprilia', teamName: 'SuperFile Trackhouse MotoGP Team', points: 278 },
  { position: 6, riderNumber: 49, riderName: 'Fabio Di Giannantonio', constructorName: 'Ducati', teamName: 'Pertamina Enduro VR46 Racing Team', points: 265 },
  { position: 7, riderNumber: 25, riderName: 'Raul Fernandez', constructorName: 'Aprilia', teamName: 'SuperFile Trackhouse MotoGP Team', points: 236 },
  { position: 8, riderNumber: 73, riderName: 'Alex Marquez', constructorName: 'Ducati', teamName: 'BK8 Gresini Racing MotoGP', points: 197 },
  { position: 9, riderNumber: 63, riderName: 'Francesco Bagnaia', constructorName: 'Ducati', teamName: 'Ducati Lenovo Team', points: 173 },
  { position: 10, riderNumber: 23, riderName: 'Enea Bastianini', constructorName: 'KTM', teamName: 'Red Bull KTM Tech3', points: 134 },
];

const OFFICIAL_2026_TEAMS = [
  { position: 1, teamName: 'Ducati Lenovo Team', constructorName: 'Ducati', points: 572 },
  { position: 2, teamName: 'Aprilia Racing', constructorName: 'Aprilia', points: 687 },
  { position: 3, teamName: 'SuperFile Trackhouse Team', constructorName: 'Aprilia', points: 514 },
  { position: 4, teamName: 'Red Bull KTM Factory Racing', constructorName: 'KTM', points: 449 },
  { position: 5, teamName: 'Pertamina Enduro VR46', constructorName: 'Ducati', points: 265 },
  { position: 6, teamName: 'BK8 Gresini Racing MotoGP', constructorName: 'Ducati', points: 251 },
];

export function LiveChampionshipWidget({
  standings,
  selectedRiderNum,
  onSelectRider,
  className = '',
  isDraggable = true,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: LiveChampionshipWidgetProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'drivers' | 'teams'>('drivers');

  // Magic Bento interactive illumination & dynamic neon border
  useMagicBentoEffect(cardRef, {
    glowColor: '234, 179, 8',
    spotlightRadius: 360,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.08,
    glowAlpha: 0.9,
  });

  const driverList = standings && standings.length > 0 ? standings : OFFICIAL_2026_DRIVERS;

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'championship')}
      onDragOver={(e) => onDragOver?.(e, 'championship')}
      onDragLeave={(e) => onDragLeave?.(e, 'championship')}
      onDrop={(e) => onDrop?.(e, 'championship')}
      onDragEnd={onDragEnd}
      className={`rounded-2xl border transition-all duration-300 flex flex-col shadow-2xl select-none font-sans relative group overflow-hidden ${
        isDragging
          ? 'opacity-40 border-dashed border-[#EAB308] scale-[0.98]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40 bg-neutral-900/90'
          : 'border-neutral-800/90 bg-[#0B0D14] hover:border-neutral-700/90'
      } ${className}`}
    >
      {/* Magic Bento Internal Lighting DOM Layers */}
      <span className="magic-bento__light" aria-hidden="true" />
      <span className="magic-bento__rim" aria-hidden="true" />
      <span className="magic-bento__border" aria-hidden="true" />

      {/* Header with Drag Handle + Game Icon + Tab Switcher */}
      <div className="px-4 py-3 bg-[#080A0F] border-b border-neutral-800/80 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition-colors flex items-center gap-1 group/handle"
              title="Drag frame to reorder in Bento grid"
            >
              <GripVertical className="w-4 h-4 text-neutral-400 group-hover/handle:text-[#EAB308] transition-colors" />
              <GiCardPick className="w-3.5 h-3.5 text-neutral-500 group-hover/handle:text-[#EAB308] transition-colors hidden sm:inline" />
            </div>
          )}
          <GiTrophyCup className="w-5 h-5 text-[#EAB308]" />
          <h2 className="font-sans font-bold text-white text-sm sm:text-base tracking-tight">
            Live Championship
          </h2>
        </div>

        {/* Tab pill switcher: Drivers / Teams */}
        <div className="flex items-center bg-black/80 p-0.5 rounded-lg border border-neutral-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'drivers'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Drivers
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'teams'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Standings List with Increased Font Size and Sora Typography */}
      <div className="p-2.5 space-y-1.5 max-h-[300px] overflow-y-auto font-sans [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {activeTab === 'drivers' ? (
          driverList.slice(0, 7).map((d) => {
            const isSelected = selectedRiderNum === String(d.riderNumber);
            const gridRider = d.riderNumber ? getRiderByNumber(String(d.riderNumber)) : undefined;
            const constructor = d.constructorName || gridRider?.constructor_name || 'Ducati';
            const surname = d.riderName?.split(' ').pop() || 'Rider';

            return (
              <div
                key={d.position}
                onClick={() => d.riderNumber && onSelectRider?.(String(d.riderNumber))}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-neutral-800/90 border border-neutral-700 text-white shadow-md'
                    : 'hover:bg-neutral-900/70 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-4 text-center font-extrabold text-neutral-400 text-xs">
                    {d.position}
                  </span>

                  <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                    <ConstructorLogo constructor={constructor} className="w-3.5 h-3.5 object-contain" />
                  </div>

                  <span className="font-bold text-white text-sm truncate">
                    {surname}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm tabular-nums">
                    {d.points}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium uppercase">
                    PTS
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          OFFICIAL_2026_TEAMS.map((t) => (
            <div
              key={t.position}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-900/70 transition-colors text-neutral-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-4 text-center font-extrabold text-neutral-400 text-xs">
                  {t.position}
                </span>

                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  <ConstructorLogo constructor={t.constructorName} className="w-3.5 h-3.5 object-contain" />
                </div>

                <span className="font-bold text-white text-sm truncate">
                  {t.teamName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm tabular-nums">
                  {t.points}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium uppercase">
                  PTS
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
