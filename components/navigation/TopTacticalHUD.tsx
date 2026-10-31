'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  Sparkles,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TopTacticalHUDProps {
  delay?: number;
  onDelayChange?: (seconds: number) => void;
  isSimulation?: boolean;
  onToggleSimulation?: () => void;
  onOpenDrawer?: () => void;
}

export const NAV_ITEMS = [
  { name: 'PITWALL LIVE', href: '/live-timing', icon: Radio, isLive: true },
  { name: 'LEAN & GYRO', href: '/lean-telemetry', icon: Compass },
  { name: 'TYRE THERMALS', href: '/tyres-asymmetry', icon: Disc },
  { name: 'BREMBO BRAKING', href: '/braking-zones', icon: Zap },
  { name: 'SPRINT VS GP', href: '/race-pace', icon: BarChart3 },
  { name: 'SECTOR DUEL', href: '/head-to-head', icon: GitCompare },
  { name: '3D RADAR', href: '/track-map', icon: Layers },
  { name: 'STANDINGS', href: '/standings', icon: Trophy },
  { name: 'INCIDENTS', href: '/gravel-trap', icon: AlertTriangle },
  { name: 'DESIGN SYSTEM', href: '/design-system', icon: Sparkles },
];

export function TopTacticalHUD({
  delay = 0,
  onDelayChange,
  isSimulation = true,
  onToggleSimulation,
  onOpenDrawer,
}: TopTacticalHUDProps) {
  const pathname = usePathname();
  const [showDelayControl, setShowDelayControl] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-neutral-800 select-none">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Official MotoGP Brand Badge */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 px-2 bg-[#E10600] flex items-center justify-center text-white font-black text-xs tracking-tighter">
              MOTOGP™
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-xs tracking-wider text-white uppercase leading-none">
                PITWALL DASHBOARD
              </span>
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mt-0.5">
                Official Engineering Feed
              </span>
            </div>
          </Link>

          {/* Active Round Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#111111] border border-neutral-800 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="text-white font-bold">MUGELLO GP</span>
            <span className="text-[10px] text-neutral-400">RND 07</span>
          </div>
        </div>

        {/* Center: Horizontal Segmented Navigation Deck (Engineered Uppercase Tracking) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-[1.5px] transition-colors shrink-0 flex items-center gap-1.5 border rounded-none ${
                  isActive
                    ? 'bg-[#181818] text-white border-neutral-700 border-b-2 border-b-[#E10600]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-[#E10600]' : 'text-neutral-400'
                  }`}
                />
                <span>{item.name}</span>

                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Broadcast TV Sync & Pitwall Drawer Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {/* TV Delay Controller Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowDelayControl(!showDelayControl)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-none text-xs font-mono font-bold transition-colors ${
                delay > 0
                  ? 'bg-neutral-900 text-[#E10600] border-[#E10600]'
                  : 'bg-[#111111] text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
              title="Adjust TV broadcast transmission delay (0-120s)"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SYNC:</span>
              <span className="text-white tabular-nums">{delay > 0 ? `-${delay.toFixed(1)}s` : 'LIVE'}</span>
            </button>

            {/* Quick Floating Delay Drawer */}
            {showDelayControl && (
              <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-[#111111] border border-neutral-800 shadow-2xl z-50 font-mono">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-white font-bold uppercase tracking-wider">Broadcast TV Sync</span>
                  <span className="text-[#E10600] font-bold tabular-nums">
                    {delay.toFixed(1)}s DELAY
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.5"
                  value={delay}
                  onChange={(e) => onDelayChange?.(parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 accent-[#E10600] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 mt-2">
                  <span>0s (Live Track)</span>
                  <span>30s (Stream)</span>
                  <span>60s (Satellite)</span>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-between">
                  <button
                    onClick={() => onDelayChange?.(0)}
                    className="text-[10px] text-neutral-400 hover:text-white uppercase"
                  >
                    Reset Live
                  </button>
                  <button
                    onClick={() => setShowDelayControl(false)}
                    className="text-[10px] text-white font-bold uppercase"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Pitwall HUD Drawer Trigger */}
          {onOpenDrawer && (
            <Button
              variant="motogp"
              size="sm"
              onClick={onOpenDrawer}
              className="flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden md:inline">HUD</span>
            </Button>
          )}
        </div>
      </div>

      {/* Signature 3px MotoGP Red Speed Stripe */}
      <div className="h-[3px] bg-[#E10600] w-full" />
    </header>
  );
}
