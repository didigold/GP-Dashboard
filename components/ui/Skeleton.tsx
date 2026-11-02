import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/** Shimmering loading placeholder tuned to the dashboard surface colors. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('skeleton', className)} />;
}
