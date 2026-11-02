'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

interface LazyCircuitCanvasProps {
  circuitName?: string;
  selectedRiderNumber?: string;
  onSelectRider?: (num: string) => void;
}

const CircuitCanvas = dynamic(
  () => import('./CircuitCanvas').then((mod) => mod.CircuitCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] w-full items-center justify-center border border-neutral-800 bg-[#0A0A0A]">
        <div className="w-full max-w-md space-y-3 px-6">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-40 w-full" />
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            Loading 3D circuit…
          </p>
        </div>
      </div>
    ),
  }
);

/** Dynamically loads the WebGL canvas so Three.js stays out of the initial bundle. */
export function LazyCircuitCanvas(props: LazyCircuitCanvasProps) {
  return <CircuitCanvas {...props} />;
}
