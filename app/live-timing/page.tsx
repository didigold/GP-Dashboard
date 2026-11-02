'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LeanMeter } from '@/components/ui/LeanMeter';
import { TyreAsymmetryPill } from '@/components/ui/TyreAsymmetryPill';
import { DriverNumber } from '@/components/ui/driver-number';
import {
  SectorTrackingTable,
  SectorCell,
  computeSectorBests,
} from '@/components/timing/SectorTrackingTable';
import { RelativeTime } from '@/components/ux/RelativeTime';
import { useDelayedLiveTiming } from '@/lib/hooks/useDelayedLiveTiming';
import { LiveTimingRider } from '@/lib/types/motogp';
import { MOTOGP_RIDERS, MOTOGP_TEAMS, getRiderByNumber, getTeamBySlug } from '@/lib/data/motogp-grid';
import { abbreviateRiderName } from '@/lib/utils/rider-name';
import {
  Radio,
  Tv,
  Rewind,
  FastForward,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Compass,
  X,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Zap,
  Activity,
  ShieldCheck,
  Disc,
} from 'lucide-react';

export default function LiveTimingPage() {
  const [delay, setDelay] = useState<number>(0);
  const [isSimulation, setIsSimulation] = useState<boolean>(false);
  const [selectedRiderNum, setSelectedRiderNum] = useState<string>('37');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false);
  const [comboboxSearch, setComboboxSearch] = useState<string>('');
  const [liveGatewayData, setLiveGatewayData] = useState<any>(null);
  const [isGatewayActive, setIsGatewayActive] = useState<boolean>(false);
  const [isCheckingGateway, setIsCheckingGateway] = useState<boolean>(false);
  const [gatewaySource, setGatewaySource] = useState<string>('Dorna Pulselive Official');
  const [sessionName, setSessionName] = useState<string>('Malaysian GP · Sprint Race');
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);

  const comboboxRef = useRef<HTMLDivElement>(null);

  // Close combobox when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsComboboxOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll Dorna live endpoint
  async function checkLiveGateway(isManual = false) {
    setIsCheckingGateway(true);
    try {
      const res = await fetch('/api/live', { cache: 'no-store' });
      const data = await res.json();
      setLastCheckTime(new Date().toLocaleTimeString());
      setLastSyncAt(Date.now());
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

  useEffect(() => {
    checkLiveGateway();
    const interval = setInterval(checkLiveGateway, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentTimingState = useDelayedLiveTiming(liveGatewayData, delay, isSimulation);

  const ridersList: LiveTimingRider[] = (
    Object.values(currentTimingState.rider || {}) as LiveTimingRider[]
  ).sort((a, b) => a.pos - b.pos);

  const sectorBests = computeSectorBests(ridersList);

  const selectedRider: LiveTimingRider | undefined =
    ridersList.find((r) => r.rider_number === selectedRiderNum) || ridersList[0];

  const selectedGridRider = selectedRider
    ? getRiderByNumber(selectedRider.rider_number)
    : undefined;

  const selectedTeam = selectedGridRider
    ? getTeamBySlug(selectedGridRider.team_id)
    : undefined;

  // Filter riders for combobox
  const filteredRiders = ridersList.filter((r) => {
    const term = comboboxSearch.toLowerCase();
    return (
      r.rider_name.toLowerCase().includes(term) ||
      r.rider_surname.toLowerCase().includes(term) ||
      r.rider_number.includes(term) ||
      r.team_name.toLowerCase().includes(term)
    );
  });

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

          <div className="flex items-center gap-1.5 text-xs">
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

          <span className="text-neutral-600 hidden sm:inline">|</span>
          <RelativeTime since={lastSyncAt} className="hidden text-xs text-neutral-400 sm:inline" />
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0A0A0A] p-0.5 border border-neutral-800 text-xs">
            <button
              onClick={() => {
                setIsSimulation(false);
                checkLiveGateway();
              }}
              className={`px-3 py-1 font-semibold transition-colors ${
                !isSimulation ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Live Gateway
            </button>
            <button
              onClick={() => setIsSimulation(true)}
              className={`px-3 py-1 font-semibold transition-colors ${
                isSimulation ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Replay Buffer
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => checkLiveGateway(true)}
            disabled={isCheckingGateway}
            className="h-8 px-2.5 text-xs flex items-center gap-1.5 font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingGateway ? 'animate-spin' : ''}`} />
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
          <span className="text-neutral-400 hidden md:inline">
            Status: <strong className="text-white">{currentTimingState.head.remaining}</strong>
          </span>
          <span className="text-neutral-600 hidden md:inline">|</span>
          <span className="text-neutral-400 hidden lg:inline">
            Air: <strong className="text-white">32°C</strong>
          </span>
          <span className="text-neutral-400 hidden lg:inline">
            Track: <strong className="text-amber-400">51°C</strong>
          </span>
          <Badge variant="green" size="sm" className="hidden lg:inline-flex">
            Dry Track
          </Badge>
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
              className="p-1.5 bg-[#0A0A0A] border border-neutral-800 text-neutral-400 hover:text-white"
              title="-1s"
            >
              <Rewind className="w-3 h-3" />
            </button>
            <label htmlFor="tv-delay-slider" className="sr-only">
              TV broadcast sync delay in seconds
            </label>
            <input
              id="tv-delay-slider"
              type="range"
              min="0"
              max="120"
              step="0.5"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              className="w-24 sm:w-36 h-1.5 bg-neutral-800 accent-[#E10600] cursor-pointer"
            />
            <button
              onClick={() => setDelay(Math.min(120, parseFloat((delay + 1).toFixed(1))))}
              className="p-1.5 bg-[#0A0A0A] border border-neutral-800 text-neutral-400 hover:text-white"
              title="+1s"
            >
              <FastForward className="w-3 h-3" />
            </button>
            {delay > 0 && (
              <button
                onClick={() => setDelay(0)}
                className="p-1.5 text-neutral-400 hover:text-white text-xs"
                title="Reset to 0s live"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MASTER-DETAIL RESPONSIVE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Compressible Live Timing Table */}
        <div
          className={`space-y-4 transition-all duration-300 ${
            isInspectorOpen ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'
          }`}
        >
          <div className="border border-neutral-800 overflow-hidden bg-[#0A0A0A]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs border-collapse font-mono">
                <caption className="sr-only">
                  Live timing classification: position, rider, team, gaps, lap times, sector splits, speed trap, lean angle, tyres, and last lap.
                </caption>
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-300 text-xs font-sans font-semibold">
                    <th scope="col" className="py-3 px-3 w-12 text-center">Pos</th>
                    <th scope="col" className="py-3 px-2 w-12 text-center">Num</th>
                    <th scope="col" className="py-3 px-4 min-w-[190px]">Rider &amp; Team</th>
                    <th scope="col" className="py-3 px-3 text-center w-20">Gap</th>
                    <th scope="col" className="py-3 px-3 text-center w-24">Lap Time</th>
                    <th scope="col" className="py-3 px-2 text-center w-14">S1</th>
                    <th scope="col" className="py-3 px-2 text-center w-14">S2</th>
                    <th scope="col" className="py-3 px-2 text-center w-14">S3</th>
                    <th scope="col" className="py-3 px-2 text-center w-14">S4</th>
                    <th scope="col" className="py-3 px-3 text-right w-24">Speed</th>
                    <th scope="col" className="py-3 px-3 text-center w-16">Tyres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {ridersList.map((rider) => {
                    const isSelected = isInspectorOpen && rider.rider_number === selectedRiderNum;
                    const isP1 = rider.pos === 1;
                    const gridRider = getRiderByNumber(rider.rider_number);
                    const teamSlug = gridRider?.team_id || 'ducati-lenovo-team';

                    return (
                      <tr
                        key={rider.rider_number}
                        onClick={() => {
                          setSelectedRiderNum(rider.rider_number);
                          setIsInspectorOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedRiderNum(rider.rider_number);
                            setIsInspectorOpen(true);
                          }
                        }}
                        tabIndex={0}
                        aria-label={`${rider.rider_name} ${rider.rider_surname}, position ${rider.pos}${
                          isSelected ? ', selected' : ''
                        }. Press Enter to inspect rider details.`}
                        className={`cursor-pointer transition-colors focus-visible:bg-neutral-900 ${
                          isSelected
                            ? 'bg-[#181818] border-l-2 border-l-[#E10600]'
                            : 'hover:bg-neutral-900/60'
                        }`}
                      >
                        {/* Position */}
                        <td className="py-3 px-3 text-center font-bold text-sm">
                          {isP1 ? (
                            <span className="text-[#E10600]">1</span>
                          ) : (
                            <span className="text-neutral-300">{rider.pos}</span>
                          )}
                        </td>

                        {/* Rider Number */}
                        <td className="py-3 px-2 text-center">
                          <DriverNumber
                            number={rider.rider_number}
                            color={rider.color}
                            size="md"
                            title={`${rider.rider_name} ${rider.rider_surname}`}
                          />
                        </td>

                        {/* Rider Name & Clickable Team */}
                        <td className="py-3 px-4 font-sans">
                          <div className="flex items-center gap-2.5">
                            {/* Rider Photo thumbnail if available */}
                            {gridRider && (
                              <div className="w-8 h-8 rounded-none bg-[#141414] border border-neutral-800 shrink-0 overflow-hidden hidden sm:block">
                                <img
                                  src={gridRider.photo_url}
                                  alt={gridRider.full_name}
                                  className="w-full h-full object-cover object-top"
                                  loading="lazy"
                                />
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="font-sans text-sm font-semibold uppercase tracking-tight text-white"
                                  title={`${rider.rider_name} ${rider.rider_surname}`}
                                >
                                  {abbreviateRiderName(rider.rider_name, rider.rider_surname)}
                                </span>
                                {rider.on_pit && (
                                  <span className="rounded-[2px] bg-amber-500/15 px-1 font-mono text-[9px] font-bold text-amber-400">
                                    P
                                  </span>
                                )}
                              </div>

                              {/* Clickable Team Link */}
                              <Link
                                href={`/teams/${teamSlug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-neutral-400 hover:text-white hover:underline font-mono truncate max-w-[190px] block transition-colors"
                                title={`View ${rider.team_name} profile`}
                              >
                                {rider.team_name}
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* Gap */}
                        <td className="py-3 px-3 text-center font-semibold tabular-nums text-xs">
                          {isP1 ? (
                            <span className="text-emerald-400">Leader</span>
                          ) : (
                            <span className="text-neutral-300">{rider.gap_first}</span>
                          )}
                        </td>

                        {/* Best Lap */}
                        <td className="py-3 px-3 text-center font-bold text-white tabular-nums text-xs">
                          {rider.lap_time || rider.last_lap_time}
                        </td>

                        {/* Sectors S1 to S4 */}
                        <td className="py-3 px-2 text-center">
                          <SectorCell value={rider.t1} best={sectorBests.t1} />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <SectorCell value={rider.t2} best={sectorBests.t2} />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <SectorCell value={rider.t3} best={sectorBests.t3} />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <SectorCell value={rider.t4} best={sectorBests.t4} />
                        </td>

                        {/* Speed Trap */}
                        <td className="py-3 px-3 text-right font-bold text-white tabular-nums text-xs">
                          {rider.speed ? `${rider.speed} km/h` : '362.8 km/h'}
                        </td>

                        {/* Tyres */}
                        <td className="py-3 px-3 text-center">
                          <span className="text-xs font-semibold text-white px-2 py-0.5 bg-neutral-900 border border-neutral-800">
                            {rider.tyre_front?.[0] || 'H'}/{rider.tyre_rear?.[0] || 'M'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sector Tracking */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-sans text-sm font-bold tracking-tight text-white">
                Sector Tracking
              </h2>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-[#E10600]" aria-hidden="true" />
                  Session best
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-[#F97316]" aria-hidden="true" />
                  2nd best
                </span>
              </div>
            </div>
            <SectorTrackingTable riders={ridersList} />
          </div>
        </div>

        {/* Right Column: Dynamic Rider Telemetry Inspector Card */}
        {isInspectorOpen && selectedRider && (
          <div className="lg:col-span-4 xl:col-span-4 sticky top-20 animate-in fade-in slide-in-from-right-4 duration-200">
            <Card className="border-neutral-800 bg-[#0E0E0E] p-5 space-y-5 relative overflow-hidden">
              {/* Brand Accent Bar */}
              <div
                className="h-1.5 w-full absolute top-0 left-0"
                style={{ backgroundColor: selectedRider.color || '#E10600' }}
              />

              {/* Inspector Header: Combobox + Close Button */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {/* Searchable Rider Combobox */}
                <div className="relative flex-1" ref={comboboxRef}>
                  <button
                    onClick={() => setIsComboboxOpen(!isComboboxOpen)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#141414] border border-neutral-800 text-xs font-mono font-bold text-white hover:border-neutral-700 transition-colors"
                  >
                    <span className="truncate">
                      #{selectedRider.rider_number} {selectedRider.rider_name} {selectedRider.rider_surname}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {isComboboxOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#141414] border border-neutral-700 shadow-2xl z-50 max-h-60 overflow-y-auto font-mono text-xs">
                      <div className="p-2 border-b border-neutral-800 sticky top-0 bg-[#141414]">
                        <input
                          type="text"
                          placeholder="Search rider..."
                          value={comboboxSearch}
                          onChange={(e) => setComboboxSearch(e.target.value)}
                          className="w-full px-2 py-1 bg-black border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#E10600]"
                          autoFocus
                        />
                      </div>

                      <div className="divide-y divide-neutral-800/60">
                        {filteredRiders.map((r) => (
                          <button
                            key={r.rider_number}
                            onClick={() => {
                              setSelectedRiderNum(r.rider_number);
                              setIsComboboxOpen(false);
                              setComboboxSearch('');
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-neutral-800 transition-colors flex items-center justify-between ${
                              r.rider_number === selectedRiderNum ? 'bg-neutral-800/80 text-[#E10600]' : 'text-neutral-300'
                            }`}
                          >
                            <span>#{r.rider_number} {r.rider_name} {r.rider_surname}</span>
                            <span className="text-[11px] text-neutral-500">P{r.pos}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Close Button ('X') */}
                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-2 bg-[#141414] border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Close inspector and maximize table"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Rider Identity with Official Photo & Team Logo */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-20 h-20 bg-[#141414] border border-neutral-800 shrink-0 overflow-hidden relative">
                  {selectedGridRider ? (
                    <img
                      src={selectedGridRider.photo_url}
                      alt={selectedGridRider.full_name}
                      className="w-full h-full object-cover object-top filter contrast-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono font-bold text-2xl text-neutral-600">
                      #{selectedRider.rider_number}
                    </div>
                  )}
                </div>

                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-2xl text-white">
                      #{selectedRider.rider_number}
                    </span>
                    <Badge variant="outline" size="sm" className="text-xs font-mono">
                      P{selectedRider.pos} {selectedRider.pos === 1 ? 'LEADER' : selectedRider.gap_first}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white font-sans truncate mt-0.5">
                    {selectedRider.rider_name} {selectedRider.rider_surname}
                  </h3>

                  {selectedTeam ? (
                    <Link
                      href={`/teams/${selectedTeam.slug}`}
                      className="text-xs text-neutral-400 hover:text-white hover:underline font-mono truncate block mt-1 transition-colors"
                    >
                      {selectedTeam.name}
                    </Link>
                  ) : (
                    <p className="text-xs text-neutral-400 font-mono truncate mt-1">
                      {selectedRider.team_name}
                    </p>
                  )}
                </div>

                {selectedTeam && (
                  <div className="w-12 h-12 bg-[#141414] p-1.5 border border-neutral-800 shrink-0 flex items-center justify-center">
                    <img
                      src={selectedTeam.logo_url}
                      alt={selectedTeam.short_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Session Lap Telemetry Box */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#141414] p-3 border border-neutral-800">
                <div>
                  <div className="text-neutral-400 text-[11px]">Best Session Lap</div>
                  <div className="text-white font-bold text-base mt-0.5 tabular-nums">
                    {selectedRider.lap_time || selectedRider.last_lap_time}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-400 text-[11px]">Speed Trap Peak</div>
                  <div className="text-[#E10600] font-bold text-base mt-0.5 tabular-nums">
                    {selectedRider.speed ? `${selectedRider.speed} km/h` : '362.8 km/h'}
                  </div>
                </div>
              </div>

              {/* Sector Splits */}
              <div>
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  Sector Splits
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                  <div className="p-2 bg-[#141414] border border-emerald-900/50">
                    <div className="text-[10px] text-neutral-500">S1</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{selectedRider.t1 || '28.3'}</div>
                  </div>
                  <div className="p-2 bg-[#141414] border border-amber-900/50">
                    <div className="text-[10px] text-neutral-500">S2</div>
                    <div className="text-amber-400 font-bold mt-0.5">{selectedRider.t2 || '29.1'}</div>
                  </div>
                  <div className="p-2 bg-[#141414] border border-purple-900/50">
                    <div className="text-[10px] text-neutral-500">S3</div>
                    <div className="text-purple-400 font-bold mt-0.5">{selectedRider.t3 || '23.8'}</div>
                  </div>
                  <div className="p-2 bg-[#141414] border border-emerald-900/50">
                    <div className="text-[10px] text-neutral-500">S4</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{selectedRider.t4 || '23.3'}</div>
                  </div>
                </div>
              </div>

              {/* Gyroscopic Lean Dynamics Gauge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 uppercase tracking-wider">Gyroscopic Lean Angle</span>
                  <span className="text-white font-bold">
                    {selectedGridRider ? `${selectedGridRider.telemetry_profile.peak_lean_angle}°` : '67.8°'}
                  </span>
                </div>
                <div className="flex justify-center p-3 bg-[#141414] border border-neutral-800">
                  <LeanMeter
                    angle={selectedGridRider ? selectedGridRider.telemetry_profile.peak_lean_angle : 67.8}
                    direction="right"
                  />
                </div>
              </div>

              {/* Michelin Tyres Thermal Condition */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Michelin Asymmetric Shoulder Heat
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TyreAsymmetryPill
                    position="FRONT"
                    compound={(selectedRider.tyre_front as any) || 'Hard'}
                    leftTemp={118}
                    rightTemp={136}
                  />
                  <TyreAsymmetryPill
                    position="REAR"
                    compound={(selectedRider.tyre_rear as any) || 'Medium'}
                    leftTemp={124}
                    rightTemp={148}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <Link
                  href={`/lean-telemetry?rider=${selectedRider.rider_number}`}
                  className="w-full block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-between text-xs font-mono"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-[#E10600]" />
                      <span>Full Gyro Telemetry Trace</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>

                {selectedTeam && (
                  <Link href={`/teams/${selectedTeam.slug}`} className="w-full block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-between text-xs font-mono"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{selectedTeam.short_name} Paddock</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
