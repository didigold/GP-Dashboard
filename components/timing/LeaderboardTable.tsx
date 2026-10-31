'use client';

import { useState } from 'react';
import { LiveTimingState, LiveTimingRider } from '../../lib/types/motogp';
import { ChevronUp, ChevronDown, Minus, Zap, ShieldAlert, CircleDot } from 'lucide-react';

interface LeaderboardTableProps {
  state: LiveTimingState;
  onSelectRider?: (riderNumber: string) => void;
  selectedRiderNumber?: string;
}

export function LeaderboardTable({
  state,
  onSelectRider,
  selectedRiderNumber,
}: LeaderboardTableProps) {
  // Sort riders by position
  const ridersList: LiveTimingRider[] = Object.values(state.rider || {}).sort(
    (a, b) => a.pos - b.pos
  );

  return (
    <div className="glass-card rounded-2xl border border-racing-border overflow-hidden">
      {/* Session Progress Header */}
      <div className="px-5 py-4 border-b border-racing-border bg-racing-dark/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-racing-green animate-pulse"></span>
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {state.head.session_name}
            </span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-racing-border text-slate-300">
            {state.head.circuit_name}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-slate-400">
            LAP: <span className="text-racing-cyan font-bold">{state.head.remaining}</span>
          </div>
          <div className="text-slate-400">
            SESSION: <span className="text-white font-bold">{state.head.duration}</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-racing-border/80 bg-racing-card/40 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4 w-12 text-center">POS</th>
              <th className="py-3 px-3 w-16">NO</th>
              <th className="py-3 px-4">RIDER</th>
              <th className="py-3 px-4">TEAM & BIKE</th>
              <th className="py-3 px-3 text-right">GAP (P1)</th>
              <th className="py-3 px-3 text-right">INT</th>
              <th className="py-3 px-3 text-center">T1</th>
              <th className="py-3 px-3 text-center">T2</th>
              <th className="py-3 px-3 text-center">T3</th>
              <th className="py-3 px-3 text-center">T4</th>
              <th className="py-3 px-3 text-right">SPEED</th>
              <th className="py-3 px-3 text-center">TYRES</th>
              <th className="py-3 px-4 text-center">LAST LAP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-racing-border/40 font-mono text-xs">
            {ridersList.map((rider, index) => {
              const isSelected = selectedRiderNumber === rider.rider_number;
              const isP1 = rider.pos === 1;

              return (
                <tr
                  key={rider.rider_number}
                  onClick={() => onSelectRider && onSelectRider(rider.rider_number)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-racing-cyan/10 border-l-4 border-racing-cyan font-semibold'
                      : 'hover:bg-racing-cardHover/70'
                  }`}
                >
                  {/* Position */}
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span
                      className={`inline-block w-6 h-6 rounded-md text-center leading-6 ${
                        isP1
                          ? 'bg-racing-cyan text-black font-extrabold shadow-glow-cyan'
                          : rider.pos <= 3
                          ? 'bg-racing-purple/30 text-white border border-racing-purple/40'
                          : 'text-slate-300'
                      }`}
                    >
                      {rider.pos}
                    </span>
                  </td>

                  {/* Rider Number with Color Stripe */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-5 rounded-full"
                        style={{ backgroundColor: rider.color || '#FF2A54' }}
                      />
                      <span className="font-extrabold text-white text-sm">
                        {rider.rider_number}
                      </span>
                    </div>
                  </td>

                  {/* Rider Name */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {rider.rider_surname.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-xs hidden sm:inline">
                          {rider.rider_name}
                        </span>
                      </div>
                      {rider.on_pit && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-racing-red font-mono">
                          <CircleDot className="w-2.5 h-2.5 animate-pulse" /> IN PIT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Team & Bike */}
                  <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">
                    <div className="truncate max-w-[180px]">{rider.team_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{rider.bike_name}</div>
                  </td>

                  {/* Gap to First */}
                  <td className="py-3.5 px-3 text-right font-bold">
                    <span className={isP1 ? 'text-racing-cyan' : 'text-slate-200'}>
                      {rider.gap_first}
                    </span>
                  </td>

                  {/* Interval */}
                  <td className="py-3.5 px-3 text-right text-slate-400">
                    {rider.gap_prev}
                  </td>

                  {/* Sector 1 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-racing-dark/80 text-racing-green border border-racing-green/30">
                      {rider.t1 || '28.9'}
                    </span>
                  </td>

                  {/* Sector 2 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-racing-dark/80 text-racing-yellow border border-racing-yellow/30">
                      {rider.t2 || '29.3'}
                    </span>
                  </td>

                  {/* Sector 3 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-racing-dark/80 text-racing-purple border border-racing-purple/30">
                      {rider.t3 || '24.1'}
                    </span>
                  </td>

                  {/* Sector 4 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-racing-dark/80 text-racing-green border border-racing-green/30">
                      {rider.t4 || '23.3'}
                    </span>
                  </td>

                  {/* Speed Trap (km/h) */}
                  <td className="py-3.5 px-3 text-right font-bold text-racing-cyan">
                    {rider.speed ? `${rider.speed} km/h` : '361.4'}
                  </td>

                  {/* Tyres */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px]">
                      <span
                        className="px-1.5 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor:
                            rider.tyre_front === 'Hard'
                              ? '#EAB308'
                              : rider.tyre_front === 'Medium'
                              ? '#E2E8F0'
                              : '#EF4444',
                          color: '#000',
                        }}
                      >
                        {rider.tyre_front ? rider.tyre_front[0] : 'H'}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor:
                            rider.tyre_rear === 'Hard'
                              ? '#EAB308'
                              : rider.tyre_rear === 'Medium'
                              ? '#E2E8F0'
                              : '#EF4444',
                          color: '#000',
                        }}
                      >
                        {rider.tyre_rear ? rider.tyre_rear[0] : 'M'}
                      </span>
                    </div>
                  </td>

                  {/* Last Lap Time */}
                  <td className="py-3.5 px-4 text-center font-bold text-white">
                    {rider.last_lap_time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
