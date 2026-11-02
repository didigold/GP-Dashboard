import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg border border-white/[0.08] bg-[#111111] p-8 text-center rounded-2xl shadow-elev-2">
        <SearchX className="mx-auto h-7 w-7 text-[#E10600]" aria-hidden="true" />
        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[#E10600]">
          Error 404
        </p>
        <h1 className="mt-1 font-sans text-lg font-bold text-white">Sector not found</h1>
        <p className="mx-auto mt-1 max-w-sm text-xs font-light leading-relaxed text-neutral-400">
          This telemetry page does not exist or has been moved to another part of the circuit.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/">
            <Button variant="motogp" size="sm">
              <Home className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Back to pitwall
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
