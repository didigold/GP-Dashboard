'use client';

import React, { useMemo, useRef } from 'react';
import { LiveTimingRider } from '@/lib/types/motogp';
import {
  ChevronUp,
  ChevronDown,
  GripVertical,
  Trophy,
  Clock,
  Flag,
  AlertTriangle,
} from 'lucide-react';
import { useMagicBentoEffect, MagicBentoGlow } from '@/components/ui/MagicBentoCard';

interface LiveLeaderboardWidgetProps {
  riders: LiveTimingRider[];
  selectedRiderNums: string[];
  onToggleSelectRider: (riderNum: string) => void;
  isWet?: boolean;
  sessionType?: string;
  elapsedSeconds?: number;
  totalLaps?: number;
  currentLap?: number;
  investigatedRiders?: string[];
  outRiders?: string[];
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

function readableText(hex?: string): string {
  if (!hex) return '#FFFFFF';
  const value = hex.replace('#', '').trim();
  if (value.length !== 6) return '#FFFFFF';
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if ([r, g, b].some((c) => Number.isNaN(c))) return '#FFFFFF';
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#0A0A0A' : '#FFFFFF';
}

function formatClock(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function LiveLeaderboardWidget({
  riders,
  selectedRiderNums,
  onToggleSelectRider,
  sessionType = 'RAC',
  elapsedSeconds = 0,
  totalLaps = 20,
  currentLap = 1,
  investigatedRiders = [],
  outRiders = [],
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

  const sortedRiders = useMemo(() => [...riders].sort((a, b) => a.pos - b.pos), [riders]);

  const isTimedSession = sessionType === 'FP' || sessionType === 'PR' || sessionType === 'Q' || sessionType === 'WUP';

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

      {/* HEADER: Drag grip + Title + Session-aware clock/lap counter */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 relative z-10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-0.5 text-neutral-500 hover:text-white transition-colors"
              title="Drag frame to reorder"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}
          <Trophy className="w-5 h-5 text-white shrink-0" />
          <h2 className="font-sans font-bold text-white text-xs sm:text-sm tracking-tight truncate">
            Leaderboard
          </h2>
        </div>

        {isTimedSession ? (
          <div className="flex items-center gap-1.5 text-white font-bold tabular-nums text-sm">
            <Clock className="w-4 h-4 text-white" />
            <span>{formatClock(elapsedSeconds)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-white font-bold tabular-nums text-sm">
            <Flag className="w-4 h-4 text-white" />
            <span>
              LAP {currentLap}
              <span className="text-neutral-500 text-xs">/{totalLaps}</span>
            </span>
          </div>
        )}
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#090A0E]/95 text-neutral-500 text-[10px] font-semibold uppercase tracking-wider sticky top-0 z-10">
              <th scope="col" className="py-1.5 px-2 w-8 text-center">
                POS
              </th>
              <th scope="col" className="py-1.5 px-2">
                RIDER
              </th>
              <th scope="col" className="py-1.5 px-2 text-right">
                GAP
              </th>
              <th scope="col" className="py-1.5 px-2 text-right">
                INT
              </th>
              <th scope="col" className="py-1.5 px-2.5 text-right">
                LAST
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {sortedRiders.map((rider, idx) => {
              const selIdx = selectedRiderNums.indexOf(rider.rider_number);
              const isSelected = selIdx !== -1;
              const isP1 = rider.pos === 1;
              const isPointsScorer = rider.pos <= 10;
              const isInvestigated = investigatedRiders.includes(rider.rider_number);
              const isOut = outRiders.includes(rider.rider_number);
              const shortName =
                rider.rider_shortname || rider.rider_surname.slice(0, 3).toUpperCase();

              const selectedBorderColor =
                selIdx === 1 ? 'border-l-[#00F5D4]' : 'border-l-[#E10600]';

              const deltaPos = idx === 0 ? 0 : idx % 2 === 0 ? 1 : -1;

              return (
                <tr
                  key={rider.rider_number}
                  onClick={() => onToggleSelectRider(rider.rider_number)}
                  className={`cursor-pointer transition-colors h-[36px] font-sans ${
                    isSelected
                      ? `bg-white/[0.08] border-l-4 ${selectedBorderColor}`
                      : 'hover:bg-white/[0.03]'
                  } ${isOut ? 'opacity-40' : ''}`}
                >
                  {/* Position */}
                  <td className="py-1 px-2 text-center">
                    <span
                      className={`text-xs font-extrabold tabular-nums ${
                        isPointsScorer ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {rider.pos}
                    </span>
                  </td>

                  {/* Rider: colored number plate + initial + code */}
                  <td className="py-1 px-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-6 h-4 rounded-[3px] font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                        style={{
                          backgroundColor: rider.color || '#E10600',
                          color: readableText(rider.color),
                        }}
                      >
                        {rider.rider_number}
                      </span>
                      <span className="font-bold text-white text-xs tracking-tight truncate">
                        {rider.rider_name.charAt(0)} {shortName}
                      </span>
                      {deltaPos !== 0 && !isOut && (
                        <span
                          className={`text-[10px] font-bold flex items-center shrink-0 ${
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
                      {isInvestigated && !isOut && (
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      )}
                      {isOut && (
                        <span className="text-[9px] font-black text-rose-400 shrink-0">OUT</span>
                      )}
                    </div>
                  </td>

                  {/* Gap to leader */}
                  <td className="py-1 px-2 text-right tabular-nums text-[11px] font-semibold">
                    {isP1 || isOut ? (
                      <span className="text-neutral-500">—</span>
                    ) : (
                      <span className="text-neutral-200">{rider.gap_first}</span>
                    )}
                  </td>

                  {/* Interval */}
                  <td className="py-1 px-2 text-right tabular-nums text-[11px] font-medium text-neutral-400">
                    {isP1 || isOut ? '—' : rider.gap_prev || '—'}
                  </td>

                  {/* Last lap */}
                  <td className="py-1 px-2.5 text-right tabular-nums text-[11px] font-bold">
                    <span className={isP1 ? 'text-purple-400' : 'text-white'}>
                      {rider.lap_time || '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BOTTOM ALERTS: retired / OUT riders */}
      {outRiders.length > 0 && (
        <div className="px-3 py-1.5 bg-[#090A0E]/80 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] shrink-0 relative z-10">
          {outRiders.map((num) => {
            const r = riders.find((rid) => rid.rider_number === num);
            if (!r) return null;
            const short = r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase();
            return (
              <span key={num} className="flex items-center gap-1 text-rose-400 font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>
                  {r.rider_name.charAt(0)} {short}
                </span>
                <span className="text-rose-500 font-black">OUT</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
