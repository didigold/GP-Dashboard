'use client';

import React from 'react';

interface LeanMeterProps {
  angle: number;           // e.g. 64.5
  direction?: 'left' | 'right';
  maxAngle?: number;      // e.g. 68.0
  riderName?: string;
  className?: string;
}

export function LeanMeter({
  angle = 0,
  direction = 'left',
  maxAngle = 68.0,
  riderName,
  className = '',
}: LeanMeterProps) {
  // Normalize angle between 0 and 70
  const clampedAngle = Math.min(Math.max(angle, 0), 72);
  const percentage = clampedAngle / 70;

  // Determine riding zone
  const isElbowDown = clampedAngle >= 60;
  const isKneeDown = clampedAngle >= 48 && clampedAngle < 60;

  // Arc calculations (180 degree semi-circle gauge)
  const radius = 54;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage * circumference);

  const activeColor = isElbowDown
    ? '#00F5D4' // Neon cyan elbow down
    : isKneeDown
    ? '#38BDF8' // Electric blue knee down
    : '#94A3B8'; // Normal transition

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative w-36 h-20 flex items-center justify-center overflow-hidden">
        <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 130 130">
          {/* Background track arc */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#1a2336"
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset="0"
          />

          {/* Active lean angle arc */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />

          {/* 60 degree elbow-down threshold marker */}
          <line
            x1="65"
            y1="8"
            x2="65"
            y2="18"
            stroke="#EC4899"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Center Angle Display */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className="text-2xl font-mono font-black text-text-primary tracking-tighter flex items-start">
            <span>{clampedAngle.toFixed(1)}</span>
            <span className="text-xs font-bold text-apex-cyan ml-0.5">°</span>
          </div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted">
            {direction.toUpperCase()} LEAN
          </div>
        </div>
      </div>

      {/* Threshold Status Pill */}
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className={`text-[9px] font-mono px-2 py-0.5 rounded-apex-xs font-bold ${
            isElbowDown
              ? 'bg-apex-cyan/20 text-apex-cyan border border-apex-cyan/40 shadow-glow-cyan'
              : isKneeDown
              ? 'bg-apex-blue/20 text-apex-blue border border-apex-blue/40'
              : 'bg-surface-subtle text-text-muted border border-surface-border'
          }`}
        >
          {isElbowDown ? '⚡ ELBOW DOWN' : isKneeDown ? 'KNEE DOWN' : 'UPRIGHT'}
        </span>
        {maxAngle && (
          <span className="text-[9px] font-mono text-text-muted">
            MAX: <strong className="text-text-primary">{maxAngle.toFixed(1)}°</strong>
          </span>
        )}
      </div>
    </div>
  );
}
