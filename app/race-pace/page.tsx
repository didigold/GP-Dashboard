'use client';

import { Header } from '../../components/navigation/Header';
import { RacePaceChart } from '../../components/charts/RacePaceChart';
import { Disc, TrendingDown, Layers, Zap } from 'lucide-react';

export default function RacePacePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName="Grand Prix Race Pace & Tyre Analysis" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Race Pace Chart */}
        <RacePaceChart />

        {/* Michelin Tyre Allocation & Degradation Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-2xl border border-racing-border space-y-3">
            <div className="flex items-center gap-2 text-racing-cyan text-xs font-mono font-bold">
              <Disc className="w-4 h-4" />
              <span>FRONT TYRE COMPOUND MATRIX</span>
            </div>
            <h3 className="text-sm font-bold text-white">Braking Stability & Grip</h3>
            <p className="text-xs text-slate-400">
              Mugello Turn 1 San Donato imposes over 1.5G of deceleration from 360 km/h. 
              Majority of riders chose the <strong>Hard compound</strong> front for support under heavy trail-braking.
            </p>
            <div className="p-3 bg-racing-dark rounded-xl border border-racing-border text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">HARD (82% of Grid):</span>
                <span className="text-racing-green font-bold">Preferred</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MEDIUM (18% of Grid):</span>
                <span className="text-slate-300">Viñales, Quartararo</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-racing-border space-y-3">
            <div className="flex items-center gap-2 text-racing-purple text-xs font-mono font-bold">
              <TrendingDown className="w-4 h-4" />
              <span>REAR TYRE DEGRADATION</span>
            </div>
            <h3 className="text-sm font-bold text-white">Traction & Drop-Off</h3>
            <p className="text-xs text-slate-400">
              The high-speed Arrabbiata curves create extreme thermal loads on the right shoulder.
              Pace drop-off typically accelerates from <strong>Lap 16 of 23</strong>.
            </p>
            <div className="p-3 bg-racing-dark rounded-xl border border-racing-border text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">DEGRADATION INDEX:</span>
                <span className="text-racing-yellow font-bold">+0.045s / lap</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CLIFF THRESHOLD:</span>
                <span className="text-white">Lap 18</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-racing-border space-y-3">
            <div className="flex items-center gap-2 text-racing-red text-xs font-mono font-bold">
              <Zap className="w-4 h-4" />
              <span>RACE STRATEGY PREDICTION</span>
            </div>
            <h3 className="text-sm font-bold text-white">Fuel Weight Compensation</h3>
            <p className="text-xs text-slate-400">
              MotoGP bikes start with 22 liters of fuel (~16.5 kg). As fuel burns off, lap times 
              offset tyre degradation by approximately <strong>0.03s per lap</strong>.
            </p>
            <div className="p-3 bg-racing-dark rounded-xl border border-racing-border text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">NET PACE BALANCE:</span>
                <span className="text-racing-cyan font-bold">Stable until L15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">FUEL BURN EFFECT:</span>
                <span className="text-white">-0.7s total race</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
