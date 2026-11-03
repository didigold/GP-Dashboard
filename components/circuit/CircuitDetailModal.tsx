'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CircuitInfo, CHAMPIONSHIP_ROUNDS_2026 } from '@/lib/data/circuits-data';
import { GiSpeedometer, GiTrophy, GiStopwatch, GiCheckeredFlag } from 'react-icons/gi';
import { X, MapPin, Compass, Award, Zap, ShieldCheck, FileText, ExternalLink, Navigation } from 'lucide-react';

interface CircuitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuit?: CircuitInfo | null;
}

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
  return <span className="text-xl shrink-0">🏁</span>;
}

export function CircuitDetailModal({
  isOpen,
  onClose,
  circuit,
}: CircuitDetailModalProps) {
  const defaultCircuit = CHAMPIONSHIP_ROUNDS_2026.find((c) => c.status === 'CURRENT') || CHAMPIONSHIP_ROUNDS_2026[0];
  const currentCircuit = circuit || defaultCircuit;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar bg-[#0D0D10]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-6 sm:p-8 text-white shadow-2xl font-sans">
        <DialogHeader className="border-b border-white/[0.08] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-[#E10600]">
              <CountryFlag
                iso={currentCircuit.country_code}
                country={currentCircuit.country}
                className="w-7 h-5"
              />
              <span className="tracking-wider uppercase font-bold">
                Round {currentCircuit.round_number} · 2026 World Championship
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentCircuit.pdf_url && (
                <a
                  href={currentCircuit.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-[#E10600]/20 hover:text-[#FF2A24] text-xs font-sans font-semibold text-neutral-200 transition-colors border border-white/[0.08]"
                  title="Open Official MotoGP Circuit Information PDF"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E10600]" />
                  <span>MotoGP Sheet</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {currentCircuit.osm_url && (
                <a
                  href={currentCircuit.osm_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-cyan-500/20 hover:text-cyan-300 text-xs font-sans font-semibold text-neutral-200 transition-colors border border-white/[0.08]"
                  title="View on OpenStreetMap"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Map</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>
          </div>

          <DialogTitle className="text-2xl sm:text-3xl font-sans font-extrabold text-white tracking-tight mt-2">
            {currentCircuit.name}
          </DialogTitle>

          <DialogDescription className="text-sm text-neutral-400 font-light flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-[#E10600] shrink-0" />
            <span>
              {currentCircuit.city ? `${currentCircuit.city}, ` : ''}{currentCircuit.country} · {currentCircuit.dates}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Circuit Visual Layout Silhouette */}
          <div className="w-full h-56 bg-black/60 rounded-2xl border border-white/[0.08] p-4 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.1)_0%,transparent_70%)] pointer-events-none" />
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full max-h-48 filter drop-shadow-[0_0_16px_rgba(225,6,0,0.4)] transition-transform duration-500 group-hover:scale-105"
            >
              <path
                d={currentCircuit.svg_path}
                fill="none"
                stroke="#E10600"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute bottom-3 right-4 text-xs font-mono text-neutral-400 bg-black/50 px-2.5 py-1 rounded-full border border-white/[0.06]">
              FIM Grade A Architecture · {currentCircuit.direction || 'Clockwise'}
            </div>
          </div>

          {/* Core Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">Circuit Length</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">{currentCircuit.length_km} km</div>
              <div className="text-xs text-neutral-400 mt-1">Width: {currentCircuit.width_m || 14} m</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">Total Corners</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">{currentCircuit.corners} Turns</div>
              <div className="text-xs text-neutral-400 mt-1">
                {currentCircuit.corners_left || 5} Left · {currentCircuit.corners_right || 9} Right
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">Longest Straight</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">{currentCircuit.longest_straight_m} m</div>
              <div className="text-xs text-neutral-400 mt-1">
                {currentCircuit.laps ? `${currentCircuit.laps} Race Laps` : 'Main Straight'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">All-Time Lap Record</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">{currentCircuit.lap_record.time}</div>
              <div className="text-xs text-neutral-400 mt-1 truncate">
                {currentCircuit.lap_record.rider} ({currentCircuit.lap_record.year})
              </div>
            </div>
          </div>

          {/* Historical & Engineering Notes */}
          <div className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-sm leading-relaxed text-neutral-300">
            <div className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#E10600]" />
              <span>Engineering Characteristics &amp; Paddock Notes</span>
            </div>
            <p className="text-neutral-300 font-light">
              {currentCircuit.description ||
                `${currentCircuit.name} is an internationally recognized premier FIM Grade A circuit featuring ${currentCircuit.corners} high-speed and technical turns with intense aerodynamic demand and heavy braking.`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-neutral-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                <span>Top Speed Trap: {currentCircuit.top_speed_kmh ? `${currentCircuit.top_speed_kmh} km/h` : '350+ km/h'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Track Direction: {currentCircuit.direction || 'Clockwise'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Race Distance: {currentCircuit.race_distance_km ? `${currentCircuit.race_distance_km} km` : `${((currentCircuit.length_km || 4.5) * (currentCircuit.laps || 24)).toFixed(1)} km`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Winner: {currentCircuit.winner ? `${currentCircuit.winner} (${currentCircuit.winner_team || ''})` : 'Upcoming Round'}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
