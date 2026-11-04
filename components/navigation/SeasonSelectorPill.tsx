'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Check, Calendar } from 'lucide-react';
import { useSeason } from '@/lib/context/SeasonContext';
import { toast } from 'sonner';

export function SeasonSelectorPill() {
  const { season, setSeason, availableSeasons } = useSeason();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSeason = (newSeason: (typeof availableSeasons)[0]) => {
    if (newSeason.year === season.year) {
      setIsOpen(false);
      return;
    }
    setSeason(newSeason);
    setIsOpen(false);
    toast.success(`Championship Season set to ${newSeason.year}`, {
      description: 'Standings, calendar, stats, and rider records synchronized.',
    });
  };

  return (
    <div ref={containerRef} className="fixed bottom-5 left-5 z-[80] select-none font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute bottom-full mb-3 left-0 w-36 rounded-2xl liquid-glass-dropdown p-1.5 shadow-2xl z-[120] font-sans"
          >
            {/* Clean minimal year options only - no title, separator or footer */}
            <div className="relative z-[2] space-y-0.5">
              {availableSeasons.map((item) => {
                const isSelected = item.year === season.year;
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => handleSelectSeason(item)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-white/[0.14] text-white font-bold shadow-sm'
                        : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="font-sans font-bold text-sm tracking-tight">
                      {item.year}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#E10600] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Liquid Glass Pill Button: Calendar Icon + Sora Year */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.04 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Select Championship Season, currently ${season.year}`}
        aria-expanded={isOpen}
        className={`group relative flex items-center gap-2.5 h-9 px-4 rounded-full liquid-glass-pill transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'ring-2 ring-white/30 text-white'
            : 'text-neutral-200 hover:text-white'
        }`}
      >
        <Calendar className="w-4 h-4 text-white shrink-0 relative z-[2] drop-shadow-sm" />
        <span className="font-sans font-bold text-sm text-white tracking-tight relative z-[2]">
          {season.year}
        </span>
        <ChevronUp
          className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform duration-200 shrink-0 relative z-[2] ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </motion.button>
    </div>
  );
}
