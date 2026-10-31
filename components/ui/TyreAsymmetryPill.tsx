'use client';

import React from 'react';

interface TyreAsymmetryPillProps {
  position?: 'FRONT' | 'REAR';
  compound?: 'Soft' | 'Medium' | 'Hard';
  leftTemp?: number;    // e.g. 118°C
  rightTemp?: number;   // e.g. 82°C
  leftWear?: number;    // e.g. 84%
  rightWear?: number;   // e.g. 96%
  pressureBar?: number; // e.g. 1.84 bar
  className?: string;
}

export function TyreAsymmetryPill({
  position = 'FRONT',
  compound = 'Hard',
  leftTemp = 115,
  rightTemp = 88,
  leftWear = 82,
  rightWear = 94,
  pressureBar = 1.86,
  className = '',
}: TyreAsymmetryPillProps) {
  const deltaTemp = Math.abs(leftTemp - rightTemp);
  const isThermalImbalance = deltaTemp >= 25; // Asymmetric track stress alert

  // Color helper for shoulder temperature
  const getTempColor = (temp: number) => {
    if (temp < 80) return 'text-apex-blue bg-apex-blue/15 border-apex-blue/30';
    if (temp <= 120) return 'text-apex-green bg-apex-green/15 border-apex-green/30';
    if (temp <= 130) return 'text-apex-amber bg-apex-amber/15 border-apex-amber/30';
    return 'text-apex-crimson bg-apex-crimson/15 border-apex-crimson/30 shadow-glow-crimson';
  };

  const compoundBadge = {
    Soft: 'bg-apex-crimson text-black',
    Medium: 'bg-text-primary text-black',
    Hard: 'bg-apex-amber text-black',
  }[compound];

  return (
    <div className={`p-3 rounded-apex-md bg-surface-subtle/90 border border-surface-border flex flex-col gap-2 font-mono ${className}`}>
      {/* Top Header: Tyre Type & Pressure */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-text-secondary">{position}</span>
          <span className={`px-1.5 py-0.2 rounded-apex-xs text-[9px] font-extrabold ${compoundBadge}`}>
            {compound.toUpperCase()}
          </span>
        </div>
        <div className="text-[10px] text-text-muted">
          P: <strong className={pressureBar < 1.80 ? 'text-apex-crimson' : 'text-apex-green'}>{pressureBar.toFixed(2)} bar</strong>
        </div>
      </div>

      {/* Split Shoulder Comparison: Left vs Right */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Left Shoulder */}
        <div className={`p-2 rounded-apex-xs border text-center ${getTempColor(leftTemp)}`}>
          <div className="text-[8px] text-text-muted uppercase">L-SHOULDER</div>
          <div className="text-xs font-black">{leftTemp}°C</div>
          <div className="text-[9px] text-text-secondary">{leftWear}% Life</div>
        </div>

        {/* Right Shoulder */}
        <div className={`p-2 rounded-apex-xs border text-center ${getTempColor(rightTemp)}`}>
          <div className="text-[8px] text-text-muted uppercase">R-SHOULDER</div>
          <div className="text-xs font-black">{rightTemp}°C</div>
          <div className="text-[9px] text-text-secondary">{rightWear}% Life</div>
        </div>
      </div>

      {/* Asymmetric Warning Pill if thermal delta is severe */}
      {isThermalImbalance && (
        <div className="text-[9px] text-apex-amber flex items-center justify-between border-t border-surface-border/40 pt-1.5">
          <span>⚠️ ASYMMETRIC STRESS</span>
          <span>Δ {deltaTemp}°C</span>
        </div>
      )}
    </div>
  );
}
