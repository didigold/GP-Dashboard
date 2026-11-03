'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOTOGP_RIDERS } from '@/lib/data/motogp-grid';
import { computeTriDuel } from '@/lib/data/head-to-head-data';
import { X, Trophy, Zap, Gauge, Users, ArrowRight, Sparkles } from 'lucide-react';

interface TriDuelComparisonProps {
  initialRiderAId?: string;
  initialRiderBId?: string;
  initialRiderCId?: string;
  onRemoveThirdRider?: () => void;
}

export function TriDuelComparison({
  initialRiderAId = 'marquez-93',
  initialRiderBId = 'bagnaia-63',
  initialRiderCId = 'martin-89',
  onRemoveThirdRider,
}: TriDuelComparisonProps) {
  const [riderAId, setRiderAId] = useState<string>(initialRiderAId);
  const [riderBId, setRiderBId] = useState<string>(initialRiderBId);
  const [riderCId, setRiderCId] = useState<string>(initialRiderCId);

  const triDuel = computeTriDuel(riderAId, riderBId, riderCId);
  const { riderA, riderB, riderC, statsA, statsB, statsC, duelAB, duelAC, duelBC, benchmarkRounds } = triDuel;

  const presets = [
    { label: '2026 Title Fight', a: 'marquez-93', b: 'bagnaia-63', c: 'martin-89' },
    { label: 'Ducati vs Aprilia vs KTM', a: 'bagnaia-63', b: 'martin-89', c: 'acosta-37' },
    { label: 'Champions Tri-Duel', a: 'marquez-93', b: 'bagnaia-63', c: 'quartararo-20' },
    { label: 'Young Guns vs Veteran', a: 'marquez-93', b: 'acosta-37', c: 'aldeguer-54' },
  ];

  // SVG Radar Coordinates for 3 riders
  const radarMetrics = [
    { label: 'Qualifying', valA: statsA.radar.qualifyingPace, valB: statsB.radar.qualifyingPace, valC: statsC.radar.qualifyingPace },
    { label: 'Sprint Attack', valA: statsA.radar.sprintAggression, valB: statsB.radar.sprintAggression, valC: statsC.radar.sprintAggression },
    { label: 'Racecraft', valA: statsA.radar.sundayRacecraft, valB: statsB.radar.sundayRacecraft, valC: statsC.radar.sundayRacecraft },
    { label: 'Lean Mastery', valA: statsA.radar.leanMastery, valB: statsB.radar.leanMastery, valC: statsC.radar.leanMastery },
    { label: 'Braking Force', valA: statsA.radar.brakingForce, valB: statsB.radar.brakingForce, valC: statsC.radar.brakingForce },
    { label: 'Consistency', valA: statsA.radar.consistency, valB: statsB.radar.consistency, valC: statsC.radar.consistency },
  ];

  const radarPoints = (riderIndex: 'A' | 'B' | 'C') => {
    const count = radarMetrics.length;
    const center = 110;
    const radius = 80;
    return radarMetrics
      .map((m, i) => {
        const val = riderIndex === 'A' ? m.valA : riderIndex === 'B' ? m.valB : m.valC;
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
      {/* Top Presets & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0E0F12] border border-white/[0.08]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400 shrink-0">
            Tri-Duel Presets:
          </span>
          {presets.map((preset) => {
            const isActive =
              riderAId === preset.a && riderBId === preset.b && riderCId === preset.c;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setRiderAId(preset.a);
                  setRiderBId(preset.b);
                  setRiderCId(preset.c);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#141519] border border-white/[0.08] text-neutral-300 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Back to Dual Duel CTA */}
        <button
          onClick={onRemoveThirdRider}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181A20] hover:bg-[#20222A] text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold transition-all shrink-0 self-start sm:self-auto"
        >
          <X className="w-3.5 h-3.5 text-neutral-400" />
          <span>Switch Back to 2 Riders</span>
        </button>
      </div>

      {/* 3 Driver Profile Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Driver A */}
        <div className="p-5 rounded-2xl bg-[#0E0F12] border border-white/[0.08] relative overflow-hidden group">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: riderA.color }}
          />
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900 shrink-0 shadow-md">
              <img
                src={riderA.photo_url}
                alt={riderA.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-white/[0.08] text-white">
                  #{riderA.number}
                </span>
                <span className="text-[11px] text-neutral-400 truncate">{riderA.country.name}</span>
              </div>
              <h4 className="text-lg font-bold font-sans text-white truncate mt-0.5">
                {riderA.full_name}
              </h4>
              <p className="text-xs text-neutral-400 truncate">{riderA.team_name}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <select
              value={riderAId}
              onChange={(e) => setRiderAId(e.target.value)}
              className="bg-[#141519] border border-white/10 text-xs text-white px-2.5 py-1 rounded-lg outline-none cursor-pointer w-full"
            >
              {MOTOGP_RIDERS.map((r) => (
                <option key={r.id} value={r.id} disabled={r.id === riderBId || r.id === riderCId}>
                  #{r.number} {r.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Driver B */}
        <div className="p-5 rounded-2xl bg-[#0E0F12] border border-white/[0.08] relative overflow-hidden group">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: riderB.color }}
          />
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900 shrink-0 shadow-md">
              <img
                src={riderB.photo_url}
                alt={riderB.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-white/[0.08] text-white">
                  #{riderB.number}
                </span>
                <span className="text-[11px] text-neutral-400 truncate">{riderB.country.name}</span>
              </div>
              <h4 className="text-lg font-bold font-sans text-white truncate mt-0.5">
                {riderB.full_name}
              </h4>
              <p className="text-xs text-neutral-400 truncate">{riderB.team_name}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <select
              value={riderBId}
              onChange={(e) => setRiderBId(e.target.value)}
              className="bg-[#141519] border border-white/10 text-xs text-white px-2.5 py-1 rounded-lg outline-none cursor-pointer w-full"
            >
              {MOTOGP_RIDERS.map((r) => (
                <option key={r.id} value={r.id} disabled={r.id === riderAId || r.id === riderCId}>
                  #{r.number} {r.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Driver C */}
        <div className="p-5 rounded-2xl bg-[#0E0F12] border border-white/[0.08] relative overflow-hidden group">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: riderC.color }}
          />
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900 shrink-0 shadow-md">
              <img
                src={riderC.photo_url}
                alt={riderC.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-white/[0.08] text-white">
                  #{riderC.number}
                </span>
                <span className="text-[11px] text-neutral-400 truncate">{riderC.country.name}</span>
              </div>
              <h4 className="text-lg font-bold font-sans text-white truncate mt-0.5">
                {riderC.full_name}
              </h4>
              <p className="text-xs text-neutral-400 truncate">{riderC.team_name}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <select
              value={riderCId}
              onChange={(e) => setRiderCId(e.target.value)}
              className="bg-[#141519] border border-white/10 text-xs text-white px-2.5 py-1 rounded-lg outline-none cursor-pointer w-full"
            >
              {MOTOGP_RIDERS.map((r) => (
                <option key={r.id} value={r.id} disabled={r.id === riderAId || r.id === riderBId}>
                  #{r.number} {r.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3-Way Head-to-Head Pairwise Duel Matrix */}
      <div className="p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-sans text-white tracking-tight">
              Pairwise Matchup Matrix
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Head-to-head records across all sessions between each pair of the trio.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 uppercase">
            19 Rounds Tally
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pair 1: A vs B */}
          <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-white border-b border-white/[0.08] pb-2">
              <span style={{ color: riderA.color }}>{riderA.surname}</span>
              <span className="text-neutral-500 font-normal">vs</span>
              <span style={{ color: riderB.color }}>{riderB.surname}</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span>Quali Duels:</span>
                <span className="font-bold">{duelAB.qualiWinsA} - {duelAB.qualiWinsB}</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday GP:</span>
                <span className="font-bold">{duelAB.sundayWinsA} - {duelAB.sundayWinsB}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Avg Delta:</span>
                <span className="font-bold">{duelAB.avgQualiDelta <= 0 ? `${duelAB.avgQualiDelta}s` : `+${duelAB.avgQualiDelta}s`}</span>
              </div>
            </div>
          </div>

          {/* Pair 2: A vs C */}
          <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-white border-b border-white/[0.08] pb-2">
              <span style={{ color: riderA.color }}>{riderA.surname}</span>
              <span className="text-neutral-500 font-normal">vs</span>
              <span style={{ color: riderC.color }}>{riderC.surname}</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span>Quali Duels:</span>
                <span className="font-bold">{duelAC.qualiWinsA} - {duelAC.qualiWinsB}</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday GP:</span>
                <span className="font-bold">{duelAC.sundayWinsA} - {duelAC.sundayWinsB}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Avg Delta:</span>
                <span className="font-bold">{duelAC.avgQualiDelta <= 0 ? `${duelAC.avgQualiDelta}s` : `+${duelAC.avgQualiDelta}s`}</span>
              </div>
            </div>
          </div>

          {/* Pair 3: B vs C */}
          <div className="p-4 rounded-xl bg-[#141519] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-white border-b border-white/[0.08] pb-2">
              <span style={{ color: riderB.color }}>{riderB.surname}</span>
              <span className="text-neutral-500 font-normal">vs</span>
              <span style={{ color: riderC.color }}>{riderC.surname}</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span>Quali Duels:</span>
                <span className="font-bold">{duelBC.qualiWinsA} - {duelBC.qualiWinsB}</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday GP:</span>
                <span className="font-bold">{duelBC.sundayWinsA} - {duelBC.sundayWinsB}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Avg Delta:</span>
                <span className="font-bold">{duelBC.avgQualiDelta <= 0 ? `${duelBC.avgQualiDelta}s` : `+${duelBC.avgQualiDelta}s`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delta to Session Benchmark ("Tri-Delta" Progression) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Round by Round Benchmark Bar (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-sans text-white tracking-tight">
                Delta to Benchmark Driver
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Who set the fastest session benchmark per round, and the gap behind them.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5" style={{ color: riderA.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riderA.color }} />
                {riderA.surname}
              </span>
              <span className="flex items-center gap-1.5" style={{ color: riderB.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riderB.color }} />
                {riderB.surname}
              </span>
              <span className="flex items-center gap-1.5" style={{ color: riderC.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riderC.color }} />
                {riderC.surname}
              </span>
            </div>
          </div>

          {/* Round-by-round Benchmark List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {benchmarkRounds.map((rnd) => (
              <div
                key={rnd.round}
                className="p-3 rounded-xl bg-[#141519] border border-white/[0.05] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-bold w-6">R{rnd.round}</span>
                  <span className="text-white font-sans font-medium">{rnd.circuitName}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold" style={{
                    backgroundColor: rnd.bestRider === 'A' ? `${riderA.color}25` : rnd.bestRider === 'B' ? `${riderB.color}25` : `${riderC.color}25`,
                    color: rnd.bestRider === 'A' ? riderA.color : rnd.bestRider === 'B' ? riderB.color : riderC.color,
                  }}>
                    P1: {rnd.bestRider === 'A' ? riderA.surname : rnd.bestRider === 'B' ? riderB.surname : riderC.surname}
                  </span>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <span style={{ color: rnd.deltaA === 0 ? '#10B981' : undefined }}>
                      +{rnd.deltaA.toFixed(2)}s
                    </span>
                    <span>/</span>
                    <span style={{ color: rnd.deltaB === 0 ? '#10B981' : undefined }}>
                      +{rnd.deltaB.toFixed(2)}s
                    </span>
                    <span>/</span>
                    <span style={{ color: rnd.deltaC === 0 ? '#10B981' : undefined }}>
                      +{rnd.deltaC.toFixed(2)}s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Way Radar Telemetry Overlay (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold font-sans text-white tracking-tight">
                3-Way Telemetry Radar
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-light">
              Combined multi-rider telemetry polygon overlay.
            </p>

            {/* SVG Radar */}
            <div className="relative w-full aspect-square max-w-[280px] mx-auto my-3 flex items-center justify-center">
              <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
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

                {/* Rider A */}
                <polygon
                  points={radarPoints('A')}
                  fill={riderA.color || '#E10600'}
                  fillOpacity="0.25"
                  stroke={riderA.color || '#E10600'}
                  strokeWidth="2"
                />

                {/* Rider B */}
                <polygon
                  points={radarPoints('B')}
                  fill={riderB.color || '#38BDF8'}
                  fillOpacity="0.2"
                  stroke={riderB.color || '#38BDF8'}
                  strokeWidth="2"
                />

                {/* Rider C */}
                <polygon
                  points={radarPoints('C')}
                  fill={riderC.color || '#F97316'}
                  fillOpacity="0.2"
                  stroke={riderC.color || '#F97316'}
                  strokeWidth="2"
                />

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

          {/* Points Leaderboard */}
          <div className="pt-3 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#141519] border border-white/[0.05]">
              <div className="text-[10px] text-neutral-400 font-sans">{riderA.surname}</div>
              <div className="text-base font-bold font-mono mt-0.5" style={{ color: riderA.color }}>
                {statsA.totalPoints} pts
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#141519] border border-white/[0.05]">
              <div className="text-[10px] text-neutral-400 font-sans">{riderB.surname}</div>
              <div className="text-base font-bold font-mono mt-0.5" style={{ color: riderB.color }}>
                {statsB.totalPoints} pts
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#141519] border border-white/[0.05]">
              <div className="text-[10px] text-neutral-400 font-sans">{riderC.surname}</div>
              <div className="text-base font-bold font-mono mt-0.5" style={{ color: riderC.color }}>
                {statsC.totalPoints} pts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
