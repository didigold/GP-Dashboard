'use client';

import { useState } from 'react';
import { RIDERS_DATA } from '../../lib/data/mock-race-data';
import { ArrowLeft, ArrowRight, Gauge, Trophy } from 'lucide-react';

export function SectorDeltaBar() {
  const [riderAId, setRiderAId] = useState<string>('bagnaia-1');
  const [riderBId, setRiderBId] = useState<string>('martin-89');

  const riderA = RIDERS_DATA.find((r) => r.id === riderAId) || RIDERS_DATA[0];
  const riderB = RIDERS_DATA.find((r) => r.id === riderBId) || RIDERS_DATA[1];

  // Sector time mock comparisons
  const sectors = [
    { name: 'Sector 1 (San Donato)', timeA: 28.750, timeB: 28.890, winner: 'A', delta: 0.140 },
    { name: 'Sector 2 (Luco - Materassi)', timeA: 29.340, timeB: 29.210, winner: 'B', delta: 0.130 },
    { name: 'Sector 3 (Arrabbiata 1 & 2)', timeA: 24.112, timeB: 24.190, winner: 'A', delta: 0.078 },
    { name: 'Sector 4 (Correntaio - Bucine)', timeA: 23.350, timeB: 23.310, winner: 'B', delta: 0.040 },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-racing-border space-y-6">
      {/* Selector Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Rider A Box */}
        <div className="w-full md:w-1/3 p-4 rounded-xl bg-racing-dark/80 border border-racing-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-8 rounded-full" style={{ backgroundColor: riderA.color }} />
            <div>
              <div className="text-sm font-bold text-white">{riderA.full_name}</div>
              <div className="text-xs text-slate-400 font-mono">#{riderA.number} • {riderA.constructor_name}</div>
            </div>
          </div>
          <select
            value={riderAId}
            onChange={(e) => setRiderAId(e.target.value)}
            className="bg-racing-card text-xs font-mono text-slate-300 rounded px-2 py-1 border border-racing-border outline-none"
          >
            {RIDERS_DATA.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.number} {r.surname}
              </option>
            ))}
          </select>
        </div>

        {/* VS Badge */}
        <div className="px-3 py-1 rounded-full bg-racing-border text-xs font-extrabold font-mono text-racing-cyan border border-racing-cyan/30">
          VS
        </div>

        {/* Rider B Box */}
        <div className="w-full md:w-1/3 p-4 rounded-xl bg-racing-dark/80 border border-racing-border flex items-center justify-between">
          <select
            value={riderBId}
            onChange={(e) => setRiderBId(e.target.value)}
            className="bg-racing-card text-xs font-mono text-slate-300 rounded px-2 py-1 border border-racing-border outline-none"
          >
            {RIDERS_DATA.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.number} {r.surname}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-sm font-bold text-white">{riderB.full_name}</div>
              <div className="text-xs text-slate-400 font-mono">#{riderB.number} • {riderB.constructor_name}</div>
            </div>
            <span className="w-2.5 h-8 rounded-full" style={{ backgroundColor: riderB.color }} />
          </div>
        </div>
      </div>

      {/* Sector Bar Comparisons */}
      <div className="space-y-4">
        {sectors.map((sec) => (
          <div key={sec.name} className="p-3.5 rounded-xl bg-racing-dark/60 border border-racing-border/60">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="font-bold" style={{ color: riderA.color }}>
                {sec.timeA.toFixed(3)}s
              </span>
              <span className="text-slate-300 font-semibold">{sec.name}</span>
              <span className="font-bold" style={{ color: riderB.color }}>
                {sec.timeB.toFixed(3)}s
              </span>
            </div>

            {/* Split Visual Bar */}
            <div className="h-3 w-full bg-racing-card rounded-full flex overflow-hidden border border-racing-border/50">
              <div
                className="h-full transition-all"
                style={{
                  width: sec.winner === 'A' ? '65%' : '35%',
                  backgroundColor: riderA.color,
                  opacity: sec.winner === 'A' ? 1 : 0.4,
                }}
              />
              <div
                className="h-full transition-all"
                style={{
                  width: sec.winner === 'B' ? '65%' : '35%',
                  backgroundColor: riderB.color,
                  opacity: sec.winner === 'B' ? 1 : 0.4,
                }}
              />
            </div>

            <div className="text-[10px] font-mono text-center mt-1 text-slate-400">
              {sec.winner === 'A' ? `${riderA.surname} faster by -${sec.delta}s` : `${riderB.surname} faster by -${sec.delta}s`}
            </div>
          </div>
        ))}
      </div>

      {/* Career Head-to-Head Tally */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-racing-card/40 border border-racing-border text-center font-mono">
        <div>
          <div className="text-lg font-extrabold text-white">{riderA.stats?.victories || 0}</div>
          <div className="text-[11px] text-slate-400">GP WINS</div>
        </div>
        <div>
          <div className="text-lg font-extrabold text-racing-cyan">
            {riderA.stats?.podiums || 0} vs {riderB.stats?.podiums || 0}
          </div>
          <div className="text-[11px] text-slate-400">PODIUMS</div>
        </div>
        <div>
          <div className="text-lg font-extrabold text-white">{riderB.stats?.victories || 0}</div>
          <div className="text-[11px] text-slate-400">GP WINS</div>
        </div>
      </div>
    </div>
  );
}
