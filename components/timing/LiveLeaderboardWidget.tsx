'use client';

import React, { useState, useMemo, useRef } from 'react';
import { LiveTimingRider } from '@/lib/types/motogp';
import { getRiderByNumber } from '@/lib/data/motogp-grid';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import { Search, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useMagicBentoEffect } from '@/components/ui/MagicBentoCard';
import {
  GiFullMotorcycleHelmet,
  GiStopwatch,
  GiCarWheel,
  GiCheckeredFlag,
  GiCardPick,
} from 'react-icons/gi';

interface LiveLeaderboardWidgetProps {
  riders: LiveTimingRider[];
  selectedRiderNums: string[];
  onToggleSelectRider: (riderNum: string) => void;
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

export function LiveLeaderboardWidget({
  riders,
  selectedRiderNums,
  onToggleSelectRider,
  className = '',
  isDraggable = true,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: LiveLeaderboardWidgetProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'timing' | 'stints'>('timing');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Magic Bento interactive illumination & dynamic neon border
  useMagicBentoEffect(cardRef, {
    glowColor: '225, 6, 0',
    spotlightRadius: 360,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.08,
    glowAlpha: 0.9,
  });

  // Sort riders by position
  const sortedRiders = useMemo(() => {
    let list = [...riders].sort((a, b) => a.pos - b.pos);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.rider_name.toLowerCase().includes(q) ||
          r.rider_surname.toLowerCase().includes(q) ||
          r.rider_number.includes(q) ||
          r.team_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [riders, searchQuery]);

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'leaderboard')}
      onDragOver={(e) => onDragOver?.(e, 'leaderboard')}
      onDragLeave={(e) => onDragLeave?.(e, 'leaderboard')}
      onDrop={(e) => onDrop?.(e, 'leaderboard')}
      onDragEnd={onDragEnd}
      className={`rounded-2xl border transition-all duration-300 flex flex-col shadow-2xl select-none font-sans relative group overflow-hidden ${
        isDragging
          ? 'opacity-40 border-dashed border-[#E10600] scale-[0.98]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40 bg-neutral-900/90'
          : 'border-neutral-800/90 bg-[#0B0D14] hover:border-neutral-700/90'
      } ${className}`}
    >
      {/* Magic Bento Internal Lighting DOM Layers */}
      <span className="magic-bento__light" aria-hidden="true" />
      <span className="magic-bento__rim" aria-hidden="true" />
      <span className="magic-bento__border" aria-hidden="true" />

      {/* Header matching Formula 1 Dashboard: Drag Handle + Title + Tabs (Timing | Stints) + Search */}
      <div className="px-4 py-3 bg-[#080A0F] border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition-colors flex items-center gap-1 group/handle"
              title="Drag frame to reorder in Bento grid"
            >
              <GripVertical className="w-4 h-4 text-neutral-400 group-hover/handle:text-[#E10600] transition-colors" />
              <GiCardPick className="w-3.5 h-3.5 text-neutral-500 group-hover/handle:text-[#E10600] transition-colors hidden sm:inline" />
            </div>
          )}
          <GiFullMotorcycleHelmet className="w-5 h-5 text-[#E10600]" />
          <h2 className="font-sans font-bold text-white text-sm sm:text-base tracking-tight">
            Leaderboard
          </h2>

          {/* View Tab Switcher: Timing vs Stints (Inspired by F1 Dashboard) */}
          <div className="flex items-center bg-black/80 p-0.5 rounded-lg border border-neutral-800 text-xs font-semibold ml-1">
            <button
              onClick={() => setActiveTab('timing')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'timing'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Timing
            </button>
            <button
              onClick={() => setActiveTab('stints')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'stints'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Stints
            </button>
          </div>
        </div>

        {/* Search input with increased sizing */}
        <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1.5 rounded-lg border border-neutral-800 text-xs w-32 sm:w-44">
          <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search riders..."
            className="w-full bg-transparent text-white placeholder-neutral-500 focus:outline-none text-xs font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard Table with Sora Typography, Generous Padding, and Micro-Sectors */}
      <div className="overflow-x-auto flex-1 max-h-[640px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-800/80 bg-neutral-950/90 text-neutral-400 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10">
              <th scope="col" className="py-2.5 px-3 w-10 text-center">POS</th>
              <th scope="col" className="py-2.5 px-3 min-w-[140px]">DRIVER</th>
              <th scope="col" className="py-2.5 px-3 text-right">GAP</th>
              <th scope="col" className="py-2.5 px-3 text-right">INT</th>
              <th scope="col" className="py-2.5 px-3 text-right hidden md:table-cell">LAST</th>
              <th scope="col" className="py-2.5 px-3 text-right hidden lg:table-cell">BEST</th>
              <th scope="col" className="py-2.5 px-3 text-center hidden xl:table-cell">SECTORS</th>
              <th scope="col" className="py-2.5 px-3 text-center hidden md:table-cell">LAPS</th>
              <th scope="col" className="py-2.5 px-3 text-center">TYRE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/80">
            {sortedRiders.map((rider, idx) => {
              const isSelected = selectedRiderNums.includes(rider.rider_number);
              const isP1 = rider.pos === 1;
              const gridRider = getRiderByNumber(rider.rider_number);
              const constructorName = gridRider?.constructor_name || 'Ducati';
              const shortName = rider.rider_shortname || rider.rider_surname.slice(0, 3).toUpperCase();

              // Tyre compound badge styling
              const tyreFront = rider.tyre_front || (idx % 3 === 0 ? 'Hard' : 'Medium');
              const tyreColorClass =
                tyreFront === 'Soft'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : tyreFront === 'Medium'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-neutral-800 text-neutral-200 border-neutral-700';

              const tyreLetter = tyreFront.charAt(0);
              const tyreLaps = rider.num_lap || (20 - Math.floor(idx * 0.5));

              // Simulated delta position arrow (e.g. +2, -1)
              const deltaPos = idx === 0 ? 0 : idx % 2 === 0 ? 1 : -1;

              return (
                <tr
                  key={rider.rider_number}
                  onClick={() => onToggleSelectRider(rider.rider_number)}
                  className={`cursor-pointer transition-colors h-[42px] font-sans ${
                    isSelected
                      ? 'bg-neutral-800/90 border-l-4 border-[#E10600]'
                      : 'hover:bg-neutral-900/70'
                  }`}
                >
                  {/* Position */}
                  <td className="py-2 px-3 text-center font-extrabold text-xs">
                    <span className={isP1 ? 'text-[#E10600]' : 'text-neutral-300'}>
                      {rider.pos}
                    </span>
                  </td>

                  {/* Constructor Logo, 3-Letter Code, Number, Delta Arrow */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                        <ConstructorLogo constructor={constructorName} className="w-4 h-4 object-contain" />
                      </div>
                      <span className="font-bold text-white text-sm tracking-tight">
                        {shortName}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-semibold">
                        #{rider.rider_number}
                      </span>
                      {deltaPos !== 0 && (
                        <span
                          className={`text-[10px] font-bold flex items-center ${
                            deltaPos > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {deltaPos > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {Math.abs(deltaPos)}
                        </span>
                      )}
                      {rider.on_pit && (
                        <span className="rounded bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                          PIT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Gap to Leader */}
                  <td className="py-2 px-3 text-right tabular-nums text-xs font-semibold">
                    {isP1 ? (
                      <span className="text-neutral-500">—</span>
                    ) : (
                      <span className="text-neutral-200">{rider.gap_first}</span>
                    )}
                  </td>

                  {/* Interval to previous rider */}
                  <td className="py-2 px-3 text-right tabular-nums text-xs font-semibold text-neutral-400">
                    {isP1 ? '—' : rider.gap_prev || '—'}
                  </td>

                  {/* Last Lap Time */}
                  <td className="py-2 px-3 text-right tabular-nums text-xs font-medium text-neutral-300 hidden md:table-cell">
                    {rider.lap_time || "1'57.412"}
                  </td>

                  {/* Best Lap Time (Purple if P1 / overall fastest) */}
                  <td className="py-2 px-3 text-right tabular-nums text-xs font-bold hidden lg:table-cell">
                    <span className={isP1 ? 'text-purple-400' : 'text-neutral-300'}>
                      {rider.best_lap?.time || rider.lap_time || "1'57.100"}
                    </span>
                  </td>

                  {/* Mini-Sectors Micro Visual Blocks (Inspired by F1 Dashboard) */}
                  <td className="py-2 px-3 hidden xl:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <span
                        className={`w-3.5 h-1.5 rounded-sm ${
                          isP1 ? 'bg-purple-400' : idx % 2 === 0 ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        title={`S1: ${rider.t1 || '28.250'}`}
                      />
                      <span
                        className={`w-3.5 h-1.5 rounded-sm ${
                          isP1 ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        title={`S2: ${rider.t2 || '29.100'}`}
                      />
                      <span
                        className={`w-3.5 h-1.5 rounded-sm ${
                          idx === 1 ? 'bg-purple-400' : 'bg-emerald-400'
                        }`}
                        title={`S3: ${rider.t3 || '23.800'}`}
                      />
                      <span
                        className="w-3.5 h-1.5 rounded-sm bg-emerald-400"
                        title={`S4: ${rider.t4 || '23.200'}`}
                      />
                    </div>
                  </td>

                  {/* Laps Completed */}
                  <td className="py-2 px-3 text-center tabular-nums text-xs font-medium text-neutral-400 hidden md:table-cell">
                    {rider.num_lap || 20}
                  </td>

                  {/* Michelin Tyre Allocation Badge */}
                  <td className="py-2 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded-full font-bold text-[10px] border ${tyreColorClass}`}
                        title={`Michelin ${tyreFront} Compound`}
                      >
                        {tyreLetter}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 hidden sm:inline tabular-nums">
                        {tyreLaps}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
