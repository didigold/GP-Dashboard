'use client';

import React, { useState } from 'react';
import { useDelayedLiveTiming } from '../../lib/hooks/useDelayedLiveTiming';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LeanMeter } from '@/components/ui/LeanMeter';
import { TyreAsymmetryPill } from '@/components/ui/TyreAsymmetryPill';
import {
  Radio,
  Tv,
  Zap,
  Gauge,
  Disc,
  RotateCcw,
  FastForward,
  Rewind,
  Eye,
  CircleDot,
  Compass,
} from 'lucide-react';

export default function LiveTimingPage() {
  const [delay, setDelay] = useState<number>(0);
  const [isSimulation, setIsSimulation] = useState<boolean>(true);
  const [selectedRiderNum, setSelectedRiderNum] = useState<string>('1');

  // Live feed buffered with circular memory queue
  const currentTimingState = useDelayedLiveTiming(null, delay, isSimulation);

  const ridersList = Object.values(currentTimingState.rider || {}).sort((a, b) => a.pos - b.pos);
  const selectedRider = ridersList.find((r) => r.rider_number === selectedRiderNum) || ridersList[0];

  return (
    <div className="w-full min-h-screen bg-black text-white p-4 lg:p-6 space-y-4 max-w-[1920px] mx-auto select-none">
      {/* Session Quick Status & Broadcast Sync Command Strip */}
      <div className="p-3.5 bg-[#111111] border border-neutral-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Badge variant="motogp" dot>
            {currentTimingState.head.session_name.toUpperCase()}
          </Badge>
          <span className="text-white font-bold">{currentTimingState.head.circuit_name}</span>
          <span className="text-neutral-600 hidden md:inline">|</span>
          <span className="text-neutral-400 hidden md:inline">LAP: <strong className="text-white">{currentTimingState.head.remaining}</strong></span>
          <span className="text-neutral-600 hidden md:inline">|</span>
          <span className="text-neutral-400 hidden lg:inline">AIR: <strong className="text-white">27°C</strong></span>
          <span className="text-neutral-400 hidden lg:inline">TRACK: <strong className="text-amber-400">42°C</strong></span>
          <Badge variant="green" size="sm" className="hidden lg:inline-flex">DRY TRACK</Badge>
        </div>

        {/* TV Sync Compact Controller */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0A0A0A] px-3 py-1.5 border border-neutral-800">
            <Tv className="w-3.5 h-3.5 text-[#E10600]" />
            <span className="text-neutral-400">TV SYNC:</span>
            <span className="font-extrabold text-white tabular-nums">{delay > 0 ? `-${delay.toFixed(1)}s` : 'REAL-TIME'}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setDelay(Math.max(0, parseFloat((delay - 1).toFixed(1))))}
              className="p-1 bg-[#0A0A0A] border border-neutral-800 text-neutral-400 hover:text-white"
              title="-1s"
            >
              <Rewind className="w-3 h-3" />
            </button>
            <input
              type="range"
              min="0"
              max="120"
              step="0.5"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              className="w-24 sm:w-36 h-1 bg-neutral-800 appearance-none cursor-pointer accent-[#E10600]"
            />
            <button
              onClick={() => setDelay(Math.min(120, parseFloat((delay + 1).toFixed(1))))}
              className="p-1 bg-[#0A0A0A] border border-neutral-800 text-neutral-400 hover:text-white"
              title="+1s"
            >
              <FastForward className="w-3 h-3" />
            </button>
            {delay > 0 && (
              <button
                onClick={() => setDelay(0)}
                className="p-1 text-neutral-400 hover:text-white text-[10px]"
                title="Reset to 0s live"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Panoramic Pitwall Table */}
      <div className="border border-neutral-800 overflow-hidden bg-[#0A0A0A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-[10px] tracking-wider uppercase">
                <th className="py-2.5 px-3 w-12 text-center">POS</th>
                <th className="py-2.5 px-2 w-10 text-center">NUM</th>
                <th className="py-2.5 px-4 min-w-[180px]">RIDER &amp; BIKE</th>
                <th className="py-2.5 px-3 text-center w-20">GAP</th>
                <th className="py-2.5 px-3 text-center w-20">INT</th>
                <th className="py-2.5 px-3 text-center w-24">LAP TIME</th>
                <th className="py-2.5 px-2.5 text-center w-14">S1</th>
                <th className="py-2.5 px-2.5 text-center w-14">S2</th>
                <th className="py-2.5 px-2.5 text-center w-14">S3</th>
                <th className="py-2.5 px-2.5 text-center w-14">S4</th>
                <th className="py-2.5 px-3 text-right w-24">SPEED</th>
                <th className="py-2.5 px-3 text-center w-20">LEAN</th>
                <th className="py-2.5 px-3 text-center w-20">TYRES</th>
                <th className="py-2.5 px-3 text-center w-24">LAST LAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {ridersList.map((rider) => {
                const isSelected = rider.rider_number === selectedRiderNum;
                const isP1 = rider.pos === 1;
                const mockLean = 63.5 + ((parseInt(rider.rider_number) * 7) % 48) / 10;

                return (
                  <tr
                    key={rider.rider_number}
                    onClick={() => setSelectedRiderNum(rider.rider_number)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#181818] border-l-2 border-l-[#E10600]'
                        : 'hover:bg-neutral-900/60'
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3 px-3 text-center font-black">
                      {isP1 ? (
                        <span className="text-[#E10600] font-bold">1</span>
                      ) : (
                        <span className="text-neutral-400">{rider.pos}</span>
                      )}
                    </td>

                    {/* Rider Number */}
                    <td className="py-3 px-2 text-center font-extrabold text-white">
                      #{rider.rider_number}
                    </td>

                    {/* Rider Name & Constructor */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4" style={{ backgroundColor: rider.color || '#E10600' }} />
                        <div>
                          <div className="font-bold text-white tracking-wide">
                            {rider.rider_name} {rider.rider_surname}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-light truncate max-w-[200px]">
                            {rider.team_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Gap */}
                    <td className="py-3 px-3 text-center font-bold tabular-nums">
                      {isP1 ? <span className="text-emerald-400">LEADER</span> : <span className="text-neutral-400">{rider.gap_first}</span>}
                    </td>

                    {/* Interval */}
                    <td className="py-3 px-3 text-center text-neutral-400 tabular-nums">
                      {isP1 ? '—' : rider.gap_prev}
                    </td>

                    {/* Best Lap */}
                    <td className="py-3 px-3 text-center font-extrabold text-white tabular-nums">
                      {rider.lap_time || rider.last_lap_time}
                    </td>

                    {/* Sectors S1 to S4 */}
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 text-[10px] bg-black text-emerald-400 border border-emerald-900">
                        {rider.t1 || '28.9'}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 text-[10px] bg-black text-amber-400 border border-amber-900">
                        {rider.t2 || '29.3'}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 text-[10px] bg-black text-purple-400 border border-purple-900">
                        {rider.t3 || '24.1'}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 text-[10px] bg-black text-emerald-400 border border-emerald-900">
                        {rider.t4 || '23.3'}
                      </span>
                    </td>

                    {/* Speed Trap */}
                    <td className="py-3 px-3 text-right font-black text-white tabular-nums">
                      {rider.speed ? `${rider.speed} km/h` : '361.4 km/h'}
                    </td>

                    {/* Max Lean Angle */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                        mockLean >= 67 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                      }`}>
                        {mockLean.toFixed(1)}°
                      </span>
                    </td>

                    {/* Tyres */}
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold text-white px-2 py-0.5 bg-neutral-900 border border-neutral-800">
                        {rider.tyre_front || 'H'} / {rider.tyre_rear || 'M'}
                      </span>
                    </td>

                    {/* Last Lap Time */}
                    <td className="py-3 px-3 text-center font-bold text-neutral-300 tabular-nums">
                      {rider.last_lap_time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Focused Rider Telemetry Drawer */}
      {selectedRider && (
        <div className="p-4 bg-[#111111] border border-neutral-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3">
            <span className="w-2 h-10 bg-[#E10600]" />
            <div>
              <div className="text-base font-black text-white">
                #{selectedRider.rider_number} {selectedRider.rider_name} {selectedRider.rider_surname}
              </div>
              <div className="text-xs text-neutral-400 font-mono font-light">{selectedRider.team_name}</div>
            </div>
          </div>

          {/* Lean Gauge */}
          <div className="flex justify-center">
            <LeanMeter angle={selectedRider.rider_number === '93' ? 68.2 : selectedRider.rider_number === '89' ? 67.8 : 65.4} direction="right" />
          </div>

          {/* Tyre Status */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-3">
            <TyreAsymmetryPill position="FRONT" compound={selectedRider.tyre_front as any || 'Hard'} leftTemp={125} rightTemp={84} />
            <TyreAsymmetryPill position="REAR" compound={selectedRider.tyre_rear as any || 'Medium'} leftTemp={134} rightTemp={88} />
          </div>
        </div>
      )}
    </div>
  );
}
