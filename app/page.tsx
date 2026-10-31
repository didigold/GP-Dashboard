'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LeanMeter } from '../components/ui/LeanMeter';
import { TyreAsymmetryPill } from '../components/ui/TyreAsymmetryPill';
import { BrakingGForceBar } from '../components/ui/BrakingGForceBar';
import { CircuitCanvas } from '../components/3d/CircuitCanvas';
import { MOCK_STANDINGS, RIDERS_DATA } from '../lib/data/mock-race-data';
import {
  Radio,
  Compass,
  Disc,
  Zap,
  BarChart3,
  GitCompare,
  Trophy,
  Flame,
  ArrowRight,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [selectedRider, setSelectedRider] = useState('1');

  return (
    <div className="w-full p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Hero Grand Prix Tactical Banner */}
      <section className="relative overflow-hidden rounded-apex-lg border border-surface-border p-6 sm:p-8 bg-gradient-to-r from-surface-card via-surface-base to-surface-card shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-apex-cyan/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-apex-crimson/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" dot>
                GRAND PRIX WEEKEND LIVE
              </Badge>
              <span className="text-xs font-mono text-text-muted">ROUND 07 OF 21</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
              Gran Premio d’Italia Brembo
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl font-mono leading-relaxed">
              Autodromo Internazionale del Mugello • 5.245 km • 68° Max Lean • 1.65G Braking at San Donato.
              High-frequency telemetry, asymmetric tyre thermals, and zero-spoiler TV broadcast sync.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            <Link href="/live-timing">
              <Button variant="primary" size="md" icon={<Radio className="w-4 h-4 animate-pulse" />}>
                LAUNCH PITWALL
              </Button>
            </Link>
            <Link href="/lean-telemetry">
              <Button variant="secondary" size="md" icon={<Compass className="w-4 h-4 text-apex-cyan" />}>
                LEAN ANGLE RADAR
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship MotoGP Physics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Max Lean Angle */}
        <Link href="/lean-telemetry" className="group">
          <Card variant="pitwall" hoverable className="h-full">
            <CardHeader>
              <CardTitle>
                <Compass className="w-4 h-4 text-apex-cyan" />
                <span>MAX LEAN ANGLE</span>
              </CardTitle>
              <Badge variant="cyan">68.2°</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-mono font-black text-white group-hover:text-apex-cyan transition-colors">
                    68.2°
                  </div>
                  <div className="text-[10px] font-mono text-text-muted">Arrabbiata 2 (Turn 9)</div>
                </div>
                <div className="text-right font-mono text-xs text-apex-cyan font-bold">
                  M. Marquez #93
                </div>
              </div>
              <p className="text-[11px] text-text-secondary font-mono leading-relaxed pt-2 border-t border-surface-border/50">
                Elbow and shoulder scraping the kerb at 232 km/h.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Metric 2: Asymmetric Tyre Thermal Delta */}
        <Link href="/tyres-asymmetry" className="group">
          <Card variant="pitwall" hoverable className="h-full">
            <CardHeader>
              <CardTitle>
                <Disc className="w-4 h-4 text-apex-amber" />
                <span>TYRE ASYMMETRY</span>
              </CardTitle>
              <Badge variant="amber">Δ 36°C</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-mono font-black text-white group-hover:text-apex-amber transition-colors">
                    124°C / 88°C
                  </div>
                  <div className="text-[10px] font-mono text-text-muted">Left vs Right Shoulder</div>
                </div>
                <div className="text-right font-mono text-xs text-apex-amber font-bold">
                  Michelin Hard
                </div>
              </div>
              <p className="text-[11px] text-text-secondary font-mono leading-relaxed pt-2 border-t border-surface-border/50">
                High thermal shear load on right shoulder through Casanova-Savelli.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Metric 3: Deceleration G-Force */}
        <Link href="/braking-zones" className="group">
          <Card variant="pitwall" hoverable className="h-full">
            <CardHeader>
              <CardTitle>
                <Zap className="w-4 h-4 text-apex-orange" />
                <span>HARD BRAKING LOAD</span>
              </CardTitle>
              <Badge variant="crimson">1.65 G</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-mono font-black text-white group-hover:text-apex-orange transition-colors">
                    -269 km/h
                  </div>
                  <div className="text-[10px] font-mono text-text-muted">361 km/h to 92 km/h in 286m</div>
                </div>
                <div className="text-right font-mono text-xs text-apex-orange font-bold">
                  San Donato
                </div>
              </div>
              <p className="text-[11px] text-text-secondary font-mono leading-relaxed pt-2 border-t border-surface-border/50">
                Brembo 355mm carbon discs heating up to 860°C.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Metric 4: All-Time Speed Record */}
        <Link href="/track-map" className="group">
          <Card variant="pitwall" hoverable className="h-full">
            <CardHeader>
              <CardTitle>
                <Flame className="w-4 h-4 text-apex-crimson" />
                <span>TOP SPEED TRAP</span>
              </CardTitle>
              <Badge variant="purple">RECORD</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-mono font-black text-white group-hover:text-apex-purple transition-colors">
                    366.1 km/h
                  </div>
                  <div className="text-[10px] font-mono text-text-muted">Mugello Main Straight</div>
                </div>
                <div className="text-right font-mono text-xs text-apex-purple font-bold">
                  B. Binder #33
                </div>
              </div>
              <p className="text-[11px] text-text-secondary font-mono leading-relaxed pt-2 border-t border-surface-border/50">
                Aero winglets and holeshot shapeshifter engaged.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 3D Track Radar + Live Standings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-apex-cyan" />
              <h2 className="text-sm font-mono font-bold text-white tracking-wider">
                3D CIRCUIT RADAR & BIKE TRACKING
              </h2>
            </div>
            <Link href="/track-map" className="text-xs font-mono text-apex-cyan hover:underline flex items-center gap-1">
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

        {/* Championship Top 5 Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-apex-purple" />
              <h2 className="text-sm font-mono font-bold text-white tracking-wider">
                WORLD CHAMPIONSHIP
              </h2>
            </div>
            <Link href="/standings" className="text-xs font-mono text-apex-cyan hover:underline flex items-center gap-1">
              <span>Full Standings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card variant="pitwall" className="h-[550px] overflow-y-auto space-y-2 p-3 font-mono text-xs">
            {MOCK_STANDINGS.map((item) => (
              <div
                key={item.rider.id}
                className="p-3 rounded-apex-sm bg-surface-subtle border border-surface-border flex items-center justify-between hover:border-apex-cyan/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-apex-xs font-extrabold flex items-center justify-center text-xs ${
                      item.position === 1
                        ? 'bg-apex-cyan text-surface-base shadow-glow-cyan'
                        : item.position <= 3
                        ? 'bg-apex-purple/30 text-white border border-apex-purple/40'
                        : 'bg-surface-card text-text-muted'
                    }`}
                  >
                    {item.position}
                  </span>
                  <div>
                    <div className="font-bold text-white font-sans">{item.rider.full_name}</div>
                    <div className="text-[10px] text-text-muted">{item.team.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-white">{item.points} PTS</div>
                  <div className="text-[10px] text-text-muted">#{item.rider.number}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
