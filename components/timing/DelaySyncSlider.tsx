'use client';

import { Play, RotateCcw, Clock, Tv, FastForward, Rewind } from 'lucide-react';

interface DelaySyncSliderProps {
  delay: number;
  onDelayChange: (seconds: number) => void;
}

const PRESETS = [
  { label: 'Real-time (0s)', value: 0 },
  { label: 'VideoPass (~20s)', value: 20 },
  { label: 'Cable TV (~45s)', value: 45 },
  { label: 'Streaming (~70s)', value: 70 },
];

export function DelaySyncSlider({ delay, onDelayChange }: DelaySyncSliderProps) {
  return (
    <div className="glass-card p-4 rounded-2xl border border-racing-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and active delay read-out */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-racing-cyan/10 border border-racing-cyan/30 flex items-center justify-center text-racing-cyan">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                TV Broadcast Delay Sync
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-racing-border text-racing-cyan">
                {delay > 0 ? `-${delay.toFixed(1)}s` : 'LIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Align the live timing board with your television broadcast transmission
            </p>
          </div>
        </div>

        {/* Step buttons & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onDelayChange(preset.value)}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all ${
                Math.abs(delay - preset.value) < 1
                  ? 'bg-racing-cyan text-black font-bold border-racing-cyan shadow-glow-cyan'
                  : 'bg-racing-dark text-slate-400 border-racing-border hover:border-slate-500 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}

          {/* Reset button */}
          <button
            onClick={() => onDelayChange(0)}
            className="p-1.5 rounded-lg bg-racing-dark border border-racing-border text-slate-400 hover:text-white"
            title="Reset delay to zero (Instant Live)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Range Slider & Fine Controls */}
      <div className="mt-4 pt-3 border-t border-racing-border/50 flex items-center gap-4">
        <button
          onClick={() => onDelayChange(Math.max(0, parseFloat((delay - 1).toFixed(1))))}
          className="p-1 text-slate-400 hover:text-racing-cyan transition-colors"
          title="-1.0 second"
        >
          <Rewind className="w-4 h-4" />
        </button>

        <input
          type="range"
          min="0"
          max="120"
          step="0.5"
          value={delay}
          onChange={(e) => onDelayChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-racing-dark rounded-lg appearance-none cursor-pointer accent-racing-cyan"
        />

        <button
          onClick={() => onDelayChange(Math.min(120, parseFloat((delay + 1).toFixed(1))))}
          className="p-1 text-slate-400 hover:text-racing-cyan transition-colors"
          title="+1.0 second"
        >
          <FastForward className="w-4 h-4" />
        </button>

        <div className="w-20 text-right font-mono text-sm font-bold text-white">
          {delay.toFixed(1)}s
        </div>
      </div>
    </div>
  );
}
