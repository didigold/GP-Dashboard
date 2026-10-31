'use client';

import { useState } from 'react';
import { MOCK_RACE_PACE_DATA } from '../../lib/data/mock-race-data';
import { RiderRacePace } from '../../lib/types/motogp';

export function RacePaceChart() {
  const [selectedRiders, setSelectedRiders] = useState<string[]>([
    'Francesco Bagnaia',
    'Jorge Martin',
    'Marc Marquez',
  ]);

  const toggleRider = (name: string) => {
    setSelectedRiders((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const activeData: RiderRacePace[] = MOCK_RACE_PACE_DATA.filter((r) =>
    selectedRiders.includes(r.rider_name)
  );

  return (
    <div className="glass-card p-6 rounded-2xl border border-racing-border space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">
            Race Pace & Tyre Degradation Curve
          </h2>
          <p className="text-xs text-slate-400">
            Lap-by-lap evolution across the 23-lap Grand Prix distance
          </p>
        </div>

        {/* Rider Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {MOCK_RACE_PACE_DATA.map((rider) => {
            const isSelected = selectedRiders.includes(rider.rider_name);
            return (
              <button
                key={rider.rider_name}
                onClick={() => toggleRider(rider.rider_name)}
                className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? 'border-transparent text-white font-bold shadow-sm'
                    : 'bg-racing-dark text-slate-400 border-racing-border opacity-50'
                }`}
                style={{
                  backgroundColor: isSelected ? `${rider.color}25` : undefined,
                  borderColor: isSelected ? rider.color : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: rider.color }}
                />
                <span>#{rider.rider_number} {rider.rider_name.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synthetic Boxplot / Pace Matrix Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeData.map((r) => (
          <div
            key={r.rider_name}
            className="p-4 rounded-xl bg-racing-dark/80 border border-racing-border/80 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-sm font-bold text-white">{r.rider_name}</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{r.constructor_name}</span>
            </div>

            <div className="my-4 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-racing-card p-2 rounded-lg border border-racing-border">
                <div className="text-[10px] text-slate-400">MEDIAN PACE</div>
                <div className="text-sm font-bold text-racing-cyan">1'45.78s</div>
              </div>
              <div className="bg-racing-card p-2 rounded-lg border border-racing-border">
                <div className="text-[10px] text-slate-400">BEST LAP</div>
                <div className="text-sm font-bold text-racing-purple">{r.best_lap}</div>
              </div>
            </div>

            {/* Tyre Specs */}
            <div className="text-[11px] font-mono text-slate-400 border-t border-racing-border/40 pt-2 flex items-center justify-between">
              <span>FRONT: <strong className="text-slate-200">{r.front_tyre.split(' ')[0]}</strong></span>
              <span>REAR: <strong className="text-slate-200">{r.rear_tyre.split(' ')[0]}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* SVG Pace Degradation Line Chart */}
      <div className="p-4 rounded-xl bg-racing-dark/60 border border-racing-border overflow-hidden">
        <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
          <span>Y: LAP TIME DELTA (+0.0s to +2.5s)</span>
          <span>X: RACE DISTANCE (LAPS 1 TO 23)</span>
        </div>

        <div className="h-44 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="800" y2="30" stroke="#1e2638" strokeDasharray="4 4" />
            <line x1="0" y1="70" x2="800" y2="70" stroke="#1e2638" strokeDasharray="4 4" />
            <line x1="0" y1="110" x2="800" y2="110" stroke="#1e2638" strokeDasharray="4 4" />

            {/* Plot lines for active riders */}
            {activeData.map((rider) => {
              const points = rider.laps
                .map((lap, i) => {
                  const x = (i / 22) * 800;
                  // normalize lap time between 105.0 and 107.5 sec
                  const norm = (lap.lap_time_seconds - 105.0) / 2.5;
                  const y = Math.max(10, Math.min(150, norm * 140));
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <polyline
                  key={rider.rider_name}
                  fill="none"
                  stroke={rider.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
