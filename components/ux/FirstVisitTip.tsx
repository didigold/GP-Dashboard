'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

/** One-time onboarding tip; dismissal is remembered in localStorage. */
export function FirstVisitTip() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem('gp.onboarded')) return;
    } catch {
      return;
    }

    const timer = window.setTimeout(() => {
      toast('Welcome to the pitwall', {
        description:
          'Press Ctrl / ⌘ + K to jump between telemetry pages, or ? for the shortcut list.',
        duration: 8000,
      });
      try {
        window.localStorage.setItem('gp.onboarded', '1');
      } catch {
        // Ignore storage failures.
      }
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
