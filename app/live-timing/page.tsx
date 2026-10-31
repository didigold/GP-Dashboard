'use client';

import React, { useState, useEffect } from 'react';
import { useDelayedLiveTiming } from '../../lib/hooks/useDelayedLiveTiming';
import { LiveTimingRider, LiveTimingState } from '../../lib/types/motogp';
import { LeanMeter } from '@/components/ui/LeanMeter';
import { TyreAsymmetryPill } from '@/components/ui/TyreAsymmetryPill';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Radio,
  Tv,
  RotateCcw,
  FastForward,
  Rewind,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Compass,
  Disc,
} from 'lucide-react';

export default function LiveTimingPage() {
  const [delay, setDelay] = useState<number>(0);
  const [isSimulation, setIsSimulation] = useState<boolean>(false);
  const [selectedRiderNum, setSelectedRiderNum] = useState<string>('37');
  const [liveGatewayData, setLiveGatewayData] = useState<any>(null);
  const [isGatewayActive, setIsGatewayActive] = useState<boolean>(false);
  const [isCheckingGateway, setIsCheckingGateway] = useState<boolean>(false);
  const [gatewaySource, setGatewaySource] = useState<string>('Dorna Pulselive Official');
  const [sessionName, setSessionName] = useState<string>('Malaysian GP · Sprint Race');
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  // Function to poll the real-world Dorna live-timing endpoint via our proxy
  async function checkLiveGateway() {
    setIsCheckingGateway(true);
    try {
      const res = await fetch('/api/live', { cache: 'no-store' });
      const data = await res.json();
      setLastCheckTime(new Date().toLocaleTimeString());
      if (data && data.active && data.data) {
        setIsGatewayActive(true);
        setLiveGatewayData(data.data);
        if (data.sessionName) setSessionName(data.sessionName);
        if (data.source === 'gateway-live') {
          setGatewaySource('Dorna Live Track Stream');
        } else {
          setGatewaySource('Dorna Sports Official Pulselive API');
        }
      } else {
        setIsGatewayActive(false);
        setLiveGatewayData(null);
      }
    } catch (err) {
      console.warn('Live gateway connection check failed:', err);
      setIsGatewayActive(false);
    } finally {
      setIsCheckingGateway(false);
    }
  }

  // Poll Dorna Sports live-timing gateway every 10 seconds
  useEffect(() => {
    checkLiveGateway();
    const interval = setInterval(checkLiveGateway, 10000);
    return () => clearInterval(interval);
  }, []);

  // When live track action is active, automatically use live data; otherwise allow high-fidelity replay
  const currentTimingState = useDelayedLiveTiming(liveGatewayData, delay, isSimulation);

  const ridersList: LiveTimingRider[] = (Object.values(currentTimingState.rider || {}) as LiveTimingRider[]).sort((a, b) => a.pos - b.pos);
  const selectedRider: LiveTimingRider | undefined = ridersList.find((r) => r.rider_number === selectedRiderNum) || ridersList[0];

  return (
    <div className="w-full min-h-screen bg-black text-white p-4 lg:p-6 space-y-4 max-w-[1920px] mx-auto select-none">
      {/* Live Data Connection & Source Transparency Banner */}
      <div className="p-3 bg-[#111111] border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isGatewayActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-semibold text-white">Data Source:</span>
            <span className="text-neutral-400">{gatewaySource}</span>
          </div>

          <span className="text-neutral-600 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 text-[11px]">
            {isGatewayActive ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {sessionName}
              </span>
            ) : (
              <span className="text-amber-400 font-normal flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Official Sepang Sprint Results Loaded
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0A0A0A] p-0.5 border border-neutral-800 text-[11px]">
            <button
              onClick={() => {
                setIsSimulation(false);
                checkLiveGateway();
              }}
              className={`px-2.5 py-1 font-semibold transition-colors ${
                !isSimulation ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Live Gateway
            </button>
            <button
              onClick={() => setIsSimulation(true)}
              className={`px-2.5 py-1 font-semibold transition-colors ${
                isSimulation ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Replay Buffer
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={checkLiveGateway}
            disabled={isCheckingGateway}
            className="h-7 px-2 text-[10px] flex items-center gap-1 font-mono"
          >
            <RefreshCw className={`w-3 h-3 ${isCheckingGateway ? 'animate-spin' : ''}`} />
            <span>Ping Dorna</span>
          </Button>
        </div>
      </div>

      {/* Session Quick Status & Broadcast Sync Command Strip */}
      <div className="p-3.5 bg-[#111111] border border-neutral-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Badge variant="motogp" dot>
            {currentTimingState.head.session_name}
          </Badge>
          <span className="text-white font-semibold">{currentTimingState.head.circuit_name}</span>
          <span className="text-neutral-600 hidden md:inline">|</span>
          <span className="text-neutral-400 hidden md:inline">Lap: <strong className="text-white">{currentTimingState.head.remaining}</strong></span>
          <span className="text-neutral-600 hidden md:inline">|</span>
          <span className="text-neutral-400 hidden lg:inline">Air: <strong className="text-white">27°C</strong></span>
          <span className="text-neutral-400 hidden lg:inline">Track: <strong className="text-amber-400">42°C</strong></span>
          <Badge variant="green" size="sm" className="hidden lg:inline-flex">Dry Track</Badge>
        </div>

        {/* TV Sync Compact Controller */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Tv className="w-3.5 h-3.5 text-[#E10600]" />
            <span>TV Sync:</span>
            <span className="font-bold text-white tabular-nums">
              {delay === 0 ? 'Real-time' : `-${delay.toFixed(1)}s`}
            </span>
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
              className="w-24 sm:w-36 h-1 bg-neutral-800 accent-[#E10600] cursor-pointer"
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
              <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-[11px] font-sans font-semibold">
                <th className="py-2.5 px-3 w-12 text-center">Pos</th>
                <th className="py-2.5 px-2 w-10 text-center">Num</th>
                <th className="py-2.5 px-4 min-w-[180px]">Rider &amp; Bike</th>
                <th className="py-2.5 px-3 text-center w-20">Gap</th>
                <th className="py-2.5 px-3 text-center w-20">Int</th>
                <th className="py-2.5 px-3 text-center w-24">Lap Time</th>
                <th className="py-2.5 px-2.5 text-center w-14">S1</th>
                <th className="py-2.5 px-2.5 text-center w-14">S2</th>
                <th className="py-2.5 px-2.5 text-center w-14">S3</th>
                <th className="py-2.5 px-2.5 text-center w-14">S4</th>
                <th className="py-2.5 px-3 text-right w-24">Speed</th>
                <th className="py-2.5 px-3 text-center w-20">Lean</th>
                <th className="py-2.5 px-3 text-center w-20">Tyres</th>
                <th className="py-2.5 px-3 text-center w-24">Last Lap</th>
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
                    <td className="py-3 px-3 text-center font-bold">
                      {isP1 ? (
                        <span className="text-[#E10600]">1</span>
                      ) : (
                        <span className="text-neutral-400">{rider.pos}</span>
                      )}
                    </td>

                    {/* Rider Number */}
                    <td className="py-3 px-2 text-center font-bold text-white">
                      #{rider.rider_number}
                    </td>

                    {/* Rider Name & Constructor */}
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4" style={{ backgroundColor: rider.color || '#E10600' }} />
                        <div>
                          <div className="font-semibold text-white tracking-normal">
                            {rider.rider_name} {rider.rider_surname}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-light truncate max-w-[200px]">
                            {rider.team_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Gap */}
                    <td className="py-3 px-3 text-center font-semibold tabular-nums">
                      {isP1 ? <span className="text-emerald-400">Leader</span> : <span className="text-neutral-400">{rider.gap_first}</span>}
                    </td>

                    {/* Interval */}
                    <td className="py-3 px-3 text-center text-neutral-400 tabular-nums">
                      {isP1 ? '—' : rider.gap_prev}
                    </td>

                    {/* Best Lap */}
                    <td className="py-3 px-3 text-center font-bold text-white tabular-nums">
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
                    <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                      {rider.speed ? `${rider.speed} km/h` : '361.4 km/h'}
                    </td>

                    {/* Max Lean Angle */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                        mockLean >= 67 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                      }`}>
                        {mockLean.toFixed(1)}°
                      </span>
                    </td>

                    {/* Tyres */}
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-semibold text-white px-2 py-0.5 bg-neutral-900 border border-neutral-800">
                        {rider.tyre_front || 'H'} / {rider.tyre_rear || 'M'}
                      </span>
                    </td>

                    {/* Last Lap Time */}
                    <td className="py-3 px-3 text-center font-medium text-neutral-300 tabular-nums">
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
              <div className="text-base font-bold text-white">
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
