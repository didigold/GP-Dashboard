'use client';

import React from 'react';

interface TyreAsymmetryPillProps {
  position?: 'FRONT' | 'REAR' | 'Front' | 'Rear';
  compound?: 'Soft' | 'Medium' | 'Hard';
  leftTemp?: number;
  rightTemp?: number;
  leftWear?: number;
  rightWear?: number;
  pressureBar?: number;
  className?: string;
  lifePercent?: number;
}

export function TyreAsymmetryPill({
  position = 'Front',
  compound = 'Hard',
  leftTemp = 115,
  rightTemp = 88,
  leftWear = 82,
  rightWear = 94,
  pressureBar = 1.86,
  className = '',
}: TyreAsymmetryPillProps) {
  const deltaTemp = Math.abs(leftTemp - rightTemp);
  const isThermalImbalance = deltaTemp >= 25;

  const getTempColor = (temp: number) => {
    if (temp < 80) return 'text-blue-400 bg-blue-950/20 border-blue-900/50';
    if (temp <= 120) return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/50';
    if (temp <= 130) return 'text-amber-400 bg-amber-950/20 border-amber-900/50';
    return 'text-[#E10600] bg-red-950/20 border-red-900/50';
  };

  const compoundBadge = {
    Soft: 'bg-[#E10600] text-white',
    Medium: 'bg-white text-black',
    Hard: 'bg-amber-400 text-black',
  }[compound] || 'bg-white text-black';

  return (
    <div className={`p-3 bg-[#0A0A0A] border border-neutral-800 flex flex-col gap-2 font-mono ${className}`}>
      {/* Top Header: Tyre Type & Pressure */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-neutral-300 capitalize">{position.toLowerCase()}</span>
          <span className={`px-1.5 py-0.2 text-[9px] font-bold ${compoundBadge}`}>
            {compound}
          </span>
        </div>
        <div className="text-[10px] text-neutral-400">
          P: <strong className={pressureBar < 1.80 ? 'text-[#E10600]' : 'text-emerald-400'}>{pressureBar.toFixed(2)} bar</strong>
        </div>
      </div>

      {/* Split Shoulder Comparison: Left vs Right */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Left Shoulder */}
        <div className={`p-2 border text-center ${getTempColor(leftTemp)}`}>
          <div className="text-[8px] text-neutral-400">Left Shoulder</div>
          <div className="text-xs font-bold">{leftTemp}°C</div>
          <div className="text-[9px] text-neutral-400">{leftWear}% Life</div>
        </div>

        {/* Right Shoulder */}
        <div className={`p-2 border text-center ${getTempColor(rightTemp)}`}>
          <div className="text-[8px] text-neutral-400">Right Shoulder</div>
          <div className="text-xs font-bold">{rightTemp}°C</div>
          <div className="text-[9px] text-neutral-400">{rightWear}% Life</div>
        </div>
      </div>

      {/* Asymmetric Warning Pill if thermal delta is severe */}
      {isThermalImbalance && (
        <div className="text-[9px] text-amber-400 flex items-center justify-between border-t border-neutral-800/80 pt-1.5">
          <span>⚠️ Asymmetric thermal stress</span>
          <span>Δ {deltaTemp}°C</span>
        </div>
      )}
    </div>
  );
}
