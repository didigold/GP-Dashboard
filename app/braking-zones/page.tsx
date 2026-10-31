'use client';

import React from 'react';
import { BrakingGForceBar } from '@/components/ui/BrakingGForceBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Disc } from 'lucide-react';

const BRAKING_ZONES_DATABASE = [
  {
    circuit: 'Mugello (Italy)',
    corner: 'Turn 1 San Donato',
    initialSpeed: 361.4,
    apexSpeed: 92.5,
    brakingDistanceM: 286,
    gForce: 1.65,
    discTemp: 860,
    discSpec: '355mm Heavy Carbon Discs',
    notes: 'Bikes arrive over a crest at 360+ km/h where front wheels become airborne before heavy braking.',
  },
  {
    circuit: 'Spielberg (Austria)',
    corner: 'Turn 3 Remus Uphill',
    initialSpeed: 315.0,
    apexSpeed: 68.2,
    brakingDistanceM: 224,
    gForce: 1.75,
    discTemp: 910,
    discSpec: '355mm Heavy Carbon + Caliper Ducts',
    notes: 'Extreme uphill compression. Peak G-load on riders wrists and arms reaches 1.75G.',
  },
  {
    circuit: 'Mobility Resort Motegi (Japan)',
    corner: 'Turn 11 90-Degree Corner',
    initialSpeed: 312.0,
    apexSpeed: 74.0,
    brakingDistanceM: 238,
    gForce: 1.80,
    discTemp: 940,
    discSpec: '355mm Ventilated Carbon',
    notes: 'Stop-and-go punishment for front forks. Rear wheel lifts off the tarmac (stoppie) for 40+ meters.',
  },
  {
    circuit: 'Circuit of The Americas (USA)',
    corner: 'Turn 12 End of Backstraight',
    initialSpeed: 348.5,
    apexSpeed: 64.0,
    brakingDistanceM: 298,
    gForce: 1.70,
    discTemp: 890,
    discSpec: '355mm Carbon Carbon Discs',
    notes: 'Longest continuous straight on calendar into tight first-gear left-hand hairpin.',
  },
];

export default function BrakingZonesPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">Brembo 355mm Carbon</Badge>
            <Badge variant="outline">Deceleration Kinetics</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            Hard Braking Zones &amp; G-Forces
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Dissipating kinetic energy from 360 km/h: 900°C carbon disc temperatures, 1.80G deceleration loads, and stoppie rear-wheel lift indices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="destructive" dot>
            Critical Thermal Window &gt;800°C
          </Badge>
        </div>
      </div>

      {/* Grid of Hardest Braking Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRAKING_ZONES_DATABASE.map((zone) => (
          <Card key={zone.corner}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-sans font-bold text-sm">
                  <span className="text-[#E10600] font-mono mr-2">[{zone.circuit}]</span>
                  <span>{zone.corner}</span>
                </CardTitle>
                <Badge variant="destructive">{zone.gForce.toFixed(2)} G Load</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <BrakingGForceBar
                cornerName={zone.corner}
                initialSpeed={zone.initialSpeed}
                apexSpeed={zone.apexSpeed}
                brakingDistanceM={zone.brakingDistanceM}
                gForce={zone.gForce}
                carbonDiscTemp={zone.discTemp}
              />
              <p className="text-xs text-neutral-400 font-light leading-relaxed bg-[#0A0A0A] p-3 border border-neutral-800">
                {zone.notes}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Carbon Braking Deep-Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="space-y-2 text-xs font-mono p-5">
            <div className="font-semibold text-white flex items-center gap-2 font-sans">
              <Disc className="w-4 h-4 text-[#E10600]" />
              <span>Carbon Operating Window</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed font-sans">
              Carbon discs do not function below 250°C. Optimum friction coefficient (μ = 0.60) is reached between 400°C and 800°C.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 text-xs font-mono p-5">
            <div className="font-semibold text-white flex items-center gap-2 font-sans">
              <Zap className="w-4 h-4 text-[#E5A93C]" />
              <span>Rear Wheel Stoppie Lift</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed font-sans">
              Weight transfer shifts 100% of motorcycle and rider mass onto the front Michelin tyre. Anti-stoppie software regulates rear-wheel lift.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 text-xs font-mono p-5">
            <div className="font-semibold text-white flex items-center gap-2 font-sans">
              <Zap className="w-4 h-4 text-[#0066FF]" />
              <span>1.80G Physiological Stress</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed font-sans">
              Riders endure 7.5 kg of front brake lever pressure, generating over 150 kg of physical load pushing through their shoulders and arms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
