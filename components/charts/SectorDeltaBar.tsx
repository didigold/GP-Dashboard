'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOTOGP_RIDERS, getRiderByNumber, getTeamBySlug } from '@/lib/data/motogp-grid';
import { ArrowLeft, ArrowRight, Gauge, Trophy, ShieldCheck } from 'lucide-react';

export function SectorDeltaBar() {
  const [riderAId, setRiderAId] = useState<string>('marquez-93');
  const [riderBId, setRiderBId] = useState<string>('martin-89');

  const riderA = MOTOGP_RIDERS.find((r) => r.id === riderAId) || MOTOGP_RIDERS[0];
  const riderB = MOTOGP_RIDERS.find((r) => r.id === riderBId) || MOTOGP_RIDERS[1];

  const teamA = getTeamBySlug(riderA.team_id);
  const teamB = getTeamBySlug(riderB.team_id);

  // Sector time Sepang comparisons
  const sectors = [
    { name: 'Sector 1 (Main Straight & T1-T2)', timeA: 28.290, timeB: 28.410, winner: 'A', delta: 0.120 },
    { name: 'Sector 2 (T3-T6 High-Speed Sweepers)', timeA: 29.110, timeB: 29.040, winner: 'B', delta: 0.070 },
    { name: 'Sector 3 (T7-T11 Complex & Uphill Crest)', timeA: 23.840, timeB: 23.910, winner: 'A', delta: 0.070 },
    { name: 'Sector 4 (920m Back Straight & T15)', timeA: 23.310, timeB: 23.280, winner: 'B', delta: 0.030 },
  ];

  return (
    <div className="p-6 bg-[#0E0E0E] border border-neutral-800 space-y-6">
      {/* Selector Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Rider A Box */}
        <div className="w-full md:w-5/12 p-4 bg-[#141414] border border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 bg-[#0E0E0E] border border-neutral-800 shrink-0 overflow-hidden">
              <img
                src={riderA.photo_url}
                alt={riderA.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{riderA.full_name}</div>
              <Link
                href={`/teams/${riderA.team_id}`}
                className="text-xs text-neutral-400 hover:text-white hover:underline font-mono truncate block"
              >
                #{riderA.number} • {riderA.team_name}
              </Link>
            </div>
          </div>

          <select
            value={riderAId}
            onChange={(e) => setRiderAId(e.target.value)}
            className="bg-black text-xs font-mono text-neutral-200 px-2 py-1.5 border border-neutral-700 outline-none cursor-pointer"
          >
            {MOTOGP_RIDERS.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.number} {r.surname}
              </option>
            ))}
          </select>
        </div>

        {/* VS Badge */}
        <div className="px-3.5 py-1 bg-[#E10600] text-xs font-extrabold font-mono text-white tracking-widest shrink-0">
          VS
        </div>

        {/* Rider B Box */}
        <div className="w-full md:w-5/12 p-4 bg-[#141414] border border-neutral-800 flex items-center justify-between gap-3">
          <select
            value={riderBId}
            onChange={(e) => setRiderBId(e.target.value)}
            className="bg-black text-xs font-mono text-neutral-200 px-2 py-1.5 border border-neutral-700 outline-none cursor-pointer"
          >
            {MOTOGP_RIDERS.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.number} {r.surname}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 text-right overflow-hidden">
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{riderB.full_name}</div>
              <Link
                href={`/teams/${riderB.team_id}`}
                className="text-xs text-neutral-400 hover:text-white hover:underline font-mono truncate block"
              >
                #{riderB.number} • {riderB.team_name}
              </Link>
            </div>
            <div className="w-12 h-12 bg-[#0E0E0E] border border-neutral-800 shrink-0 overflow-hidden">
              <img
                src={riderB.photo_url}
                alt={riderB.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sector Bar Comparisons */}
      <div className="space-y-4">
        {sectors.map((sec) => (
          <div key={sec.name} className="p-4 bg-[#141414] border border-neutral-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="font-bold text-sm" style={{ color: riderA.color }}>
                {sec.timeA.toFixed(3)}s
              </span>
              <span className="text-neutral-300 font-semibold">{sec.name}</span>
              <span className="font-bold text-sm" style={{ color: riderB.color }}>
                {sec.timeB.toFixed(3)}s
              </span>
            </div>

            {/* Split Visual Bar */}
            <div className="h-3 w-full bg-black rounded-full flex overflow-hidden border border-neutral-800">
              <div
                className="h-full transition-all"
                style={{
                  width: sec.winner === 'A' ? '65%' : '35%',
                  backgroundColor: riderA.color,
                  opacity: sec.winner === 'A' ? 1 : 0.45,
                }}
              />
              <div
                className="h-full transition-all"
                style={{
                  width: sec.winner === 'B' ? '65%' : '35%',
                  backgroundColor: riderB.color,
                  opacity: sec.winner === 'B' ? 1 : 0.45,
                }}
              />
            </div>

            <div className="text-xs font-mono text-center mt-2 text-neutral-400">
              {sec.winner === 'A'
                ? `${riderA.surname} faster by -${sec.delta.toFixed(3)}s`
                : `${riderB.surname} faster by -${sec.delta.toFixed(3)}s`}
            </div>
          </div>
        ))}
      </div>

      {/* Career Head-to-Head Tally */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-[#141414] border border-neutral-800 text-center font-mono">
        <div>
          <div className="text-2xl font-bold text-white">{riderA.stats?.victories || 0}</div>
          <div className="text-xs text-neutral-400 uppercase mt-0.5">GP Victories</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400">
            {riderA.stats?.world_championships || 0} vs {riderB.stats?.world_championships || 0}
          </div>
          <div className="text-xs text-neutral-400 uppercase mt-0.5">World Championships</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{riderB.stats?.victories || 0}</div>
          <div className="text-xs text-neutral-400 uppercase mt-0.5">GP Victories</div>
        </div>
      </div>
    </div>
  );
}
