'use client';

import { useEffect, useState } from 'react';

interface RelativeTimeProps {
  /** Epoch milliseconds of the last successful sync, or null if none yet. */
  since: number | null;
  className?: string;
}

/** Ticks once a second to show how stale the live feed is. */
export function RelativeTime({ since, className }: RelativeTimeProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (since === null) {
    return <span className={className}>Awaiting first sync</span>;
  }

  const seconds = Math.max(0, Math.floor((now - since) / 1000));
  const label = seconds < 2 ? 'Synced just now' : `Synced ${seconds}s ago`;

  return <span className={className}>{label}</span>;
}
