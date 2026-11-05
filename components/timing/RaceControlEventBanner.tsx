'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  GiHeavyRain,
  GiCheckeredFlag,
  GiStopwatch,
  GiFullMotorcycleHelmet,
} from 'react-icons/gi';

export interface RaceControlAlert {
  id: string;
  type: 'wet' | 'yellow' | 'red' | 'fastest' | 'clear';
  title: string;
  subtitle: string;
  timestampStr: string;
}

interface RaceControlEventBannerProps {
  alert: RaceControlAlert | null;
  onDismiss: () => void;
}

export function RaceControlEventBanner({
  alert,
  onDismiss,
}: RaceControlEventBannerProps) {
  if (!alert) return null;

  const styleConfig = {
    wet: {
      border: 'border-sky-400/50',
      badgeBg: 'bg-sky-500 text-black',
      glow: 'shadow-[0_12px_40px_rgba(56,189,248,0.35)]',
      vignette: 'from-sky-500/18 via-transparent to-transparent',
      icon: <GiHeavyRain className="w-4 h-4 text-sky-400 shrink-0" />,
      tag: 'WET RACE / WHITE CROSS FLAG',
    },
    yellow: {
      border: 'border-amber-400/50',
      badgeBg: 'bg-amber-400 text-black',
      glow: 'shadow-[0_12px_40px_rgba(251,191,36,0.35)]',
      vignette: 'from-amber-500/18 via-transparent to-transparent',
      icon: <GiCheckeredFlag className="w-4 h-4 text-amber-400 shrink-0" />,
      tag: 'RACE DIRECTION · YELLOW FLAG',
    },
    red: {
      border: 'border-[#E10600]/60',
      badgeBg: 'bg-[#E10600] text-white',
      glow: 'shadow-[0_12px_40px_rgba(225,6,0,0.45)]',
      vignette: 'from-[#E10600]/22 via-transparent to-transparent',
      icon: <GiCheckeredFlag className="w-4 h-4 text-[#E10600] shrink-0" />,
      tag: 'SESSION RED FLAGGED',
    },
    fastest: {
      border: 'border-purple-400/50',
      badgeBg: 'bg-purple-500 text-white',
      glow: 'shadow-[0_12px_40px_rgba(168,85,247,0.35)]',
      vignette: 'from-purple-500/15 via-transparent to-transparent',
      icon: <GiStopwatch className="w-4 h-4 text-purple-400 shrink-0" />,
      tag: 'NEW FASTEST LAP',
    },
    clear: {
      border: 'border-emerald-400/50',
      badgeBg: 'bg-emerald-400 text-black',
      glow: 'shadow-[0_12px_40px_rgba(16,185,129,0.3)]',
      vignette: 'from-emerald-500/14 via-transparent to-transparent',
      icon: <GiFullMotorcycleHelmet className="w-4 h-4 text-emerald-400 shrink-0" />,
      tag: 'TRACK CLEAR · GREEN FLAG',
    },
  }[alert.type];

  return (
    <AnimatePresence>
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, y: -14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -14, scale: 0.96 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-x-0 top-3 z-30 flex flex-col items-center px-4 font-sans"
      >
        {/* Subtle Top Viewport Edge Atmospheric Glow */}
        <div
          className={`pointer-events-none absolute -top-3 inset-x-0 h-20 bg-gradient-to-b ${styleConfig.vignette}`}
        />

        {/* Liquid Glass Broadcast Pill Banner */}
        <div
          className={`pointer-events-auto relative h-10 px-3.5 rounded-full liquid-glass-dropdown ${styleConfig.border} ${styleConfig.glow} flex items-center gap-3 max-w-full`}
        >
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${styleConfig.badgeBg}`}
          >
            {styleConfig.tag}
          </span>

          <div className="flex items-center gap-2 min-w-0 text-xs">
            {styleConfig.icon}
            <span className="font-bold text-white truncate">{alert.title}</span>
            <span className="text-neutral-400 hidden sm:inline">·</span>
            <span className="text-neutral-300 font-medium truncate hidden sm:inline">
              {alert.subtitle}
            </span>
          </div>

          <span className="text-[10px] text-neutral-400 font-semibold tabular-nums hidden md:inline">
            {alert.timestampStr}
          </span>

          <button
            type="button"
            onClick={onDismiss}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
