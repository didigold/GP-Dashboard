'use client';

import React, { useState } from 'react';
import { LeanMeter } from '@/components/ui/LeanMeter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Compass, Gauge, Zap, Flame, Award, ChevronRight } from 'lucide-react';

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
            <Badge variant="motogp">GYROSCOPIC SENSORS</Badge>
            <Badge variant="outline">68.2° ELBOW-DOWN ANGLE</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight uppercase text-white leading-none">
            Lean Angle &amp; Apex Dynamics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Real-time gyroscopic angle telemetry, elbow-down thresholds, and corner apex speeds across Mugello&apos;s 15 curves.
          </p>
        </div>

        {/* Rider Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111111] border border-neutral-800 font-mono text-xs">
          {(['martin', 'bagnaia', 'marquez'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRider(r)}
              className={`px-3 py-1.5 font-bold transition-colors ${
                selectedRider === r
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Flagship Corner Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Corner Inspector & Curve Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>CORNER TELEMETRY:</span>
                  <span className="text-[#E10600]">
                    TURN {corner.number} — {corner.name.toUpperCase()}
                  </span>
                </CardTitle>
                <Badge variant="outline">
                  {corner.type.toUpperCase()} HANDER
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
                    <div className="text-[10px] text-neutral-400 uppercase">APEX VELOCITY</div>
                    <div className="text-xl font-black text-white mt-1 tabular-nums">
                      {corner.apexSpeed.toFixed(1)} km/h
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">Gear: {corner.gear}th</div>
                  </div>

                  <div className="p-3 bg-[#0A0A0A] border border-neutral-800">
                    <div className="text-[10px] text-neutral-400 uppercase">TIME AT &gt; 60° LEAN</div>
                    <div className="text-xl font-black text-[#E10600] mt-1 tabular-nums">
                      {riderStats.timeInLeanSec}s
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">High tire shear</div>
                  </div>

                  <div className="p-3 bg-[#0A0A0A] border border-neutral-800">
                    <div className="text-[10px] text-neutral-400 uppercase">ELEVATION GRADIENT</div>
                    <div className="text-xl font-black text-amber-400 mt-1 tabular-nums">
                      +{corner.elevationM}m Crest
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">Blind apex uphill</div>
                  </div>

                  <div className="p-3 bg-[#0A0A0A] border border-neutral-800">
                    <div className="text-[10px] text-neutral-400 uppercase">RIDING STYLE MATRIX</div>
                    <div className="text-sm font-black text-purple-400 mt-1 truncate">
                      {riderStats.style}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-light mt-0.5">#{riderStats.number} {riderStats.name}</div>
                  </div>
                </div>
              </div>

              {/* Riding Style Physics Comparison */}
              <div className="p-4 bg-[#0A0A0A] border border-neutral-800 text-xs space-y-2 font-mono">
                <div className="font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#E10600]" />
                  <span>POINT-AND-SHOOT (V-SHAPE) vs CORNER SPEED (U-SHAPE)</span>
                </div>
                <p className="text-neutral-400 font-light leading-relaxed">
                  <strong className="text-white">Bagnaia (V-Shape):</strong> Brakes heavily upright, snaps the bike down to 65° for only 1.95s, then immediately picks the bike up onto the fat part of the tire to unleash 300+ HP out of the exit.
                  <br />
                  <strong className="text-white">Martin (U-Shape):</strong> Carries higher rolling speed at 67.8° lean angle for 2.45s, relying heavily on front edge grip.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Circuit Corner Selector Bar */}
          <div className="p-4 bg-[#111111] border border-neutral-800">
            <div className="text-xs font-mono text-neutral-400 mb-2 flex justify-between">
              <span className="uppercase tracking-wider font-bold">SELECT CORNER (1 TO 15)</span>
              <span>AUTODROMO DEL MUGELLO</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 font-mono text-xs">
              {MUGELLO_CORNERS.map((c, i) => (
                <button
                  key={c.number}
                  onClick={() => setSelectedCornerIdx(i)}
                  className={`p-2 border text-center transition-colors ${
                    selectedCornerIdx === i
                      ? 'bg-[#E10600] text-white font-black border-[#E10600]'
                      : 'bg-[#0A0A0A] text-neutral-400 hover:text-white border-neutral-800'
                  }`}
                >
                  <div className="text-[9px] text-neutral-400 font-light">T{c.number}</div>
                  <div className="font-bold tabular-nums">{c.angle.toFixed(0)}°</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Maximum Lean Leaderboard */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#E10600]" />
                  <span>MAX LEAN RECORD</span>
                </CardTitle>
                <Badge variant="purple">SESSION PEAK</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              {[
                { pos: 1, rider: 'Marc Marquez', num: 93, angle: 68.2, corner: 'T9 Arrabbiata 2', color: '#38BDF8' },
                { pos: 2, rider: 'Jorge Martin', num: 89, angle: 67.8, corner: 'T9 Arrabbiata 2', color: '#9333EA' },
                { pos: 3, rider: 'Pedro Acosta', num: 31, angle: 67.1, corner: 'T8 Arrabbiata 1', color: '#EF4444' },
                { pos: 4, rider: 'Francesco Bagnaia', num: 1, angle: 65.4, corner: 'T7 Savelli', color: '#CC0000' },
                { pos: 5, rider: 'Maverick Viñales', num: 12, angle: 65.1, corner: 'T15 Bucine', color: '#22C55E' },
              ].map((r) => (
                <div
                  key={r.num}
                  className="p-3 bg-[#0A0A0A] border border-neutral-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-6" style={{ backgroundColor: r.color }} />
                    <div>
                      <div className="font-bold text-white">#{r.num} {r.rider}</div>
                      <div className="text-[10px] text-neutral-400 font-light">{r.corner}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-white tabular-nums">{r.angle.toFixed(1)}°</div>
                    <div className="text-[9px] text-[#E10600] font-bold">ELBOW DOWN</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
