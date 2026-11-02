'use client';

import React, { useState } from 'react';
import { RacePaceChart } from '@/components/charts/RacePaceChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Disc, Flame } from 'lucide-react';

export default function RacePacePage() {
  const [sessionType, setSessionType] = useState<'sprint' | 'gp'>('gp');

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">Tyre Degradation Analysis</Badge>
            <Badge variant="outline">Sprint vs Grand Prix</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            Race Pace &amp; Tyre Degradation Cliff
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Lap-by-lap pace evolution: 100% attack mode across the 11-lap Saturday Sprint vs thermal conservation and tyre cliff management in the 23-lap Grand Prix.
          </p>
        </div>

        {/* Session Type Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#111111] border border-neutral-800 text-xs">
          <button
            onClick={() => setSessionType('sprint')}
            className={`px-3 py-1.5 font-semibold transition-colors ${
              sessionType === 'sprint' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sprint (11 Laps)
          </button>
          <button
            onClick={() => setSessionType('gp')}
            className={`px-3 py-1.5 font-semibold transition-colors ${
              sessionType === 'gp' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Grand Prix (23 Laps)
          </button>
        </div>
      </div>

      {/* Flagship Chart View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-sans font-bold text-sm">
              <BarChart3 className="w-4 h-4 text-[#E10600]" />
              <span>
                {sessionType === 'sprint' ? 'Saturday Sprint Pace Evolution' : 'Sunday Grand Prix 23-Lap Pace Cliff'}
              </span>
            </CardTitle>
            <Badge variant={sessionType === 'sprint' ? 'destructive' : 'green'}>
              {sessionType === 'sprint' ? '100% Attack • No Conservation' : 'Lap 16 Tyre Cliff Active'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <RacePaceChart />
        </CardContent>
      </Card>

      {/* Physics Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-sans font-bold text-sm">
                <Disc className="w-4 h-4 text-[#E10600]" />
                <span>Front Tyre Hardness</span>
              </CardTitle>
              <Badge variant="outline">Michelin Spec</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-neutral-400 font-light leading-relaxed font-sans">
              Mugello Turn 1 San Donato imposes over 1.65G of deceleration from 360 km/h. 
              Over 82% of the premier class grid selected the <strong className="text-white">Hard front compound</strong> to prevent carcass deflection under trail-braking.
            </p>
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Hard (82% of Grid):</span>
                <span className="text-emerald-400 font-bold">Stable Platform</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Medium (18% of Grid):</span>
                <span className="text-white font-bold">Viñales, Quartararo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-sans font-bold text-sm">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Rear Compound Drop-Off</span>
              </CardTitle>
              <Badge variant="amber">Lap 16 Cliff</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-neutral-400 font-light leading-relaxed font-sans">
              In the Sprint, riders run the Soft rear with zero tyre management. In Sunday&apos;s race, riders who pushed early suffered a <strong className="text-amber-400">+1.2s lap time drop</strong> after Lap 16.
            </p>
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Laps 1–15 Median:</span>
                <span className="text-white font-bold">1&apos;45.620</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Laps 16–23 Median:</span>
                <span className="text-amber-400 font-bold">1&apos;46.850 (+1.23s)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="consistency" className="scroll-mt-20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-sans font-bold text-sm">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Championship Pace Delta</span>
              </CardTitle>
              <Badge variant="green">P1 vs P2</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-neutral-400 font-light leading-relaxed font-sans">
              Bagnaia achieved race victory through metronomic consistency, maintaining within 0.18s of his median pace for 19 consecutive laps.
            </p>
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">P1 Bagnaia Consistency:</span>
                <span className="text-emerald-400 font-bold">σ = 0.142s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">P2 Martin Consistency:</span>
                <span className="text-white font-bold">σ = 0.228s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
