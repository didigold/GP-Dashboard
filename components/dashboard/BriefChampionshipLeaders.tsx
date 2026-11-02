'use client';

import React from 'react';
import Link from 'next/link';
import { MOTOGP_RIDERS } from '@/lib/data/motogp-grid';
import { ArrowRight } from 'lucide-react';
import { GiTrophy } from 'react-icons/gi';

interface BriefChampionshipLeadersProps {
  className?: string;
}

export function BriefChampionshipLeaders({ className }: BriefChampionshipLeadersProps) {
  const topLeaders = [
    {
      rider: MOTOGP_RIDERS.find((r) => r.number === 93)!,
      points: 374,
      rank: 1,
      gap: 'Leader',
    },
    {
      rider: MOTOGP_RIDERS.find((r) => r.number === 89)!,
      points: 355,
      rank: 2,
      gap: '-19 pts',
    },
    {
      rider: MOTOGP_RIDERS.find((r) => r.number === 72)!,
      points: 322,
      rank: 3,
      gap: '-52 pts',
    },
    {
      rider: MOTOGP_RIDERS.find((r) => r.number === 63)!,
      points: 314,
      rank: 4,
      gap: '-60 pts',
    },
  ].filter((item) => Boolean(item.rider));

  const defaultClasses =
    'w-full bg-[#0D0D0E]/90 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between min-h-[340px]';

  return (
    <div className={className || defaultClasses}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <GiTrophy className="w-4 h-4 text-white" />
            <span className="text-xs font-sans font-semibold tracking-wide text-neutral-300">
              Championship Leaders
            </span>
          </div>

          <Link
            href="/standings"
            className="text-xs font-sans text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Full Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Riders Brief List */}
        <div className="space-y-2.5">
          {topLeaders.map(({ rider, points, rank, gap }) => (
            <div
              key={rider.id}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.12] transition-colors flex items-center justify-between gap-3"
            >
              {/* Left: Rank, Number, Portrait & Name */}
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-sans font-bold text-xs px-2 py-0.5 rounded-md ${
                    rank === 1
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : rank === 2
                      ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                      : rank === 3
                      ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                      : 'bg-white/[0.05] text-neutral-400'
                  }`}
                >
                  P{rank}
                </span>

                <div className="w-9 h-9 rounded-lg bg-[#141414] border border-white/[0.08] overflow-hidden shrink-0">
                  <img
                    src={rider.photo_url}
                    alt={rider.full_name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-sans font-bold text-white truncate flex items-center gap-1.5">
                    <span className="text-[#FF2A24] font-sans">#{rider.number}</span>
                    <span>{rider.full_name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-light truncate">
                    {rider.team_name}
                  </div>
                </div>
              </div>

              {/* Right: Points & Gap */}
              <div className="text-right shrink-0">
                <div className="text-xs font-bold font-sans text-white tabular-nums">
                  {points} <span className="text-[10px] text-neutral-400 font-normal">pts</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-sans mt-0.5">
                  {gap}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-sans text-neutral-400">
        <span>Updated after Rd 19 Sprint</span>
        <span className="text-[#E10600] font-medium">MotoGP™ 2026</span>
      </div>
    </div>
  );
}
