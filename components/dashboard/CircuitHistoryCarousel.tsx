'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryRecord {
  id: string;
  category: string;
  title: string;
  result: string;
  subResult?: string;
  context: string;
}

interface CircuitHistoryCarouselProps {
  className?: string;
}

export function CircuitHistoryCarousel({ className }: CircuitHistoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const records: HistoryRecord[] = [
    {
      id: 'lap-record',
      category: 'All-Time Lap Record',
      title: 'Qualifying Benchmark Shootout',
      result: "1'57.491",
      subResult: 'Francesco Bagnaia · Ducati Lenovo Team',
      context: 'All-time premier class benchmark set on the Desmosedici GP24 with Michelin Soft rear compound.',
    },
    {
      id: 'top-speed',
      category: 'Top Speed Record',
      title: 'Back Straight Terminal Velocity',
      result: '362.8 km/h',
      subResult: 'Pedro Acosta · Red Bull KTM Factory Racing',
      context: 'Clocked on the 920m back straight slipstream draft braking into the off-camber Turn 15 hairpin.',
    },
    {
      id: 'debut',
      category: 'Year of Debut',
      title: 'Inaugural Grand Prix of Malaysia',
      result: '1999',
      subResult: 'Sepang International Circuit Premiere',
      context: 'Premier 500cc class debut won by Kenny Roberts Jr. on Suzuki RGV500, inaugurating modern MotoGP in Malaysia.',
    },
    {
      id: 'most-wins',
      category: 'Driver with Most Wins',
      title: 'All-Time Grand Prix Victories',
      result: '6 Wins',
      subResult: 'Valentino Rossi (Honda & Yamaha)',
      context: 'All-time premier class record. Active contender record: Marc Márquez with 3 premier class victories.',
    },
    {
      id: 'last-winner',
      category: 'Last Grand Prix Winner',
      title: 'Premier Class Main Race',
      result: 'Enea Bastianini',
      subResult: 'Ducati Lenovo Team · 39:59.137',
      context: 'Commanding victory under intense tropical heat. Tissot Sprint winner: Pedro Acosta (KTM).',
    },
  ];

  // Auto-advance every 10 seconds, pausing on hover
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % records.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isPaused, records.length]);

  const current = records[currentIndex];

  const defaultClasses =
    'w-full bg-[#0D0D0E]/90 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white';

  return (
    <div
      className={className || defaultClasses}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E10600]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Main Slide Content - Tightly grouped editorial hierarchy without awkward gaps */}
      <div className="relative z-10 flex-1 flex flex-col justify-start py-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-start space-y-3.5"
          >
            {/* Top Stat Cluster: Category badge closely hugging the main number */}
            <div className="space-y-1">
              <span className="text-xs font-sans font-bold text-[#E10600] uppercase tracking-wider block">
                {current.category}
              </span>
              <div className="text-5xl sm:text-6xl font-sans font-black text-white tracking-tight leading-none whitespace-nowrap pt-0.5">
                {current.result}
              </div>
              {current.subResult && (
                <div className="text-xs sm:text-sm font-sans font-semibold text-neutral-300 truncate pt-0.5">
                  {current.subResult}
                </div>
              )}
            </div>

            {/* Benchmark Title & Narrative closely following the number */}
            <div className="space-y-1 pt-1.5">
              <h3 className="text-sm sm:text-base font-sans font-bold text-white leading-snug">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                {current.context}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicator Dots in Bottom Left */}
      <div className="relative z-10 pt-4 mt-auto flex items-center gap-1.5">
        {records.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Record ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-7 bg-white'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
