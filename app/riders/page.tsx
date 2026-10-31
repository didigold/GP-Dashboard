'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RIDERS_DATA } from '@/lib/data/mock-race-data';
import { Users, Trophy, Flag, Award, Flame, ExternalLink } from 'lucide-react';

export default function RidersPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">PREMIER CLASS</Badge>
            <Badge variant="outline">22 PILOTS</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight uppercase text-white leading-none">
            Official Rider Grid &amp; Milestones
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            World Championship riders, manufacturer alliances, career milestones, and technical specifications.
          </p>
        </div>
      </div>

      {/* Riders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {RIDERS_DATA.map((rider) => (
          <Card key={rider.id} className="p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div className="space-y-3">
              {/* Rider Top Row: Number & Flag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-7"
                    style={{ backgroundColor: rider.color || '#E10600' }}
                  />
                  <span className="font-mono font-black text-2xl text-white">
                    #{rider.number}
                  </span>
                </div>
                <Badge variant="outline" size="sm">
                  {rider.country.name}
                </Badge>
              </div>

              {/* Name & Team */}
              <div>
                <h3 className="text-base font-black uppercase text-white font-sans">
                  {rider.full_name}
                </h3>
                {rider.nickname && (
                  <p className="text-xs text-[#E10600] font-mono italic">
                    &quot;{rider.nickname}&quot;
                  </p>
                )}
                <p className="text-xs text-neutral-400 font-mono font-light mt-1">
                  {rider.team_name}
                </p>
              </div>
            </div>

            {/* Career Milestone Counters */}
            <div className="mt-5 pt-4 border-t border-neutral-800 grid grid-cols-4 gap-2 text-center font-mono">
              <div className="spec-cell p-2">
                <div className="text-[9px] text-neutral-500 uppercase">TITLES</div>
                <div className="text-sm font-black text-amber-400 tabular-nums">
                  {rider.stats?.world_championships || 0}
                </div>
              </div>

              <div className="spec-cell p-2">
                <div className="text-[9px] text-neutral-500 uppercase">WINS</div>
                <div className="text-sm font-black text-white tabular-nums">
                  {rider.stats?.victories || 0}
                </div>
              </div>

              <div className="spec-cell p-2">
                <div className="text-[9px] text-neutral-500 uppercase">PODIUMS</div>
                <div className="text-sm font-black text-emerald-400 tabular-nums">
                  {rider.stats?.podiums || 0}
                </div>
              </div>

              <div className="spec-cell p-2">
                <div className="text-[9px] text-neutral-500 uppercase">POLES</div>
                <div className="text-sm font-black text-neutral-300 tabular-nums">
                  {rider.stats?.poles || 0}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
