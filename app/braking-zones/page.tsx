'use client';

import React, { useState } from 'react';
import { BrakingGForceBar } from '../../components/ui/BrakingGForceBar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Zap, Gauge, Disc, ShieldAlert, Award } from 'lucide-react';

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
    discSpec: '355mm Carbon Discs',
    notes: 'Longest braking zone on the calendar: ~300 meters from 6th gear down to 1st gear.',
  },
];

export default function BrakingZonesPage() {
  return (
    <div className="w-full p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-apex-orange">
            <Zap className="w-4 h-4" />
            <span>BREMBO CARBON-CARBON DECELERATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
            Hard Braking Zones & G-Forces
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Extreme kinetic energy dissipation: 360 km/h to 70 km/h, 900°C carbon discs, and rear-wheel lift.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber" dot>
            BREMBO 355MM CARBON MANDATE
          </Badge>
        </div>
      </div>

      {/* Grid of Hardest Braking Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRAKING_ZONES_DATABASE.map((zone) => (
          <Card key={zone.corner} variant="pitwall">
            <CardHeader>
              <CardTitle>
                <span className="text-apex-orange font-mono">[{zone.circuit}]</span>
                <span>{zone.corner.toUpperCase()}</span>
              </CardTitle>
              <Badge variant="crimson">{zone.gForce.toFixed(2)} G LOAD</Badge>
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
              <p className="text-xs text-text-secondary font-mono leading-relaxed bg-surface-base/80 p-3 rounded-apex-sm border border-surface-border">
                {zone.notes}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Carbon Braking Deep-Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="subtle">
          <CardContent className="space-y-2 text-xs font-mono">
            <div className="font-bold text-text-primary flex items-center gap-2">
              <Disc className="w-4 h-4 text-apex-cyan" />
              <span>CARBON OPERATING WINDOW</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Carbon discs do not function below 250°C. Peak bite and coefficient of friction occur between 400°C and 800°C. Caliper cooling ducts manage temperature spikes above 950°C.
            </p>
          </CardContent>
        </Card>

        <Card variant="subtle">
          <CardContent className="space-y-2 text-xs font-mono">
            <div className="font-bold text-text-primary flex items-center gap-2">
              <Gauge className="w-4 h-4 text-apex-amber" />
              <span>REAR THUMB BRAKE LEVER</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Modern riders use a left-handlebar thumb or finger scooter-style brake to modulate rear slip in deep right-handers where the rider's right foot is scraping the tarmac.
            </p>
          </CardContent>
        </Card>

        <Card variant="subtle">
          <CardContent className="space-y-2 text-xs font-mono">
            <div className="font-bold text-text-primary flex items-center gap-2">
              <Award className="w-4 h-4 text-apex-crimson" />
              <span>ENGINE BRAKING MAPS (EBC)</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Electronic ride-by-wire butterflies automatically crack open on corner entry to prevent rear-wheel hopping, adjusting engine braking corner-by-corner via GPS mapping.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
