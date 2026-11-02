'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { CHAMPIONSHIP_ROUNDS_2026, CircuitInfo } from '@/lib/data/circuits-data';
import { CircuitDetailModal } from '@/components/circuit/CircuitDetailModal';
import { GiTrophy } from 'react-icons/gi';
import { MapPin, ChevronRight, ExternalLink, FileText, LayoutGrid, Columns } from 'lucide-react';

const RealMapboxView = dynamic(
  () => import('@/components/calendar/RealMapboxView').then((mod) => mod.RealMapboxView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#05070E] text-neutral-400 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-ping" />
          <span>Loading Mapbox Real Satellite &amp; Vector Map...</span>
        </div>
      </div>
    ),
  }
);

// Crisp cross-platform Country Flag component
function CountryFlag({ iso, country, className = 'w-7 h-5' }: { iso?: string; country?: string; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const cleanIso = (iso || '').toLowerCase().trim();
  const isoMap: Record<string, string> = {
    gp: 'un',
    uk: 'gb',
    england: 'gb-eng',
  };
  const resolvedIso = isoMap[cleanIso] || cleanIso;

  if (resolvedIso && resolvedIso.length === 2 && !imageError) {
    return (
      <img
        src={`https://flagcdn.com/w80/${resolvedIso}.png`}
        alt={country || resolvedIso.toUpperCase()}
        loading="lazy"
        onError={() => setImageError(true)}
        className={`${className} object-cover rounded shadow border border-white/10 shrink-0`}
      />
    );
  }
  return <span className="text-lg shrink-0">🏁</span>;
}

export default function SchedulePage() {
  // Synchronized selected circuit between left 1/3 cards and right 2/3 real map
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitInfo>(
    CHAMPIONSHIP_ROUNDS_2026.find((c) => c.status === 'CURRENT') || CHAMPIONSHIP_ROUNDS_2026[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Layout mode for circuit cards: '2-col' (matching request) or '1-col'
  const [layoutMode, setLayoutMode] = useState<'2-col' | '1-col'>('2-col');

  const handleOpenCircuit = (circuit: CircuitInfo) => {
    setSelectedCircuit(circuit);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col lg:flex-row bg-[#060810] text-white font-sans select-none">
      {/* =========================================================================
          LEFT PANEL (1/3): SCROLLABLE CIRCUIT CARDS (Supports 2-Column Grid)
         ========================================================================= */}
      <div className="w-full lg:w-1/3 xl:w-1/3 h-full overflow-y-auto border-r border-white/[0.08] bg-[#070913] p-3 sm:p-4 space-y-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
        {/* Subtle workstation bar with round count and 1-col / 2-col toggle */}
        <div className="flex items-center justify-between pb-1 px-1 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white tracking-wider text-xs uppercase">
              2026 Calendar
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              ({CHAMPIONSHIP_ROUNDS_2026.length} Rounds)
            </span>
          </div>

          <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setLayoutMode('2-col')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                layoutMode === '2-col'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="2-Column Cards"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>2-Col</span>
            </button>
            <button
              onClick={() => setLayoutMode('1-col')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                layoutMode === '1-col'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="1-Column Full Cards"
            >
              <Columns className="w-3 h-3" />
              <span>1-Col</span>
            </button>
          </div>
        </div>

        {/* Cards Grid: 2-column or 1-column */}
        <div
          className={`grid gap-3 ${
            layoutMode === '2-col' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {CHAMPIONSHIP_ROUNDS_2026.map((round) => {
            const isSelected = selectedCircuit?.id === round.id;
            const isLive = round.status === 'CURRENT';
            const isFinished = round.status === 'FINISHED';

            return (
              <div
                key={round.id}
                id={`circuit-card-${round.id}`}
                onClick={() => setSelectedCircuit(round)}
                className={`rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-2 border-white/95 bg-[#101424] shadow-[0_0_24px_rgba(255,255,255,0.18)] scale-[1.01]'
                    : isLive
                    ? 'border-2 border-[#E10600] bg-[#120B0D] shadow-[0_0_20px_rgba(225,6,0,0.2)]'
                    : 'border border-white/[0.08] bg-[#0A0D18]/90 hover:border-white/25 hover:bg-[#0E1220]'
                }`}
              >
                {/* Selected or Live ambient glow */}
                {(isSelected || isLive) && (
                  <div
                    className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 ${
                      isLive ? 'bg-[#E10600]/20' : 'bg-white/10'
                    }`}
                  />
                )}

                <div className="space-y-2.5 relative z-10">
                  {/* Header: Round + Flag + Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CountryFlag
                        iso={round.country_code}
                        country={round.country}
                        className="w-6 h-4.5"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E10600]">
                            R{round.round_number}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {round.short_name}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-300 font-medium">
                          {round.dates}
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={isLive ? 'motogp' : isFinished ? 'outline' : 'secondary'}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isLive ? 'animate-pulse' : ''
                      }`}
                    >
                      {isLive ? 'Active GP' : isFinished ? 'Done' : 'Upcoming'}
                    </Badge>
                  </div>

                  {/* Circuit Title & Location */}
                  <div>
                    <h3 className="text-sm sm:text-base font-sans font-extrabold text-white group-hover:text-[#FF2A24] transition-colors leading-snug line-clamp-1">
                      {round.name}
                    </h3>
                    <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-[#E10600] shrink-0" />
                      <span className="truncate">
                        {round.city ? `${round.city}, ` : ''}{round.country}
                      </span>
                    </div>
                  </div>

                  {/* Integrated Track Outline Vector */}
                  <div className="h-20 w-full bg-black/40 rounded-xl p-1.5 flex items-center justify-center relative overflow-hidden group-hover:bg-black/60 transition-colors">
                    <svg
                      viewBox="0 0 200 120"
                      className="w-full h-full max-h-16 filter drop-shadow transition-transform duration-300 group-hover:scale-105"
                    >
                      <path
                        d={round.svg_path}
                        fill="none"
                        stroke={isSelected ? '#FFFFFF' : isLive ? '#E10600' : '#E0E5EE'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <div className="absolute bottom-1 right-1.5 text-[9px] font-mono text-neutral-400 bg-black/70 px-1.5 py-0.5 rounded">
                      {round.direction}
                    </div>
                  </div>

                  {/* ALL SPECS IN THE CARD (Clean typographic layout, no nested box frames) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-2 pt-0.5 text-left font-sans">
                    <div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-neutral-400">
                        Length
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5">
                        {round.length_km} km
                      </div>
                      <div className="text-[9px] text-neutral-400">
                        Width: {round.width_m}m
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-neutral-400">
                        Corners
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5">
                        {round.corners} Turns
                      </div>
                      <div className="text-[9px] text-neutral-400">
                        {round.corners_left}L · {round.corners_right}R
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-neutral-400">
                        Straight
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5">
                        {round.longest_straight_m} m
                      </div>
                      <div className="text-[9px] text-neutral-400">
                        {round.laps} Laps
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-[9px] font-medium uppercase tracking-wider text-neutral-400">
                        Lap Record
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 truncate">
                        {round.lap_record.time}
                      </div>
                      <div className="text-[9px] text-neutral-400 truncate">
                        {round.lap_record.rider} ({round.lap_record.year})
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-neutral-400">
                        Top Speed
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5">
                        {round.top_speed_kmh ? `${round.top_speed_kmh}` : '350+'}{' '}
                        <span className="text-[9px] font-normal">km/h</span>
                      </div>
                      <div className="text-[9px] text-neutral-400">
                        Speed Trap
                      </div>
                    </div>
                  </div>

                  {/* Winner if completed */}
                  {round.winner && (
                    <div className="pt-1.5 flex items-center justify-between text-xs font-sans text-neutral-300 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <GiTrophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-bold text-white truncate max-w-[100px]">{round.winner}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 truncate max-w-[100px]">
                        {round.winner_team}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer with Direct Links */}
                <div className="pt-2.5 mt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-1 relative z-10">
                  <div className="flex items-center gap-1.5">
                    {round.pdf_url && (
                      <a
                        href={round.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-[#E10600]/25 hover:text-[#FF2A24] text-[10px] font-sans font-semibold text-neutral-200 transition-colors border border-white/[0.08]"
                        title="Direct Link to Official MotoGP Circuit Sheet (PDF)"
                      >
                        <FileText className="w-3 h-3 text-[#E10600]" />
                        <span>Sheet</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}

                    {round.osm_url && (
                      <a
                        href={round.osm_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-cyan-500/25 hover:text-cyan-300 text-[10px] font-sans font-semibold text-neutral-200 transition-colors border border-white/[0.08]"
                        title="Open Circuit Location on OpenStreetMap"
                      >
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>Map</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCircuit(round);
                    }}
                    className="inline-flex items-center gap-0.5 text-[10px] font-bold text-white hover:text-[#FF2A24] transition-colors py-0.5 pl-1"
                  >
                    <span>Specs</span>
                    <ChevronRight className="w-3 h-3 text-[#E10600] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL (2/3): REAL WORKING MAPBOX MAP
         ========================================================================= */}
      <div className="w-full lg:w-2/3 xl:w-2/3 h-full relative">
        <RealMapboxView
          selectedCircuit={selectedCircuit}
          onSelectCircuit={setSelectedCircuit}
          onOpenModal={handleOpenCircuit}
        />
      </div>

      {/* Circuit Detail Modal (Deep technical specs, notes, & telemetry) */}
      <CircuitDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        circuit={selectedCircuit}
      />
    </div>
  );
}
