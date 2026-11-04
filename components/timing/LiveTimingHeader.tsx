'use client';

import React from 'react';
import {
  Thermometer,
  CloudSun,
  Droplets,
  Wind,
  Gauge,
  CloudRain,
  Flag,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  GiFullMotorcycleHelmet,
  GiRoad,
  GiStopwatch,
  GiCardPick,
  GiTrophyCup,
} from 'react-icons/gi';

export type TrackStatus = 'CLEAR' | 'YELLOW' | 'SAFETY_CAR' | 'RED';
export type LayoutMode = 'cockpit' | 'map-focus' | 'table-focus' | 'custom-bento';

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
  availableSessions?: AvailableSession[];
  selectedSessionType?: string;
  onSelectSessionType?: (type: string) => void;
  layoutMode?: LayoutMode;
  onChangeLayoutMode?: (mode: LayoutMode) => void;
  onResetLayout?: () => void;
  airTemp?: number;
  trackTemp?: number;
  humidity?: number;
  className?: string;
}

export function LiveTimingHeader({
  sessionName = 'Petronas Grand Prix of Malaysia',
  circuitName = 'Petronas Sepang International Circuit',
  elapsedSeconds = 7200, // 02:00:00
  totalLaps = 20,
  currentLap = 18,
  isGatewayActive = true,
  trackStatus = 'CLEAR',
  onChangeTrackStatus,
  availableSessions = [],
  selectedSessionType = 'RAC',
  onSelectSessionType,
  layoutMode = 'cockpit',
  onChangeLayoutMode,
  onResetLayout,
  airTemp = 34,
  trackTemp = 49,
  humidity = 61,
  className = '',
}: LiveTimingHeaderProps) {
  const [sessionMenuOpen, setSessionMenuOpen] = React.useState(false);
  const [layoutMenuOpen, setLayoutMenuOpen] = React.useState(false);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`px-4 py-2.5 bg-[#0B0D14] border border-neutral-800/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl select-none font-sans ${className}`}
    >
      {/* Left: Event Title + Session Timer + Live Pill + Flag Pill (Matching Reference Image) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Event Title with Session Switcher */}
        <div className="relative">
          <button
            onClick={() => setSessionMenuOpen(!sessionMenuOpen)}
            className="flex items-center gap-1.5 text-left group"
          >
            <div>
              <h1 className="text-sm sm:text-base font-bold font-sans tracking-tight text-white group-hover:text-[#E10600] transition-colors">
                {sessionName}
              </h1>
              <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider">
                {circuitName}
              </p>
            </div>
            {availableSessions.length > 0 && (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform" />
            )}
          </button>

          {/* Session Switcher Dropdown */}
          {sessionMenuOpen && availableSessions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 bg-[#0E111A] border border-neutral-700 rounded-xl shadow-2xl p-1.5 z-50 min-w-[220px] font-sans text-xs space-y-1">
              <span className="text-[10px] font-sans uppercase text-neutral-400 px-2 py-1 block">
                Select MotoGP Session
              </span>
              {availableSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSessionType?.(s.type);
                    setSessionMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedSessionType === s.type
                      ? 'bg-[#E10600] text-white'
                      : 'hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="font-sans text-[10px] opacity-75">{s.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />

        {/* Stopwatch Pill (02:00:00) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 font-sans text-xs font-semibold text-white">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span className="tabular-nums">{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Live Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/50 text-red-300 border border-red-800/60 font-sans text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
          <span>{isGatewayActive ? 'LIVE' : 'OFFICIAL CLASSIFICATION'}</span>
        </div>

        {/* Track Flag Pill */}
        <div
          onClick={() =>
            onChangeTrackStatus?.(trackStatus === 'CLEAR' ? 'YELLOW' : 'CLEAR')
          }
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 font-sans text-[10px] font-semibold cursor-pointer hover:border-emerald-600 transition-colors"
          title="Click to toggle track flag simulation"
        >
          <Flag className="w-3 h-3 fill-emerald-400 text-emerald-400" />
          <span>{trackStatus === 'CLEAR' ? 'TRACK CLEAR' : 'YELLOW FLAG'}</span>
        </div>
      </div>

      {/* Right: Lap Counter + Meteorological Weather Telemetry (Matching Reference Image) */}
      <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
        {/* Laps Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs">
          <span className="text-[10px] text-neutral-400 font-semibold uppercase">LAPS</span>
          <span className="font-bold text-white tabular-nums">
            {currentLap} <span className="text-neutral-400 text-[10px]">/ {totalLaps}</span>
          </span>
        </div>

        {/* Weather Telemetry Group */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] bg-neutral-900/60 px-3 py-1 rounded-full border border-neutral-800 text-neutral-300">
          <div className="flex items-center gap-1" title="Air Temperature">
            <Thermometer className="w-3 h-3 text-sky-400" />
            <span>AIR <strong className="text-white">{airTemp.toFixed(1)}°C</strong></span>
          </div>

          <span className="text-neutral-700">|</span>

          <div className="flex items-center gap-1" title="Track Asphalt Temperature">
            <CloudSun className="w-3 h-3 text-amber-400" />
            <span>TRACK <strong className="text-amber-400 font-bold">{trackTemp.toFixed(1)}°C</strong></span>
          </div>

          <span className="text-neutral-700">|</span>

          <div className="flex items-center gap-1" title="Humidity">
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>HUM <strong className="text-white">{humidity.toFixed(1)}%</strong></span>
          </div>

          <span className="text-neutral-700">|</span>

          <div className="flex items-center gap-1" title="Wind Velocity">
            <Wind className="w-3 h-3 text-neutral-400" />
            <span>WIND <strong className="text-white">2.1 m/s</strong></span>
          </div>

          <span className="text-neutral-700">|</span>

          <div className="flex items-center gap-1" title="Atmospheric Pressure">
            <Gauge className="w-3 h-3 text-neutral-400" />
            <span>PRESS <strong className="text-white">1012 hPa</strong></span>
          </div>

          <span className="text-neutral-700">|</span>

          <div className="flex items-center gap-1" title="Precipitation">
            <CloudRain className="w-3 h-3 text-emerald-400" />
            <span>RAIN <strong className="text-emerald-400">0 mm</strong></span>
          </div>
        </div>

        {/* Top Right Layout Switcher & Reset Button (Matching F1 Dashboard Immersion) */}
        <div className="flex items-center gap-1.5">
          {onResetLayout && (
            <button
              onClick={onResetLayout}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              title="Reset layout frames to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setLayoutMenuOpen(!layoutMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 hover:text-white hover:border-neutral-700 transition-colors shadow-sm font-semibold"
            >
              <GiCardPick className="w-4 h-4 text-[#E10600]" />
              <span className="font-sans capitalize hidden sm:inline">
                {layoutMode === 'custom-bento'
                  ? 'Custom Bento'
                  : layoutMode === 'map-focus'
                  ? 'Cinema Focus'
                  : layoutMode === 'table-focus'
                  ? 'Timing Focus'
                  : 'Cockpit View'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {layoutMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-[#0E111A] border border-neutral-700 rounded-xl shadow-2xl p-1.5 z-50 min-w-[200px] font-sans text-xs space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 px-2 py-1 block font-bold">
                  Immersion Layout
                </span>
                {[
                  {
                    mode: 'cockpit' as LayoutMode,
                    label: 'Cockpit View (3-Col)',
                    desc: 'Balanced live race telemetry & 3D map',
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
                    onClick={() => {
                      onChangeLayoutMode?.(item.mode);
                      setLayoutMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      layoutMode === item.mode
                        ? 'bg-[#E10600] text-white shadow-md'
                        : 'hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-[9px] opacity-75 font-normal leading-none mt-0.5">
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
