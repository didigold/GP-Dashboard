'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RIDERS_DATA } from '@/lib/data/mock-race-data';

export default function RidersPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">Premier Class</Badge>
            <Badge variant="outline">22 Riders</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
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
                  <span className="font-mono font-bold text-2xl text-white">
                    #{rider.number}
                  </span>
                </div>
                <Badge variant="outline" size="sm">
                  {rider.country.name}
                </Badge>
              </div>

              {/* Name & Team */}
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  {rider.full_name}
                </h3>
                {rider.nickname && (
                  <p className="text-xs text-[#E10600] font-mono italic">
                    &quot;{rider.nickname}&quot;
                  </p>
                )}
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  {rider.team_name}
                </p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-800/80 font-mono text-center">
                <div className="bg-[#0A0A0A] p-2 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">World Titles</span>
                  <span className="text-sm font-bold text-[#E5A93C]">{rider.stats?.world_championships || 0}</span>
                </div>
                <div className="bg-[#0A0A0A] p-2 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">Victories</span>
                  <span className="text-sm font-bold text-white">{rider.stats?.victories || 0}</span>
                </div>
                <div className="bg-[#0A0A0A] p-2 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">Podiums</span>
                  <span className="text-sm font-bold text-neutral-300">{rider.stats?.podiums || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
