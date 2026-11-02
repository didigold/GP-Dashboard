'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Season, STANDINGS_SEASONS } from '@/lib/data/standings';

interface SeasonComboboxProps {
  value: Season;
  onChange: (season: Season) => void;
}

export function SeasonCombobox({ value, onChange }: SeasonComboboxProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select championship season"
        className="flex h-9 w-full min-w-[230px] items-center justify-between gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E10600] sm:w-auto"
      >
        <span className="truncate">{value.label}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-neutral-400 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Championship seasons"
          className="absolute right-0 z-50 mt-2 w-full min-w-[260px] rounded-xl border border-white/[0.1] bg-[#0D0D0E]/95 p-1 shadow-2xl backdrop-blur-2xl"
        >
          {STANDINGS_SEASONS.map((season) => {
            const isSelected = season.year === value.year;
            return (
              <li key={season.year} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(season);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-white/[0.06] text-white'
                      : 'text-neutral-300 hover:bg-white/[0.04] hover:text-white'
                  )}
                >
                  <span className="truncate">{season.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-[#E10600]" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
