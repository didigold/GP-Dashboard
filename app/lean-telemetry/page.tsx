'use client';

import React, { useState } from 'react';
import { LeanMeter } from '../../components/ui/LeanMeter';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
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
    <div className="w-full p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-apex-cyan">
            <Compass className="w-4 h-4" />
            <span>MUSEUM OF CORNERING PHYSICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
            Lean Angle & Apex Dynamics
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time gyroscopic angle telemetry, elbow-down thresholds, and corner apex speeds at Mugello.
          </p>
        </div>

        {/* Rider Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-subtle rounded-apex-sm border border-surface-border font-mono text-xs">
          {(['martin', 'bagnaia', 'marquez'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRider(r)}
              className={`px-3 py-1.5 rounded-apex-xs transition-all font-bold ${
                selectedRider === r
                  ? 'bg-apex-cyan text-surface-base shadow-glow-cyan'
                  : 'text-text-secondary hover:text-white'
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
          <Card variant="pitwall">
            <CardHeader>
              <CardTitle>
                <span>CORNER TELEMETRY:</span>
                <span className="text-apex-cyan font-mono">
                  TURN {corner.number} — {corner.name.toUpperCase()}
                </span>
              </CardTitle>
              <Badge variant="cyan" dot>
                {corner.type.toUpperCase()} HANDER
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Lean Meter Component */}
                <div className="p-4 rounded-apex-md bg-surface-base/80 border border-surface-border flex justify-center">
                  <LeanMeter
                    angle={corner.angle}
                    direction={corner.type === 'Left' ? 'left' : 'right'}
                    maxAngle={riderStats.maxLean}
                  />
                </div>

                {/* Corner Metrics */}
                <div className="sm:col-span-2 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-apex-sm bg-surface-subtle border border-surface-border">
                    <div className="text-[10px] text-text-muted">APEX VELOCITY</div>
                    <div className="text-xl font-extrabold text-white mt-1">
                      {corner.apexSpeed.toFixed(1)} km/h
                    </div>
                    <div className="text-[10px] text-text-muted">Gear: {corner.gear}th</div>
                  </div>

                  <div className="p-3 rounded-apex-sm bg-surface-subtle border border-surface-border">
                    <div className="text-[10px] text-text-muted">TIME AT &gt; 60° LEAN</div>
                    <div className="text-xl font-extrabold text-apex-cyan mt-1">
                      {riderStats.timeInLeanSec}s
                    </div>
                    <div className="text-[10px] text-text-muted">High tire shear</div>
                  </div>

                  <div className="p-3 rounded-apex-sm bg-surface-subtle border border-surface-border">
                    <div className="text-[10px] text-text-muted">ELEVATION GRADIENT</div>
                    <div className="text-xl font-extrabold text-apex-amber mt-1">
                      +{corner.elevationM}m Crest
                    </div>
                    <div className="text-[10px] text-text-muted">Blind apex uphill</div>
                  </div>

                  <div className="p-3 rounded-apex-sm bg-surface-subtle border border-surface-border">
                    <div className="text-[10px] text-text-muted">RIDING STYLE MATRIX</div>
                    <div className="text-sm font-extrabold text-apex-purple mt-1 truncate">
                      {riderStats.style}
                    </div>
                    <div className="text-[10px] text-text-muted">#{riderStats.number} {riderStats.name}</div>
                  </div>
                </div>
              </div>

              {/* Riding Style Physics Comparison */}
              <div className="p-4 rounded-apex-sm bg-surface-base border border-surface-border text-xs space-y-2">
                <div className="font-mono font-bold text-text-primary flex items-center gap-2">
                  <Zap className="w-4 h-4 text-apex-cyan" />
                  <span>POINT-AND-SHOOT (V-SHAPE) vs CORNER SPEED (U-SHAPE)</span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  <strong>Bagnaia (V-Shape):</strong> Brakes heavily upright, snaps the bike down to 65° for only 1.95s, then immediately picks the bike up onto the fat part of the tire to unleash 300+ HP out of the exit.
                  <br />
                  <strong>Martin (U-Shape):</strong> Carries higher rolling speed at 67.8° lean angle for 2.45s, relying heavily on front edge grip.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Circuit Corner Selector Bar */}
          <div className="glass-card p-4 rounded-apex-md border border-surface-border">
            <div className="text-xs font-mono text-text-muted mb-2 flex justify-between">
              <span>SELECT CORNER (1 TO 15)</span>
              <span>AUTODROMO DEL MUGELLO</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 font-mono text-xs">
              {MUGELLO_CORNERS.map((c, i) => (
                <button
                  key={c.number}
                  onClick={() => setSelectedCornerIdx(i)}
                  className={`p-2 rounded-apex-xs border text-center transition-all ${
                    selectedCornerIdx === i
                      ? 'bg-apex-cyan text-surface-base font-extrabold border-apex-cyan shadow-glow-cyan'
                      : 'bg-surface-subtle text-text-secondary hover:text-white border-surface-border'
                  }`}
                >
                  <div className="text-[9px] text-text-muted">T{c.number}</div>
                  <div className="font-bold">{c.angle.toFixed(0)}°</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Maximum Lean Leaderboard */}
        <div className="space-y-6">
          <Card variant="pitwall">
            <CardHeader>
              <CardTitle>
                <Flame className="w-4 h-4 text-apex-crimson" />
                <span>MAX LEAN LEADERBOARD</span>
              </CardTitle>
              <Badge variant="purple">SESSION PEAK</Badge>
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
                  className="p-3 rounded-apex-sm bg-surface-subtle border border-surface-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: r.color }} />
                    <div>
                      <div className="font-bold text-white">#{r.num} {r.rider}</div>
                      <div className="text-[10px] text-text-muted">{r.corner}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-apex-cyan">{r.angle.toFixed(1)}°</div>
                    <div className="text-[9px] text-text-muted">ELBOW DOWN</div>
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
