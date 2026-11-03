'use client';

import React, { useState } from 'react';
import { CircuitInfo, getCircuitImageUrl } from '@/lib/data/circuits-data';

interface CircuitCardProps {
  circuit: CircuitInfo;
  isSelected: boolean;
  onSelect: (circuit: CircuitInfo) => void;
}

// Crisp cross-platform Country Flag component
export function CountryFlag({
  iso,
  country,
  className = 'w-7 h-4.5',
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
        className={`${className} object-cover rounded-[3px] ring-1 ring-inset ring-black/40 shrink-0 shadow-sm`}
      />
    );
  }
  return <span className="text-base shrink-0">🏁</span>;
}

// Format dates with natural case (e.g. "15 May – 17 May", not full caps)
function formatDisplayDates(dates: string): string {
  const clean = dates.replace(/,?\s*\d{4}$/, '').trim();
  const parts = clean.split('-').map((p) => p.trim());
  if (parts.length === 2) {
    const parsePart = (str: string) => {
      const match = str.match(/([a-zA-Z]+)\s*(\d+)/);
      if (match) {
        const month = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        return `${match[2].padStart(2, '0')} ${month}`;
      }
      return str;
    };
    return `${parsePart(parts[0])} – ${parsePart(parts[1])}`;
  }
  return clean;
}

// Natural title case for circuit headers
function getDisplayTitle(circuit: CircuitInfo): string {
  if (circuit.id.includes('catalonia')) return 'Catalonia';
  if (circuit.id.includes('aragon')) return 'Aragón';
  if (circuit.id.includes('san-marino')) return 'San Marino';
  if (circuit.id.includes('valencia')) return 'Valencia';
  if (circuit.country.toLowerCase() === 'united states') return 'USA';
  if (circuit.country.toLowerCase() === 'united kingdom') return 'Great Britain';
  return circuit.country;
}

// Crisp, dedicated PDF Document Icon (exact 20x20px with explicit dimensions)
function CleanPdfIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/80"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export function CircuitCard({ circuit, isSelected, onSelect }: CircuitCardProps) {
  const [imgError, setImgError] = useState(false);
  const bgImage = imgError ? '/images/circuits/round-01-thailand.jpg' : getCircuitImageUrl(circuit);
  const isLive = circuit.status === 'CURRENT';
  const isFinished = circuit.status === 'FINISHED';
  const displayDates = formatDisplayDates(circuit.dates);
  const displayTitle = getDisplayTitle(circuit);

  return (
    <div
      id={`circuit-card-${circuit.id}`}
      onClick={() => onSelect(circuit)}
      className={`relative w-full h-full p-4 flex flex-col justify-between cursor-pointer select-none group text-white overflow-hidden rounded-2xl transition-all duration-300 font-sans border-none shadow-none bg-[#070913] ${
        isSelected
          ? 'ring-1 ring-white/35'
          : 'ring-1 ring-white/10 hover:ring-white/20'
      }`}
    >
      {/* Background authentic circuit photo */}
      {/* When selected: highlighted image (brighter, sharper, more vivid) */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
          isSelected
            ? 'brightness-125 scale-105 saturate-110'
            : 'brightness-90 group-hover:brightness-105 group-hover:scale-102 saturate-95'
        }`}
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark gradient overlay */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isSelected
            ? 'bg-gradient-to-t from-[#05070E] via-[#05070E]/60 to-[#05070E]/30'
            : 'bg-gradient-to-t from-[#070913] via-[#070913]/85 to-[#070913]/60 group-hover:via-[#070913]/70'
        }`}
      />

      {/* TOP ROW: Country Flag (Left) & Angled Status Ribbon (Right) */}
      <div className="relative z-10 flex items-start justify-between">
        <CountryFlag iso={circuit.country_code} country={circuit.country} className="w-8 h-5" />

        {/* Angled Status Ribbon in Natural Case (Finished, Up next, Upcoming) */}
        <div
          className={`px-3 py-0.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-wider flex items-center justify-center shrink-0 ${
            isFinished
              ? 'bg-black/95 text-neutral-300'
              : isLive
              ? 'bg-[#E10600] text-white'
              : 'bg-black/80 text-neutral-400'
          }`}
          style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        >
          {isFinished ? 'Finished' : isLive ? 'Up next' : 'Upcoming'}
        </div>
      </div>

      {/* MAIN BODY: Left side (Dates, Sora Number + Country, Subtitle) pushed down & Right side (Authentic Track Silhouette) */}
      <div className="relative z-10 flex items-center justify-between gap-3 flex-1 min-h-0 pt-1">
        {/* Left Column: Pushed down toward the bottom of the card */}
        <div className="flex-1 min-w-0 flex flex-col justify-end self-end space-y-1 pb-0.5">
          {/* Dates Row (natural case) */}
          <div className="text-xs sm:text-[13px] font-sans font-medium tracking-wide text-neutral-300">
            {displayDates}
          </div>

          {/* Identity Row: Sora Number is thinner than title and grey, does not turn red */}
          <div className="flex items-baseline">
            <span className="font-sans font-light text-2xl sm:text-3xl text-neutral-400 mr-2.5 select-none leading-none">
              {circuit.round_number}
            </span>
            <span className="font-sans font-black text-xl sm:text-2xl tracking-tight text-white leading-none truncate">
              {displayTitle}
            </span>
          </div>

          {/* Official Grand Prix Name (Natural Case) */}
          <p className="text-[11px] font-sans font-normal text-neutral-300/90 tracking-normal truncate">
            {circuit.official_name}
          </p>
        </div>

        {/* Right Column: High-Fidelity Track Layout Silhouette (Centered, balanced, official 500x500 vector) */}
        <div className="shrink-0 w-32 sm:w-36 h-20 sm:h-24 flex items-center justify-center self-center pr-2">
          <svg viewBox="0 0 500 500" className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <path
              d={circuit.svg_path}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* PDF Icon at Bottom Right: Clean, unclipped, NO bg, NO border, NO hover color change */}
      {circuit.pdf_url && (
        <a
          href={circuit.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 right-3 z-30 p-1 bg-transparent border-none ring-0 outline-none text-white/80 hover:text-white/80 transition-none flex items-center justify-center cursor-pointer select-none"
          title="Official Circuit Information Sheet"
        >
          <CleanPdfIcon />
        </a>
      )}
    </div>
  );
}
