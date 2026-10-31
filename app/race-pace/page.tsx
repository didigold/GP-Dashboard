'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RacePaceChart } from '../../components/charts/RacePaceChart';
import { BarChart3, Zap, Disc, TrendingDown, Clock } from 'lucide-react';

export default function RacePacePage() {
  const [sessionType, setSessionType] = useState<'sprint' | 'feature'>('feature');

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">STINT DEGRADATION</Badge>
            <Badge variant="outline">SPRINT VS GRAND PRIX</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight uppercase text-white leading-none">
            Race Pace &amp; Tyre Degradation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Comparing the flat-out 10-lap Saturday Sprint (100% attack) with the 23-lap Sunday Grand Prix tyre conservation and the critical Lap 16 cliff.
          </p>
        </div>

        {/* Sprint vs Feature GP Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111111] border border-neutral-800 font-mono text-xs">
          <button
            onClick={() => setSessionType('sprint')}
            className={`px-4 py-2 font-bold uppercase transition-colors ${
              sessionType === 'sprint'
                ? 'bg-[#E10600] text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            SPRINT (10 LAPS)
          </button>
          <button
            onClick={() => setSessionType('feature')}
            className={`px-4 py-2 font-bold uppercase transition-colors ${
              sessionType === 'feature'
                ? 'bg-[#E10600] text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            GRAND PRIX (23 LAPS)
          </button>
        </div>
      </div>

      {/* Flagship Chart View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#E10600]" />
              <span>
                {sessionType === 'sprint' ? 'SATURDAY SPRINT PACE EVOLUTION' : 'SUNDAY GRAND PRIX 23-LAP PACE CLIFF'}
              </span>
            </CardTitle>
            <Badge variant={sessionType === 'sprint' ? 'destructive' : 'green'}>
              {sessionType === 'sprint' ? '100% ATTACK / NO CONSERVATION' : 'LAP 16 TYRE CLIFF ACTIVE'}
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
              <CardTitle className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-[#E10600]" />
                <span>FRONT TYRE HARDNESS</span>
              </CardTitle>
              <Badge variant="outline">MICHELIN SPEC</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-neutral-400 font-light leading-relaxed">
              Mugello Turn 1 San Donato imposes over 1.65G of deceleration from 360 km/h. 
              Over 82% of the premier class grid selected the <strong className="text-white">Hard front compound</strong> to prevent carcass deflection under trail-braking.
            </p>
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">HARD (82% of Grid):</span>
                <span className="text-emerald-400 font-bold">Stable Platform</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">MEDIUM (18% of Grid):</span>
                <span className="text-white font-bold">Viñales, Quartararo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-500" />
                <span>REAR EDGE DEGRADATION</span>
              </CardTitle>
              <Badge variant="amber">THERMAL INDEX</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-neutral-400 font-light leading-relaxed">
              High-speed lateral acceleration through Arrabbiata 1 &amp; 2 causes high surface temperatures. Pace decay rate: <strong className="text-white">+0.045s per lap</strong> until Lap 16 cliff.
            </p>
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">DEGRADATION RATE:</span>
                <span className="text-amber-400 font-bold">+0.045s / lap</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">DROP-OFF CLIFF:</span>
                <span className="text-white font-bold">Lap 16 - 18</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>FUEL WEIGHT BURNOFF OFFSET</span>
              </CardTitle>
              <Badge variant="purple">22 LITERS</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-neutral-400 font-light leading-relaxed">
              Bikes start with 22 liters of fuel (~16.5 kg). As fuel burns off at ~0.7 kg/lap, the lighter bike gains approximately <strong className="text-white">0.03s/lap</strong> in acceleration, partially offsetting early tire wear.
            </p>
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">NET LAP OFFSET:</span>
                <span className="text-white font-bold">-0.72s Total GP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">MAX ACCEL GAIN:</span>
                <span className="text-white font-bold">Laps 18 to 23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
