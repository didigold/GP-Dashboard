'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg border border-white/[0.08] bg-[#111111] p-8 text-center rounded-2xl shadow-elev-2">
        <AlertTriangle className="mx-auto h-7 w-7 text-[#E10600]" aria-hidden="true" />
        <h1 className="mt-4 font-sans text-lg font-bold text-white">
          Telemetry feed interrupted
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-xs font-light leading-relaxed text-neutral-400">
          Something went wrong while rendering this sector. Retry the feed or return to the pitwall.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="motogp" size="sm" onClick={() => reset()}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Retry
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Pitwall
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
