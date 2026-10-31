'use client';

import { useState } from 'react';
import { Header } from '../../components/navigation/Header';
import { DelaySyncSlider } from '../../components/timing/DelaySyncSlider';
import { LeaderboardTable } from '../../components/timing/LeaderboardTable';
import { useDelayedLiveTiming } from '../../lib/hooks/useDelayedLiveTiming';
import { Zap, Gauge, Flame, ShieldAlert, Award, Disc } from 'lucide-react';

export default function LiveTimingPage() {
  const [delay, setDelay] = useState<number>(0);
  const [isSimulation, setIsSimulation] = useState<boolean>(true);
  const [selectedRiderNum, setSelectedRiderNum] = useState<string>('1');

  // Uses delayed buffer hook with circular memory queue
  const currentTimingState = useDelayedLiveTiming(null, delay, isSimulation);

  // Find selected rider
  const selectedRider = Object.values(currentTimingState.rider || {}).find(
    (r) => r.rider_number === selectedRiderNum
  ) || Object.values(currentTimingState.rider || {})[0];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        isSimulation={isSimulation}
        onToggleSimulation={() => setIsSimulation(!isSimulation)}
        eventName={currentTimingState.head.event_tv_name}
      />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* TV Broadcast Delay Sync Controller */}
        <DelaySyncSlider delay={delay} onDelayChange={setDelay} />

        {/* Live Leaderboard & Focused Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Leaderboard Table (3 Cols) */}
          <div className="lg:col-span-3">
            <LeaderboardTable
              state={currentTimingState}
              selectedRiderNumber={selectedRiderNum}
              onSelectRider={setSelectedRiderNum}
            />
          </div>

          {/* Focused Rider Telemetry Box (1 Col) */}
          <div className="space-y-4">
            {selectedRider && (
              <div className="glass-card p-5 rounded-2xl border border-racing-border space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-racing-border">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-7 rounded-full"
                      style={{ backgroundColor: selectedRider.color || '#FF2A54' }}
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        {selectedRider.rider_name} {selectedRider.rider_surname}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        #{selectedRider.rider_number} • {selectedRider.team_name}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-extrabold font-mono text-racing-cyan">
                    P{selectedRider.pos}
                  </span>
                </div>

                {/* Key Real-Time Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-racing-dark p-2.5 rounded-xl border border-racing-border">
                    <div className="text-[10px] text-slate-400">LAST LAP</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {selectedRider.last_lap_time}
                    </div>
                  </div>

                  <div className="bg-racing-dark p-2.5 rounded-xl border border-racing-border">
                    <div className="text-[10px] text-slate-400">GAP TO P1</div>
                    <div className="text-sm font-bold text-racing-cyan mt-0.5">
                      {selectedRider.gap_first}
                    </div>
                  </div>

                  <div className="bg-racing-dark p-2.5 rounded-xl border border-racing-border">
                    <div className="text-[10px] text-slate-400">SPEED TRAP</div>
                    <div className="text-sm font-bold text-racing-yellow mt-0.5">
                      {selectedRider.speed} km/h
                    </div>
                  </div>

                  <div className="bg-racing-dark p-2.5 rounded-xl border border-racing-border">
                    <div className="text-[10px] text-slate-400">INTERVAL</div>
                    <div className="text-sm font-bold text-slate-300 mt-0.5">
                      {selectedRider.gap_prev}
                    </div>
                  </div>
                </div>

                {/* Micro-Sectors Breakdown */}
                <div className="p-3 bg-racing-dark rounded-xl border border-racing-border space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Sector Split Breakdown
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-xs">
                    <div className="p-1 rounded bg-racing-green/20 text-racing-green border border-racing-green/30">
                      <div className="text-[9px] text-slate-400">T1</div>
                      <div className="font-bold">{selectedRider.t1 || '28.9'}</div>
                    </div>
                    <div className="p-1 rounded bg-racing-yellow/20 text-racing-yellow border border-racing-yellow/30">
                      <div className="text-[9px] text-slate-400">T2</div>
                      <div className="font-bold">{selectedRider.t2 || '29.3'}</div>
                    </div>
                    <div className="p-1 rounded bg-racing-purple/20 text-racing-purple border border-racing-purple/30">
                      <div className="text-[9px] text-slate-400">T3</div>
                      <div className="font-bold">{selectedRider.t3 || '24.1'}</div>
                    </div>
                    <div className="p-1 rounded bg-racing-green/20 text-racing-green border border-racing-green/30">
                      <div className="text-[9px] text-slate-400">T4</div>
                      <div className="font-bold">{selectedRider.t4 || '23.3'}</div>
                    </div>
                  </div>
                </div>

                {/* Michelin Tyre Compounds */}
                <div className="p-3 bg-racing-dark rounded-xl border border-racing-border flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Disc className="w-3.5 h-3.5" />
                    <span>TYRES:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-racing-card border border-racing-border text-white">
                      F: {selectedRider.tyre_front || 'Hard'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-racing-card border border-racing-border text-white">
                      R: {selectedRider.tyre_rear || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Session Legend Card */}
            <div className="glass-card p-4 rounded-2xl border border-racing-border space-y-2 text-xs font-mono">
              <div className="text-slate-400 font-bold text-[10px] uppercase">
                Sector Color Legend
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-racing-purple"></span>
                <span className="text-slate-300">Fastest overall in session</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-racing-green"></span>
                <span className="text-slate-300">Personal session best</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-racing-yellow"></span>
                <span className="text-slate-300">Slower than personal best</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
