'use client';

import React, { useRef } from 'react';
import { LiveTimingRider } from '@/lib/types/motogp';
import { parseLapTimeToSeconds } from '@/lib/utils/time';
import { abbreviateRiderName } from '@/lib/utils/rider-name';
import { DriverNumber } from '@/components/ui/driver-number';
import { cn } from '@/lib/utils';
import { GripVertical, Timer, LayoutGrid } from 'lucide-react';
import { useMagicBentoEffect } from '@/components/ui/MagicBentoCard';

export const SECTOR_KEYS = ['t1', 't2', 't3', 't4'] as const;
export type SectorKey = (typeof SECTOR_KEYS)[number];

export type SectorTone = 'fastest' | 'second' | 'normal' | 'empty';

export interface SectorBest {
  fastest: number | null;
  second: number | null;
}

export type SectorBests = Record<SectorKey, SectorBest>;

const EMPTY_BESTS: SectorBests = {
  t1: { fastest: null, second: null },
  t2: { fastest: null, second: null },
  t3: { fastest: null, second: null },
  t4: { fastest: null, second: null },
};

const EPSILON = 0.001;

/**
 * Compute the fastest and second-fastest sector time for every sector column
 * across the supplied riders. Used to colour-code sector cells.
 */
export function computeSectorBests(riders: LiveTimingRider[]): SectorBests {
  const bests: SectorBests = {
    t1: { ...EMPTY_BESTS.t1 },
    t2: { ...EMPTY_BESTS.t2 },
    t3: { ...EMPTY_BESTS.t3 },
    t4: { ...EMPTY_BESTS.t4 },
  };

  for (const key of SECTOR_KEYS) {
    const values = riders
      .map((rider) => parseLapTimeToSeconds(rider[key]))
      .filter((value) => value > 0)
      .sort((a, b) => a - b);

    bests[key].fastest = values[0] ?? null;
    bests[key].second = values[1] ?? null;
  }

  return bests;
}

/**
 * Map a sector time to its visual tone: red = fastest in column,
 * orange = second fastest, dark = the rest.
 */
export function getSectorTone(value: string | undefined, best: SectorBest): SectorTone {
  const seconds = parseLapTimeToSeconds(value);
  if (seconds <= 0) return 'empty';
  if (best.fastest !== null && Math.abs(seconds - best.fastest) < EPSILON) return 'fastest';
  if (best.second !== null && Math.abs(seconds - best.second) < EPSILON) return 'second';
  return 'normal';
}

const TONE_CLASSES: Record<SectorTone, string> = {
  fastest: 'bg-[#E10600] text-white border-[#E10600] font-semibold',
  second: 'bg-[#F97316] text-white border-[#F97316] font-semibold',
  normal: 'bg-[#1C1C1C] text-neutral-300 border-neutral-800',
  empty: 'bg-[#111111] text-neutral-600 border-neutral-800',
};

/** Reusable sector pill used by the live leaderboard and sector table. */
export function SectorCell({
  value,
  best,
  className,
}: {
  value?: string;
  best: SectorBest;
  className?: string;
}) {
  const tone = getSectorTone(value, best);
  return (
    <span
      className={cn(
        'inline-flex min-w-[56px] items-center justify-center rounded border px-2 py-1 font-sans text-xs font-semibold tabular-nums',
        TONE_CLASSES[tone],
        className
      )}
    >
      {value || '—'}
    </span>
  );
}

interface SectorTrackingTableProps {
  riders: LiveTimingRider[];
  className?: string;
  /** Show the pos + rider + number identification columns. */
  showRider?: boolean;
  isDraggable?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragLeave?: (e: React.DragEvent, id: string) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

/**
 * Sector tracking grid: one row per rider, S1-S4 columns colour-coded against
 * the session fastest (red) and second fastest (orange) per sector.
 */
export function SectorTrackingTable({
  riders,
  className,
  showRider = true,
  isDraggable = true,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: SectorTrackingTableProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const bests = computeSectorBests(riders);

  // Magic Bento interactive illumination & dynamic neon border
  useMagicBentoEffect(cardRef, {
    glowColor: '16, 185, 129',
    spotlightRadius: 360,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.08,
    glowAlpha: 0.9,
  });

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'sectors')}
      onDragOver={(e) => onDragOver?.(e, 'sectors')}
      onDragLeave={(e) => onDragLeave?.(e, 'sectors')}
      onDrop={(e) => onDrop?.(e, 'sectors')}
      onDragEnd={onDragEnd}
      className={cn(
        'rounded-2xl border transition-all duration-300 flex flex-col shadow-2xl select-none font-sans relative group overflow-hidden',
        isDragging
          ? 'opacity-40 border-dashed border-emerald-400 scale-[0.98]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40 bg-neutral-900/90'
          : 'border-neutral-800/90 bg-[#0B0D14] hover:border-neutral-700/90',
        className
      )}
    >
      {/* Magic Bento Internal Lighting DOM Layers */}
      <span className="magic-bento__light" aria-hidden="true" />
      <span className="magic-bento__rim" aria-hidden="true" />
      <span className="magic-bento__border" aria-hidden="true" />

      {/* Header with Drag Handle + Title + Game Icon */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition-colors flex items-center gap-1 group/handle"
              title="Drag frame to reorder in Bento grid"
            >
              <GripVertical className="w-4 h-4 text-neutral-400 group-hover/handle:text-emerald-400 transition-colors" />
              <LayoutGrid className="w-4 h-4 text-neutral-500 group-hover/handle:text-white transition-colors hidden sm:inline" />
            </div>
          )}
          <Timer className="w-5 h-5 text-white" />
          <h2 className="font-sans font-bold text-white text-sm sm:text-base tracking-tight">
            Sector Split Benchmarks &amp; Speed Traps
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full min-w-[420px] border-collapse text-left font-sans text-xs">
          <caption className="sr-only">
            Sector tracking: fastest and second fastest sector times per rider, colour-coded by
            session best.
          </caption>
          <thead>
            <tr className="border-b border-neutral-800/80 bg-neutral-950/90 text-xs font-sans font-bold uppercase tracking-wider text-neutral-400">
              {showRider && (
                <>
                  <th scope="col" className="w-12 px-3 py-2.5 text-center">
                    Pos
                  </th>
                  <th scope="col" className="min-w-[110px] px-3 py-2.5">
                    Rider
                  </th>
                  <th scope="col" className="w-12 px-2 py-2.5 text-center">
                    #
                  </th>
                </>
              )}
              <th scope="col" className="px-3 py-2.5 text-center">
                S1
              </th>
              <th scope="col" className="px-3 py-2.5 text-center">
                S2
              </th>
              <th scope="col" className="px-3 py-2.5 text-center">
                S3
              </th>
              <th scope="col" className="px-3 py-2.5 text-center">
                S4
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {riders.map((rider) => (
              <tr key={rider.rider_number} className="transition-colors hover:bg-neutral-900/60">
                {showRider && (
                  <>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-[3px] bg-white/[0.08] px-1 text-[11px] font-bold text-white tabular-nums">
                        {String(rider.pos).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[13px] font-semibold uppercase tracking-tight text-white">
                        {abbreviateRiderName(rider.rider_name, rider.rider_surname)}
                      </span>
                      {rider.on_pit && (
                        <span className="ml-1.5 font-sans text-[10px] font-bold text-amber-400">
                          P
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <DriverNumber
                        number={rider.rider_number}
                        color={rider.color}
                        size="sm"
                      />
                    </td>
                  </>
                )}
                {SECTOR_KEYS.map((key) => (
                  <td key={key} className="px-3 py-2 text-center">
                    <SectorCell value={rider[key]} best={bests[key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
