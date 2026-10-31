'use client';

import { CloudSun, Thermometer, Wind, Flag, Sparkles } from 'lucide-react';

interface HeaderProps {
  isSimulation?: boolean;
  onToggleSimulation?: () => void;
  airTemp?: number;
  trackTemp?: number;
  condition?: string;
  eventName?: string;
}

export function Header({
  isSimulation = true,
  onToggleSimulation,
  airTemp = 27,
  trackTemp = 42,
  condition = 'Dry',
  eventName = 'Mugello MotoGP™ Official Test & Race',
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-racing-border bg-racing-dark/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Active Event & Track Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-racing-cyan" />
          <h1 className="text-sm font-semibold text-white tracking-wide truncate max-w-xs md:max-w-md">
            {eventName}
          </h1>
        </div>

        {/* Live / Sim status badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-racing-card border border-racing-border text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-racing-green animate-pulse"></span>
          <span className="text-slate-300">SESSION: RACING</span>
        </div>
      </div>

      {/* Right: Weather Telemetry & Simulation Toggle */}
      <div className="flex items-center gap-3">
        {/* Track Conditions */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-300 border-r border-racing-border pr-4">
          <div className="flex items-center gap-1.5" title="Air Temperature">
            <CloudSun className="w-3.5 h-3.5 text-racing-yellow" />
            <span>AIR: {airTemp}°C</span>
          </div>
          <div className="flex items-center gap-1.5" title="Track Asphalt Temperature">
            <Thermometer className="w-3.5 h-3.5 text-racing-red" />
            <span>TRACK: {trackTemp}°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-racing-cyan font-bold" title="Surface Status">
            <span>{condition.toUpperCase()}</span>
          </div>
        </div>

        {/* Simulation / Live Feed Mode Switch */}
        {onToggleSimulation && (
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isSimulation
                ? 'bg-racing-purple/20 text-racing-purple border-racing-purple/40 shadow-glow-purple'
                : 'bg-racing-card text-slate-400 border-racing-border hover:text-white'
            }`}
            title="Toggle between real Pulselive API and simulated Grand Prix battle"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulation ? 'SIMULATION MODE' : 'LIVE API FEED'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
