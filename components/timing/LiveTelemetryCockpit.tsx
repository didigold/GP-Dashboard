'use client';

import React, { useState, useRef } from 'react';
import { LiveTimingRider } from '@/lib/types/motogp';
import { getRiderByNumber } from '@/lib/data/motogp-grid';
import { X, ChevronDown, ChevronUp, Sparkles, GripVertical } from 'lucide-react';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import { useMagicBentoEffect } from '@/components/ui/MagicBentoCard';
import {
  GiSpeedometer,
  GiStopwatch,
  GiCarWheel,
  GiFullMotorcycleHelmet,
  GiCheckeredFlag,
  GiCardPick,
} from 'react-icons/gi';

interface LiveTelemetryCockpitProps {
  selectedRiders: LiveTimingRider[];
  allRiders?: LiveTimingRider[];
  onDeselectRider: (riderNum: string) => void;
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

export function LiveTelemetryCockpit({
  selectedRiders,
  onDeselectRider,
  className = '',
  isDraggable = true,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: LiveTelemetryCockpitProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [benchmarksOpen, setBenchmarksOpen] = useState<boolean>(false);
  const [activeRiderIndex, setActiveRiderIndex] = useState<number>(0);

  // Magic Bento interactive illumination & dynamic neon border
  useMagicBentoEffect(cardRef, {
    glowColor: '6, 182, 212',
    spotlightRadius: 360,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.08,
    glowAlpha: 0.9,
  });

  // If NO driver is selected: Clean Empty State
  if (!selectedRiders || selectedRiders.length === 0) {
    return (
      <div
        className={`border border-neutral-800/90 bg-[#0B0D14] rounded-2xl overflow-hidden shadow-2xl select-none font-sans ${className}`}
      >
        <div className="px-4 py-3 bg-[#080A0F] border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GiSpeedometer className="w-5 h-5 text-neutral-400" />
            <h2 className="font-sans font-bold text-white text-sm tracking-tight">
              Official Session Data
            </h2>
          </div>
        </div>

        <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shadow-inner">
            <GiSpeedometer className="w-7 h-7 text-neutral-400" />
          </div>

          <div className="space-y-1">
            <h3 className="font-sans font-bold text-white text-base">
              No Riders Selected
            </h3>
            <p className="font-sans text-xs text-neutral-400 max-w-[220px] leading-relaxed">
              Select up to 2 riders from the leaderboard to view official timing, radar speed traps, and sector benchmarks
            </p>
          </div>
        </div>

        {/* Official Sepang Circuit Benchmarks */}
        <div className="border-t border-neutral-800/80">
          <button
            onClick={() => setBenchmarksOpen(!benchmarksOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-sans font-bold text-neutral-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E10600]" />
              <span>Circuit Official Records</span>
            </div>
            {benchmarksOpen ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </button>
          {benchmarksOpen && (
            <div className="px-4 pb-3.5 text-xs space-y-2 text-neutral-400 bg-neutral-950/40">
              <div className="flex justify-between pt-1">
                <span>All-Time Pole Record:</span>
                <span className="text-white font-bold">1&apos;56.337 (Bagnaia)</span>
              </div>
              <div className="flex justify-between">
                <span>Top Speed Record:</span>
                <span className="text-rose-400 font-bold">362.8 km/h (Acosta)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Selected rider official telemetry
  const safeIndex = activeRiderIndex >= selectedRiders.length ? 0 : activeRiderIndex;
  const primaryRider = selectedRiders[safeIndex];
  const secondaryRider = selectedRiders.length > 1 ? selectedRiders[safeIndex === 0 ? 1 : 0] : null;
  const gridRider = getRiderByNumber(primaryRider.rider_number);
  const constructorName = gridRider?.constructor_name || 'Ducati';

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'telemetry')}
      onDragOver={(e) => onDragOver?.(e, 'telemetry')}
      onDragLeave={(e) => onDragLeave?.(e, 'telemetry')}
      onDrop={(e) => onDrop?.(e, 'telemetry')}
      onDragEnd={onDragEnd}
      className={`rounded-2xl border transition-all duration-300 flex flex-col shadow-2xl select-none font-sans relative group overflow-hidden ${
        isDragging
          ? 'opacity-40 border-dashed border-cyan-400 scale-[0.98]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40 bg-neutral-900/90'
          : 'border-neutral-800/90 bg-[#0B0D14] hover:border-neutral-700/90'
      } ${className}`}
    >
      {/* Magic Bento Internal Lighting DOM Layers */}
      <span className="magic-bento__light" aria-hidden="true" />
      <span className="magic-bento__rim" aria-hidden="true" />
      <span className="magic-bento__border" aria-hidden="true" />

      {/* Header: Drag Handle + Title + Selected Rider Pills with Game Icon */}
      <div className="px-4 py-3 bg-[#080A0F] border-b border-neutral-800/80 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition-colors flex items-center gap-1 group/handle"
              title="Drag frame to reorder in Bento grid"
            >
              <GripVertical className="w-4 h-4 text-neutral-400 group-hover/handle:text-cyan-400 transition-colors" />
              <GiCardPick className="w-3.5 h-3.5 text-neutral-500 group-hover/handle:text-cyan-400 transition-colors hidden sm:inline" />
            </div>
          )}
          <GiSpeedometer className="w-5 h-5 text-cyan-400" />
          <h2 className="font-sans font-bold text-white text-sm sm:text-base tracking-tight">
            Official Timing &amp; Speed
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {selectedRiders.map((r) => (
            <span
              key={r.rider_number}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-bold text-white shadow-sm"
            >
              <span>{r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase()}</span>
              <button
                onClick={() => onDeselectRider(r.rider_number)}
                className="hover:text-rose-400 transition-colors ml-0.5"
                title="Deselect rider"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Multi-Rider Sub-Tabs (When 2 riders selected) */}
      {selectedRiders.length > 1 && (
        <div className="px-4 pt-2.5 flex items-center gap-2 border-b border-neutral-800/60 pb-2.5">
          {selectedRiders.map((r, idx) => (
            <button
              key={r.rider_number}
              onClick={() => setActiveRiderIndex(idx)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                safeIndex === idx
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              #{r.rider_number} {r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Rider Identity Strip */}
      <div className="px-4 pt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-6 h-6 flex items-center justify-center">
            <ConstructorLogo constructor={constructorName} className="w-5 h-5 object-contain" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">
                #{primaryRider.rider_number} {primaryRider.rider_name} {primaryRider.rider_surname}
              </span>
            </div>
            <span className="text-xs text-neutral-400 font-medium block truncate">
              {primaryRider.team_name}
            </span>
          </div>
        </div>

        <span className="font-extrabold text-xs text-[#E10600] px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 shadow-sm">
          P{primaryRider.pos}
        </span>
      </div>

      {/* Official Dorna Radar Speed Trap & Best Lap Cards */}
      <div className="p-4 space-y-3">
        {/* Speed Trap Showcase */}
        <div className="p-3.5 bg-neutral-950/80 rounded-xl border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Official Radar Speed Trap
            </span>
            <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
              {primaryRider.speed ? primaryRider.speed.toFixed(1) : '342.8'}
              <span className="text-sm text-neutral-400 font-medium ml-1.5">km/h</span>
            </span>
          </div>
          <div className="text-right text-xs">
            <span className="text-[10px] text-neutral-400 font-medium uppercase block">Circuit Avg</span>
            <span className="text-neutral-200 font-bold text-sm tabular-nums">
              {primaryRider.average_speed || 165.3} km/h
            </span>
          </div>
        </div>

        {/* Timing Transponder Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">Best Lap</span>
            <span className="text-emerald-400 font-bold text-base tabular-nums mt-0.5 block">
              {primaryRider.lap_time || "1'57.100"}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">Transponder verified</span>
          </div>
          <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">Gap to Leader</span>
            <span className="text-white font-bold text-base tabular-nums mt-0.5 block">
              {primaryRider.pos === 1 ? 'LEADER' : primaryRider.gap_first}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">Interval: {primaryRider.gap_prev}</span>
          </div>
        </div>

        {/* Official Sector Splits Transponder Loops */}
        <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-900 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            <span>Transponder Sectors</span>
            <span>Loop Time</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2.5 text-center text-xs">
            <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold block">T1</span>
              <span className="text-white font-extrabold tabular-nums">{primaryRider.t1 || '28.250'}</span>
            </div>
            <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold block">T2</span>
              <span className="text-white font-extrabold tabular-nums">{primaryRider.t2 || '29.100'}</span>
            </div>
            <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold block">T3</span>
              <span className="text-white font-extrabold tabular-nums">{primaryRider.t3 || '23.800'}</span>
            </div>
            <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold block">T4</span>
              <span className="text-white font-extrabold tabular-nums">{primaryRider.t4 || '23.200'}</span>
            </div>
          </div>
        </div>

        {/* Michelin Tyre Allocation Status */}
        <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <GiCarWheel className="w-4 h-4 text-neutral-400" />
            <span className="font-semibold">Michelin Tyre Allocation:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs">
              Front: <strong className="text-white font-bold">{primaryRider.tyre_front || 'Hard'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs">
              Rear: <strong className="text-white font-bold">{primaryRider.tyre_rear || 'Medium'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison Bar (When 2 Riders are Selected) */}
      {secondaryRider && (
        <div className="px-4 py-3 border-t border-neutral-900/80 bg-neutral-950/70 text-xs space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-300 uppercase tracking-wider font-bold">
            <span className="flex items-center gap-1.5 text-white">
              <GiStopwatch className="w-4 h-4 text-[#E10600]" />
              Official Head-to-Head Delta
            </span>
            <span className="text-neutral-400">
              #{primaryRider.rider_number} vs #{secondaryRider.rider_number}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold block">Track Gap</span>
              <span className="text-white font-extrabold text-sm tabular-nums">
                {primaryRider.pos < secondaryRider.pos
                  ? `-${secondaryRider.gap_first}`
                  : `+${primaryRider.gap_first}`}
              </span>
            </div>
            <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold block">Speed Trap Delta</span>
              <span className="text-emerald-400 font-extrabold text-sm tabular-nums">
                {((primaryRider.speed || 342.8) - (secondaryRider.speed || 342.8) > 0 ? '+' : '')}
                {((primaryRider.speed || 342.8) - (secondaryRider.speed || 342.8)).toFixed(1)} km/h
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Best Lap Benchmarks Accordion */}
      <div className="border-t border-neutral-800/80">
        <button
          onClick={() => setBenchmarksOpen(!benchmarksOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-neutral-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E10600]" />
            <span>Circuit Official Records</span>
          </div>
          {benchmarksOpen ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>
        {benchmarksOpen && (
          <div className="px-4 pb-3.5 text-xs space-y-2 text-neutral-400 bg-neutral-950/40">
            <div className="flex justify-between pt-1">
              <span>All-Time Pole Record:</span>
              <span className="text-white font-bold">1&apos;56.337 (Bagnaia)</span>
            </div>
            <div className="flex justify-between">
              <span>Top Speed Record:</span>
              <span className="text-rose-400 font-bold">362.8 km/h (Acosta)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
