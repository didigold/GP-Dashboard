'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LeanMeter } from '@/components/ui/LeanMeter';
import { TyreAsymmetryPill } from '@/components/ui/TyreAsymmetryPill';
import { BrakingGForceBar } from '@/components/ui/BrakingGForceBar';
import { CircuitCanvas } from '@/components/3d/CircuitCanvas';
import { MOCK_STANDINGS, RIDERS_DATA } from '@/lib/data/mock-race-data';
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
  Thermometer,
  ShieldCheck,
  Activity,
  Maximize2,
  SlidersHorizontal,
} from 'lucide-react';

export default function HomePage() {
  const [selectedRider, setSelectedRider] = useState('1');
  const [activeTelemetryTab, setActiveTelemetryTab] = useState('lean');

  return (
    <div className="w-full min-h-screen bg-black text-white select-none">
      {/* SECTION 1: HERO PHOTO & TELEMETRY BAND (BMW M-inspired layout) */}
      <section className="relative w-full border-b border-neutral-800 bg-[#0A0A0A]">
        {/* MotoGP Red Speed Stripe */}
        <div className="h-[3px] bg-[#E10600] w-full" />

        <div className="max-w-[1560px] mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="motogp">ROUND 07 · LIVE PITWALL</Badge>
                <Badge variant="outline">MUGELLO AUTODROMO INTERNAZIONALE</Badge>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight uppercase text-white leading-none">
                THE ULTIMATE <br />
                <span className="text-[#E10600]">MOTOGP™ TELEMETRY</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-2xl">
                Engineered for motorsport fans and data engineers. Track gyroscopic 68° lean angles,
                Michelin asymmetric shoulder heat deltas, Brembo 1.80G carbon braking zones, and Saturday Sprint vs Sunday Grand Prix degradation in real-time.
              </p>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/live-timing">
                <Button variant="motogp" size="lg" className="flex items-center gap-2">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>OPEN LIVE PITWALL</span>
                </Button>
              </Link>
              <Link href="/lean-telemetry">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#E10600]" />
                  <span>LEAN DYNAMICS</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Technical Spec Cells (BMW M Spec-Cell Pattern) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            <div className="spec-cell">
              <div className="text-[10px] font-mono uppercase tracking-[1.5px] text-neutral-400 mb-1">
                PEAK LEAN ANGLE
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                68.2°
              </div>
              <div className="text-[11px] text-neutral-400 font-light mt-1">
                M. Marquez #93 · Bucine
              </div>
            </div>

            <div className="spec-cell">
              <div className="text-[10px] font-mono uppercase tracking-[1.5px] text-neutral-400 mb-1">
                SAN DONATO BRAKING
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#E10600] tabular-nums">
                1.80 G
              </div>
              <div className="text-[11px] text-neutral-400 font-light mt-1">
                360 → 91 km/h in 286m
              </div>
            </div>

            <div className="spec-cell">
              <div className="text-[10px] font-mono uppercase tracking-[1.5px] text-neutral-400 mb-1">
                TOP SPEED TRAP
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                366.1 <span className="text-xs text-neutral-400">KM/H</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-light mt-1">
                B. Binder · Red Bull KTM
              </div>
            </div>

            <div className="spec-cell">
              <div className="text-[10px] font-mono uppercase tracking-[1.5px] text-neutral-400 mb-1">
                TYRE THERMAL DELTA
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums">
                +24°C
              </div>
              <div className="text-[11px] text-neutral-400 font-light mt-1">
                Right Shoulder Overload
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4-COLUMN HIGH-IMPACT MOTORSPORT GRIDS */}
      <section className="max-w-[1560px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[1.5px] text-[#E10600]">
              TELEMETRY DOMAINS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white font-sans mt-0.5">
              MotoGP™ Engineering Pillars
            </h2>
          </div>
          <Link href="/live-timing" className="text-xs font-bold uppercase tracking-[1.5px] text-neutral-400 hover:text-white flex items-center gap-1">
            <span>View All Sectors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lean Angle */}
          <Link href="/lean-telemetry" className="group">
            <Card className="h-full hover:border-[#E10600] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#E10600]" />
                    <span>LEAN &amp; GYROSCOPE</span>
                  </CardTitle>
                  <Badge variant="outline">68.2° MAX</Badge>
                </div>
                <CardDescription>
                  Extreme centrifugal cornering dynamics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div className="text-3xl font-black font-mono text-white group-hover:text-[#E10600] transition-colors">
                    68.2°
                  </div>
                  <div className="text-xs font-mono text-neutral-400 font-semibold">
                    Turn 9 Arrabbiata
                  </div>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed border-t border-neutral-800/80 pt-3">
                  Ground clearance drops to zero as rider knee and elbow scrape the kerb at 230+ km/h apex velocity.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs font-mono text-neutral-400">
                <span>V-Line vs U-Line</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#E10600]" />
              </CardFooter>
            </Card>
          </Link>

          {/* Card 2: Michelin Asymmetry */}
          <Link href="/tyres-asymmetry" className="group">
            <Card className="h-full hover:border-amber-500 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Disc className="w-4 h-4 text-amber-500" />
                    <span>TYRE ASYMMETRY</span>
                  </CardTitle>
                  <Badge variant="amber">1.84 BAR</Badge>
                </div>
                <CardDescription>
                  Left vs Right shoulder compound heat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div className="text-3xl font-black font-mono text-white group-hover:text-amber-400 transition-colors">
                    138°C
                  </div>
                  <div className="text-xs font-mono text-neutral-400 font-semibold">
                    Right Shoulder
                  </div>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed border-t border-neutral-800/80 pt-3">
                  Mugello&apos;s 9 right turns push the right carcass into extreme thermal stress while left shoulder drops to 104°C.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs font-mono text-neutral-400">
                <span>FIM 1.80 Bar Rule</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
              </CardFooter>
            </Card>
          </Link>

          {/* Card 3: Brembo Braking */}
          <Link href="/braking-zones" className="group">
            <Card className="h-full hover:border-[#E10600] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#E10600]" />
                    <span>BREMBO BRAKING</span>
                  </CardTitle>
                  <Badge variant="destructive">1.80 G</Badge>
                </div>
                <CardDescription>
                  355mm carbon-carbon kinetic dissipation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div className="text-3xl font-black font-mono text-white group-hover:text-[#E10600] transition-colors">
                    -269 <span className="text-sm text-neutral-400">KM/H</span>
                  </div>
                  <div className="text-xs font-mono text-neutral-400 font-semibold">
                    286 Meters
                  </div>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed border-t border-neutral-800/80 pt-3">
                  Braking from 360 km/h into Turn 1 produces 1.80G deceleration loads, pushing carbon disc temps to 900°C.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs font-mono text-neutral-400">
                <span>Rear Stoppie Lift</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#E10600]" />
              </CardFooter>
            </Card>
          </Link>

          {/* Card 4: Sprint vs GP Pace */}
          <Link href="/race-pace" className="group">
            <Card className="h-full hover:border-emerald-500 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    <span>SPRINT VS GP PACE</span>
                  </CardTitle>
                  <Badge variant="green">LAP 16 CLIFF</Badge>
                </div>
                <CardDescription>
                  10-lap attack vs 23-lap conservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div className="text-3xl font-black font-mono text-white group-hover:text-emerald-400 transition-colors">
                    +1.4s
                  </div>
                  <div className="text-xs font-mono text-neutral-400 font-semibold">
                    Tyre Drop-Off
                  </div>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed border-t border-neutral-800/80 pt-3">
                  Saturday Sprint permits 100% flat-out riding. Sunday Grand Prix requires managing the sharp Lap 16 degradation cliff.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs font-mono text-neutral-400">
                <span>Pace Evolution</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
              </CardFooter>
            </Card>
          </Link>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE 3D TRACK & REAL-TIME ACCORDIONS */}
      <section className="max-w-[1560px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: 3D Circuit Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="p-0 overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#E10600]" />
                      <span>MUGELLO 3D SECTOR RADAR</span>
                    </CardTitle>
                    <CardDescription>
                      WebGL track geometry with speed traps &amp; apex markers
                    </CardDescription>
                  </div>
                  <Link href="/track-map">
                    <Button variant="outline" size="sm">
                      FULLSCREEN 3D
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[460px] w-full bg-black relative">
                  <CircuitCanvas selectedRiderNumber={selectedRider} />
                  <div className="absolute top-4 left-4 z-10 bg-black/85 border border-neutral-800 p-3 font-mono text-xs">
                    <div className="text-neutral-400 text-[10px] uppercase">Active Elevation</div>
                    <div className="text-white font-bold text-sm">41.2m Elevation Change</div>
                    <div className="text-[#E10600] text-[10px] mt-0.5">Arrabbiata Crest: 280 km/h</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Technical Accordion Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[1.5px] text-[#E10600]">
                CIRCUIT TELEMETRY MANUAL
              </div>
              <h3 className="text-xl font-black uppercase text-white font-sans mt-0.5">
                Technical Sector Breakdown
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Deep engineering breakdown of the 15 corners at Mugello.
              </p>
            </div>

            <Accordion type="single" collapsible defaultValue="sector1" className="space-y-2">
              <AccordionItem value="sector1">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E10600]" />
                    <span>Sector 1: San Donato &amp; Luco (T1-T3)</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      Begins with the terrifying 1.14 km main straight. Bikes reach 360+ km/h before the uphill braking into San Donato (Turn 1).
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 font-mono text-[11px]">
                      <div>
                        <span className="text-neutral-500 block">Braking Distance:</span>
                        <span className="text-white font-bold">286 Meters</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Apex Speed:</span>
                        <span className="text-white font-bold">91 km/h</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sector2">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500" />
                    <span>Sector 2: Casanova, Savelli &amp; Arrabbiata 1-2 (T4-T9)</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      The most demanding corner combination in world motorsport. Blind downhill right into Casanova, followed by the uphill right curves of Arrabbiata 1 &amp; 2 at 68° lean.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 font-mono text-[11px]">
                      <div>
                        <span className="text-neutral-500 block">Peak Lean:</span>
                        <span className="text-purple-400 font-bold">68.2° (Turn 9)</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Thermal Load:</span>
                        <span className="text-amber-400 font-bold">+24°C Delta</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sector3">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500" />
                    <span>Sector 3: Scarperia &amp; Palagio (T10-T11)</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      A fast technical chicane requiring rapid change of direction. Bikes transition from full right lean to full left lean in under 0.6 seconds.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 font-mono text-[11px]">
                      <div>
                        <span className="text-neutral-500 block">Roll Rate:</span>
                        <span className="text-emerald-400 font-bold">88 °/second</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">FIM Min Pressure:</span>
                        <span className="text-white font-bold">1.84 bar (&gt;1.80)</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sector4">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500" />
                    <span>Sector 4: Correntaio, Biondetti &amp; Bucine (T12-T15)</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      Long downhill parabola into Correntaio, high-speed Biondetti kink, and the crucial final Bucine hairpin which decides slipstream drag race to the chequered flag.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 font-mono text-[11px]">
                      <div>
                        <span className="text-neutral-500 block">Exit Acceleration:</span>
                        <span className="text-white font-bold">0.95G Longitudinal</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Ride-Height Drop:</span>
                        <span className="text-white font-bold">-70mm Rear Device</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE RIDER STANDINGS & COMPARISON TABLE */}
      <section className="max-w-[1560px] mx-auto px-6 py-12 border-t border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[1.5px] text-[#E10600]">
              WORLD CHAMPIONSHIP CLASSIFICATION
            </div>
            <h3 className="text-2xl font-black uppercase text-white font-sans mt-0.5">
              Live Rider Standings
            </h3>
          </div>
          <Link href="/standings">
            <Button variant="outline" size="sm">
              FULL 22-RIDER TABLE
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto no-scrollbar border border-neutral-800 bg-[#0E0E0E]">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">POS</th>
                <th className="py-3 px-4">RIDER</th>
                <th className="py-3 px-4">TEAM / CONSTRUCTOR</th>
                <th className="py-3 px-4">BEST LAP</th>
                <th className="py-3 px-4">GAP</th>
                <th className="py-3 px-4">MAX LEAN</th>
                <th className="py-3 px-4">SPEED TRAP</th>
                <th className="py-3 px-4 text-right">POINTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {MOCK_STANDINGS.slice(0, 6).map((standing) => (
                <tr
                  key={standing.rider.id}
                  className="hover:bg-neutral-900/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRider(standing.rider.number.toString())}
                >
                  <td className="py-3.5 px-4 font-black text-white">
                    {standing.position === 1 ? (
                      <span className="text-[#E10600]">P1</span>
                    ) : (
                      `P${standing.position}`
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">#{standing.rider.number}</span>
                      <span className="font-semibold text-neutral-200">{standing.rider.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 font-light">
                    {standing.team.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white tabular-nums">
                    {standing.position === 1 ? "1'44.855" : `1'44.${855 + standing.position * 42}`}
                  </td>
                  <td className="py-3.5 px-4 font-semibold tabular-nums">
                    {standing.position === 1 ? (
                      <span className="text-emerald-400">LEADER</span>
                    ) : (
                      <span className="text-neutral-400">+{((standing.position - 1) * 0.082).toFixed(3)}s</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">
                    <span className="text-white font-bold">{64 + standing.position * 0.7}°</span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">
                    <span className="text-white font-bold">{364 - standing.position * 1.2} km/h</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-white tabular-nums">
                    {standing.points} PTS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: FOOTER (BMW M Style pure black) */}
      <footer className="border-t border-neutral-800 bg-black py-16 px-6">
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="h-6 px-2 bg-[#E10600] inline-flex items-center text-white font-black text-xs tracking-tighter mb-3">
              MOTOGP™
            </div>
            <div className="text-sm font-black uppercase text-white font-sans">
              GP-Dashboard Telemetry Platform
            </div>
            <p className="text-xs text-neutral-500 font-light mt-1 max-w-md">
              European motorsport engineering interface. High-frequency telemetry, Michelin thermal matrices, and Brembo deceleration dynamics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
            <div>
              <div className="text-white font-bold uppercase tracking-wider mb-3">
                Telemetry
              </div>
              <ul className="space-y-2 text-neutral-400 font-light">
                <li><Link href="/live-timing" className="hover:text-white">Pitwall Timing</Link></li>
                <li><Link href="/lean-telemetry" className="hover:text-white">68° Lean Angle</Link></li>
                <li><Link href="/tyres-asymmetry" className="hover:text-white">Tyre Asymmetry</Link></li>
                <li><Link href="/braking-zones" className="hover:text-white">Braking Zones</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold uppercase tracking-wider mb-3">
                Design System
              </div>
              <ul className="space-y-2 text-neutral-400 font-light">
                <li><Link href="/design-system" className="hover:text-white">Apex DS Spec</Link></li>
                <li><Link href="/design-system?tab=tokens" className="hover:text-white">Color Tokens</Link></li>
                <li><Link href="/design-system?tab=components" className="hover:text-white">shadcn/ui Suite</Link></li>
                <li><Link href="/design-system?tab=telemetry" className="hover:text-white">Physics Primitives</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold uppercase tracking-wider mb-3">
                Championship
              </div>
              <ul className="space-y-2 text-neutral-400 font-light">
                <li><Link href="/standings" className="hover:text-white">Standings</Link></li>
                <li><Link href="/schedule" className="hover:text-white">Calendar</Link></li>
                <li><Link href="/gravel-trap" className="hover:text-white">Incident Ledger</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-[1560px] mx-auto mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono">
          <div>© 2026 GP-Dashboard. Official MotoGP™ Timing &amp; Telemetry Data.</div>
          <div className="mt-2 sm:mt-0">Private &amp; Confidential Engineering Workspace.</div>
        </div>
      </footer>
    </div>
  );
}
