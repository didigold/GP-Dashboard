'use client';

import React from 'react';
import {
  Clock,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import {
  GiFullMotorcycleHelmet,
  GiRoad,
  GiStopwatch,
  GiCardPick,
  GiSun,
  GiThermometerHot,
  GiWindSlap,
  GiHeavyRain,
  GiCheckeredFlag,
  GiCrossedSwords,
} from 'react-icons/gi';

export type TrackStatus = 'CLEAR' | 'YELLOW' | 'SAFETY_CAR' | 'RED';
export type LayoutMode = 'cockpit' | 'map-focus' | 'table-focus' | 'custom-bento';
export type WeatherSimPreset = 'dry' | 'light-rain' | 'heavy-wet';

interface AvailableSession {
  id: string;
  type: string;
  name: string;
}

interface LiveTimingHeaderProps {
  sessionName?: string;
  circuitName?: string;
  elapsedSeconds?: number;
  totalLaps?: number;
  currentLap?: number;
  isGatewayActive?: boolean;
  trackStatus?: TrackStatus;
  onChangeTrackStatus?: (status: TrackStatus) => void;
  weatherPreset?: WeatherSimPreset;
  onChangeWeatherPreset?: (preset: WeatherSimPreset) => void;
  onQuickCompareTop2?: () => void;
  isComparingTwo?: boolean;
  availableSessions?: AvailableSession[];
  selectedSessionType?: string;
  onSelectSessionType?: (type: string) => void;
  layoutMode?: LayoutMode;
  onChangeLayoutMode?: (mode: LayoutMode) => void;
  onResetLayout?: () => void;
  airTemp?: number;
  trackTemp?: number;
  humidity?: number;
  rainMm?: number;
  windSpeedMs?: number;
  className?: string;
}

export function LiveTimingHeader({
  sessionName = 'Petronas Grand Prix of Malaysia',
  circuitName = 'Petronas Sepang International Circuit',
  elapsedSeconds = 2294,
  totalLaps = 20,
  currentLap = 16,
  isGatewayActive = true,
  trackStatus = 'CLEAR',
  onChangeTrackStatus,
  weatherPreset = 'dry',
  onChangeWeatherPreset,
  onQuickCompareTop2,
  isComparingTwo = false,
  availableSessions = [],
  selectedSessionType = 'RAC',
  onSelectSessionType,
  layoutMode = 'cockpit',
  onChangeLayoutMode,
  onResetLayout,
  airTemp = 33.8,
  trackTemp = 48.2,
  humidity = 61.5,
  rainMm = 0,
  windSpeedMs = 2.1,
  className = '',
}: LiveTimingHeaderProps) {
  const [sessionMenuOpen, setSessionMenuOpen] = React.useState(false);
  const [layoutMenuOpen, setLayoutMenuOpen] = React.useState(false);
  const [simMenuOpen, setSimMenuOpen] = React.useState(false);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const lapProgressPct = Math.min(100, Math.max(5, (currentLap / Math.max(1, totalLaps)) * 100));
  const isWet = weatherPreset !== 'dry' || rainMm > 0;

  return (
    <div
      className={`px-3.5 py-2 bg-[#0D0D0E]/90 border border-white/[0.08] rounded-2xl flex flex-wrap items-center justify-between gap-2.5 shadow-2xl select-none font-sans relative z-30 shrink-0 ${className}`}
    >
      {/* LEFT CLUSTER: Event Title + Session Timer + Live Pill + Flag/Weather Simulator Pill */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Event Title & Session Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSessionMenuOpen(!sessionMenuOpen)}
            className="flex items-center gap-1.5 text-left group cursor-pointer pr-1"
          >
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold font-sans tracking-tight text-white group-hover:text-[#FF2A24] transition-colors leading-tight">
                {sessionName.split('·')[0].trim()}
              </h1>
              <p className="text-[10px] font-sans font-semibold text-neutral-400 uppercase tracking-wider leading-none mt-0.5">
                {selectedSessionType === 'SPR' ? 'TISSOT SPRINT' : 'GRAND PRIX RACE'} · {circuitName}
              </p>
            </div>
            {availableSessions.length > 0 && (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform" />
            )}
          </button>

          {sessionMenuOpen && availableSessions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 liquid-glass-dropdown rounded-2xl p-2 z-50 min-w-[230px] font-sans text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1 block">
                Select MotoGP™ Session
              </span>
              {availableSessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectSessionType?.(s.type);
                    setSessionMenuOpen(false);
                  }}
                  className={`w-full text-left h-8 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedSessionType === s.type
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'hover:bg-white/[0.08] text-neutral-200'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] opacity-70">{s.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        {/* Session Stopwatch Pill (h-8) */}
        <div className="h-8 px-3 rounded-full liquid-glass-pill text-xs font-bold text-white flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#E10600]" />
          <span className="tabular-nums">{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Live Status Pill (h-8) */}
        <div className="h-8 px-3 rounded-full bg-[#E10600]/15 border border-[#E10600]/40 text-white text-[11px] font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
          <span>{isGatewayActive ? 'LIVE' : 'OFFICIAL'}</span>
        </div>

        {/* Track Status & Wet Condition Simulator Trigger Pill (h-8) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSimMenuOpen(!simMenuOpen)}
            className={`h-8 px-3 rounded-full border text-[11px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              trackStatus === 'RED'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : trackStatus === 'YELLOW'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : isWet
                ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
            }`}
            title="Click to simulate Track Flags & Wet Race Conditions"
          >
            {isWet ? (
              <GiHeavyRain className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <GiCheckeredFlag className="w-3.5 h-3.5" />
            )}
            <span>
              {trackStatus === 'RED'
                ? 'RED FLAG'
                : trackStatus === 'YELLOW'
                ? 'YELLOW FLAG'
                : weatherPreset === 'heavy-wet'
                ? 'WET RACE · FLAG-TO-FLAG'
                : weatherPreset === 'light-rain'
                ? 'LIGHT RAIN · S2'
                : 'TRACK CLEAR'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {simMenuOpen && (
            <div className="absolute top-full left-0 mt-2 liquid-glass-dropdown rounded-2xl p-2.5 z-50 w-[260px] space-y-2.5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1 block">
                  Track Flag Status
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {(['CLEAR', 'YELLOW', 'RED'] as TrackStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onChangeTrackStatus?.(st);
                        setSimMenuOpen(false);
                      }}
                      className={`h-8 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        trackStatus === st
                          ? 'bg-white text-black shadow-xs'
                          : 'bg-white/[0.05] text-neutral-300 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1 block">
                  Weather &amp; Rain Simulation
                </span>
                {[
                  { id: 'dry' as WeatherSimPreset, label: 'Dry Asphalt (0 mm)', sub: '48.2°C Track · Slick Tyres' },
                  { id: 'light-rain' as WeatherSimPreset, label: 'Light Rain Shower (0.8 mm)', sub: 'White Cross Flag · Damp' },
                  { id: 'heavy-wet' as WeatherSimPreset, label: 'Heavy Monsoon Wet (3.4 mm)', sub: 'Flag-to-Flag · Michelin Wet' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      onChangeWeatherPreset?.(w.id);
                      setSimMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      weatherPreset === w.id
                        ? 'bg-white text-black font-bold'
                        : 'hover:bg-white/[0.08] text-neutral-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{w.label}</div>
                      <div
                        className={`text-[10px] ${
                          weatherPreset === w.id ? 'text-neutral-700' : 'text-neutral-400'
                        }`}
                      >
                        {w.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CLUSTER: Laps Progress Card + Weather Telemetry Pill + 2-Driver Battle Switch + Layout */}
      <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
        {/* Laps Progress Card (Matching F1 Image 2 & Image 5) */}
        <div className="h-8 px-3 rounded-full liquid-glass-pill flex flex-col justify-center min-w-[92px]">
          <div className="flex items-center justify-between gap-2 text-[11px] leading-none">
            <span className="text-[9px] text-neutral-400 font-bold uppercase">LAPS</span>
            <span className="font-black text-white tabular-nums">
              {currentLap} <span className="text-neutral-400 font-semibold text-[10px]">/ {totalLaps}</span>
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-[#3B82F6] rounded-full transition-all duration-300"
              style={{ width: `${lapProgressPct}%` }}
            />
          </div>
        </div>

        {/* Weather Telemetry Bar with Game Icons (Matching Overview UnifiedHeroScheduleCard taste) */}
        <div className="hidden xl:flex items-center gap-3 h-8 px-3.5 rounded-full liquid-glass-pill text-[11px] text-neutral-300">
          <div className="flex items-center gap-1.5" title="Air Temperature">
            <GiSun className="w-3.5 h-3.5 text-sky-400" />
            <span>
              AIR <strong className="text-white tabular-nums">{airTemp.toFixed(1)}°C</strong>
            </span>
          </div>

          <span className="text-white/15">|</span>

          <div className="flex items-center gap-1.5" title="Track Asphalt Temperature">
            <GiThermometerHot className="w-3.5 h-3.5 text-amber-400" />
            <span>
              TRACK <strong className="text-amber-400 font-bold tabular-nums">{trackTemp.toFixed(1)}°C</strong>
            </span>
          </div>

          <span className="text-white/15">|</span>

          <div className="flex items-center gap-1.5" title="Relative Humidity">
            <span>
              HUM <strong className="text-white tabular-nums">{humidity.toFixed(0)}%</strong>
            </span>
          </div>

          <span className="text-white/15">|</span>

          <div className="flex items-center gap-1.5" title="Wind Speed">
            <GiWindSlap className="w-3.5 h-3.5 text-neutral-300" />
            <span>
              WIND <strong className="text-white tabular-nums">{windSpeedMs.toFixed(1)} m/s</strong>
            </span>
          </div>

          <span className="text-white/15">|</span>

          <div className="flex items-center gap-1.5" title="Precipitation">
            <GiHeavyRain className={`w-3.5 h-3.5 ${isWet ? 'text-sky-400' : 'text-emerald-400'}`} />
            <span>
              RAIN{' '}
              <strong className={`tabular-nums ${isWet ? 'text-sky-400' : 'text-emerald-400'}`}>
                {rainMm.toFixed(1)} mm
              </strong>
            </span>
          </div>
        </div>

        {/* Quick 2-Driver Battle Focus Pill (h-8) */}
        {onQuickCompareTop2 && (
          <button
            type="button"
            onClick={onQuickCompareTop2}
            className={`h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isComparingTwo
                ? 'bg-white text-black font-bold shadow-md'
                : 'liquid-glass-pill text-neutral-200 hover:text-white'
            }`}
            title="Toggle 2-Driver Real-Time Comparison Battle Mode"
          >
            <GiCrossedSwords
              className={`w-3.5 h-3.5 ${isComparingTwo ? 'text-[#E10600]' : 'text-[#E10600]'}`}
            />
            <span className="hidden sm:inline">2-Driver Battle</span>
          </button>
        )}

        {/* Layout Switcher & Reset */}
        <div className="flex items-center gap-1.5">
          {onResetLayout && (
            <button
              type="button"
              onClick={onResetLayout}
              className="w-8 h-8 liquid-glass-circle text-neutral-300 hover:text-white cursor-pointer"
              title="Reset workspace layout"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setLayoutMenuOpen(!layoutMenuOpen)}
              className="h-8 px-3 rounded-full liquid-glass-pill text-xs text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <GiCardPick className="w-3.5 h-3.5 text-[#E10600]" />
              <span className="hidden sm:inline">Layout</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {layoutMenuOpen && (
              <div className="absolute top-full right-0 mt-2 liquid-glass-dropdown rounded-2xl p-2 z-50 min-w-[215px] font-sans text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1 block">
                  Workspace Layout
                </span>
                {[
                  {
                    mode: 'cockpit' as LayoutMode,
                    label: 'Cockpit View (Zero-Scroll)',
                    desc: 'Balanced 3-column live telemetry & map',
                    icon: <GiFullMotorcycleHelmet className="w-4 h-4" />,
                  },
                  {
                    mode: 'map-focus' as LayoutMode,
                    label: 'Cinema / Map Focus',
                    desc: 'Expansive 3D track centerpiece',
                    icon: <GiRoad className="w-4 h-4" />,
                  },
                  {
                    mode: 'table-focus' as LayoutMode,
                    label: 'Timing Grid Focus',
                    desc: 'Full sector splits & stint matrix',
                    icon: <GiStopwatch className="w-4 h-4" />,
                  },
                  {
                    mode: 'custom-bento' as LayoutMode,
                    label: 'Custom Magic Bento',
                    desc: 'Freely drag & reorder all frames',
                    icon: <GiCardPick className="w-4 h-4 text-[#00F5D4]" />,
                  },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => {
                      onChangeLayoutMode?.(item.mode);
                      setLayoutMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      layoutMode === item.mode
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'hover:bg-white/[0.08] text-neutral-200'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span
                        className={`text-[9px] font-normal leading-none mt-0.5 ${
                          layoutMode === item.mode ? 'text-neutral-700' : 'text-neutral-400'
                        }`}
                      >
                        {item.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
