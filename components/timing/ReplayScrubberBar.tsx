'use client';

import React from 'react';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  X,
} from 'lucide-react';

interface IncidentMarker {
  timeSec: number;
  label: string;
  type: 'green' | 'yellow' | 'purple';
}

const TIMELINE_INCIDENTS: IncidentMarker[] = [
  { timeSec: 0, label: 'Race Start', type: 'green' },
  { timeSec: 420, label: 'Marquez overtakes Acosta', type: 'purple' },
  { timeSec: 1200, label: 'Turn 4 Incident Yellow Flag', type: 'yellow' },
  { timeSec: 1850, label: 'Fastest Lap Bagnaia 1:56.337', type: 'purple' },
];

interface ReplayScrubberBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTimeSec: number;
  totalDurationSec: number;
  onSeek: (seconds: number) => void;
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
  totalDurationSec = 7917, // 02:11:57 (matching screenshot)
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  tvDelay = 0,
  onChangeTvDelay,
  className = '',
}: ReplayScrubberBarProps) {
  const [showFlags, setShowFlags] = React.useState<boolean>(true);

  const formatSeconds = (totalSec: number) => {
    const clamped = Math.max(0, totalSec);
    const h = Math.floor(clamped / 3600);
    const m = Math.floor((clamped % 3600) / 60);
    const s = Math.floor(clamped % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTimeSec / totalDurationSec) * 100));

  const speeds = [1, 2, 5, 10, 20, 30];

  return (
    <div
      className={`px-4 py-2.5 bg-[#0B0D14] border border-neutral-800/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl select-none font-sans text-xs ${className}`}
    >
      {/* Left: Round Play Button + SESSION REPLAY text */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-[#1D4ED8] hover:bg-[#2563EB] text-white flex items-center justify-center transition-all shadow-md active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
        </button>

        <span className="font-sans font-bold text-white text-xs tracking-wider uppercase">
          Session Replay
        </span>
      </div>

      {/* Center: Timeline Scrubber + Flags Switch + Time Counter (Matching Reference Image) */}
      <div className="w-full flex-1 max-w-3xl flex items-center gap-3">
        {/* Flags toggle switch */}
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 shrink-0">
          <span>FLAGS</span>
          <button
            onClick={() => setShowFlags(!showFlags)}
            className={`w-6 h-3.5 rounded-full p-0.5 transition-colors ${
              showFlags ? 'bg-[#1D4ED8]' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                showFlags ? 'translate-x-2.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Scrubber Line */}
        <div className="relative flex-1 py-3 cursor-pointer group">
          {/* Incident Pins along the timeline */}
          {showFlags &&
            TIMELINE_INCIDENTS.map((inc) => {
              const posPercent = (inc.timeSec / totalDurationSec) * 100;
              let dotBg = 'bg-emerald-400';
              if (inc.type === 'yellow') dotBg = 'bg-amber-400';
              if (inc.type === 'purple') dotBg = 'bg-purple-400';

              return (
                <div
                  key={inc.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(inc.timeSec);
                  }}
                  style={{ left: `${posPercent}%` }}
                  className="absolute top-1.5 -translate-x-1/2 z-10"
                  title={`${inc.label} (${formatSeconds(inc.timeSec)})`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${dotBg} ring-1 ring-black hover:scale-150 transition-transform`} />
                </div>
              );
            })}

          {/* Background Track */}
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#1D4ED8] rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={totalDurationSec}
            step="1"
            value={currentTimeSec}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Time Readout: 00:00:13 / 02:11:57 */}
        <span className="text-neutral-300 font-sans text-[11px] tabular-nums shrink-0">
          {formatSeconds(currentTimeSec)} <span className="text-neutral-400">/ {formatSeconds(totalDurationSec)}</span>
        </span>
      </div>

      {/* Right: Step Buttons + Speed Multipliers: 1x 2x 5x 10x 20x 30x (Matching Reference Image) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onSeek(Math.max(0, currentTimeSec - 10))}
          className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
          title="Step back 10s"
        >
          <Rewind className="w-3 h-3" />
        </button>

        <button
          onClick={() => onSeek(Math.min(totalDurationSec, currentTimeSec + 10))}
          className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
          title="Step forward 10s"
        >
          <FastForward className="w-3 h-3" />
        </button>

        {/* Speed Multiplier Pills */}
        <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                playbackSpeed === s
                  ? 'bg-[#1D4ED8] text-white'
                  : 'text-neutral-400 hover:text-white'
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
