'use client';

import React, { useState } from 'react';
import { CircuitInfo, getCircuitImageUrl } from '@/lib/data/circuits-data';
import { Maximize2 } from 'lucide-react';

interface CircuitCardProps {
  circuit: CircuitInfo;
  isSelected: boolean;
  onSelect: (circuit: CircuitInfo) => void;
  onExpand: (circuit: CircuitInfo) => void;
}

// Crisp cross-platform Country Flag component
export function CountryFlag({
  iso,
  country,
  className = 'w-6 h-4.5',
}: {
  iso?: string;
  country?: string;
  className?: string;
}) {
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
        className={`${className} object-cover rounded-[2px] ring-1 ring-inset ring-black/30 shrink-0`}
      />
    );
  }
  return <span className="text-base shrink-0">🏁</span>;
}

// Helper to format country/title like official MotoGP presentation
function getDisplayTitle(circuit: CircuitInfo): string {
  if (circuit.id.includes('catalonia')) return 'CATALONIA';
  if (circuit.id.includes('aragon')) return 'ARAGON';
  if (circuit.id.includes('san-marino')) return 'SAN MARINO';
  if (circuit.id.includes('valencia')) return 'VALENCIA';
  if (circuit.country.toLowerCase() === 'united states') return 'USA';
  if (circuit.country.toLowerCase() === 'united kingdom') return 'GREAT BRITAIN';
  return circuit.country.toUpperCase();
}

export function CircuitCard({ circuit, isSelected, onSelect, onExpand }: CircuitCardProps) {
  const [imgError, setImgError] = useState(false);
  const bgImage = imgError ? '/images/circuits/round-01-thailand.jpg' : getCircuitImageUrl(circuit);
  const isLive = circuit.status === 'CURRENT';
  const isFinished = circuit.status === 'FINISHED';
  const displayTitle = getDisplayTitle(circuit);

  return (
    <div
      id={`circuit-card-${circuit.id}`}
      onClick={() => onSelect(circuit)}
      className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 select-none flex flex-col justify-between ${
        isSelected
          ? 'border-2 border-white ring-2 ring-[#E10600]/60 shadow-[0_0_24px_rgba(225,6,0,0.35)] scale-[1.01]'
          : isLive
          ? 'border-2 border-[#E10600] shadow-[0_0_20px_rgba(225,6,0,0.25)] hover:border-[#FF2A24]'
          : 'border border-white/10 hover:border-white/30 hover:shadow-xl'
      }`}
      style={{ minHeight: '172px' }}
    >
      {/* GP photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Darkening & vignette overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-[#07080B]/85 to-[#07080B]/55 group-hover:via-[#07080B]/75 transition-all duration-300" />
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />

      {/* Selected / Live ambient accent glow */}
      {(isSelected || isLive) && (
        <div
          className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
            isLive ? 'bg-[#E10600]/30' : 'bg-white/15'
          }`}
        />
      )}

      {/* Card content */}
      <div className="relative z-10 p-3.5 flex flex-col justify-between h-full space-y-2.5">
        {/* Top row: Flag + date and status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CountryFlag
              iso={circuit.country_code}
              country={circuit.country}
              className="w-6 h-4"
            />
            <span className="text-[11px] font-sans font-semibold tracking-wide text-neutral-300 uppercase">
              {circuit.dates}
            </span>
          </div>

          <div>
            {isFinished ? (
              <div
                className="px-2.5 py-0.5 text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-200 bg-black/85 border border-white/15 shadow-sm"
                style={{ clipPath: 'polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              >
                FINISHED
              </div>
            ) : isLive ? (
              <div
                className="px-2.5 py-0.5 text-[9px] font-sans font-black tracking-widest uppercase text-white bg-[#E10600] shadow-[0_0_12px_rgba(225,6,0,0.8)] flex items-center gap-1.5"
                style={{ clipPath: 'polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>UP NEXT</span>
              </div>
            ) : (
              <div
                className="px-2.5 py-0.5 text-[9px] font-sans font-medium tracking-wider uppercase text-neutral-400 bg-white/[0.08] border border-white/10"
                style={{ clipPath: 'polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              >
                UPCOMING
              </div>
            )}
          </div>
        </div>

        {/* Identity row */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-sans font-black text-[#E10600] shrink-0 tabular-nums">
              {circuit.round_number}
            </span>
            <h3 className="text-base sm:text-lg font-sans font-black tracking-tight text-white uppercase transition-colors truncate">
              {displayTitle}
            </h3>
          </div>
          <div className="text-[10.5px] font-sans text-neutral-400 uppercase tracking-wide truncate mt-0.5">
            {circuit.official_name}
          </div>
        </div>

        {/* Bottom row: track silhouette + specs + expand */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-8 bg-black/40 rounded-md p-0.5 flex items-center justify-center shrink-0 border border-white/10">
              <svg viewBox="0 0 200 120" className="w-full h-full max-h-7">
                <path
                  d={circuit.svg_path}
                  fill="none"
                  stroke={isSelected ? '#FFFFFF' : isLive ? '#E10600' : 'rgba(255,255,255,0.7)'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="text-[10px] font-sans text-neutral-300">
              <span className="font-semibold text-white tabular-nums">{circuit.length_km} km</span>
              <span className="mx-1 text-neutral-500">·</span>
              <span className="tabular-nums">{circuit.corners} Turns</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(circuit);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#E10600] text-white text-[11px] font-sans font-semibold backdrop-blur-md transition-all border border-white/15 hover:border-[#E10600] shadow-sm hover:scale-105"
            title="Expand circuit telemetry and technical data"
          >
            <Maximize2 className="w-3 h-3 text-white" />
            <span>Expand</span>
          </button>
        </div>
      </div>
    </div>
  );
}
