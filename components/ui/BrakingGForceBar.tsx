'use client';

import React from 'react';

interface BrakingGForceBarProps {
  cornerName?: string;
  initialSpeed?: number;
  apexSpeed?: number;
  brakingDistanceM?: number;
  gForce?: number;
  carbonDiscTemp?: number;
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
  const gPercent = Math.min(Math.max((gForce / 2.0) * 100, 0), 100);

  return (
    <div className={`p-4 bg-[#0A0A0A] border border-neutral-800 flex flex-col gap-3 font-mono ${className}`}>
      {/* Corner Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white font-sans">{cornerName}</div>
          <div className="text-[10px] text-neutral-400">Brembo 355mm Carbon Discs</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-[#E5A93C]">{gForce.toFixed(2)} G</div>
          <div className="text-[9px] text-neutral-400">Peak Decel</div>
        </div>
      </div>

      {/* G-Force Load Meter */}
      <div className="space-y-1">
        <div className="h-1.5 w-full bg-[#111111] overflow-hidden flex border border-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-[#E10600] transition-all duration-500"
            style={{ width: `${gPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-neutral-400">
          <span>0.0G</span>
          <span>0.8G</span>
          <span>1.4G</span>
          <span>2.0G Max</span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80 text-center">
        <div className="p-1.5 bg-black border border-neutral-800">
          <div className="text-[9px] text-neutral-400">Entry Speed</div>
          <div className="text-xs font-bold text-white">{initialSpeed} km/h</div>
        </div>

        <div className="p-1.5 bg-black border border-neutral-800">
          <div className="text-[9px] text-neutral-400">Braking Dist</div>
          <div className="text-xs font-bold text-blue-400">{brakingDistanceM} m</div>
        </div>

        <div className="p-1.5 bg-black border border-neutral-800">
          <div className="text-[9px] text-neutral-400">Disc Temp</div>
          <div className="text-xs font-bold text-[#E10600]">{carbonDiscTemp}°C</div>
        </div>
      </div>
    </div>
  );
}
