'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Season, STANDINGS_SEASONS } from '@/lib/data/standings';

interface SeasonContextType {
  season: Season;
  setSeason: (season: Season) => void;
  availableSeasons: Season[];
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

const STORAGE_KEY = 'gp.selected_season_year';

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeasonState] = useState<Season>(STANDINGS_SEASONS[0]);

  // Load persisted season from localStorage on mount
  useEffect(() => {
    try {
      const storedYear = window.localStorage.getItem(STORAGE_KEY);
      if (storedYear) {
        const found = STANDINGS_SEASONS.find((s) => s.year === parseInt(storedYear, 10));
        if (found) {
          setSeasonState(found);
        }
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const setSeason = useCallback((newSeason: Season) => {
    setSeasonState(newSeason);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(newSeason.year));
      window.dispatchEvent(new CustomEvent('gp:season_change', { detail: newSeason }));
    } catch {
      // Storage unavailable
    }
  }, []);

  return (
    <SeasonContext.Provider
      value={{
        season,
        setSeason,
        availableSeasons: STANDINGS_SEASONS,
      }}
    >
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason(): SeasonContextType {
  const context = useContext(SeasonContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      season: STANDINGS_SEASONS[0],
      setSeason: () => {},
      availableSeasons: STANDINGS_SEASONS,
    };
  }
  return context;
}
