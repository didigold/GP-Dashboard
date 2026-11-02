'use client';

import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

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
    ? '#0066FF' // MotoGP electric blue
    : isKneeDown
    ? '#38BDF8'
    : '#737373';

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
            stroke="#1a1a1a"
            strokeWidth="8"
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
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset,stroke] duration-slow ease-precision"
          />

          {/* 60 degree elbow-down threshold marker */}
          <line
            x1="65"
            y1="8"
            x2="65"
            y2="18"
            stroke="#E10600"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Center Angle Display */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className="text-2xl font-mono font-bold text-white tracking-tighter flex items-start">
            <AnimatedNumber value={clampedAngle} decimals={1} />
            <span className="text-xs font-bold text-[#0066FF] ml-0.5">°</span>
          </div>
          <div className="text-[10px] font-mono text-neutral-400 capitalize">
            {direction} lean
          </div>
        </div>
      </div>

      {/* Threshold Status Pill */}
      <div className="mt-1 flex items-center gap-1.5 font-mono">
        <span
          className={`text-[9px] px-2 py-0.5 font-medium border ${
            isElbowDown
              ? 'bg-blue-950/40 text-blue-400 border-blue-800'
              : isKneeDown
              ? 'bg-neutral-900 text-neutral-200 border-neutral-700'
              : 'bg-black text-neutral-400 border-neutral-800'
          }`}
        >
          {isElbowDown ? '⚡ Elbow Down' : isKneeDown ? 'Knee Down' : 'Upright'}
        </span>
        {maxAngle && (
          <span className="text-[9px] text-neutral-400">
            Max: <strong className="text-white">{maxAngle.toFixed(1)}°</strong>
          </span>
        )}
      </div>
    </div>
  );
}
