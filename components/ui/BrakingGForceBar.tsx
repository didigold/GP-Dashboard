'use client';

import React from 'react';

interface BrakingGForceBarProps {
  cornerName?: string;       // e.g. "Turn 1 San Donato"
  initialSpeed?: number;     // e.g. 362 km/h
  apexSpeed?: number;        // e.g. 94 km/h
  brakingDistanceM?: number; // e.g. 288 meters
  gForce?: number;           // e.g. 1.65 G
  carbonDiscTemp?: number;   // e.g. 840 °C
  className?: string;
}

export function BrakingGForceBar({
  cornerName = 'Turn 1 San Donato',
  initialSpeed = 361.4,
  apexSpeed = 92.5,
  brakingDistanceM = 286,
  gForce = 1.65,
  carbonDiscTemp = 860,
  className = '',
}: BrakingGForceBarProps) {
  // G-Force percentage of 2.0G
  const gPercent = Math.min(Math.max((gForce / 2.0) * 100, 0), 100);

  return (
    <div className={`p-4 rounded-apex-md bg-surface-subtle/80 border border-surface-border flex flex-col gap-3 font-mono ${className}`}>
      {/* Corner Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-text-primary">{cornerName}</div>
          <div className="text-[10px] text-text-muted">Brembo 355mm Carbon Discs</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-extrabold text-apex-orange">{gForce.toFixed(2)} G</div>
          <div className="text-[9px] text-text-muted">PEAK DECEL</div>
        </div>
      </div>

      {/* G-Force Load Meter */}
      <div className="space-y-1">
        <div className="h-2 w-full bg-surface-card rounded-full overflow-hidden flex border border-surface-border/50">
          <div
            className="h-full bg-gradient-to-r from-apex-cyan via-apex-amber to-apex-crimson transition-all duration-500 rounded-full"
            style={{ width: `${gPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-text-muted">
          <span>0.0G</span>
          <span>0.8G</span>
          <span>1.4G</span>
          <span>2.0G MAX</span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border/40 text-center">
        <div className="p-1.5 rounded-apex-xs bg-surface-base">
          <div className="text-[8px] text-text-muted">ENTRY SPEED</div>
          <div className="text-xs font-extrabold text-text-primary">{initialSpeed} km/h</div>
        </div>

        <div className="p-1.5 rounded-apex-xs bg-surface-base">
          <div className="text-[8px] text-text-muted">BRAKING DIST</div>
          <div className="text-xs font-extrabold text-apex-cyan">{brakingDistanceM} m</div>
        </div>

        <div className="p-1.5 rounded-apex-xs bg-surface-base">
          <div className="text-[8px] text-text-muted">DISC TEMP</div>
          <div className="text-xs font-extrabold text-apex-crimson">{carbonDiscTemp}°C</div>
        </div>
      </div>
    </div>
  );
}
