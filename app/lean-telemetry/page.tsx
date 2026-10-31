'use client';

import React, { useState } from 'react';
import { LeanMeter } from '@/components/ui/LeanMeter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Zap } from 'lucide-react';

interface CornerData {
  number: number;
  name: string;
  type: 'Left' | 'Right';
  angle: number;
  apexSpeed: number;
  gear: number;
  elevationM: number;
}

const MUGELLO_CORNERS: CornerData[] = [
  { number: 1, name: 'San Donato', type: 'Right', angle: 61.4, apexSpeed: 94.2, gear: 2, elevationM: 5 },
  { number: 2, name: 'Luco', type: 'Left', angle: 62.8, apexSpeed: 128.5, gear: 2, elevationM: 15 },
  { number: 3, name: 'Poggio Secco', type: 'Right', angle: 64.1, apexSpeed: 135.0, gear: 3, elevationM: 25 },
  { number: 4, name: 'Materassi', type: 'Left', angle: 63.5, apexSpeed: 118.2, gear: 2, elevationM: 22 },
  { number: 5, name: 'Borgo San Lorenzo', type: 'Right', angle: 62.0, apexSpeed: 122.4, gear: 2, elevationM: 18 },
  { number: 6, name: 'Casanova', type: 'Right', angle: 64.8, apexSpeed: 188.5, gear: 4, elevationM: 10 },
  { number: 7, name: 'Savelli', type: 'Left', angle: 65.5, apexSpeed: 172.0, gear: 3, elevationM: -5 },
  { number: 8, name: 'Arrabbiata 1', type: 'Right', angle: 66.8, apexSpeed: 215.4, gear: 4, elevationM: 5 },
  { number: 9, name: 'Arrabbiata 2', type: 'Right', angle: 67.4, apexSpeed: 232.0, gear: 5, elevationM: 25 },
  { number: 10, name: 'Scarperia', type: 'Right', angle: 62.5, apexSpeed: 105.8, gear: 2, elevationM: 35 },
  { number: 11, name: 'Palagio', type: 'Left', angle: 63.0, apexSpeed: 112.4, gear: 2, elevationM: 25 },
  { number: 12, name: 'Correntaio', type: 'Right', angle: 64.2, apexSpeed: 110.0, gear: 2, elevationM: 10 },
  { number: 13, name: 'Biondetti 1', type: 'Left', angle: 65.0, apexSpeed: 168.2, gear: 3, elevationM: 5 },
  { number: 14, name: 'Biondetti 2', type: 'Right', angle: 64.5, apexSpeed: 175.0, gear: 3, elevationM: 3 },
  { number: 15, name: 'Bucine', type: 'Left', angle: 65.8, apexSpeed: 115.6, gear: 2, elevationM: 2 },
];

export default function LeanTelemetryPage() {
  const [selectedCornerIdx, setSelectedCornerIdx] = useState(8); // Default Arrabbiata 2
  const [selectedRider, setSelectedRider] = useState<'martin' | 'bagnaia' | 'marquez'>('martin');

  const corner = MUGELLO_CORNERS[selectedCornerIdx];

  const riderStats = {
    martin: { name: 'Jorge Martin', number: 89, maxLean: 67.8, style: 'Corner Speed / High Lean', color: '#9333EA', timeInLeanSec: 2.45 },
    bagnaia: { name: 'Francesco Bagnaia', number: 1, maxLean: 65.4, style: 'Point-and-Shoot V-Shape', color: '#CC0000', timeInLeanSec: 1.95 },
    marquez: { name: 'Marc Marquez', number: 93, maxLean: 68.2, style: 'Aggressive Front-End Push', color: '#38BDF8', timeInLeanSec: 2.30 },
  }[selectedRider];

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">Gyroscopic Sensors</Badge>
            <Badge variant="outline">68.2° Elbow-Down Angle</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            Lean Angle &amp; Apex Dynamics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Real-time gyroscopic angle telemetry, elbow-down thresholds, and corner apex speeds across Mugello&apos;s 15 curves.
          </p>
        </div>

        {/* Rider Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#111111] border border-neutral-800 text-xs">
          {(['martin', 'bagnaia', 'marquez'] as const).map((r) => {
            const labels = { martin: 'Martin #89', bagnaia: 'Bagnaia #1', marquez: 'Marquez #93' };
            return (
              <button
                key={r}
                onClick={() => setSelectedRider(r)}
                className={`px-3 py-1.5 font-semibold transition-colors ${
                  selectedRider === r
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flagship Corner Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Corner Inspector & Curve Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-sans font-bold text-sm">
                  <span>Corner Telemetry:</span>
                  <span className="text-[#E10600]">
                    Turn {corner.number} — {corner.name}
                  </span>
                </CardTitle>
                <Badge variant="outline">
                  {corner.type}-hander
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Lean Meter Component */}
                <div className="p-4 bg-[#0A0A0A] border border-neutral-800 flex justify-center">
                  <LeanMeter
                    angle={corner.angle}
                    direction={corner.type === 'Left' ? 'left' : 'right'}
                    maxAngle={riderStats.maxLean}
                  />
                </div>

                {/* Corner Metrics */}
                <div className="sm:col-span-2 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#0A0A0A] border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">Apex Velocity</div>
                    <div className="text-xl font-bold text-white mt-1 tabular-nums">
                      {corner.apexSpeed.toFixed(1)} km/h
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">Gear: {corner.gear}th</div>
                  </div>

                  <div className="p-3 bg-[#0A0A0A] border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">Time at &gt;60° Lean</div>
                    <div className="text-xl font-bold text-[#E10600] mt-1 tabular-nums">
                      {riderStats.timeInLeanSec}s
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">High tire shear</div>
                  </div>

                  <div className="p-3 bg-[#0A0A0A] border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">Turn Elevation</div>
                    <div className="text-xl font-bold text-white mt-1 tabular-nums">
                      {corner.elevationM > 0 ? `+${corner.elevationM}m` : `${corner.elevationM}m`}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">Crest compression</div>
                  </div>

                  <div className="p-3 bg-[#0A0A0A] border border-neutral-800">
                    <div className="text-[10px] text-neutral-400">Rider Max Lean Limit</div>
                    <div className="text-xl font-bold text-amber-400 mt-1 tabular-nums">
                      {riderStats.maxLean}°
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">{riderStats.style}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Mugello Corner Selector List */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-sans font-bold text-sm">
                Mugello Corner Selector
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 p-3 overflow-y-auto max-h-[500px]">
              {MUGELLO_CORNERS.map((c, idx) => (
                <button
                  key={c.number}
                  onClick={() => setSelectedCornerIdx(idx)}
                  className={`w-full p-2.5 flex items-center justify-between text-left text-xs font-mono transition-colors border ${
                    selectedCornerIdx === idx
                      ? 'bg-[#181818] border-[#E10600] text-white'
                      : 'bg-black border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#E10600]">T{c.number}</span>
                    <span className="font-sans font-medium text-white">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-neutral-500">{c.type}</span>
                    <span className="font-bold text-white">{c.angle}°</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
