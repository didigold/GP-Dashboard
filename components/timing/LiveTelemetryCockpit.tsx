'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTimingRider } from '@/lib/types/motogp';
import { getRiderByNumber } from '@/lib/data/motogp-grid';
import { computeRiderLiveKinematics, RiderKinematicTelemetry } from '@/lib/utils/rider-kinematics';
import { X, GripVertical, Play, Pause } from 'lucide-react';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import { useMagicBentoEffect, MagicBentoGlow } from '@/components/ui/MagicBentoCard';
import {
  GiSpeedometer,
  GiStopwatch,
  GiCarWheel,
  GiCrossedSwords,
} from 'react-icons/gi';

interface LiveTelemetryCockpitProps {
  selectedRiders: LiveTimingRider[];
  allRiders?: LiveTimingRider[];
  onDeselectRider: (riderNum: string) => void;
  onQuickCompareTop2?: () => void;
  elapsedSeconds?: number;
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

/**
 * Circular MotoGP Broadcast Telemetry Gauge (Inspired by Image 3 & Image 5)
 * Displays Instantaneous Speed (km/h), RPM, Gear (1-6), Lean Angle (°), and Throttle/Brake arcs.
 */
function CircularTelemetryGauge({
  rider,
  kinematics,
  accentColor,
  compact = false,
}: {
  rider: LiveTimingRider;
  kinematics: RiderKinematicTelemetry;
  accentColor: string;
  compact?: boolean;
}) {
  const shortCode = rider.rider_shortname || rider.rider_surname.slice(0, 3).toUpperCase();
  const size = compact ? 118 : 126;
  const stroke = compact ? 7 : 8;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  // Throttle arc (left/top) & speed fill (up to 355 km/h)
  const speedPct = Math.min(1, Math.max(0.12, kinematics.speedKmh / 355));
  const arcLength = circumference * 0.75; // 270 degree gauge
  const speedDash = arcLength * speedPct;

  return (
    <div className="flex flex-col items-center">
      {compact && (
        <span
          className="font-black text-xs tracking-wider uppercase mb-1"
          style={{ color: accentColor }}
        >
          {shortCode}
        </span>
      )}

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[135deg]">
          {/* Background 270-deg track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active Speed / Throttle / Braking Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={kinematics.isBraking ? '#EF4444' : accentColor}
            strokeWidth={stroke}
            strokeDasharray={`${speedDash} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>

        {/* Center Readouts: Speed, RPM, Lean Angle, Gear */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none tracking-tight">
            {kinematics.speedKmh}
          </span>
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">
            KM/H
          </span>

          <div className="mt-1 flex items-center gap-1 text-[10px] font-extrabold tabular-nums">
            <span className="text-neutral-300">{kinematics.rpm}</span>
            <span className="text-[8px] text-neutral-500">RPM</span>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold">
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-white">
              G{kinematics.gear}
            </span>
            <span className="text-amber-400 tabular-nums">
              {kinematics.leanAngleDeg}°{kinematics.leanDirection !== 'C' ? kinematics.leanDirection : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Micro Throttle vs Brake Bar underneath */}
      <div className="w-full max-w-[116px] grid grid-cols-2 gap-1.5 mt-1 text-[9px] font-bold uppercase text-neutral-400">
        <div>
          <div className="flex justify-between mb-0.5">
            <span>THR</span>
            <span className="text-emerald-400 tabular-nums">{kinematics.throttlePct}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-150"
              style={{ width: `${kinematics.throttlePct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-0.5">
            <span>BRK</span>
            <span className="text-rose-400 tabular-nums">{kinematics.brakePct}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-150"
              style={{ width: `${kinematics.brakePct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LiveTelemetryCockpit({
  selectedRiders,
  onDeselectRider,
  onQuickCompareTop2,
  elapsedSeconds = 2294,
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
}: LiveTelemetryCockpitProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [singleSlideIdx, setSingleSlideIdx] = useState<number>(0);
  const [autoCycle, setAutoCycle] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useMagicBentoEffect(cardRef, {
    glowColor: '0, 245, 212',
    spotlightRadius: 340,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.07,
    glowAlpha: 0.85,
  });

  // Auto-cycle single rider slides every 7 seconds
  useEffect(() => {
    if (!autoCycle || isHovered || selectedRiders.length !== 1) return;
    const timer = setInterval(() => {
      setSingleSlideIdx((prev) => (prev + 1) % 2);
    }, 7000);
    return () => clearInterval(timer);
  }, [autoCycle, isHovered, selectedRiders.length]);

  // 0 RIDERS SELECTED: Clean Empty State with Quick Compare CTA
  if (!selectedRiders || selectedRiders.length === 0) {
    return (
      <div
        ref={cardRef}
        className={`rounded-2xl border border-white/[0.08] bg-[#0D0D0E]/90 overflow-hidden shadow-2xl select-none font-sans flex flex-col justify-between relative ${className}`}
      >
        <MagicBentoGlow />
        <div className="px-3.5 py-2.5 border-b border-white/[0.08] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <GiSpeedometer className="w-4 h-4 text-[#00F5D4]" />
            <h2 className="font-sans font-bold text-white text-xs sm:text-sm tracking-tight">
              Telemetry &amp; Comparison
            </h2>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
          <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400">
            <GiSpeedometer className="w-5 h-5 text-neutral-300" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-white text-sm">No Riders Selected</h3>
            <p className="font-sans text-xs text-neutral-400 max-w-[230px] leading-relaxed">
              Select 1 rider for live telemetry or 2 riders from the leaderboard for head-to-head battle mode.
            </p>
          </div>
          {onQuickCompareTop2 && (
            <button
              type="button"
              onClick={onQuickCompareTop2}
              className="h-8 px-4 rounded-full liquid-glass-btn text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <GiCrossedSwords className="w-3.5 h-3.5 text-[#E10600]" />
              <span>Compare Top 2 Battle</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const isDualMode = selectedRiders.length >= 2;
  const primaryRider = selectedRiders[0];
  const secondaryRider = isDualMode ? selectedRiders[1] : null;

  const kinA = computeRiderLiveKinematics(primaryRider, elapsedSeconds, isWet);
  const kinB = secondaryRider
    ? computeRiderLiveKinematics(secondaryRider, elapsedSeconds, isWet)
    : null;

  const gridPrimary = getRiderByNumber(primaryRider.rider_number);
  const primaryConstructor = gridPrimary?.constructor_name || 'Ducati';

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'telemetry')}
      onDragOver={(e) => onDragOver?.(e, 'telemetry')}
      onDragLeave={(e) => onDragLeave?.(e, 'telemetry')}
      onDrop={(e) => onDrop?.(e, 'telemetry')}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-2xl select-none font-sans relative overflow-hidden bg-[#0D0D0E]/90 ${
        isDragging
          ? 'opacity-40 border-dashed border-[#00F5D4] scale-[0.98]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      } ${className}`}
    >
      <MagicBentoGlow />

      {/* HEADER: Title + Selected Rider Pills (LEC x vs VER x style from Image 5) */}
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
          <GiSpeedometer className="w-4 h-4 text-[#00F5D4] shrink-0" />
          <h2 className="font-sans font-bold text-white text-xs sm:text-sm tracking-tight truncate">
            {isDualMode ? 'Head-to-Head Telemetry' : 'Live Rider Telemetry'}
          </h2>
        </div>

        {/* Selected Rider Tag Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {selectedRiders.map((r, idx) => {
            const code = r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase();
            const pillColor =
              idx === 1 && r.color === primaryRider.color ? '#38BDF8' : r.color || '#E10600';
            return (
              <React.Fragment key={r.rider_number}>
                {idx === 1 && (
                  <span className="text-[10px] font-bold text-neutral-400">vs</span>
                )}
                <span
                  className="h-7 px-2.5 rounded-full bg-black/70 border text-[11px] font-extrabold text-white inline-flex items-center gap-1"
                  style={{ borderColor: `${pillColor}80` }}
                >
                  <span style={{ color: pillColor }}>{code}</span>
                  <button
                    type="button"
                    onClick={() => onDeselectRider(r.rider_number)}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={`Deselect #${r.rider_number}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </React.Fragment>
            );
          })}

          {!isDualMode && onQuickCompareTop2 && (
            <button
              type="button"
              onClick={onQuickCompareTop2}
              className="h-7 px-2.5 rounded-full liquid-glass-pill text-[10px] font-bold text-neutral-200 hover:text-white flex items-center gap-1 cursor-pointer"
              title="Select P1 vs P2 for real-time dual battle comparison"
            >
              <GiCrossedSwords className="w-3 h-3 text-[#E10600]" />
              <span>2-Way</span>
            </button>
          )}
        </div>
      </div>

      {/* BODY: DUAL COMPARISON MODE (Image 5) OR SINGLE-RIDER CAROUSEL */}
      <div className="relative z-10 flex-1 min-h-0 px-3.5 py-2.5 flex flex-col justify-between overflow-hidden">
        {isDualMode && secondaryRider && kinB ? (
          /* 2-DRIVER SIDE-BY-SIDE DUAL GAUGES + RADAR SPEED & SECTOR DELTAS */
          <div className="flex flex-col justify-between h-full gap-2">
            <div className="flex items-center justify-around gap-1 my-auto">
              <CircularTelemetryGauge
                rider={primaryRider}
                kinematics={kinA}
                accentColor={primaryRider.color || '#EF4444'}
                compact={true}
              />

              <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] font-black text-neutral-300 shrink-0">
                VS
              </div>

              <CircularTelemetryGauge
                rider={secondaryRider}
                kinematics={kinB}
                accentColor={
                  secondaryRider.color === primaryRider.color
                    ? '#38BDF8'
                    : secondaryRider.color || '#38BDF8'
                }
                compact={true}
              />
            </div>

            {/* Bottom Comparison Metrics Strip */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/[0.08] text-center text-[11px]">
              <div className="bg-white/[0.03] px-2 py-1.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] font-bold uppercase text-neutral-400 block">
                  Speed Trap Δ
                </span>
                <span className="font-black text-white tabular-nums text-xs">
                  {((primaryRider.speed || 342.8) - (secondaryRider.speed || 344.2) > 0 ? '+' : '')}
                  {((primaryRider.speed || 342.8) - (secondaryRider.speed || 344.2)).toFixed(1)}{' '}
                  <span className="text-[9px] text-neutral-400">km/h</span>
                </span>
              </div>

              <div className="bg-white/[0.03] px-2 py-1.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] font-bold uppercase text-neutral-400 block">
                  Lean Angle
                </span>
                <span className="font-black text-amber-400 tabular-nums text-xs">
                  {kinA.leanAngleDeg}° vs {kinB.leanAngleDeg}°
                </span>
              </div>

              <div className="bg-white/[0.03] px-2 py-1.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] font-bold uppercase text-neutral-400 block">
                  Michelin R
                </span>
                <span className="font-black text-emerald-400 text-xs">
                  {(primaryRider.tyre_rear || 'M').charAt(0)} vs{' '}
                  {(secondaryRider.tyre_rear || 'M').charAt(0)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* SINGLE RIDER TELEMETRY WITH 2-SLIDE DYNAMIC CAROUSEL */
          <div className="flex flex-col justify-between h-full">
            {/* Rider Identity Header Strip */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5 min-w-0">
                <ConstructorLogo constructor={primaryConstructor} className="w-4 h-4 object-contain shrink-0" />
                <div className="truncate">
                  <span className="font-extrabold text-white text-xs sm:text-sm block truncate">
                    #{primaryRider.rider_number} {primaryRider.rider_name}{' '}
                    {primaryRider.rider_surname}
                  </span>
                  <span className="text-[11px] text-neutral-400 block truncate">
                    {primaryRider.team_name}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/10 font-black text-xs text-[#E10600] shrink-0">
                P{primaryRider.pos}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {singleSlideIdx === 0 ? (
                /* SLIDE 0: LIVE CIRCULAR TELEMETRY DIAL + RADAR SPEED TRAP */
                <motion.div
                  key="single-dial"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-12 gap-3 items-center my-auto py-1"
                >
                  <div className="col-span-6 flex justify-center">
                    <CircularTelemetryGauge
                      rider={primaryRider}
                      kinematics={kinA}
                      accentColor={primaryRider.color || '#E10600'}
                      compact={false}
                    />
                  </div>

                  <div className="col-span-6 space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Radar Speed Trap
                      </span>
                      <span className="text-lg font-black text-white tabular-nums">
                        {(primaryRider.speed || 342.8).toFixed(1)}{' '}
                        <span className="text-[10px] font-normal text-neutral-400">km/h</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Best Lap
                      </span>
                      <span className="text-sm font-black text-emerald-400 tabular-nums">
                        {primaryRider.lap_time || "1'57.100"}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 font-semibold">Tyres</span>
                      <span className="font-bold text-white">
                        {isWet
                          ? 'Wet / Wet'
                          : `${primaryRider.tyre_front || 'Hard'} / ${primaryRider.tyre_rear || 'Med'}`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* SLIDE 1: TRANSPONDER SECTORS T1-T4 + CIRCUIT BENCHMARKS */
                <motion.div
                  key="single-sectors"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5 my-auto py-1"
                >
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {(['t1', 't2', 't3', 't4'] as const).map((secKey, i) => {
                      const isActiveSec = kinA.sector === i + 1;
                      return (
                        <div
                          key={secKey}
                          className={`p-2 rounded-xl border ${
                            isActiveSec
                              ? 'bg-[#E10600]/20 border-[#E10600] text-white'
                              : 'bg-white/[0.04] border-white/[0.08] text-neutral-200'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                            T{i + 1}
                          </span>
                          <span className="text-xs font-black text-white tabular-nums mt-0.5 block">
                            {primaryRider[secKey] || (28.25 - i * 1.4).toFixed(3)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Gap to Leader</span>
                      <span className="font-bold text-white tabular-nums">
                        {primaryRider.pos === 1 ? 'LEADER' : primaryRider.gap_first}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">All-Time Lap Record</span>
                      <span className="font-bold text-neutral-200 tabular-nums">
                        1&apos;56.337 (Bagnaia)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Top Speed Record</span>
                      <span className="font-bold text-[#E10600] tabular-nums">
                        362.8 km/h (Acosta)
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Dots for Single-Rider Telemetry Carousel */}
            <div className="pt-1.5 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[0, 1].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSingleSlideIdx(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      singleSlideIdx === idx ? 'w-6 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAutoCycle(!autoCycle)}
                className="text-[10px] font-bold text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {autoCycle ? <Pause className="w-2.5 h-2.5 text-[#00F5D4]" /> : <Play className="w-2.5 h-2.5" />}
                <span>{singleSlideIdx === 0 ? 'Live Gauge' : 'Sector Splits'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
