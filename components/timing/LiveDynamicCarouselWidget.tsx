'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTimingRider } from '@/lib/types/motogp';
import { getRiderByNumber } from '@/lib/data/motogp-grid';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import { useMagicBentoEffect, MagicBentoGlow } from '@/components/ui/MagicBentoCard';
import { computeSectorBests, SectorCell, SECTOR_KEYS } from './SectorTrackingTable';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Play,
  Pause,
  Trophy,
  Gauge,
  Disc,
  Flag,
} from 'lucide-react';

export interface StandingItem {
  position: number;
  riderNumber?: number;
  riderName?: string;
  countryIso?: string;
  teamName?: string;
  constructorName?: string;
  points: number;
}

interface LiveDynamicCarouselWidgetProps {
  standings?: StandingItem[];
  riders: LiveTimingRider[];
  selectedRiderNums: string[];
  onSelectRider: (riderNum: string) => void;
  isWet?: boolean;
  trackStatus?: string;
  currentLap?: number;
  totalLaps?: number;
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

const MOTOGP_RACE_POINTS = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

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
];

const OFFICIAL_2026_TEAMS = [
  { position: 1, teamName: 'Aprilia Racing', constructorName: 'Aprilia', points: 687, liveGain: 29 },
  { position: 2, teamName: 'Ducati Lenovo Team', constructorName: 'Ducati', points: 572, liveGain: 28 },
  { position: 3, teamName: 'SuperFile Trackhouse Team', constructorName: 'Aprilia', points: 514, liveGain: 13 },
  { position: 4, teamName: 'Red Bull KTM Factory Racing', constructorName: 'KTM', points: 449, liveGain: 27 },
  { position: 5, teamName: 'Pertamina Enduro VR46', constructorName: 'Ducati', points: 265, liveGain: 14 },
  { position: 6, teamName: 'BK8 Gresini Racing MotoGP', constructorName: 'Ducati', points: 251, liveGain: 16 },
];

const SLIDE_META = [
  { id: 'championship', title: 'Live Championship', icon: Trophy, accent: '#EAB308' },
  { id: 'speed-sectors', title: 'Speed Trap & Sectors', icon: Gauge, accent: '#E10600' },
  { id: 'tyre-stints', title: 'Michelin Tyre Stints', icon: Disc, accent: '#00F5D4' },
  { id: 'team-comms', title: 'Team Comms & Steward', icon: Flag, accent: '#38BDF8' },
] as const;

export function LiveDynamicCarouselWidget({
  standings,
  riders,
  selectedRiderNums,
  onSelectRider,
  isWet = false,
  trackStatus = 'CLEAR',
  currentLap = 16,
  totalLaps = 20,
  className = '',
  isDraggable = true,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: LiveDynamicCarouselWidgetProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [champTab, setChampTab] = useState<'drivers' | 'teams'>('drivers');
  const [speedTab, setSpeedTab] = useState<'speed' | 'sectors'>('speed');

  useMagicBentoEffect(cardRef, {
    glowColor: '225, 6, 0',
    spotlightRadius: 340,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.07,
    glowAlpha: 0.85,
  });

  // Auto-advance carousel every 8 seconds when autoRotate is enabled and not hovered
  useEffect(() => {
    if (!autoRotate || isHovered) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDE_META.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [autoRotate, isHovered]);

  // Compute live championship standings with live race points gain
  const liveDriversStandings = useMemo(() => {
    const base = standings && standings.length > 0 ? standings : OFFICIAL_2026_DRIVERS;
    return base.slice(0, 7).map((item, idx) => {
      const liveRider = riders.find((r) => r.rider_number === String(item.riderNumber));
      const racePos = liveRider ? liveRider.pos : idx + 1;
      const gainedPoints = racePos >= 1 && racePos <= 15 ? MOTOGP_RACE_POINTS[racePos - 1] : 0;
      const rankDelta = idx === 1 ? 1 : idx === 2 ? -1 : 0;
      return {
        ...item,
        gainedPoints,
        totalLivePoints: item.points + gainedPoints,
        rankDelta,
      };
    });
  }, [standings, riders]);

  // Sort riders by top speed for the MotoGP Broadcast Top Speed Tower (Image 4 Left Tower)
  const topSpeedRiders = useMemo(() => {
    return [...riders]
      .sort((a, b) => (b.speed || 340) - (a.speed || 340))
      .slice(0, 7);
  }, [riders]);

  const sectorBests = useMemo(() => computeSectorBests(riders), [riders]);

  const activeSlide = SLIDE_META[slideIndex];
  const SlideIcon = activeSlide.icon;

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'championship')}
      onDragOver={(e) => onDragOver?.(e, 'championship')}
      onDragLeave={(e) => onDragLeave?.(e, 'championship')}
      onDrop={(e) => onDrop?.(e, 'championship')}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-2xl select-none font-sans relative overflow-hidden bg-[#0D0D0E]/90 ${
        isDragging
          ? 'opacity-40 border-dashed border-[#E10600] scale-[0.98]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      } ${className}`}
    >
      <MagicBentoGlow />

      {/* TOP HEADER: Active Slide Title + Auto-Rotate Switch / Sub-controls */}
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
          <SlideIcon className="w-5 h-5 shrink-0 text-white" />
          <h2 className="font-sans font-bold text-white text-xs sm:text-sm tracking-tight truncate">
            {activeSlide.title}
          </h2>
        </div>

        {/* Right Controls: Slide-specific pill + Auto-Carousel Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {slideIndex === 0 && (
            <div className="h-7 p-0.5 inline-flex items-center rounded-full liquid-glass-pill text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setChampTab('drivers')}
                className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                  champTab === 'drivers' ? 'bg-white text-black font-bold shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Drivers
              </button>
              <button
                type="button"
                onClick={() => setChampTab('teams')}
                className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                  champTab === 'teams' ? 'bg-white text-black font-bold shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Teams
              </button>
            </div>
          )}

          {slideIndex === 1 && (
            <div className="h-7 p-0.5 inline-flex items-center rounded-full liquid-glass-pill text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setSpeedTab('speed')}
                className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                  speedTab === 'speed' ? 'bg-white text-black font-bold shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Top Speed
              </button>
              <button
                type="button"
                onClick={() => setSpeedTab('sectors')}
                className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                  speedTab === 'sectors' ? 'bg-white text-black font-bold shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Sectors
              </button>
            </div>
          )}

          {/* Auto-Rotate Switch Pill */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`h-7 px-2.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              autoRotate
                ? 'liquid-glass-pill text-white border-white/30'
                : 'bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Toggle automatic frame rotation (8s)"
          >
            {autoRotate ? (
              <Pause className="w-2.5 h-2.5 text-[#00F5D4] fill-[#00F5D4]" />
            ) : (
              <Play className="w-2.5 h-2.5 text-neutral-400" />
            )}
            <span>AUTO</span>
          </button>
        </div>
      </div>

      {/* SLIDE CONTENT VIEWPORT (No scroll needed; clean fixed-height rows) */}
      <div className="relative z-10 flex-1 min-h-0 px-3 py-2 flex flex-col justify-between overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {slideIndex === 0 && (
            /* SLIDE 0: LIVE CHAMPIONSHIP (With +PTS Gain Pills & Rank Arrows like F1 Image 5) */
            <motion.div
              key={`champ-${champTab}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 my-auto"
            >
              {champTab === 'drivers'
                ? liveDriversStandings.map((d) => {
                    const isSelected = selectedRiderNums.includes(String(d.riderNumber));
                    const gridRider = d.riderNumber ? getRiderByNumber(String(d.riderNumber)) : undefined;
                    const constructor = d.constructorName || gridRider?.constructor_name || 'Ducati';
                    const surname = d.riderName?.split(' ').pop() || 'Rider';

                    return (
                      <div
                        key={d.position}
                        onClick={() => d.riderNumber && onSelectRider(String(d.riderNumber))}
                        className={`h-8 px-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors text-xs ${
                          isSelected
                            ? 'bg-white/[0.12] border border-white/20 text-white'
                            : 'hover:bg-white/[0.05] text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-4 text-center font-bold text-neutral-400 tabular-nums">
                            {d.position}
                          </span>
                          <ConstructorLogo constructor={constructor} className="w-3.5 h-3.5 object-contain shrink-0" />
                          <span className="font-bold text-white truncate">{surname}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 tabular-nums">
                          {d.gainedPoints > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                              +{d.gainedPoints}
                            </span>
                          )}
                          <span className="font-extrabold text-white text-xs w-8 text-right">
                            {d.totalLivePoints}
                          </span>
                          <span className="w-5 flex items-center justify-end text-[10px] font-bold">
                            {d.rankDelta > 0 ? (
                              <span className="text-emerald-400 flex items-center">
                                <ChevronUp className="w-3 h-3" />
                                {d.rankDelta}
                              </span>
                            ) : d.rankDelta < 0 ? (
                              <span className="text-rose-400 flex items-center">
                                <ChevronDown className="w-3 h-3" />
                                {Math.abs(d.rankDelta)}
                              </span>
                            ) : (
                              <span className="text-neutral-600">—</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                : OFFICIAL_2026_TEAMS.map((t) => (
                    <div
                      key={t.position}
                      className="h-8 px-2.5 rounded-xl flex items-center justify-between hover:bg-white/[0.05] transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-4 text-center font-bold text-neutral-400 tabular-nums">
                          {t.position}
                        </span>
                        <ConstructorLogo constructor={t.constructorName} className="w-3.5 h-3.5 object-contain shrink-0" />
                        <span className="font-bold text-white truncate">{t.teamName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 tabular-nums">
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          +{t.liveGain}
                        </span>
                        <span className="font-extrabold text-white text-xs">
                          {t.points + t.liveGain}
                        </span>
                      </div>
                    </div>
                  ))}
            </motion.div>
          )}

          {slideIndex === 1 && (
            /* SLIDE 1: MOTOGP BROADCAST TOP SPEED TOWER (Image 4) OR SECTOR SPLITS */
            <motion.div
              key={`speed-${speedTab}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 my-auto"
            >
              {speedTab === 'speed' ? (
                topSpeedRiders.map((r, idx) => {
                  const speedVal = r.speed || 342.8;
                  const barPct = Math.min(100, Math.max(35, ((speedVal - 330) / 18) * 100));
                  const isRecord = idx === 0;
                  return (
                    <div
                      key={r.rider_number}
                      onClick={() => onSelectRider(r.rider_number)}
                      className="h-8 px-2 rounded-xl flex items-center justify-between gap-2 hover:bg-white/[0.05] cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-[105px]">
                        <span className="w-4 text-center font-bold text-neutral-400 tabular-nums">
                          {idx + 1}
                        </span>
                        {/* Sharp square team number badge matching Overview DriverStandingsTop5 */}
                        <span
                          className="w-5 h-5 rounded-none font-black text-[10px] text-white flex items-center justify-center shrink-0"
                          style={{ backgroundColor: r.color || '#E10600' }}
                        >
                          {r.rider_number}
                        </span>
                        <span className="font-bold text-white truncate">
                          {r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isRecord ? 'bg-[#E10600]' : 'bg-white/40'
                          }`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>

                      <span
                        className={`font-black tabular-nums text-xs px-1.5 py-0.5 rounded ${
                          isRecord ? 'bg-[#E10600] text-white' : 'text-white'
                        }`}
                      >
                        {speedVal.toFixed(1)}
                      </span>
                    </div>
                  );
                })
              ) : (
                riders.slice(0, 6).map((r) => (
                  <div
                    key={r.rider_number}
                    onClick={() => onSelectRider(r.rider_number)}
                    className="h-8 px-1.5 rounded-xl flex items-center justify-between gap-1 hover:bg-white/[0.05] cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-[68px]">
                      <span
                        className="w-5 h-5 rounded-none font-black text-[10px] text-white flex items-center justify-center shrink-0"
                        style={{ backgroundColor: r.color || '#E10600' }}
                      >
                        {r.rider_number}
                      </span>
                      <span className="font-bold text-white text-[11px]">
                        {r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 flex-1">
                      {SECTOR_KEYS.map((k) => (
                        <SectorCell
                          key={k}
                          value={r[k]}
                          best={sectorBests[k]}
                          className="min-w-0 px-1 py-0.5 text-[10px]"
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {slideIndex === 2 && (
            /* SLIDE 2: MICHELIN ASYMMETRIC TYRE STINTS & DEGRADATION */
            <motion.div
              key="tyre-stints"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5 my-auto"
            >
              <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 pb-0.5">
                <div className="col-span-4">Rider</div>
                <div className="col-span-4 text-center">Front / Rear</div>
                <div className="col-span-2 text-center">Age</div>
                <div className="col-span-2 text-right">Life</div>
              </div>
              {riders.slice(0, 6).map((r, idx) => {
                const front = isWet ? 'Wet-S' : r.tyre_front || 'Hard';
                const rear = isWet ? 'Wet-M' : r.tyre_rear || (idx % 2 === 0 ? 'Medium' : 'Soft');
                const stintLaps = currentLap;
                const lifePct = Math.max(24, 92 - stintLaps * (rear === 'Soft' ? 3.4 : 2.3));

                return (
                  <div
                    key={r.rider_number}
                    onClick={() => onSelectRider(r.rider_number)}
                    className="h-8 px-2 rounded-xl grid grid-cols-12 items-center hover:bg-white/[0.05] cursor-pointer text-xs"
                  >
                    <div className="col-span-4 flex items-center gap-2 min-w-0">
                      <span
                        className="w-5 h-5 rounded-none font-black text-[10px] text-white flex items-center justify-center shrink-0"
                        style={{ backgroundColor: r.color || '#E10600' }}
                      >
                        {r.rider_number}
                      </span>
                      <span className="font-bold text-white truncate">
                        {r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase()}
                      </span>
                    </div>

                    <div className="col-span-4 flex items-center justify-center gap-1.5 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/15 text-white">
                        F: {front.charAt(0)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full border ${
                          rear.startsWith('Wet')
                            ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                            : rear === 'Soft'
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        R: {rear.charAt(0)}
                      </span>
                    </div>

                    <div className="col-span-2 text-center font-semibold text-neutral-300 tabular-nums">
                      {stintLaps}L
                    </div>

                    <div className="col-span-2 text-right font-extrabold text-emerald-400 tabular-nums">
                      {Math.round(lifePct)}%
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {slideIndex === 3 && (
            /* SLIDE 3: TEAM COMMUNICATION & RACE DIRECTION FEED (Broadcast Image 4 Right Card) */
            <motion.div
              key="team-comms"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 my-auto"
            >
              {/* Featured Dorna Broadcast Team Communication Box (Image 4 Style) */}
              <div className="p-2.5 rounded-xl bg-black/60 border-l-4 border-[#E10600] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    TEAM COMMUNICATION · DASHBOARD MSG
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#E10600] text-white font-black text-[10px]">
                    #{riders[0]?.rider_number || '93'}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-white">
                  {riders[0]?.rider_name?.[0]}. {riders[0]?.rider_surname || 'Marquez'}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-bold text-neutral-200 bg-white/[0.04] p-2 rounded-lg">
                  <div>• P1 LEADER</div>
                  <div>• BEHIND #{riders[1]?.rider_number || '37'}</div>
                  <div>• GAP {riders[1]?.gap_first || '+0.505s'}</div>
                  <div>• {Math.max(1, totalLaps - currentLap)} LAPS TO GO</div>
                </div>
              </div>

              {/* Race Direction Live Notices */}
              <div className="space-y-1.5 text-xs">
                <div className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-neutral-300 font-medium truncate">
                    {isWet
                      ? 'Race Direction: White Cross Flag — Bike Swap Permitted'
                      : trackStatus === 'YELLOW'
                      ? 'Sector 1 Yellow Flag — Turn 4 Gravel Runoff'
                      : 'Track Limits Warning — #37 P. Acosta (Turn 15)'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 shrink-0 ml-2">
                    L{currentLap}
                  </span>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-neutral-300 font-medium truncate">
                    Official Speed Trap Peak — #37 Acosta (344.2 km/h)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 shrink-0 ml-2">
                    REC
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM CAROUSEL FOOTER: Dot Indicators + Manual Step Arrows */}
      <div className="px-3.5 py-2 border-t border-white/[0.06] flex items-center justify-between relative z-10 shrink-0">
        {/* Indicator Dots matching CircuitHistoryCarousel.tsx */}
        <div className="flex items-center gap-1.5">
          {SLIDE_META.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSlideIndex(idx)}
              aria-label={`Show ${s.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === slideIndex ? 'w-6 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setSlideIndex((prev) => (prev - 1 + SLIDE_META.length) % SLIDE_META.length)
            }
            className="w-6 h-6 liquid-glass-circle text-neutral-300 hover:text-white cursor-pointer"
            title="Previous frame"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSlideIndex((prev) => (prev + 1) % SLIDE_META.length)}
            className="w-6 h-6 liquid-glass-circle text-neutral-300 hover:text-white cursor-pointer"
            title="Next frame"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
