'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GiTrophy } from 'react-icons/gi';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface DriverStandingsTop5Props {
  className?: string;
}

export function DriverStandingsTop5({ className }: DriverStandingsTop5Props) {
  const topRiders = [
    {
      pos: '1',
      firstInitial: 'M',
      surname: 'MAR',
      fullName: 'Marc Márquez',
      number: 93,
      teamName: 'Ducati Lenovo Team',
      bike: 'Desmosedici GP25',
      teamColor: '#CC0000',
      photoUrl: 'https://photos.motogp.com/riders/2/3/23e50438-a657-4fb0-a190-3262b5472f29/2026/profile/main-129758.png',
      points: 374,
      gap: '±0',
      wins: 3,
      championships: 8,
      recent: [1, 2, 1],
    },
    {
      pos: '2',
      firstInitial: 'J',
      surname: 'MAR',
      fullName: 'Jorge Martín',
      number: 89,
      teamName: 'Aprilia Racing',
      bike: 'Aprilia RS-GP25',
      teamColor: '#800020',
      photoUrl: 'https://photos.motogp.com/riders/5/b/5b9af34e-da94-4ca2-9c4c-6be0fc8b1bbc/2026/profile/main-560307.png',
      points: 355,
      gap: '-19',
      wins: 7,
      championships: 2,
      recent: [2, 1, 3],
    },
    {
      pos: '3',
      firstInitial: 'M',
      surname: 'BEZ',
      fullName: 'Marco Bezzecchi',
      number: 72,
      teamName: 'Aprilia Racing',
      bike: 'Aprilia RS-GP25',
      teamColor: '#1A1A1A',
      photoUrl: 'https://photos.motogp.com/riders/e/6/e622ec5b-5ccf-457c-a67f-ec028f0ddf6e/2026/profile/main-590216.png',
      points: 322,
      gap: '-52',
      wins: 3,
      championships: 0,
      recent: [3, 4, 2],
    },
    {
      pos: '4',
      firstInitial: 'F',
      surname: 'BAG',
      fullName: 'Francesco Bagnaia',
      number: 63,
      teamName: 'Ducati Lenovo Team',
      bike: 'Desmosedici GP25',
      teamColor: '#CC0000',
      photoUrl: 'https://photos.motogp.com/riders/6/6/66b78301-5826-4986-b11e-fa68a7bd77a7/2026/profile/main-794330.png',
      points: 314,
      gap: '-60',
      wins: 11,
      championships: 3,
      recent: [1, 3, 1],
    },
    {
      pos: '5',
      firstInitial: 'P',
      surname: 'ACO',
      fullName: 'Pedro Acosta',
      number: 37,
      teamName: 'Red Bull KTM Factory Racing',
      bike: 'KTM RC16 Prototype',
      teamColor: '#FF6600',
      photoUrl: 'https://photos.motogp.com/riders/e/a/ea39a0af-95d3-4a37-81a7-f332efdb9216/2026/profile/main-274705.png',
      points: 298,
      gap: '-76',
      wins: 2,
      championships: 2,
      recent: [4, 2, 4],
    },
  ];

  const defaultClasses =
    'w-full bg-[#0D0D0E]/90 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-start text-white';

  return (
    <div className={className || defaultClasses}>
      <div className="space-y-3.5 w-full">
        {/* Card Header (Separator removed as requested) */}
        <div className="flex items-center justify-between pb-2 h-8">
          <div className="flex items-center gap-2">
            <GiTrophy className="w-4 h-4 text-white shrink-0" />
            <span className="text-xs sm:text-sm font-sans font-bold tracking-tight text-white truncate">
              Riders Championship
            </span>
          </div>

          <Link
            href="/standings"
            className="text-xs font-sans text-neutral-400 hover:text-white flex items-center gap-1 transition-colors shrink-0"
          >
            <span>Full Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table Column Headers (Standardized h-6 for alignment across cards) */}
        <div className="grid grid-cols-12 gap-1.5 text-xs font-sans font-semibold text-neutral-400 px-1 uppercase tracking-wider items-center h-6">
          <div className="col-span-1 text-center">Pos</div>
          <div className="col-span-3">Rider</div>
          <div className="col-span-2 text-center">#</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-1 text-right">Diff</div>
          <div className="col-span-1 text-center">Wins</div>
          <div className="col-span-2 text-center">Last 3</div>
        </div>

        {/* Fixed Row Height (h-11) so all 5 rows comfortably fit without being cut off */}
        <div className="space-y-1.5 font-sans pt-1">
          {topRiders.map((item) => (
            <div
              key={item.number}
              className="grid grid-cols-12 gap-1.5 items-center h-11 px-1 border-b border-white/[0.04] last:border-0"
            >
              {/* Position: 1, 2, 3, 4, 5 */}
              <div
                className={`col-span-1 text-center font-bold text-xs sm:text-sm tabular-nums ${
                  item.pos === '1'
                    ? 'text-amber-300'
                    : item.pos === '2'
                    ? 'text-neutral-200'
                    : item.pos === '3'
                    ? 'text-amber-600'
                    : 'text-neutral-400'
                }`}
              >
                {item.pos}
              </div>

              {/* Rider Name with shadcn HoverCard + Click leads to Driver Stats */}
              <div className="col-span-3 text-xs sm:text-sm truncate tracking-tight min-w-0">
                <HoverCard openDelay={80} closeDelay={120}>
                  <HoverCardTrigger asChild>
                    <Link
                      href="/standings"
                      className="inline-block truncate hover:underline cursor-pointer group focus-visible:outline-none"
                      title={`Click to view ${item.fullName} stats`}
                    >
                      <span className="font-normal text-neutral-400 group-hover:text-neutral-200">
                        {item.firstInitial}{' '}
                      </span>
                      <span className="font-bold text-white group-hover:text-[#FF2A24] transition-colors">
                        {item.surname}
                      </span>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex w-72 flex-col gap-3 p-4 bg-[#0F0F12]/95 border border-white/15 backdrop-blur-3xl shadow-2xl rounded-2xl text-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white/20 shadow-md shrink-0">
                        <AvatarImage src={item.photoUrl} alt={item.fullName} />
                        <AvatarFallback
                          style={{ backgroundColor: item.teamColor }}
                          className="text-white font-black text-xs"
                        >
                          {item.firstInitial}
                          {item.surname.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-sans font-bold text-sm text-white truncate">
                          {item.fullName}
                        </div>
                        <div className="text-xs text-neutral-300 truncate">
                          {item.teamName}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {item.bike}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-sans">
                      <div className="bg-white/[0.04] p-1.5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          Position
                        </div>
                        <div className="text-xs font-bold text-white pt-0.5">
                          P{item.pos}
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-1.5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          Points
                        </div>
                        <div className="text-xs font-bold text-white pt-0.5">
                          {item.points}
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-1.5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          Wins
                        </div>
                        <div className="text-xs font-bold text-white pt-0.5">
                          {item.wins}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/standings"
                      className="text-xs font-semibold text-[#E10600] hover:text-[#ff4d48] flex items-center justify-between pt-1 group/link"
                    >
                      <span>View Full Driver Stats</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* Dedicated # Column: Full Sharp Square Background (rounded-none), Strictly Aligned */}
              <div className="col-span-2 flex justify-center items-center">
                <span
                  className="w-7 h-7 rounded-none font-black text-xs sm:text-sm text-white flex items-center justify-center shadow-md select-none"
                  style={{ backgroundColor: item.teamColor }}
                  title={`${item.fullName} #${item.number}`}
                >
                  {item.number}
                </span>
              </div>

              {/* Points */}
              <div className="col-span-2 text-right font-bold text-xs sm:text-sm text-white tabular-nums">
                {item.points}
              </div>

              {/* Diff: ±0 for leader, -19 for others */}
              <div className="col-span-1 text-right font-semibold text-xs sm:text-sm text-neutral-300 tabular-nums">
                {item.gap}
              </div>

              {/* Victories (Wins) */}
              <div className="col-span-1 text-center font-semibold text-xs sm:text-sm text-neutral-300 tabular-nums">
                {item.wins}
              </div>

              {/* Last 3 Positions: Centered Circles */}
              <div className="col-span-2 flex items-center justify-center gap-1">
                {item.recent.map((pos, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full aspect-square flex items-center justify-center font-bold text-[9px] sm:text-[10px] leading-none shrink-0 shadow-sm ${
                      pos === 1
                        ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40'
                        : pos === 2
                        ? 'bg-slate-300/25 text-slate-200 border border-slate-300/40'
                        : pos === 3
                        ? 'bg-amber-700/25 text-amber-500 border border-amber-700/40'
                        : 'bg-white/10 text-neutral-300 border border-white/10'
                    }`}
                  >
                    <span className="block leading-none -translate-y-[0.5px] tabular-nums">
                      {pos}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
