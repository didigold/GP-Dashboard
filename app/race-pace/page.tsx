'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Banner } from '../../components/ui/Banner';
import { RacePaceChart } from '../../components/charts/RacePaceChart';
import { BarChart3, Zap, Disc, TrendingDown, Clock } from 'lucide-react';

export default function RacePacePage() {
  const [sessionType, setSessionType] = useState<'sprint' | 'feature'>('feature');

  return (
    <div className="w-full p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-apex-green">
            <BarChart3 className="w-4 h-4" />
            <span>SPRINT (100% ATTACK) vs FEATURE GRAND PRIX (MANAGEMENT)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
            Race Pace & Stint Degradation
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Pace distribution boxplots, tire thermal cliff thresholds, and Saturday Sprint vs Sunday Grand Prix pace comparisons.
          </p>
        </div>

        {/* Sprint vs Feature GP Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-subtle rounded-apex-sm border border-surface-border font-mono text-xs">
          <button
            onClick={() => setSessionType('sprint')}
            className={`px-3 py-1.5 rounded-apex-xs font-bold transition-all ${
              sessionType === 'sprint'
                ? 'bg-apex-purple text-white shadow-glow-purple'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            SATURDAY SPRINT (11 LAPS)
          </button>
          <button
            onClick={() => setSessionType('feature')}
            className={`px-3 py-1.5 rounded-apex-xs font-bold transition-all ${
              sessionType === 'feature'
                ? 'bg-apex-cyan text-surface-base shadow-glow-cyan'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            SUNDAY GRAND PRIX (23 LAPS)
          </button>
        </div>
      </div>

      {sessionType === 'sprint' ? (
        <Banner
          type="info"
          title="SATURDAY SPRINT MODE: ZERO TIRE MANAGEMENT"
          description="In the 11-lap Sprint, riders run Engine Map 1 (maximum output) and Soft rear tires with zero conservation. Laps are consistently within 0.2s of qualifying pace."
        />
      ) : (
        <Banner
          type="yellow"
          title="SUNDAY GRAND PRIX: THE CRITICAL LAP 16 CLIFF"
          description="At full Grand Prix distance (23 laps), rear tire grip begins degrading rapidly from Lap 16. Riders who overdrive in the opening 10 laps lose up to 1.2s per lap in the final 5 laps."
        />
      )}

      {/* Main Race Pace Boxplot Chart */}
      <RacePaceChart />

      {/* Technical Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="pitwall">
          <CardHeader>
            <CardTitle>
              <Disc className="w-4 h-4 text-apex-cyan" />
              <span>FRONT TIRE COMPOUND MATRIX</span>
            </CardTitle>
            <Badge variant="cyan">MANDATORY MICHELIN</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-text-secondary leading-relaxed">
              Mugello Turn 1 San Donato imposes over 1.65G of deceleration from 360 km/h. 
              Over 82% of the premier class grid selected the <strong>Hard front compound</strong> to prevent carcass deflection under trail-braking.
            </p>
            <div className="p-3 bg-surface-base rounded-apex-xs border border-surface-border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-muted">HARD (82% of Grid):</span>
                <span className="text-apex-green font-bold">Stable Platform</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">MEDIUM (18% of Grid):</span>
                <span className="text-text-primary font-bold">Viñales, Quartararo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="pitwall">
          <CardHeader>
            <CardTitle>
              <TrendingDown className="w-4 h-4 text-apex-amber" />
              <span>REAR EDGE DEGRADATION</span>
            </CardTitle>
            <Badge variant="amber">THERMAL INDEX</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-text-secondary leading-relaxed">
              High-speed lateral acceleration through Arrabbiata 1 & 2 causes high surface temperatures. Pace decay rate: <strong>+0.045s per lap</strong> until Lap 16 cliff.
            </p>
            <div className="p-3 bg-surface-base rounded-apex-xs border border-surface-border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-muted">DEGRADATION RATE:</span>
                <span className="text-apex-amber font-bold">+0.045s / lap</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">DROP-OFF CLIFF:</span>
                <span className="text-white font-bold">Lap 16 - 18</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="pitwall">
          <CardHeader>
            <CardTitle>
              <Clock className="w-4 h-4 text-apex-purple" />
              <span>FUEL WEIGHT BURNOFF OFFSET</span>
            </CardTitle>
            <Badge variant="purple">22 LITERS</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono">
            <p className="text-text-secondary leading-relaxed">
              Bikes start with 22 liters of fuel (~16.5 kg). As fuel burns off at ~0.7 kg/lap, the lighter bike gains approximately <strong>0.03s/lap</strong> in acceleration, partially offsetting early tire wear.
            </p>
            <div className="p-3 bg-surface-base rounded-apex-xs border border-surface-border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-muted">NET LAP OFFSET:</span>
                <span className="text-apex-cyan font-bold">-0.72s Total GP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">MAX ACCEL GAIN:</span>
                <span className="text-white font-bold">Laps 18 to 23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
