'use client';

import React from 'react';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  CloudRain,
  Flag,
  Timer,
} from 'lucide-react';

export interface TimelineIncidentMarker {
  timeSec: number;
  label: string;
  subtitle: string;
  type: 'green' | 'yellow' | 'purple' | 'wet';
}

export const TIMELINE_INCIDENTS: TimelineIncidentMarker[] = [
  {
    timeSec: 120,
    label: 'Lights Out · Race Start',
    subtitle: 'All 22 Premier Class Prototypes Away Cleanly',
    type: 'green',
  },
  {
    timeSec: 940,
    label: 'Battle Lead Change · Turn 1',
    subtitle: '#93 Marquez Outbrakes #37 Acosta at 342.8 km/h',
    type: 'purple',
  },
  {
    timeSec: 1980,
    label: 'Sector 1 Yellow Flag · Turn 4',
    subtitle: 'Gravel Trap Recovery — Local Yellow Flag Active',
    type: 'yellow',
  },
  {
    timeSec: 3420,
    label: 'Fastest Lap · #63 Bagnaia',
    subtitle: "New All-Time Race Lap Benchmark: 1'56.337",
    type: 'purple',
  },
  {
    timeSec: 5100,
    label: 'Rain Shower Detected · White Cross Flag',
    subtitle: 'Wet Track Surface — Flag-to-Flag Bike Swap Permitted',
    type: 'wet',
  },
];

interface ReplayScrubberBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTimeSec: number;
  totalDurationSec: number;
  onSeek: (seconds: number, marker?: TimelineIncidentMarker) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  tvDelay?: number;
  onChangeTvDelay?: (delay: number) => void;
  className?: string;
}

export function ReplayScrubberBar({
  isPlaying,
  onTogglePlay,
  currentTimeSec,
  totalDurationSec = 7917,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  className = '',
}: ReplayScrubberBarProps) {
  const [showFlags, setShowFlags] = React.useState<boolean>(true);
  const [hoveredIncident, setHoveredIncident] = React.useState<TimelineIncidentMarker | null>(null);

  const formatSeconds = (totalSec: number) => {
    const clamped = Math.max(0, totalSec);
    const h = Math.floor(clamped / 3600);
    const m = Math.floor((clamped % 3600) / 60);
    const s = Math.floor(clamped % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTimeSec / totalDurationSec) * 100));
  const speeds = [1, 2, 5, 10, 20, 30];

  return (
    <div
      className={`px-3.5 py-2 bg-[#0D0D0E]/90 border border-white/[0.08] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xl select-none font-sans text-xs relative z-20 shrink-0 ${className}`}
    >
      {/* Left: Play/Pause Circle Button + SESSION REPLAY label */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-[#E10600] hover:bg-[#ff1e17] text-white flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
          title={isPlaying ? 'Pause Session Replay' : 'Play Session Replay'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          )}
        </button>

        <span className="font-sans font-extrabold text-white text-xs tracking-wider uppercase">
          Session Replay
        </span>
      </div>

      {/* Center: Flags & Weather Events Switch + Interactive Scrubber + Time Readout */}
      <div className="w-full flex-1 max-w-4xl flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 shrink-0">
          <span>EVENTS</span>
          <button
            type="button"
            onClick={() => setShowFlags(!showFlags)}
            className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
              showFlags ? 'bg-[#E10600]' : 'bg-white/15'
            }`}
            title="Toggle Flag & Weather Event Pins on Timeline"
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                showFlags ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Scrubber Track with Interactive Incident & Wet Weather Pins */}
        <div className="relative flex-1 py-2.5 cursor-pointer group">
          {showFlags &&
            TIMELINE_INCIDENTS.map((inc) => {
              const posPercent = (inc.timeSec / totalDurationSec) * 100;
              let dotBg = 'bg-emerald-400';
              if (inc.type === 'yellow') dotBg = 'bg-amber-400';
              if (inc.type === 'purple') dotBg = 'bg-purple-400';
              if (inc.type === 'wet') dotBg = 'bg-sky-400';

              return (
                <div
                  key={inc.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(inc.timeSec, inc);
                  }}
                  onMouseEnter={() => setHoveredIncident(inc)}
                  onMouseLeave={() => setHoveredIncident(null)}
                  style={{ left: `${posPercent}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 p-1"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${dotBg} ring-2 ring-[#0D0D0E] hover:scale-150 transition-transform shadow-md`}
                  />
                </div>
              );
            })}

          {/* Hover Tooltip for Timeline Event */}
          {hoveredIncident && (
            <div
              style={{
                left: `${(hoveredIncident.timeSec / totalDurationSec) * 100}%`,
              }}
              className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-xl liquid-glass-dropdown border border-white/20 text-[11px] whitespace-nowrap shadow-2xl"
            >
              <div className="flex items-center gap-1.5 font-extrabold text-white">
                {hoveredIncident.type === 'wet' && (
                  <CloudRain className="w-5 h-5 text-white" />
                )}
                {hoveredIncident.type === 'yellow' && (
                  <Flag className="w-5 h-5 text-white" />
                )}
                {hoveredIncident.type === 'purple' && (
                  <Timer className="w-5 h-5 text-white" />
                )}
                <span>{hoveredIncident.label}</span>
                <span className="text-neutral-400 font-semibold tabular-nums">
                  ({formatSeconds(hoveredIncident.timeSec)})
                </span>
              </div>
              <div className="text-[10px] text-neutral-300 mt-0.5">{hoveredIncident.subtitle}</div>
            </div>
          )}

          {/* Progress Bar Track */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#E10600] to-[#FF4D48] rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scrubber Thumb */}
          <div
            style={{ left: `${progressPercent}%` }}
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] z-10"
          />

          <input
            type="range"
            min="0"
            max={totalDurationSec}
            step="1"
            value={currentTimeSec}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>

        {/* Time Readout */}
        <span className="text-white font-sans font-bold text-[11px] tabular-nums shrink-0">
          {formatSeconds(currentTimeSec)}{' '}
          <span className="text-neutral-400 font-normal">/ {formatSeconds(totalDurationSec)}</span>
        </span>
      </div>

      {/* Right: Step Back/Forward + Liquid Glass Speed Multiplier Pill */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onSeek(Math.max(0, currentTimeSec - 15))}
          className="w-7 h-7 liquid-glass-circle text-neutral-300 hover:text-white cursor-pointer"
          title="Rewind 15s"
        >
          <Rewind className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => onSeek(Math.min(totalDurationSec, currentTimeSec + 15))}
          className="w-7 h-7 liquid-glass-circle text-neutral-300 hover:text-white cursor-pointer"
          title="Fast-forward 15s"
        >
          <FastForward className="w-3 h-3" />
        </button>

        {/* Speed Multipliers inside Liquid Glass Pill */}
        <div className="h-7 p-0.5 inline-flex items-center rounded-full liquid-glass-pill text-[11px] font-semibold">
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChangeSpeed(s)}
              className={`h-full px-2 rounded-full transition-all cursor-pointer tabular-nums ${
                playbackSpeed === s
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
