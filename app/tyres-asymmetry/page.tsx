'use client';

import React, { useState } from 'react';
import { TyreAsymmetryPill } from '@/components/ui/TyreAsymmetryPill';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Disc, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TyresAsymmetryPage() {
  const [selectedCircuit, setSelectedCircuit] = useState<'sepang' | 'sachsenring' | 'mugello' | 'valencia'>('sepang');

  const circuitData = {
    sepang: {
      name: 'Petronas Sepang (Malaysia)',
      turns: '5 Left · 10 Right',
      severity: 'Extreme Thermal & Asymmetric Load',
      desc: 'High ambient humidity and tropical tarmac temperatures above 50°C combined with 10 heavy right-handers and dual 900m+ straights drive right shoulder carcass temperatures above 148°C.',
      frontLeftTemp: 110,
      frontRightTemp: 138,
      rearLeftTemp: 118,
      rearRightTemp: 148,
      pressureFront: 1.86,
      pressureRear: 1.72,
    },
    sachsenring: {
      name: 'Sachsenring (Germany)',
      turns: '10 Left · 3 Right',
      severity: 'Extreme Left Asymmetric',
      desc: 'The Waterfall (Turn 11) is the most dangerous corner on the calendar: bikes spend over 30 seconds on the left side before flicking right onto a freezing cold shoulder.',
      frontLeftTemp: 142,
      frontRightTemp: 68,
      rearLeftTemp: 148,
      rearRightTemp: 74,
      pressureFront: 1.88,
      pressureRear: 1.72,
    },
    mugello: {
      name: 'Mugello (Italy)',
      turns: '6 Left · 9 Right',
      severity: 'Right Asymmetric Load',
      desc: 'High-speed Arrabbiata 1 & 2 compress the right shoulder at over 230 km/h, causing extreme thermal stress (+24°C delta vs left shoulder).',
      frontLeftTemp: 84,
      frontRightTemp: 125,
      rearLeftTemp: 88,
      rearRightTemp: 134,
      pressureFront: 1.84,
      pressureRear: 1.70,
    },
    valencia: {
      name: 'Ricardo Tormo Valencia (Spain)',
      turns: '9 Left · 5 Right',
      severity: 'Left Continuous Load',
      desc: 'Tight amphitheatre stadium layout with continuous left-handed parabolas. Left shoulder degrades rapidly in late race laps.',
      frontLeftTemp: 135,
      frontRightTemp: 78,
      rearLeftTemp: 140,
      rearRightTemp: 82,
      pressureFront: 1.86,
      pressureRear: 1.68,
    },
  };

  const circuitSpecs = circuitData[selectedCircuit];

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">Michelin Asymmetric Tyre Telemetry</Badge>
            <Badge variant="outline">FIM 1.80 Bar Pressure Rule</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            Tyre Carcass Thermal Asymmetry
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Left vs right carcass compound differentiation, cold-shoulder safety thresholds, and FIM minimum pressure sensor compliance.
          </p>
        </div>

        {/* Circuit Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#111111] border border-neutral-800 text-xs">
          {(['sepang', 'sachsenring', 'mugello', 'valencia'] as const).map((c) => {
            const labels = { sepang: 'Sepang (Live GP)', sachsenring: 'Sachsenring', mugello: 'Mugello', valencia: 'Valencia' };
            return (
              <button
                key={c}
                onClick={() => setSelectedCircuit(c)}
                className={`px-3 py-1.5 font-semibold transition-colors ${
                  selectedCircuit === c
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {labels[c]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Circuit Cold-Side Hazard Banner */}
      <div className="p-4 bg-[#111111] border-l-4 border-l-[#E10600] border-y border-r border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E10600]" />
            <span className="font-bold text-sm text-white">{circuitSpecs.name}: {circuitSpecs.severity}</span>
          </div>
          <p className="text-xs text-neutral-400 font-light mt-1 max-w-4xl leading-relaxed">
            {circuitSpecs.desc}
          </p>
        </div>
        <Badge variant="destructive" className="shrink-0">
          Cold-Side Warning Active
        </Badge>
      </div>

      {/* Main Tyre Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Front Tyre Thermal Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-sans font-bold text-sm">
                <Disc className="w-4 h-4 text-[#E10600]" />
                <span>Front Tyre (Hard Asymmetric)</span>
              </CardTitle>
              <Badge variant="outline">Hard / Medium Compound</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="FRONT"
              compound="Hard"
              leftTemp={circuitSpecs.frontLeftTemp}
              rightTemp={circuitSpecs.frontRightTemp}
              pressureBar={circuitSpecs.pressureFront}
              lifePercent={82}
            />
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Operating Temperature:</span>
                <span className="text-white font-bold">{circuitSpecs.frontRightTemp}°C (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Cold Shoulder Delta:</span>
                <span className="text-amber-400 font-bold">{Math.abs(circuitSpecs.frontRightTemp - circuitSpecs.frontLeftTemp)}°C Difference</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rear Tyre Thermal Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-sans font-bold text-sm">
                <Disc className="w-4 h-4 text-amber-500" />
                <span>Rear Tyre (Medium Asymmetric)</span>
              </CardTitle>
              <Badge variant="amber">Medium Compound</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <TyreAsymmetryPill
              position="REAR"
              compound="Medium"
              leftTemp={circuitSpecs.rearLeftTemp}
              rightTemp={circuitSpecs.rearRightTemp}
              pressureBar={circuitSpecs.pressureRear}
              lifePercent={74}
            />
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Wheelspin Spin-Rate:</span>
                <span className="text-white font-bold">4.2% Slip Ratio</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Drive Traction:</span>
                <span className="text-emerald-400 font-bold">Anti-Wheelie Engaged</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
