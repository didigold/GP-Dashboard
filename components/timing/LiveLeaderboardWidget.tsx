'use client';

import React, { useState, useMemo, useRef } from 'react';
import { LiveTimingRider } from '@/lib/types/motogp';
import { getRiderByNumber } from '@/lib/data/motogp-grid';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import { Search, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useMagicBentoEffect, MagicBentoGlow } from '@/components/ui/MagicBentoCard';
import { GiFullMotorcycleHelmet } from 'react-icons/gi';

interface LiveLeaderboardWidgetProps {
  riders: LiveTimingRider[];
  selectedRiderNums: string[];
  onToggleSelectRider: (riderNum: string) => void;
  isWet?: boolean;
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
  isWet = false,
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
  const [activeTab, setActiveTab] = useState<'timing' | 'stints' | 'speed'>('timing');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useMagicBentoEffect(cardRef, {
    glowColor: '225, 6, 0',
    spotlightRadius: 360,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.07,
    glowAlpha: 0.85,
  });

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
      className={`rounded-2xl border transition-all duration-300 flex flex-col shadow-2xl select-none font-sans relative overflow-hidden bg-[#0D0D0E]/90 ${
        isDragging
          ? 'opacity-40 border-dashed border-[#E10600] scale-[0.98]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      } ${className}`}
    >
      <MagicBentoGlow />

      {/* SINGLE-LINE COMPACT HEADER WITH LIQUID GLASS PILLS (h-8) */}
      <div className="px-3.5 py-2.5 border-b border-white/[0.08] flex items-center justify-between gap-2 relative z-10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-0.5 text-neutral-500 hover:text-white transition-colors"
              title="Drag frame to reorder"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}
          <GiFullMotorcycleHelmet className="w-4 h-4 text-[#E10600] shrink-0" />
          <h2 className="font-sans font-bold text-white text-xs sm:text-sm tracking-tight truncate">
            Leaderboard
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Liquid Glass Segmented Tab Switcher (Timing | Stints | Speed) */}
          <div className="h-8 p-0.5 inline-flex items-center rounded-full liquid-glass-pill text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('timing')}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                activeTab === 'timing'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Timing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stints')}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                activeTab === 'stints'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Stints
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('speed')}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                activeTab === 'speed'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Speed
            </button>
          </div>

          {/* Search Toggle Circle Button */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen(!searchOpen);
              if (searchOpen) setSearchQuery('');
            }}
            className={`w-8 h-8 liquid-glass-circle transition-colors cursor-pointer ${
              searchOpen || searchQuery ? 'bg-white text-black' : 'text-neutral-300 hover:text-white'
            }`}
            title="Search riders"
          >
            {searchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* EXPANDABLE SEARCH INPUT BAR */}
      {searchOpen && (
        <div className="px-3.5 py-2 border-b border-white/[0.08] bg-black/40 relative z-10 shrink-0">
          <div className="relative w-full h-8">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rider, #number, constructor..."
              autoFocus
              className="w-full h-8 pl-8 pr-8 rounded-full bg-white/[0.05] border border-white/15 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* LEADERBOARD TABLE (Scrolls smoothly inside fixed-height column without scrolling the page) */}
      <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#090A0E]/95 text-neutral-400 text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10">
              <th scope="col" className="py-2 px-2.5 w-9 text-center">
                POS
              </th>
              <th scope="col" className="py-2 px-2">
                RIDER
              </th>
              {activeTab === 'timing' && (
                <>
                  <th scope="col" className="py-2 px-2 text-right">
                    GAP
                  </th>
                  <th scope="col" className="py-2 px-2 text-right">
                    INT
                  </th>
                  <th scope="col" className="py-2 px-2.5 text-right">
                    LAST
                  </th>
                </>
              )}
              {activeTab === 'stints' && (
                <>
                  <th scope="col" className="py-2 px-2 text-center">
                    FRONT / REAR
                  </th>
                  <th scope="col" className="py-2 px-2.5 text-right">
                    LAPS
                  </th>
                </>
              )}
              {activeTab === 'speed' && (
                <>
                  <th scope="col" className="py-2 px-2 text-right">
                    AVG
                  </th>
                  <th scope="col" className="py-2 px-2.5 text-right">
                    TOP SPEED
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {sortedRiders.map((rider, idx) => {
              const selIdx = selectedRiderNums.indexOf(rider.rider_number);
              const isSelected = selIdx !== -1;
              const isP1 = rider.pos === 1;
              const gridRider = getRiderByNumber(rider.rider_number);
              const constructorName = gridRider?.constructor_name || 'Ducati';
              const shortName =
                rider.rider_shortname || rider.rider_surname.slice(0, 3).toUpperCase();

              const tyreFront = isWet
                ? 'Wet'
                : rider.tyre_front || (idx % 3 === 0 ? 'Hard' : 'Medium');
              const tyreRear = isWet
                ? 'Wet'
                : rider.tyre_rear || (idx % 2 === 0 ? 'Medium' : 'Soft');

              const deltaPos = idx === 0 ? 0 : idx % 2 === 0 ? 1 : -1;

              // Highlight border color when selected (Red for Rider 1, Cyan/Team for Rider 2)
              const selectedBorderColor =
                selIdx === 1 ? 'border-l-[#00F5D4]' : 'border-l-[#E10600]';

              return (
                <tr
                  key={rider.rider_number}
                  onClick={() => onToggleSelectRider(rider.rider_number)}
                  className={`cursor-pointer transition-colors h-[39px] font-sans ${
                    isSelected
                      ? `bg-white/[0.10] border-l-4 ${selectedBorderColor}`
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Position */}
                  <td className="py-1.5 px-2.5 text-center font-extrabold text-xs tabular-nums">
                    <span
                      className={
                        isP1
                          ? 'text-amber-300'
                          : rider.pos === 2
                          ? 'text-neutral-200'
                          : rider.pos === 3
                          ? 'text-amber-600'
                          : 'text-neutral-400'
                      }
                    >
                      {rider.pos}
                    </span>
                  </td>

                  {/* Constructor Logo + Sharp Square Team Number Badge + 3-Letter Code + Delta */}
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-2">
                      <ConstructorLogo
                        constructor={constructorName}
                        className="w-3.5 h-3.5 object-contain shrink-0"
                      />
                      {/* Sharp Square Team-Colored Number Badge matching Overview DriverStandingsTop5 */}
                      <span
                        className="w-5 h-5 rounded-none font-black text-[10px] text-white flex items-center justify-center shadow-xs shrink-0"
                        style={{ backgroundColor: rider.color || '#E10600' }}
                      >
                        {rider.rider_number}
                      </span>
                      <span className="font-bold text-white text-xs sm:text-[13px] tracking-tight">
                        {shortName}
                      </span>
                      {deltaPos !== 0 && (
                        <span
                          className={`text-[10px] font-bold flex items-center ${
                            deltaPos > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {deltaPos > 0 ? (
                            <ChevronUp className="w-2.5 h-2.5" />
                          ) : (
                            <ChevronDown className="w-2.5 h-2.5" />
                          )}
                          {Math.abs(deltaPos)}
                        </span>
                      )}
                    </div>
                  </td>

                  {activeTab === 'timing' && (
                    <>
                      {/* Gap to Leader */}
                      <td className="py-1.5 px-2 text-right tabular-nums text-[11px] font-semibold">
                        {isP1 ? (
                          <span className="text-neutral-500">—</span>
                        ) : (
                          <span className="text-neutral-200">{rider.gap_first}</span>
                        )}
                      </td>

                      {/* Interval */}
                      <td className="py-1.5 px-2 text-right tabular-nums text-[11px] font-medium text-neutral-400">
                        {isP1 ? '—' : rider.gap_prev || '—'}
                      </td>

                      {/* Last Lap */}
                      <td className="py-1.5 px-2.5 text-right tabular-nums text-[11px] font-bold">
                        <span className={isP1 ? 'text-purple-400' : 'text-white'}>
                          {rider.lap_time || "1'57.412"}
                        </span>
                      </td>
                    </>
                  )}

                  {activeTab === 'stints' && (
                    <>
                      <td className="py-1.5 px-2 text-center">
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold">
                          <span className="px-1.5 py-0.5 rounded-full bg-white/[0.08] border border-white/15 text-white">
                            F:{tyreFront.charAt(0)}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full border ${
                              tyreRear === 'Wet'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                                : tyreRear === 'Soft'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            R:{tyreRear.charAt(0)}
                          </span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2.5 text-right tabular-nums text-xs font-bold text-neutral-300">
                        {rider.num_lap || 16}L
                      </td>
                    </>
                  )}

                  {activeTab === 'speed' && (
                    <>
                      <td className="py-1.5 px-2 text-right tabular-nums text-[11px] text-neutral-400">
                        {(rider.average_speed || 165.3).toFixed(1)}
                      </td>
                      <td className="py-1.5 px-2.5 text-right tabular-nums text-xs font-black">
                        <span
                          className={
                            (rider.speed || 0) >= 344
                              ? 'px-1.5 py-0.5 rounded bg-[#E10600] text-white'
                              : 'text-white'
                          }
                        >
                          {(rider.speed || 342.8).toFixed(1)}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
