'use client';

import { useEffect, useState } from 'react';

/**
 * State that survives reloads via localStorage.
 * Renders the provided default during SSR, then hydrates from storage.
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // Ignore unavailable or malformed storage.
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write failures (private mode, quota).
    }
  }, [key, value]);

  return [value, setValue] as const;
}
