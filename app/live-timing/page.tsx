'use client';

import React, { useState } from 'react';
import { useDelayedLiveTiming } from '../../lib/hooks/useDelayedLiveTiming';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LeanMeter } from '../../components/ui/LeanMeter';
import { TyreAsymmetryPill } from '../../components/ui/TyreAsymmetryPill';
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
    <div className="w-full p-4 lg:p-6 space-y-4 max-w-[1920px] mx-auto select-none">
      {/* Session Quick Status & Broadcast Sync Command Strip */}
      <div className="p-3.5 rounded-apex-md bg-surface-subtle border border-surface-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Badge variant="cyan" dot>
            {currentTimingState.head.session_name.toUpperCase()}
          </Badge>
          <span className="text-white font-bold">{currentTimingState.head.circuit_name}</span>
          <span className="text-text-muted hidden md:inline">|</span>
          <span className="text-text-secondary hidden md:inline">LAP: <strong className="text-apex-cyan">{currentTimingState.head.remaining}</strong></span>
          <span className="text-text-muted hidden md:inline">|</span>
          <span className="text-text-secondary hidden lg:inline">AIR: <strong className="text-white">27°C</strong></span>
          <span className="text-text-secondary hidden lg:inline">TRACK: <strong className="text-apex-amber">42°C</strong></span>
          <span className="text-apex-green font-bold hidden lg:inline">DRY</span>
        </div>

        {/* TV Sync Compact Controller */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-card px-3 py-1.5 rounded-apex-sm border border-surface-border">
            <Tv className="w-3.5 h-3.5 text-apex-cyan" />
            <span className="text-text-muted">TV SYNC:</span>
            <span className="font-extrabold text-white">{delay > 0 ? `-${delay.toFixed(1)}s` : 'REAL-TIME'}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setDelay(Math.max(0, parseFloat((delay - 1).toFixed(1))))}
              className="p-1 rounded-apex-xs bg-surface-card border border-surface-border text-text-muted hover:text-white"
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
              className="w-24 sm:w-36 h-1 bg-surface-border rounded-lg appearance-none cursor-pointer accent-apex-cyan"
            />
            <button
              onClick={() => setDelay(Math.min(120, parseFloat((delay + 1).toFixed(1))))}
              className="p-1 rounded-apex-xs bg-surface-card border border-surface-border text-text-muted hover:text-white"
              title="+1s"
            >
              <FastForward className="w-3 h-3" />
            </button>
            {delay > 0 && (
              <button
                onClick={() => setDelay(0)}
                className="p-1 text-text-muted hover:text-white text-[10px]"
                title="Reset to 0s live"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Panoramic Pitwall Table */}
      <div className="rounded-apex-md border border-surface-border overflow-hidden bg-surface-card/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-surface-border bg-surface-subtle/80 text-[10px] uppercase tracking-wider text-text-muted">
                <th className="py-2.5 px-3 w-12 text-center">POS</th>
                <th className="py-2.5 px-2 w-14">NO</th>
                <th className="py-2.5 px-3">RIDER</th>
                <th className="py-2.5 px-3">MANUFACTURER & TEAM</th>
                <th className="py-2.5 px-3 text-right">GAP (P1)</th>
                <th className="py-2.5 px-3 text-right">INT</th>
                <th className="py-2.5 px-2.5 text-center">S1</th>
                <th className="py-2.5 px-2.5 text-center">S2</th>
                <th className="py-2.5 px-2.5 text-center">S3</th>
                <th className="py-2.5 px-2.5 text-center">S4</th>
                <th className="py-2.5 px-3 text-right">TOP SPEED</th>
                <th className="py-2.5 px-3 text-center">MAX LEAN</th>
                <th className="py-2.5 px-3 text-center">TYRES (F/R)</th>
                <th className="py-2.5 px-3 text-center">LAST LAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40 text-xs">
              {ridersList.map((rider) => {
                const isSelected = selectedRiderNum === rider.rider_number;
                const isP1 = rider.pos === 1;

                // Mock realistic lean per rider
                const mockLean = {
                  '1': 65.4,
                  '89': 67.8,
                  '93': 68.2,
                  '23': 65.0,
                  '31': 67.1,
                  '12': 65.1,
                  '33': 64.9,
                  '20': 64.5,
                }[rider.rider_number] || 64.2;

                return (
                  <tr
                    key={rider.rider_number}
                    onClick={() => setSelectedRiderNum(rider.rider_number)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-surface-subtle border-l-4 border-apex-cyan font-semibold'
                        : 'hover:bg-surface-cardHover/70'
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block w-6 h-6 rounded-apex-xs text-center leading-6 font-extrabold ${
                          isP1
                            ? 'bg-apex-cyan text-surface-base shadow-glow-cyan'
                            : rider.pos <= 3
                            ? 'bg-apex-purple/30 text-white border border-apex-purple/40'
                            : 'text-text-secondary bg-surface-subtle'
                        }`}
                      >
                        {rider.pos}
                      </span>
                    </td>

                    {/* Rider Number with Color Bar */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: rider.color }} />
                        <span className="font-extrabold text-white text-sm">#{rider.rider_number}</span>
                      </div>
                    </td>

                    {/* Rider Full Name */}
                    <td className="py-3 px-3 font-sans font-bold text-white text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{rider.rider_surname.toUpperCase()}</span>
                        <span className="text-text-muted font-normal text-xs hidden sm:inline">{rider.rider_name}</span>
                        {rider.on_pit && (
                          <span className="px-1 py-0.2 rounded text-[9px] bg-apex-crimson/20 text-apex-crimson border border-apex-crimson/30">
                            BOX
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Team & Bike */}
                    <td className="py-3 px-3 font-sans text-xs text-text-secondary">
                      <div className="truncate max-w-[200px]">{rider.team_name}</div>
                      <div className="text-[10px] text-text-muted font-mono">{rider.bike_name}</div>
                    </td>

                    {/* Gap to P1 */}
                    <td className="py-3 px-3 text-right font-bold">
                      <span className={isP1 ? 'text-apex-cyan' : 'text-text-primary'}>
                        {rider.gap_first}
                      </span>
                    </td>

                    {/* Interval */}
                    <td className="py-3 px-3 text-right text-text-muted">
                      {rider.gap_prev}
                    </td>

                    {/* Sectors S1 to S4 */}
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded-apex-xs text-[10px] bg-surface-base text-apex-green border border-apex-green/30">
                        {rider.t1 || '28.9'}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded-apex-xs text-[10px] bg-surface-base text-apex-amber border border-apex-amber/30">
                        {rider.t2 || '29.3'}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded-apex-xs text-[10px] bg-surface-base text-apex-purple border border-apex-purple/30">
                        {rider.t3 || '24.1'}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded-apex-xs text-[10px] bg-surface-base text-apex-green border border-apex-green/30">
                        {rider.t4 || '23.3'}
                      </span>
                    </td>

                    {/* Speed Trap */}
                    <td className="py-3 px-3 text-right font-extrabold text-apex-cyan">
                      {rider.speed ? `${rider.speed} km/h` : '361.4 km/h'}
                    </td>

                    {/* Max Lean Angle */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-apex-xs text-[10px] font-bold ${
                        mockLean >= 67 ? 'bg-apex-cyan/20 text-apex-cyan border border-apex-cyan/40 shadow-glow-cyan' : 'bg-surface-subtle text-text-secondary border border-surface-border'
                      }`}>
                        {mockLean.toFixed(1)}°
                      </span>
                    </td>

                    {/* Tyres */}
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold text-text-primary px-2 py-0.5 rounded bg-surface-base border border-surface-border">
                        {rider.tyre_front || 'H'} / {rider.tyre_rear || 'M'}
                      </span>
                    </td>

                    {/* Last Lap Time */}
                    <td className="py-3 px-3 text-center font-bold text-white">
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
        <div className="p-4 rounded-apex-md bg-surface-subtle border border-surface-border grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-10 rounded-full" style={{ backgroundColor: selectedRider.color }} />
            <div>
              <div className="text-base font-extrabold text-white">
                #{selectedRider.rider_number} {selectedRider.rider_name} {selectedRider.rider_surname}
              </div>
              <div className="text-xs text-text-muted font-mono">{selectedRider.team_name}</div>
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
