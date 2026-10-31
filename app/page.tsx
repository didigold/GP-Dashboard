'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/navigation/Header';
import { CircuitCanvas } from '../components/3d/CircuitCanvas';
import { MOCK_STANDINGS, RIDERS_DATA } from '../lib/data/mock-race-data';
import {
  Radio,
  Layers,
  BarChart3,
  GitCompare,
  Trophy,
  Flame,
  ArrowRight,
  Gauge,
  Clock,
  ShieldCheck,
  ChevronRight,
  Calendar,
} from 'lucide-react';

export default function HomePage() {
  const [selectedRider, setSelectedRider] = useState('1');

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Hero Event Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-racing-border glass-panel p-6 sm:p-8 bg-gradient-to-r from-racing-card via-racing-dark to-racing-card">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-racing-cyan/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-racing-red/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-racing-cyan/15 text-racing-cyan border border-racing-cyan/30 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-racing-cyan animate-ping"></span>
                <span>UPCOMING GRAND PRIX ROUND</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Gran Premio d’Italia Brembo
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Autodromo Internazionale del Mugello • 5.245 km • 15 Curves • 1.141 km Main Straight.
                Get real-time live timing with TV broadcast synchronization.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/live-timing"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-racing-cyan text-black font-extrabold text-sm tracking-wide shadow-glow-cyan hover:scale-105 transition-all"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>LAUNCH LIVE TIMING</span>
              </Link>

              <Link
                href="/track-map"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-racing-card border border-racing-border hover:border-slate-500 text-white font-semibold text-sm transition-all"
              >
                <Layers className="w-4 h-4 text-racing-purple" />
                <span>EXPLORE 3D TRACK</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Metrics Quick Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-racing-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Top Speed Record</div>
              <div className="text-xl font-extrabold text-racing-cyan font-mono mt-1">366.1 km/h</div>
              <div className="text-[10px] text-slate-500 font-mono">B. Binder (Mugello)</div>
            </div>
            <div className="p-3 rounded-xl bg-racing-cyan/10 text-racing-cyan">
              <Gauge className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-racing-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Championship Leader</div>
              <div className="text-xl font-extrabold text-white font-mono mt-1">J. Martin</div>
              <div className="text-[10px] text-racing-purple font-mono">508 Points</div>
            </div>
            <div className="p-3 rounded-xl bg-racing-purple/10 text-racing-purple">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-racing-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Constructor Crown</div>
              <div className="text-xl font-extrabold text-racing-red font-mono mt-1">Ducati</div>
              <div className="text-[10px] text-slate-500 font-mono">19 Victories</div>
            </div>
            <div className="p-3 rounded-xl bg-racing-red/10 text-racing-red">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-racing-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Broadcast Sync</div>
              <div className="text-xl font-extrabold text-racing-green font-mono mt-1">0 - 120s</div>
              <div className="text-[10px] text-slate-500 font-mono">Zero Spoiler Buffer</div>
            </div>
            <div className="p-3 rounded-xl bg-racing-green/10 text-racing-green">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* 3D Track Live Preview & Standings Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: 3D Circuit Canvas */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-racing-cyan" />
                <h2 className="text-base font-bold text-white tracking-wide">
                  Live 3D Circuit Radar
                </h2>
              </div>
              <Link
                href="/track-map"
                className="text-xs font-mono text-racing-cyan hover:underline flex items-center gap-1"
              >
                <span>Fullscreen 3D</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CircuitCanvas
              circuitName="Autodromo del Mugello"
              selectedRiderNumber={selectedRider}
              onSelectRider={setSelectedRider}
            />
          </div>

          {/* Right 1 Col: Top 5 Standings Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-racing-purple" />
                <h2 className="text-base font-bold text-white tracking-wide">
                  World Standings
                </h2>
              </div>
              <Link
                href="/standings"
                className="text-xs font-mono text-racing-cyan hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-racing-border space-y-3 h-[550px] overflow-y-auto">
              {MOCK_STANDINGS.slice(0, 7).map((item) => (
                <div
                  key={item.rider.id}
                  className="p-3 rounded-xl bg-racing-dark/70 border border-racing-border/60 flex items-center justify-between hover:border-racing-cyan/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md font-mono text-xs font-extrabold flex items-center justify-center ${
                        item.position === 1
                          ? 'bg-racing-cyan text-black'
                          : item.position <= 3
                          ? 'bg-racing-purple/30 text-white'
                          : 'bg-racing-card text-slate-400'
                      }`}
                    >
                      {item.position}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {item.rider.full_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.team.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-extrabold text-white">
                      {item.points} <span className="text-[10px] text-slate-400 font-normal">PTS</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      #{item.rider.number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Navigation Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/live-timing"
            className="glass-card p-5 rounded-2xl border border-racing-border hover:border-racing-cyan/40 transition-all group"
          >
            <div className="p-3 rounded-xl bg-racing-cyan/10 text-racing-cyan w-fit mb-3 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-racing-cyan transition-colors">
              Live Timing Suite
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time sector splits, speed trap speeds, gaps, and TV broadcast delay synchronization.
            </p>
          </Link>

          <Link
            href="/race-pace"
            className="glass-card p-5 rounded-2xl border border-racing-border hover:border-racing-green/40 transition-all group"
          >
            <div className="p-3 rounded-xl bg-racing-green/10 text-racing-green w-fit mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-racing-green transition-colors">
              Race Pace & Tyres
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Lap-by-lap pace distributions, Michelin tyre compound strategies, and degradation curves.
            </p>
          </Link>

          <Link
            href="/head-to-head"
            className="glass-card p-5 rounded-2xl border border-racing-border hover:border-racing-purple/40 transition-all group"
          >
            <div className="p-3 rounded-xl bg-racing-purple/10 text-racing-purple w-fit mb-3 group-hover:scale-110 transition-transform">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-racing-purple transition-colors">
              Head-to-Head Battle
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Compare any two riders sector-by-sector with delta timing bars and career statistics.
            </p>
          </Link>

          <Link
            href="/gravel-trap"
            className="glass-card p-5 rounded-2xl border border-racing-border hover:border-racing-red/40 transition-all group"
          >
            <div className="p-3 rounded-xl bg-racing-red/10 text-racing-red w-fit mb-3 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-racing-red transition-colors">
              Gravel Trap Championship
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              The MotoGP crash tracker and estimated damage ledger across riders and manufacturers.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}
