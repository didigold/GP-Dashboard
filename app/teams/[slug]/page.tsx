'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTeamBySlug, getTeamRiders } from '@/lib/data/motogp-grid';
import {
  ChevronLeft,
  Radio,
  Compass,
  Trophy,
  Zap,
  Wrench,
  Gauge,
  Layers,
  ArrowRight,
  Disc,
} from 'lucide-react';

export default function TeamDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const team = getTeamBySlug(slug);

  if (!team) {
    return (
      <div className="w-full min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold font-sans">Team Not Found</h1>
        <p className="text-sm text-neutral-400">
          The requested team does not exist in the 2026 MotoGP grid.
        </p>
        <Link href="/teams">
          <Button variant="outline">Back to Teams Paddock</Button>
        </Link>
      </div>
    );
  }

  const riders = getTeamRiders(team.id);

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-8 max-w-[1560px] mx-auto select-none">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link href="/teams">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-xs font-mono"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Constructors &amp; Teams</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Badge
            variant={team.type === 'Factory' ? 'motogp' : 'outline'}
            size="sm"
          >
            {team.type} Team
          </Badge>
          <Badge variant="outline" size="sm">
            {team.constructor}
          </Badge>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative border border-neutral-800 bg-[#0A0A0A] overflow-hidden">
        {/* Brand color stripe */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: team.color }}
        />

        <div className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#141414] border border-neutral-800 p-3 shrink-0 flex items-center justify-center">
              <img
                src={team.logo_url}
                alt={`${team.name} Logo`}
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5"
                  style={{ backgroundColor: team.color }}
                />
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                  Official 2026 Entrant
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight">
                {team.name}
              </h1>
              <p className="text-sm font-mono text-neutral-300">
                Machine: <span className="text-white font-semibold">{team.bike_name}</span> · {team.headquarters}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="spec-cell min-w-[130px]">
              <div className="text-[11px] font-mono text-neutral-400">2026 Points</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {team.points_2026}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">Constructor Rank</div>
            </div>

            <Link href="/live-timing">
              <Button variant="motogp" size="lg" className="flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Track on Live Pitwall</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Riders (Left) + Technical Specifications (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Riders Lineup (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <span
                className="w-2.5 h-2.5"
                style={{ backgroundColor: team.color }}
              />
              <span>Official 2026 Rider Lineup</span>
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              {riders.length} Premier Class Riders
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {riders.map((rider) => (
              <Card
                key={rider.id}
                className="p-5 border-neutral-800 bg-[#0A0A0A] hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar: Number & Country */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-6"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="text-2xl font-mono font-bold text-white">
                        #{rider.number}
                      </span>
                    </div>

                    <Badge variant="outline" size="sm">
                      {rider.country.name}
                    </Badge>
                  </div>

                  {/* Rider Portrait and Name */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-20 h-20 bg-[#111111] border border-neutral-800 shrink-0 overflow-hidden relative">
                      <img
                        src={rider.photo_url}
                        alt={rider.full_name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-sans text-white leading-tight">
                        {rider.full_name}
                      </h3>
                      {rider.nickname && (
                        <p className="text-xs font-mono text-[#E10600] mt-0.5">
                          &quot;{rider.nickname}&quot;
                        </p>
                      )}
                      <p className="text-xs font-mono text-neutral-400 mt-1">
                        Born: {rider.birth_city}
                      </p>
                    </div>
                  </div>

                  {/* Telemetry Snapshot Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono bg-[#111111] p-3 border border-neutral-800/80">
                    <div>
                      <div className="text-neutral-500 text-[11px]">Peak Lean Angle</div>
                      <div className="text-white font-bold text-sm mt-0.5">
                        {rider.telemetry_profile.peak_lean_angle}°
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-500 text-[11px]">Max Braking G</div>
                      <div className="text-[#E10600] font-bold text-sm mt-0.5">
                        {rider.telemetry_profile.max_braking_g} G
                      </div>
                    </div>
                  </div>

                  {/* Career Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs font-mono">
                    <div className="p-2 bg-[#141414] border border-neutral-800/60">
                      <div className="text-neutral-500 text-[10px]">World Titles</div>
                      <div className="text-amber-400 font-bold text-sm">
                        {rider.stats.world_championships}
                      </div>
                    </div>
                    <div className="p-2 bg-[#141414] border border-neutral-800/60">
                      <div className="text-neutral-500 text-[10px]">GP Wins</div>
                      <div className="text-white font-bold text-sm">
                        {rider.stats.victories}
                      </div>
                    </div>
                    <div className="p-2 bg-[#141414] border border-neutral-800/60">
                      <div className="text-neutral-500 text-[10px]">Podiums</div>
                      <div className="text-white font-bold text-sm">
                        {rider.stats.podiums}
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/lean-telemetry?rider=${rider.number}`}
                  className="pt-3 border-t border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>Analyze Gyro Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E10600]" />
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Technical Motorcycle Specifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#E10600]" />
              <span>Machine Engineering Specs</span>
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              {team.bike_name}
            </span>
          </div>

          <Card className="p-5 border-neutral-800 bg-[#0A0A0A] space-y-4">
            <div className="space-y-3 font-mono text-xs">
              <div className="pb-3 border-b border-neutral-800/80">
                <div className="text-neutral-400 text-[11px] uppercase tracking-wider">
                  Powerplant &amp; Valvetrain
                </div>
                <div className="text-white font-medium mt-1 leading-relaxed">
                  {team.specs.engine}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-neutral-800/80">
                <div>
                  <div className="text-neutral-400 text-[11px] uppercase tracking-wider">
                    Max Output
                  </div>
                  <div className="text-amber-400 font-bold text-sm mt-1">
                    {team.specs.power}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-400 text-[11px] uppercase tracking-wider">
                    Top Speed Record
                  </div>
                  <div className="text-[#E10600] font-bold text-sm mt-1">
                    {team.specs.top_speed}
                  </div>
                </div>
              </div>

              <div className="pb-3 border-b border-neutral-800/80">
                <div className="text-neutral-400 text-[11px] uppercase tracking-wider">
                  Chassis &amp; Swingarm
                </div>
                <div className="text-white font-medium mt-1 leading-relaxed">
                  {team.specs.chassis}
                </div>
              </div>

              <div className="pb-3 border-b border-neutral-800/80">
                <div className="text-neutral-400 text-[11px] uppercase tracking-wider">
                  Carbon Braking System
                </div>
                <div className="text-white font-medium mt-1 leading-relaxed">
                  {team.specs.brakes}
                </div>
              </div>

              <div className="pb-3 border-b border-neutral-800/80">
                <div className="text-neutral-400 text-[11px] uppercase tracking-wider">
                  Suspension Units
                </div>
                <div className="text-white font-medium mt-1 leading-relaxed">
                  {team.specs.suspension}
                </div>
              </div>

              <div>
                <div className="text-neutral-400 text-[11px] uppercase tracking-wider">
                  Unified Electronics
                </div>
                <div className="text-white font-medium mt-1 leading-relaxed">
                  {team.specs.electronics}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
              <Link href="/braking-zones" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                  Braking Telemetry
                </Button>
              </Link>
              <Link href="/tyres-asymmetry" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                  Tyre Wear Thermals
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
