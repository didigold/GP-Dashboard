'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOTOGP_RIDERS } from '@/lib/data/motogp-grid';
import { computeRivalDuel, HeadToHeadSession } from '@/lib/data/head-to-head-data';
import { UserPlus, ArrowLeftRight, Trophy, Zap, Gauge, Disc, Compass, ChevronRight } from 'lucide-react';

interface DualDuelComparisonProps {
  initialRiderAId?: string;
  initialRiderBId?: string;
  onAddThirdRider?: (riderAId: string, riderBId: string) => void;
}

export function DualDuelComparison({
  initialRiderAId = 'marquez-93',
  initialRiderBId = 'bagnaia-63',
  onAddThirdRider,
}: DualDuelComparisonProps) {
  const [riderAId, setRiderAId] = useState<string>(initialRiderAId);
  const [riderBId, setRiderBId] = useState<string>(initialRiderBId);
  const [sessionFilter, setSessionFilter] = useState<'All' | 'Quali'>('All');
  const [highlightLast, setHighlightLast] = useState<boolean>(true);
  const [activeTooltip, setActiveTooltip] = useState<{
    session: HeadToHeadSession;
    x: number;
    y: number;
  } | null>(null);

  const duel = computeRivalDuel(riderAId, riderBId);
  const { riderA, riderB, statsA, statsB, sectorSplits } = duel;

  const quickPresets = [
    { label: 'Ducati Factory', a: 'marquez-93', b: 'bagnaia-63' },
    { label: 'Aprilia Factory', a: 'martin-89', b: 'bezzecchi-72' },
    { label: 'KTM Factory', a: 'acosta-37', b: 'binder-33' },
    { label: 'Yamaha Factory', a: 'quartararo-20', b: 'rins-42' },
    { label: 'Title Contenders', a: 'marquez-93', b: 'martin-89' },
  ];

  const deltaToPercent = (delta: number) => {
    const clamped = Math.max(-2.0, Math.min(2.0, delta));
    return 50 + (clamped / 2.0) * 45;
  };

  const filteredSessions = sessionFilter === 'All'
    ? duel.sessions
    : duel.sessions.filter((s) => s.type === sessionFilter);

  // SVG Radar Coordinates
  const radarMetrics = [
    { label: 'Qualifying Pace', keyA: statsA.radar.qualifyingPace, keyB: statsB.radar.qualifyingPace },
    { label: 'Sprint Attack', keyA: statsA.radar.sprintAggression, keyB: statsB.radar.sprintAggression },
    { label: 'Sunday Racecraft', keyA: statsA.radar.sundayRacecraft, keyB: statsB.radar.sundayRacecraft },
    { label: 'Lean Mastery', keyA: statsA.radar.leanMastery, keyB: statsB.radar.leanMastery },
    { label: 'Braking Force', keyA: statsA.radar.brakingForce, keyB: statsB.radar.brakingForce },
    { label: 'Consistency', keyA: statsA.radar.consistency, keyB: statsB.radar.consistency },
  ];

  const radarPoints = (isA: boolean) => {
    const count = radarMetrics.length;
    const center = 110;
    const radius = 80;
    return radarMetrics
      .map((m, i) => {
        const val = isA ? m.keyA : m.keyB;
        const normalized = val / 100;
        const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
        const x = center + radius * normalized * Math.cos(angle);
        const y = center + radius * normalized * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Quick Matchup Presets & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0E0F12] border border-white/[0.08]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400 shrink-0">
            Quick Rivalries:
          </span>
          {quickPresets.map((preset) => {
            const isActive =
              (riderAId === preset.a && riderBId === preset.b) ||
              (riderAId === preset.b && riderBId === preset.a);
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setRiderAId(preset.a);
                  setRiderBId(preset.b);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#141519] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-white/20'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Add Third Driver CTA */}
        <button
          onClick={() => onAddThirdRider?.(riderAId, riderBId)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181A20] hover:bg-[#20222A] text-white border border-white/10 hover:border-white/20 text-xs font-semibold transition-all shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5 text-[#E10600]" />
          <span>Add 3rd Rider (Tri-Duel)</span>
        </button>
      </div>

      {/* Driver Selection & Scoreboard Hero Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Rider A Profile Card (5 Cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] relative overflow-hidden group">
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: riderA.color }}
          />
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-white/[0.08] text-white">
                  #{riderA.number}
                </span>
                <span className="text-xs text-neutral-400 font-sans">{riderA.country.name}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                  {riderA.full_name}
                </h3>
                <Link
                  href={`/teams/${riderA.team_id}`}
                  className="text-xs sm:text-sm text-neutral-400 hover:text-white font-sans transition-colors block mt-0.5"
                >
                  {riderA.team_name} · {riderA.bike_name}
                </Link>
              </div>

              {/* Rider Selector Combobox */}
              <select
                value={riderAId}
                onChange={(e) => setRiderAId(e.target.value)}
                className="bg-[#141519] border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:border-white/30 transition-colors w-full sm:w-auto"
              >
                {MOTOGP_RIDERS.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.id === riderBId}>
                    #{r.number} {r.full_name} ({r.team_name.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Rider Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900 shrink-0 shadow-xl">
              <img
                src={riderA.photo_url}
                alt={riderA.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Duel Score Comparison Tally (2 Cols) */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#0E0F12] border border-white/[0.08] flex flex-col items-center justify-center space-y-3 text-center">
          <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
            2026 Head-to-Head
          </div>

          <div className="w-full space-y-2 text-xs font-mono">
            {/* Qualifying Score */}
            <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141519]">
              <span className="font-bold text-sm" style={{ color: riderA.color }}>
                {duel.qualiWinsA}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans uppercase">Qualifying</span>
              <span className="font-bold text-sm" style={{ color: riderB.color }}>
                {duel.qualiWinsB}
              </span>
            </div>

            {/* Sprint Score */}
            <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141519]">
              <span className="font-bold text-sm" style={{ color: riderA.color }}>
                {duel.sprintWinsA}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans uppercase">Sprint</span>
              <span className="font-bold text-sm" style={{ color: riderB.color }}>
                {duel.sprintWinsB}
              </span>
            </div>

            {/* Sunday Grand Prix Score */}
            <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141519]">
              <span className="font-bold text-sm" style={{ color: riderA.color }}>
                {duel.sundayWinsA}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans uppercase">Sunday GP</span>
              <span className="font-bold text-sm" style={{ color: riderB.color }}>
                {duel.sundayWinsB}
              </span>
            </div>

            {/* Points Score */}
            <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141519]">
              <span className="font-bold text-sm" style={{ color: riderA.color }}>
                {statsA.totalPoints}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans uppercase">Points</span>
              <span className="font-bold text-sm" style={{ color: riderB.color }}>
                {statsB.totalPoints}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono font-bold text-neutral-300">
            Avg Gap: <span className={duel.avgQualiDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}>{duel.avgQualiDelta > 0 ? `+${duel.avgQualiDelta}s` : `${duel.avgQualiDelta}s`}</span>
          </div>
        </div>

        {/* Rider B Profile Card (5 Cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] relative overflow-hidden group">
          <div
            className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: riderB.color }}
          />
          <div className="flex items-start justify-between gap-4">
            {/* Rider Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900 shrink-0 shadow-xl order-2 sm:order-1">
              <img
                src={riderB.photo_url}
                alt={riderB.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="space-y-3 text-right order-1 sm:order-2">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-neutral-400 font-sans">{riderB.country.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-white/[0.08] text-white">
                  #{riderB.number}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                  {riderB.full_name}
                </h3>
                <Link
                  href={`/teams/${riderB.team_id}`}
                  className="text-xs sm:text-sm text-neutral-400 hover:text-white font-sans transition-colors block mt-0.5"
                >
                  {riderB.team_name} · {riderB.bike_name}
                </Link>
              </div>

              {/* Rider Selector Combobox */}
              <select
                value={riderBId}
                onChange={(e) => setRiderBId(e.target.value)}
                className="bg-[#141519] border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:border-white/30 transition-colors w-full sm:w-auto text-right"
              >
                {MOTOGP_RIDERS.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.id === riderAId}>
                    #{r.number} {r.full_name} ({r.team_name.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Full Resolution Dot Plot Strip Chart for this 1v1 matchup */}
      <div className="p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold font-sans text-white tracking-tight">
              Session Gap Distribution (19 Rounds)
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Each point represents one Grand Prix qualifying session. Position shows gap in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-full bg-[#141519] border border-white/[0.08]">
              {(['All', 'Quali'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSessionFilter(filter)}
                  className={`px-3 py-0.5 text-xs font-semibold rounded-full transition-all ${
                    sessionFilter === filter
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300 select-none">
              <span>Highlight last round</span>
              <button
                type="button"
                role="switch"
                aria-checked={highlightLast}
                onClick={() => setHighlightLast(!highlightLast)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  highlightLast ? 'bg-[#E10600]' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    highlightLast ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* The Dot Plot Strip */}
        <div className="relative w-full pt-2 pb-2">
          <div
            className="relative w-full h-12 rounded-xl overflow-hidden flex items-center border border-white/[0.08]"
            style={{ backgroundColor: '#12141C' }}
          >
            {/* Outlier Hatches */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[15%] opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 8px)',
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-[15%] opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 8px)',
              }}
            />

            {/* Center Zero Hairline */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 z-10 -translate-x-1/2" />

            {/* Median Marker Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#E10600] z-10 transition-all duration-300"
              style={{ left: `${deltaToPercent(duel.medianQualiDelta)}%` }}
              title={`Median gap: ${duel.medianQualiDelta}s`}
            />

            {/* Plotted Session Dots */}
            {filteredSessions.map((session, idx) => {
              const xPercent = deltaToPercent(session.delta);
              const isHighlighted = highlightLast && session.isLast;

              return (
                <div
                  key={`dual-${session.round}-${session.type}-${idx}`}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-150"
                  style={{
                    left: `${xPercent}%`,
                    top: `calc(50% + ${session.jitter}px)`,
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setActiveTooltip({
                      session,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                    });
                  }}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isHighlighted
                        ? 'w-4 h-4 bg-white ring-4 ring-white/40 shadow-lg animate-pulse'
                        : 'w-3 h-3 border border-white/30 hover:border-white'
                    }`}
                    style={{
                      backgroundColor: isHighlighted
                        ? '#FFFFFF'
                        : session.winner === 'A'
                        ? riderA.color || '#E10600'
                        : riderB.color || '#38BDF8',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Scale Labels */}
          <div className="w-full flex justify-between text-[11px] text-neutral-400 font-mono mt-2 px-2 select-none">
            <span style={{ color: riderA.color }}>2.0s ({riderA.surname})</span>
            <span>1.5s</span>
            <span>1.0s</span>
            <span>0.5s</span>
            <span className="text-white font-bold">0.0s (Level)</span>
            <span>0.5s</span>
            <span>1.0s</span>
            <span>1.5s</span>
            <span style={{ color: riderB.color }}>2.0s ({riderB.surname})</span>
          </div>
        </div>
      </div>

      {/* Sector Splits & Radar Deep Dive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Split Breakdown (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-sans text-white tracking-tight">
              Mini-Sector Breakdown (Sepang GP Reference)
            </h3>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              T1 to T4 Splits
            </span>
          </div>

          <div className="space-y-4">
            {sectorSplits.map((sec) => {
              const aPct = 50 + (sec.winner === 'A' ? 12 : -12);
              return (
                <div key={sec.name} className="p-3.5 rounded-xl bg-[#141519] border border-white/[0.05] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-sm" style={{ color: riderA.color }}>
                      {sec.timeA.toFixed(3)}s
                    </span>
                    <span className="text-neutral-300 font-sans font-medium text-xs">{sec.name}</span>
                    <span className="font-bold text-sm" style={{ color: riderB.color }}>
                      {sec.timeB.toFixed(3)}s
                    </span>
                  </div>

                  {/* Visual Split Bar */}
                  <div className="h-2.5 w-full bg-black/60 rounded-full flex overflow-hidden border border-white/[0.08]">
                    <div
                      className="h-full transition-all duration-500 rounded-l-full"
                      style={{
                        width: `${aPct}%`,
                        backgroundColor: riderA.color || '#E10600',
                      }}
                    />
                    <div
                      className="h-full transition-all duration-500 rounded-r-full"
                      style={{
                        width: `${100 - aPct}%`,
                        backgroundColor: riderB.color || '#38BDF8',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-sans">
                    <span>{sec.winner === 'A' ? `${riderA.surname} advantage` : ''}</span>
                    <span className="font-mono text-neutral-300 font-bold">
                      Delta: {sec.delta.toFixed(3)}s
                    </span>
                    <span>{sec.winner === 'B' ? `${riderB.surname} advantage` : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Machine & Telemetry Hardware Specs Comparison */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#141519] border border-white/[0.05] text-center">
              <div className="text-[10px] uppercase font-sans text-neutral-400">Peak Lean</div>
              <div className="text-sm font-bold font-mono mt-1 flex items-center justify-center gap-2">
                <span style={{ color: riderA.color }}>{statsA.peakLeanAngle}°</span>
                <span className="text-neutral-600">vs</span>
                <span style={{ color: riderB.color }}>{statsB.peakLeanAngle}°</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141519] border border-white/[0.05] text-center">
              <div className="text-[10px] uppercase font-sans text-neutral-400">Max Braking</div>
              <div className="text-sm font-bold font-mono mt-1 flex items-center justify-center gap-2">
                <span style={{ color: riderA.color }}>{statsA.maxBrakingG}G</span>
                <span className="text-neutral-600">vs</span>
                <span style={{ color: riderB.color }}>{statsB.maxBrakingG}G</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141519] border border-white/[0.05] text-center">
              <div className="text-[10px] uppercase font-sans text-neutral-400">Top Speed</div>
              <div className="text-sm font-bold font-mono mt-1 flex items-center justify-center gap-2">
                <span style={{ color: riderA.color }}>{statsA.topSpeedKmh}</span>
                <span className="text-neutral-600">vs</span>
                <span style={{ color: riderB.color }}>{statsB.topSpeedKmh}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141519] border border-white/[0.05] text-center">
              <div className="text-[10px] uppercase font-sans text-neutral-400">Sunday Wins</div>
              <div className="text-sm font-bold font-mono mt-1 flex items-center justify-center gap-2">
                <span style={{ color: riderA.color }}>{statsA.sundayWins}</span>
                <span className="text-neutral-600">vs</span>
                <span style={{ color: riderB.color }}>{statsB.sundayWins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Radar & Points Progression (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold font-sans text-white tracking-tight">
                Rider Radar Profile
              </h3>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5" style={{ color: riderA.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riderA.color }} />
                  {riderA.surname}
                </span>
                <span className="flex items-center gap-1.5" style={{ color: riderB.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riderB.color }} />
                  {riderB.surname}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-light">
              Normalized comparison across 6 telemetry parameters.
            </p>

            {/* SVG Radar Graphic */}
            <div className="relative w-full aspect-square max-w-[280px] mx-auto my-3 flex items-center justify-center">
              <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                {/* Background Concentric Webs */}
                {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
                  <circle
                    key={idx}
                    cx="110"
                    cy="110"
                    r={80 * level}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                ))}

                {/* Metric Radial Lines */}
                {radarMetrics.map((_, i) => {
                  const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                  const x = 110 + 80 * Math.cos(angle);
                  const y = 110 + 80 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="110"
                      y1="110"
                      x2={x}
                      y2={y}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Rider A Polygon */}
                <polygon
                  points={radarPoints(true)}
                  fill={riderA.color || '#E10600'}
                  fillOpacity="0.3"
                  stroke={riderA.color || '#E10600'}
                  strokeWidth="2"
                />

                {/* Rider B Polygon */}
                <polygon
                  points={radarPoints(false)}
                  fill={riderB.color || '#38BDF8'}
                  fillOpacity="0.25"
                  stroke={riderB.color || '#38BDF8'}
                  strokeWidth="2"
                />

                {/* Metric Labels */}
                {radarMetrics.map((m, i) => {
                  const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                  const lx = 110 + 98 * Math.cos(angle);
                  const ly = 110 + 98 * Math.sin(angle);
                  return (
                    <text
                      key={i}
                      x={lx}
                      y={ly}
                      fontSize="9"
                      fill="#9CA3AF"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-sans font-medium"
                    >
                      {m.label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Cumulative Points Divergence */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="font-semibold text-white">Championship Points Progression</span>
              <span className="font-mono text-neutral-400">19 Rounds</span>
            </div>
            <div className="h-14 w-full bg-[#141519] rounded-xl p-2 relative flex items-end justify-between gap-1 overflow-hidden">
              {duel.cumulativePointsA.map((ptA, idx) => {
                const ptB = duel.cumulativePointsB[idx] || ptA;
                const maxPt = Math.max(...duel.cumulativePointsA, ...duel.cumulativePointsB, 1);
                const hA = Math.round((ptA / maxPt) * 44);
                const hB = Math.round((ptB / maxPt) * 44);

                return (
                  <div key={idx} className="flex-1 flex items-end justify-center gap-0.5 h-full" title={`R${idx + 1}: ${riderA.surname} ${ptA} pts vs ${riderB.surname} ${ptB} pts`}>
                    <div
                      className="w-full rounded-t-sm"
                      style={{ height: `${hA}px`, backgroundColor: riderA.color }}
                    />
                    <div
                      className="w-full rounded-t-sm"
                      style={{ height: `${hB}px`, backgroundColor: riderB.color }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {activeTooltip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full p-2.5 rounded-xl bg-black/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl text-xs space-y-1 font-sans"
          style={{
            left: `${activeTooltip.x}px`,
            top: `${activeTooltip.y}px`,
          }}
        >
          <div className="flex items-center justify-between gap-3 text-[11px] text-neutral-400 font-mono">
            <span>Round {activeTooltip.session.round} · {activeTooltip.session.circuitName}</span>
            <span className="text-white font-bold px-1.5 py-0.2 rounded bg-white/10">
              {activeTooltip.session.type}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5 text-xs font-semibold">
            <span>Gap:</span>
            <span
              className={`font-mono ${
                activeTooltip.session.delta <= 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {activeTooltip.session.delta > 0 ? `+${activeTooltip.session.delta.toFixed(3)}s` : `${activeTooltip.session.delta.toFixed(3)}s`}
            </span>
            <span className="text-neutral-400 font-light">
              ({activeTooltip.session.winner === 'A' ? `${riderA.surname} faster` : `${riderB.surname} faster`})
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            {activeTooltip.session.riderATime} vs {activeTooltip.session.riderBTime}
          </div>
        </div>
      )}
    </div>
  );
}
