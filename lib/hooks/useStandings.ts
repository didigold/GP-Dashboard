'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  INITIAL_STANDINGS,
  MOTOGP_CAT_ID,
  Season,
  StandingItem,
} from '@/lib/data/standings';

interface UseStandingsResult {
  standings: StandingItem[];
  isLoading: boolean;
  lastUpdated: string;
  refresh: () => Promise<void>;
}

/**
 * Live championship classification with a 30s refresh loop. Falls back to the
 * bundled mock standings until the Pulselive feed responds.
 */
export function useStandings(season: Season): UseStandingsResult {
  const [standings, setStandings] = useState<StandingItem[]>(INITIAL_STANDINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Live Synced');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/motogp/results/standings?seasonUuid=${season.id}&categoryUuid=${MOTOGP_CAT_ID}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.classification) {
          setStandings(data.classification);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      }
    } catch (err) {
      console.error('Failed to load live standings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [season.id]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { standings, isLoading, lastUpdated, refresh };
}
