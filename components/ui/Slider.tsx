'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  className?: string;
  variant?: 'cyan' | 'purple' | 'amber' | 'crimson';
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  unit = '',
  className,
  variant = 'cyan',
}: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const variantStyles = {
    cyan: 'accent-apex-cyan bg-apex-cyan',
    purple: 'accent-apex-purple bg-apex-purple',
    amber: 'accent-apex-amber bg-apex-amber',
    crimson: 'accent-apex-crimson bg-apex-crimson',
  };

  return (
    <div className={twMerge('w-full flex flex-col gap-1.5 select-none', className)}>
      {(label || unit) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="text-text-muted">{label}</span>}
          <span className="font-bold text-white tabular-nums">
            {value}
            {unit}
          </span>
        </div>
      )}

      <div className="relative flex items-center h-5">
        {/* Background Track */}
        <div className="absolute w-full h-1.5 rounded-full bg-surface-border overflow-hidden">
          {/* Filled Track */}
          <div
            className={twMerge('h-full transition-all duration-75', variantStyles[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real Range Input Overlay */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer z-10"
        />

        {/* Visual Custom Thumb */}
        <div
          className={twMerge(
            'absolute w-4 h-4 rounded-full bg-white border-2 border-surface-base shadow-md transition-all duration-75 pointer-events-none -ml-2',
            variant === 'cyan' && 'shadow-glow-cyan',
            variant === 'purple' && 'shadow-glow-purple',
            variant === 'crimson' && 'shadow-glow-crimson'
          )}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
