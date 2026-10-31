'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Radio,
  Layers,
  BarChart3,
  GitCompare,
  Trophy,
  AlertTriangle,
  Compass,
  Disc,
  Zap,
  Tv,
  Clock,
  Sparkles,
  ChevronDown,
  Gauge,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TopTacticalHUDProps {
  delay?: number;
  onDelayChange?: (seconds: number) => void;
  isSimulation?: boolean;
  onToggleSimulation?: () => void;
}

export const NAV_ITEMS = [
  { name: 'Live Pitwall', href: '/live-timing', icon: Radio, isLive: true },
  { name: 'Lean & Apex', href: '/lean-telemetry', icon: Compass, isNew: true },
  { name: 'Tyre Asymmetry', href: '/tyres-asymmetry', icon: Disc, isNew: true },
  { name: 'Braking Zones', href: '/braking-zones', icon: Zap, isNew: true },
  { name: 'Sprint vs GP Pace', href: '/race-pace', icon: BarChart3 },
  { name: 'Sector Battle', href: '/head-to-head', icon: GitCompare },
  { name: '3D Radar', href: '/track-map', icon: Layers },
  { name: 'Standings', href: '/standings', icon: Trophy },
  { name: 'Incident Ledger', href: '/gravel-trap', icon: AlertTriangle },
  { name: 'Design System', href: '/design-system', icon: Sparkles, isNew: true },
];

export function TopTacticalHUD({
  delay = 0,
  onDelayChange,
  isSimulation = true,
  onToggleSimulation,
}: TopTacticalHUDProps) {
  const pathname = usePathname();
  const [showDelayControl, setShowDelayControl] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-surface-base/90 backdrop-blur-md border-b border-surface-border select-none">
      <div className="w-full px-4 h-full flex items-center justify-between gap-3">
        {/* Left: Brand & Live Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-apex-sm bg-gradient-to-tr from-apex-crimson via-apex-purple to-apex-cyan p-0.5 shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-surface-base rounded-[6px] flex items-center justify-center">
                <Flame className="w-4 h-4 text-apex-cyan" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-mono font-black text-sm tracking-wider text-white">GP</span>
                <span className="font-mono font-light text-sm tracking-wider text-apex-cyan">DASH</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase">
                MotoGP™ Telemetry
              </span>
            </div>
          </Link>

          {/* Active Round Chip */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-apex-xs bg-surface-card border border-surface-border text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-apex-crimson animate-pulse" />
            <span className="text-white font-bold">MUGELLO GP</span>
            <span className="text-[10px] text-text-muted">RND 07</span>
          </div>
        </div>

        {/* Center: Horizontal Segmented Navigation Deck */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 rounded-apex-sm text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-surface-card text-white border-apex-cyan/50 shadow-glow-cyan/20 font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-apex-cyan' : 'text-text-muted'
                  }`}
                />
                <span>{item.name}</span>

                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-apex-cyan animate-pulse" />
                )}

                {item.isNew && (
                  <span className="text-[8px] px-1 rounded-apex-xs bg-apex-purple/30 text-apex-purple font-bold">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Broadcast TV Sync & Simulation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* TV Delay Controller Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowDelayControl(!showDelayControl)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-apex-sm border text-xs font-mono transition-all ${
                delay > 0
                  ? 'bg-apex-cyan/15 text-apex-cyan border-apex-cyan/40 shadow-glow-cyan'
                  : 'bg-surface-card text-text-secondary border-surface-border hover:border-surface-borderActive/40 hover:text-white'
              }`}
              title="Adjust TV broadcast transmission delay (0-120s)"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden md:inline">SYNC:</span>
              <span className="font-bold">{delay > 0 ? `-${delay.toFixed(1)}s` : 'LIVE'}</span>
            </button>

            {/* Quick Floating Delay Drawer */}
            {showDelayControl && onDelayChange && (
              <div className="absolute right-0 top-11 w-72 p-4 rounded-apex-md bg-surface-overlay/95 backdrop-blur-xl border border-surface-border shadow-2xl z-50 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-apex-cyan" />
                    BROADCAST TV DELAY
                  </span>
                  <span className="text-apex-cyan font-bold">{delay.toFixed(1)}s</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="120"
                  step="0.5"
                  value={delay}
                  onChange={(e) => onDelayChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-surface-card rounded-lg appearance-none cursor-pointer accent-apex-cyan"
                />

                <div className="grid grid-cols-4 gap-1 text-[10px]">
                  {[0, 20, 45, 75].map((val) => (
                    <button
                      key={val}
                      onClick={() => onDelayChange(val)}
                      className={`p-1 rounded-apex-xs border text-center ${
                        Math.abs(delay - val) < 1
                          ? 'bg-apex-cyan text-black font-extrabold border-apex-cyan'
                          : 'bg-surface-base text-text-muted border-surface-border'
                      }`}
                    >
                      {val === 0 ? 'Live' : `${val}s`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simulation Mode Toggle */}
          {onToggleSimulation && (
            <button
              onClick={onToggleSimulation}
              className={`p-1.5 rounded-apex-sm border transition-all text-xs font-mono flex items-center gap-1 ${
                isSimulation
                  ? 'bg-apex-purple/20 text-apex-purple border-apex-purple/40 shadow-glow-purple'
                  : 'bg-surface-card text-text-muted border-surface-border hover:text-white'
              }`}
              title="Toggle Simulated Battle Replay"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isSimulation ? 'SIM REPLAY' : 'LIVE API'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
