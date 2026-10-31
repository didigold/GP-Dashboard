'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gauge,
  Activity,
  Layers,
  BarChart3,
  GitCompare,
  Trophy,
  Users,
  AlertTriangle,
  Calendar,
  History,
  Radio,
  ChevronRight,
  Flame,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: Gauge },
  { name: 'Live Timing', href: '/live-timing', icon: Radio, isLive: true },
  { name: '3D Track Map', href: '/track-map', icon: Layers, isNew: true },
  { name: 'Race Pace & Tyres', href: '/race-pace', icon: BarChart3 },
  { name: 'Head-to-Head', href: '/head-to-head', icon: GitCompare },
  { name: 'Standings', href: '/standings', icon: Trophy },
  { name: 'Riders & Grid', href: '/riders', icon: Users },
  { name: 'Gravel Trap', href: '/gravel-trap', icon: AlertTriangle },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'History (1949+)', href: '/history', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-racing-border bg-racing-dark flex flex-col shrink-0 min-h-screen sticky top-0 h-screen z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-racing-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-racing-red via-racing-purple to-racing-cyan flex items-center justify-center p-0.5 shadow-glow-cyan transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-racing-dark rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-racing-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">GP</span>
              <span className="font-light text-lg tracking-wider text-racing-cyan">DASH</span>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-racing-subtle uppercase">
              MotoGP™ Analytics
            </p>
          </div>
        </Link>
      </div>

      {/* Live Session Status Banner */}
      <div className="px-4 py-3 border-b border-racing-border/50 bg-racing-card/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-racing-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-racing-red"></span>
            </span>
            <span className="font-semibold text-white tracking-wide">GRAND PRIX</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-racing-red/20 text-racing-red border border-racing-red/30">
            SIM LIVE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-racing-cyan/15 to-transparent text-white border-l-4 border-racing-cyan shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-racing-cardHover'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-racing-cyan'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.isLive && (
                <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-racing-cyan/20 text-racing-cyan border border-racing-cyan/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-racing-cyan animate-pulse"></span>
                  LIVE
                </span>
              )}

              {item.isNew && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-racing-purple/20 text-racing-purple border border-racing-purple/30">
                  3D
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Disclaimers */}
      <div className="p-4 border-t border-racing-border text-[11px] text-racing-subtle space-y-2">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span>DATA ENGINE</span>
          <span className="text-racing-green">PULSELIVE 1.0</span>
        </div>
        <p className="leading-tight text-[9px] text-slate-500">
          Unofficial fan project. Not endorsed by or affiliated with Dorna Sports S.L.
        </p>
      </div>
    </aside>
  );
}
