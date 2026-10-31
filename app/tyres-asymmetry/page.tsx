'use client';

import React, { useState } from 'react';
import { TyreAsymmetryPill } from '../../components/ui/TyreAsymmetryPill';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Banner } from '../../components/ui/Banner';
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
    <div className="w-full p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-apex-amber">
            <Disc className="w-4 h-4" />
            <span>MICHELIN ASYMMETRIC RUBBER DYNAMICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
            Asymmetric Tyre Thermal Matrix
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Left vs Right shoulder temperatures, cold-side crash hazards, and the FIM 1.80 bar front pressure rule.
          </p>
        </div>

        {/* Circuit Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-subtle rounded-apex-sm border border-surface-border font-mono text-xs">
          {(['sachsenring', 'mugello', 'valencia'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCircuit(c)}
              className={`px-3 py-1.5 rounded-apex-xs transition-all font-bold ${
                selectedCircuit === c
                  ? 'bg-apex-amber text-surface-base shadow-glow-amber'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetric Alert Banner */}
      <Banner
        type="yellow"
        title={`${circuitSpecs.name.toUpperCase()}: ${circuitSpecs.severity}`}
        description={circuitSpecs.desc}
      />

      {/* 2024-2026 Grid Tyre Allocations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rider 1: Bagnaia */}
        <Card variant="pitwall">
          <CardHeader>
            <CardTitle>
              <span className="w-2 h-4 rounded-full bg-[#CC0000]" />
              <span>#1 BAGNAIA</span>
            </CardTitle>
            <Badge variant="green">OPTIMAL</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="FRONT"
              compound="Hard"
              leftTemp={124}
              rightTemp={82}
              leftWear={78}
              rightWear={95}
              pressureBar={1.86}
            />
            <TyreAsymmetryPill
              position="REAR"
              compound="Medium"
              leftTemp={132}
              rightTemp={86}
              leftWear={72}
              rightWear={92}
              pressureBar={1.62}
            />
          </CardContent>
        </Card>

        {/* Rider 2: Martin */}
        <Card variant="pitwall">
          <CardHeader>
            <CardTitle>
              <span className="w-2 h-4 rounded-full bg-[#9333EA]" />
              <span>#89 MARTIN</span>
            </CardTitle>
            <Badge variant="amber">THERMAL STRESS</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="FRONT"
              compound="Hard"
              leftTemp={129}
              rightTemp={79}
              leftWear={74}
              rightWear={96}
              pressureBar={1.89}
            />
            <TyreAsymmetryPill
              position="REAR"
              compound="Medium"
              leftTemp={136}
              rightTemp={84}
              leftWear={68}
              rightWear={91}
              pressureBar={1.64}
            />
          </CardContent>
        </Card>

        {/* Rider 3: Marquez */}
        <Card variant="pitwall">
          <CardHeader>
            <CardTitle>
              <span className="w-2 h-4 rounded-full bg-[#38BDF8]" />
              <span>#93 MARQUEZ</span>
            </CardTitle>
            <Badge variant="cyan">AGGRESSIVE FRONT</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="FRONT"
              compound="Hard"
              leftTemp={126}
              rightTemp={84}
              leftWear={76}
              rightWear={94}
              pressureBar={1.84}
            />
            <TyreAsymmetryPill
              position="REAR"
              compound="Soft"
              leftTemp={138}
              rightTemp={89}
              leftWear={64}
              rightWear={88}
              pressureBar={1.61}
            />
          </CardContent>
        </Card>

        {/* Rider 4: Acosta */}
        <Card variant="pitwall">
          <CardHeader>
            <CardTitle>
              <span className="w-2 h-4 rounded-full bg-[#EF4444]" />
              <span>#31 ACOSTA</span>
            </CardTitle>
            <Badge variant="crimson">PRESSURE WARNING</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="FRONT"
              compound="Medium"
              leftTemp={131}
              rightTemp={81}
              leftWear={70}
              rightWear={92}
              pressureBar={2.12} // Overheating in slipstream!
            />
            <TyreAsymmetryPill
              position="REAR"
              compound="Medium"
              leftTemp={134}
              rightTemp={85}
              leftWear={71}
              rightWear={90}
              pressureBar={1.63}
            />
          </CardContent>
        </Card>
      </div>

      {/* Technical Explainers on Asymmetric Compounds & 1.80 Bar Regulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="subtle">
          <CardContent className="space-y-2 text-xs">
            <div className="font-mono font-bold text-text-primary flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-apex-amber" />
              <span>THE COLD-SHOULDER HAZARD (WATERFALL TURN 11)</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              When bikes spend 40+ seconds turning only left, the right shoulder of the tire drops below 75°C. When a rider suddenly flicks right into a 200 km/h apex, the cold rubber fails to deform, resulting in instant low-side or violent high-side crashes.
            </p>
          </CardContent>
        </Card>

        <Card variant="subtle">
          <CardContent className="space-y-2 text-xs">
            <div className="font-mono font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-apex-cyan" />
              <span>THE FIM 1.80 BAR FRONT TIRE MINIMUM RULE</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Riders must spend at least 60% of Grand Prix race laps above 1.80 bar (1.82 bar at certain circuits). Riding closely behind another bike increases front tire temperature and balloons pressure up to 2.15 bar, drastically reducing the contact patch.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
