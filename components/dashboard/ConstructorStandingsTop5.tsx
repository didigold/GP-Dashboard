'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GiShieldReflect } from 'react-icons/gi';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface ConstructorStandingsTop5Props {
  className?: string;
}

export function ConstructorStandingsTop5({ className }: ConstructorStandingsTop5Props) {
  const constructors = [
    {
      pos: '1',
      name: 'Ducati Corse',
      fullName: 'Ducati Lenovo Team / Ducati Corse',
      bike: 'Desmosedici GP25',
      hq: 'Borgo Panigale, Bologna, Italy',
      points: 620,
      wins: 14,
      podiums: 34,
    },
    {
      pos: '2',
      name: 'Aprilia Racing',
      fullName: 'Aprilia Racing Factory',
      bike: 'Aprilia RS-GP25',
      hq: 'Noale, Venice, Italy',
      points: 490,
      wins: 4,
      podiums: 18,
    },
    {
      pos: '3',
      name: 'Red Bull KTM',
      fullName: 'Red Bull KTM Factory Racing',
      bike: 'KTM RC16 Prototype',
      hq: 'Mattighofen, Austria',
      points: 385,
      wins: 2,
      podiums: 12,
    },
    {
      pos: '4',
      name: 'Yamaha MotoGP',
      fullName: 'Monster Energy Yamaha MotoGP',
      bike: 'Yamaha YZR-M1',
      hq: 'Iwata, Shizuoka, Japan',
      points: 195,
      wins: 0,
      podiums: 3,
    },
    {
      pos: '5',
      name: 'Honda HRC',
      fullName: 'Honda Racing Corporation (HRC)',
      bike: 'Honda RC213V Factory',
      hq: 'Asaka, Saitama, Japan',
      points: 130,
      wins: 0,
      podiums: 1,
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
            <GiShieldReflect className="w-4 h-4 text-white shrink-0" />
            <span className="text-xs sm:text-sm font-sans font-bold tracking-tight text-white truncate">
              Constructors Championship
            </span>
          </div>

          <Link
            href="/standings/constructors"
            className="text-xs font-sans text-neutral-400 hover:text-white flex items-center gap-1 transition-colors shrink-0"
          >
            <span>Teams &amp; Bikes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table Column Headers (Bike column removed as requested for spacious constructor display) */}
        <div className="grid grid-cols-12 gap-1.5 text-xs font-sans font-semibold text-neutral-400 px-1 uppercase tracking-wider items-center h-6">
          <div className="col-span-1 text-center">Pos</div>
          <div className="col-span-7">Constructor</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-2 text-right">W / P</div>
        </div>

        {/* Rows with Official Constructor Factory Logos, matching row height h-11 for pixel alignment */}
        <div className="space-y-1.5 font-sans pt-1">
          {constructors.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-12 gap-1.5 items-center h-11 px-1 border-b border-white/[0.04] last:border-0"
            >
              {/* Pos: 1, 2, 3, 4, 5 */}
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

              {/* Official Factory Logo + Constructor Name with shadcn HoverCard (Spacious col-span-7) */}
              <div className="col-span-7 flex items-center min-w-0">
                <HoverCard openDelay={80} closeDelay={120}>
                  <HoverCardTrigger asChild>
                    <Link
                      href="/standings/constructors"
                      className="flex items-center gap-2.5 min-w-0 hover:underline cursor-pointer group focus-visible:outline-none"
                      title={`Click to view ${item.name} stats`}
                    >
                      <ConstructorLogo constructor={item.name} className="w-7 h-7" />
                      <span className="font-bold text-xs sm:text-sm text-white truncate tracking-tight group-hover:text-[#FF2A24] transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex w-72 flex-col gap-3 p-4 bg-[#0F0F12]/95 border border-white/15 backdrop-blur-3xl shadow-2xl rounded-2xl text-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white/20 shadow-md p-1 bg-white/[0.05] rounded-xl shrink-0">
                        <ConstructorLogo constructor={item.name} className="w-full h-full" />
                        <AvatarFallback className="bg-neutral-800 text-white font-bold text-xs">
                          {item.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-sans font-bold text-sm text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-neutral-300 truncate">
                          {item.bike}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {item.hq}
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
                          W / P
                        </div>
                        <div className="text-xs font-bold text-white pt-0.5">
                          {item.wins}W · {item.podiums}P
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/standings/constructors"
                      className="text-xs font-semibold text-[#E10600] hover:text-[#ff4d48] flex items-center justify-between pt-1 group/link"
                    >
                      <span>View Constructor Standings &amp; Stats</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* Points */}
              <div className="col-span-2 text-right font-bold text-xs sm:text-sm text-white tabular-nums">
                {item.points}
              </div>

              {/* Wins / Podiums */}
              <div className="col-span-2 text-right font-semibold text-xs sm:text-sm text-neutral-300 tabular-nums">
                {item.wins}W · {item.podiums}P
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
