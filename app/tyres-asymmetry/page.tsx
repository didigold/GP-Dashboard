'use client';

import React, { useState } from 'react';
import { TyreAsymmetryPill } from '@/components/ui/TyreAsymmetryPill';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Disc, AlertTriangle, ShieldCheck, Thermometer, Info } from 'lucide-react';

export default function TyresAsymmetryPage() {
  const [selectedCircuit, setSelectedCircuit] = useState<'sachsenring' | 'mugello' | 'valencia'>('sachsenring');

  const circuitSpecs = {
    sachsenring: {
      name: 'Sachsenring (Germany)',
      corners: '10 Lefts vs 3 Rights',
      severity: 'EXTREME ASYMMETRIC STRESS',
      desc: 'Seven consecutive left-hand turns cook the left shoulder. Turn 11 (Waterfall) is a blind downhill right-hander taken at 210 km/h where riders crash if the cold right side drops below 75°C.',
    },
    mugello: {
      name: 'Autodromo del Mugello (Italy)',
      corners: '6 Lefts vs 9 Rights',
      severity: 'MODERATE RIGHT-LOADED',
      desc: 'High right-side thermal loading through Arrabbiata 1 & 2. Balanced front stress under heavy braking at Turn 1 San Donato.',
    },
    valencia: {
      name: 'Circuit Ricardo Tormo (Spain)',
      corners: '9 Lefts vs 5 Rights',
      severity: 'HIGH ASYMMETRIC WEAR',
      desc: 'Tight amphitheater layout with heavy left-side continuous lateral g-forces.',
    },
  }[selectedCircuit];

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">MICHELIN ASYMMETRIC</Badge>
            <Badge variant="outline">FIM 1.80 BAR MANDATE</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight uppercase text-white leading-none">
            Tyre Thermal Asymmetry
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Left vs Right shoulder temperatures, cold-side crash hazards (Turn 11 Waterfall), and real-time monitoring of the controversial FIM 1.80 bar front tyre pressure rule.
          </p>
        </div>

        {/* Circuit Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111111] border border-neutral-800 font-mono text-xs">
          {(['sachsenring', 'mugello', 'valencia'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCircuit(c)}
              className={`px-3 py-1.5 font-bold uppercase transition-colors ${
                selectedCircuit === c
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Circuit Cold-Side Hazard Banner */}
      <div className="p-4 bg-[#111111] border-l-4 border-l-[#E10600] border-y border-r border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E10600]" />
            <span className="font-bold text-sm text-white uppercase">{circuitSpecs.name}: {circuitSpecs.severity}</span>
          </div>
          <p className="text-xs text-neutral-400 font-light mt-1 max-w-4xl leading-relaxed">
            {circuitSpecs.desc}
          </p>
        </div>
        <Badge variant="destructive" className="shrink-0">
          COLD-SIDE WARNING ACTIVE
        </Badge>
      </div>

      {/* Main Tyre Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Front Tyre Thermal Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-[#E10600]" />
                <span>FRONT TYRE (HARD ASYMMETRIC)</span>
              </CardTitle>
              <Badge variant="outline">HARD / MEDIUM COMPOUND</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="FRONT"
              compound="Hard"
              leftTemp={selectedCircuit === 'sachsenring' ? 132 : 112}
              rightTemp={selectedCircuit === 'sachsenring' ? 76 : 128}
              leftWear={72}
              rightWear={88}
              pressureBar={1.84}
            />

            <div className="grid grid-cols-3 gap-3 p-3 bg-[#0A0A0A] border border-neutral-800 font-mono text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">PRESSURE</span>
                <span className="text-lg font-black text-white tabular-nums">1.84 BAR</span>
                <span className="text-[10px] text-emerald-400 block font-light">Legal (&gt;1.80)</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">DELTA TEMP</span>
                <span className="text-lg font-black text-[#E10600] tabular-nums">
                  {selectedCircuit === 'sachsenring' ? '56°C' : '16°C'}
                </span>
                <span className="text-[10px] text-neutral-400 block font-light">Shoulder split</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">CARCASS WEAR</span>
                <span className="text-lg font-black text-white tabular-nums">80%</span>
                <span className="text-[10px] text-neutral-400 block font-light">Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rear Tyre Thermal Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-amber-500" />
                <span>REAR TYRE (MEDIUM ASYMMETRIC)</span>
              </CardTitle>
              <Badge variant="amber">MEDIUM / SOFT COMPOUND</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="REAR"
              compound="Medium"
              leftTemp={selectedCircuit === 'sachsenring' ? 144 : 118}
              rightTemp={selectedCircuit === 'sachsenring' ? 82 : 139}
              leftWear={64}
              rightWear={78}
              pressureBar={1.68}
            />

            <div className="grid grid-cols-3 gap-3 p-3 bg-[#0A0A0A] border border-neutral-800 font-mono text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">PRESSURE</span>
                <span className="text-lg font-black text-white tabular-nums">1.68 BAR</span>
                <span className="text-[10px] text-emerald-400 block font-light">Optimal</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">HOT SHOULDER</span>
                <span className="text-lg font-black text-amber-400 tabular-nums">
                  {selectedCircuit === 'sachsenring' ? '144°C (Left)' : '139°C (Right)'}
                </span>
                <span className="text-[10px] text-neutral-400 block font-light">Blistering limit</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">DRIVE TRACTION</span>
                <span className="text-lg font-black text-white tabular-nums">92%</span>
                <span className="text-[10px] text-neutral-400 block font-light">Rear hookup</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FIM Pressure Rule Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="space-y-2 text-xs font-mono p-5">
            <div className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>THE 1.80 BAR MANDATE</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              FIM regulations stipulate that riders must remain above 1.80 bar for minimum 60% of Grand Prix laps (33% of Sprint). Michelin set this floor to prevent front tire bead separation under extreme 1.8G braking forces.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 text-xs font-mono p-5">
            <div className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E10600]" />
              <span>THE SLIPSTREAM PRESSURE TRAP</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              Following another motorcycle closely traps hot radiator exhaust onto the front tire. Pressure spikes from 1.82 bar to over 2.10 bar, turning the tire convex like a balloon and causing catastrophic front-end loss of grip.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 text-xs font-mono p-5">
            <div className="font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>TURN 11 WATERFALL DANGER</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              At Sachsenring, bikes turn left continuously through Turns 4 through 10. The right shoulder cools down to ambient temperatures. Entering Turn 11 downhill at 210 km/h with a cold right side has claimed dozens of catastrophic high-speed crashes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
