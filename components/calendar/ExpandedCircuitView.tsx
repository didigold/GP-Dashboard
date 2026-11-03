'use client';

import React, { useState } from 'react';
import { CircuitInfo, CHAMPIONSHIP_ROUNDS_2026, getCircuitImageUrl } from '@/lib/data/circuits-data';
import { CountryFlag } from './CircuitCard';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Compass,
  Zap,
  Gauge,
  Flag,
  Globe,
  Crosshair,
  SlidersHorizontal,
} from 'lucide-react';
import { GiTrophy } from 'react-icons/gi';

interface ExpandedCircuitViewProps {
  circuit: CircuitInfo;
  onCollapse: () => void;
  onSelectCircuit: (circuit: CircuitInfo) => void;
  onFocusTrackZoom?: () => void;
  onViewGlobe?: () => void;
  onOpenModal?: (circuit: CircuitInfo) => void;
}

export function ExpandedCircuitView({
  circuit,
  onCollapse,
  onSelectCircuit,
  onFocusTrackZoom,
  onViewGlobe,
  onOpenModal,
}: ExpandedCircuitViewProps) {
  const [imgError, setImgError] = useState(false);
  const bgImage = imgError ? '/images/circuits/round-01-thailand.jpg' : getCircuitImageUrl(circuit);
  const isLive = circuit.status === 'CURRENT';
  const isFinished = circuit.status === 'FINISHED';

  const currentIndex = CHAMPIONSHIP_ROUNDS_2026.findIndex((c) => c.id === circuit.id);
  const prevCircuit = currentIndex > 0 ? CHAMPIONSHIP_ROUNDS_2026[currentIndex - 1] : null;
  const nextCircuit =
    currentIndex < CHAMPIONSHIP_ROUNDS_2026.length - 1
      ? CHAMPIONSHIP_ROUNDS_2026[currentIndex + 1]
      : null;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#070913] text-white p-4 sm:p-5 space-y-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent] select-none">
      {/* 1. TOP NAVIGATION / COLLAPSE BAR */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        {/* Back Button */}
        <button
          onClick={onCollapse}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-sans font-semibold text-white transition-colors border border-white/10 group"
          title="Collapse and show all calendar rounds"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#E10600] group-hover:-translate-x-0.5 transition-transform" />
          <span>All Circuits</span>
        </button>

        {/* Round Stepper: Prev · Round X of 22 · Next */}
        <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-lg p-1 text-xs">
          <button
            onClick={() => prevCircuit && onSelectCircuit(prevCircuit)}
            disabled={!prevCircuit}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${
              !prevCircuit ? 'opacity-30 cursor-not-allowed' : 'text-white'
            }`}
            title={prevCircuit ? `Previous: R${prevCircuit.round_number} ${prevCircuit.country}` : ''}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-[11px] px-2 text-neutral-300">
            Round <strong className="text-white">{circuit.round_number}</strong> / {CHAMPIONSHIP_ROUNDS_2026.length}
          </span>

          <button
            onClick={() => nextCircuit && onSelectCircuit(nextCircuit)}
            disabled={!nextCircuit}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${
              !nextCircuit ? 'opacity-30 cursor-not-allowed' : 'text-white'
            }`}
            title={nextCircuit ? `Next: R${nextCircuit.round_number} ${nextCircuit.country}` : ''}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Minimize Icon */}
        <button
          onClick={onCollapse}
          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-400 hover:text-white border border-white/10 transition-colors"
          title="Collapse to card list"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. HERO CARD WITH AUTHENTIC CIRCUIT PHOTO */}
      <div className="relative rounded-2xl overflow-hidden border border-white/15 p-4 sm:p-5 shadow-2xl">
        {/* Background Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        {/* Darkening Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/85 to-[#070913]/60" />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Header Row: Flag + Status + Round */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CountryFlag iso={circuit.country_code} country={circuit.country} className="w-7 h-5" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E10600]">
                Round {circuit.round_number}
              </span>
            </div>

            {/* Status Ribbon */}
            {isFinished ? (
              <div
                className="px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-200 bg-black/85 border border-white/15"
                style={{ clipPath: 'polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              >
                FINISHED
              </div>
            ) : isLive ? (
              <div
                className="px-3 py-1 text-[10px] font-mono font-black tracking-widest uppercase text-white bg-[#E10600] shadow-[0_0_12px_rgba(225,6,0,0.8)] flex items-center gap-1.5"
                style={{ clipPath: 'polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>UP NEXT</span>
              </div>
            ) : (
              <div
                className="px-3 py-1 text-[10px] font-mono font-medium tracking-wider uppercase text-neutral-400 bg-white/[0.08] border border-white/10"
                style={{ clipPath: 'polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              >
                UPCOMING
              </div>
            )}
          </div>

          {/* Circuit Title & Official Name */}
          <div>
            <h2 className="text-xl sm:text-2xl font-sans font-black text-white tracking-tight leading-tight">
              {circuit.name}
            </h2>
            <div className="text-xs font-mono text-neutral-300 uppercase tracking-wider mt-0.5">
              {circuit.official_name}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 mt-2 font-sans">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
                <span>
                  {circuit.city ? `${circuit.city}, ` : ''}
                  {circuit.country}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{circuit.dates}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TRACK SVG VECTOR OUTLINE & DIRECTION */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E101D] p-4 relative overflow-hidden group">
        <div className="flex items-center justify-between pb-2 text-xs font-mono text-neutral-400">
          <span className="uppercase tracking-wider font-bold text-white">Circuit Layout</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px]">
            <Compass className="w-3 h-3 text-[#E10600]" />
            <span>{circuit.direction}</span>
          </div>
        </div>

        <div className="h-44 w-full bg-black/50 rounded-xl p-3 flex items-center justify-center relative">
          <svg viewBox="0 0 500 500" className="w-full h-full max-h-36 filter drop-shadow-lg">
            <path
              d={circuit.svg_path}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Turn indicators */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[10px] font-mono text-neutral-400 bg-black/75 px-2 py-0.5 rounded border border-white/10">
            <span>{circuit.corners} Turns</span>
            <span>·</span>
            <span className="text-cyan-400">{circuit.corners_left}L</span>
            <span>·</span>
            <span className="text-amber-400">{circuit.corners_right}R</span>
          </div>

          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-neutral-300 bg-black/75 px-2 py-0.5 rounded border border-white/10">
            Straight: <strong className="text-white">{circuit.longest_straight_m}m</strong>
          </div>
        </div>
      </div>

      {/* 4. TECHNICAL SPECIFICATIONS GRID (Design System Primitives) */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 px-1">
          Technical Specifications
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Card: Length */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E101D] p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Track Length
            </div>
            <div className="text-base sm:text-lg font-mono font-extrabold text-white mt-0.5">
              {circuit.length_km} <span className="text-xs font-normal text-neutral-400">km</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Width: {circuit.width_m}m</div>
          </div>

          {/* Card: Corners */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E101D] p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Total Turns
            </div>
            <div className="text-base sm:text-lg font-mono font-extrabold text-white mt-0.5">
              {circuit.corners} <span className="text-xs font-normal text-neutral-400">corners</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              {circuit.corners_left} Left · {circuit.corners_right} Right
            </div>
          </div>

          {/* Card: Longest Straight */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E101D] p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Longest Straight
            </div>
            <div className="text-base sm:text-lg font-mono font-extrabold text-[#FF2A24] mt-0.5">
              {circuit.longest_straight_m} <span className="text-xs font-normal text-neutral-400">m</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Heavy Braking Zone</div>
          </div>

          {/* Card: Laps & Distance */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E101D] p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Race Distance
            </div>
            <div className="text-base sm:text-lg font-mono font-extrabold text-white mt-0.5">
              {circuit.race_distance_km} <span className="text-xs font-normal text-neutral-400">km</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">{circuit.laps} Full Laps</div>
          </div>

          {/* Card: Top Speed Trap */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E101D] p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Top Speed Trap
            </div>
            <div className="text-base sm:text-lg font-mono font-extrabold text-white mt-0.5">
              {circuit.top_speed_kmh || 350}+ <span className="text-xs font-normal text-neutral-400">km/h</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Speed Trap Radar</div>
          </div>

          {/* Card: Lap Record */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E101D] p-3 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              All-Time Lap Record
            </div>
            <div className="text-base sm:text-lg font-mono font-extrabold text-cyan-400 mt-0.5 truncate">
              {circuit.lap_record.time}
            </div>
            <div className="text-[10px] text-neutral-300 truncate mt-0.5">
              {circuit.lap_record.rider} ({circuit.lap_record.year})
            </div>
          </div>
        </div>
      </div>

      {/* 5. RACE WINNER (IF FINISHED) */}
      {circuit.winner && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <GiTrophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                2026 Grand Prix Winner
              </div>
              <div className="text-sm font-sans font-extrabold text-white">
                {circuit.winner} {circuit.winner_number ? `#${circuit.winner_number}` : ''}
              </div>
              <div className="text-xs text-neutral-400">{circuit.winner_team}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              25 PTS
            </span>
          </div>
        </div>
      )}

      {/* 6. CIRCUIT PROFILE / DESCRIPTION */}
      {circuit.description && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E101D] p-4 text-xs font-sans text-neutral-300 leading-relaxed">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
            Circuit Profile &amp; Dynamics
          </div>
          {circuit.description}
        </div>
      )}

      {/* 7. QUICK MAP ACTIONS */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E101D] p-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono text-neutral-400">Map Focus:</span>
        <div className="flex items-center gap-2">
          {onFocusTrackZoom && (
            <button
              onClick={onFocusTrackZoom}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-sans font-semibold transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Track Satellite Zoom</span>
            </button>
          )}

          {onViewGlobe && (
            <button
              onClick={onViewGlobe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-sans font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#E10600]" />
              <span>3D Earth Globe</span>
            </button>
          )}
        </div>
      </div>

      {/* 8. EXTERNAL DOCUMENTATION LINKS */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.08]">
        <div className="flex items-center gap-2">
          {circuit.pdf_url && (
            <a
              href={circuit.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#E10600]/25 hover:text-[#FF2A24] text-xs font-sans font-medium text-neutral-200 transition-colors border border-white/10"
              title="Official MotoGP Circuit Information PDF"
            >
              <FileText className="w-3.5 h-3.5 text-[#E10600]" />
              <span>Official PDF</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}

          {circuit.osm_url && (
            <a
              href={circuit.osm_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-cyan-500/25 hover:text-cyan-300 text-xs font-sans font-medium text-neutral-200 transition-colors border border-white/10"
              title="Open location on OpenStreetMap"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>OpenStreetMap</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}
        </div>

        {onOpenModal && (
          <button
            onClick={() => onOpenModal(circuit)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E10600] hover:bg-[#FF2A24] text-white text-xs font-sans font-bold transition-all shadow-md"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Deep Telemetry</span>
          </button>
        )}
      </div>
    </div>
  );
}
