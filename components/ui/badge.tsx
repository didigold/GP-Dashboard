import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-[10px] font-semibold tracking-normal transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E10600] rounded-full select-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-white text-black',
        motogp: 'border-transparent bg-[#E10600] text-white',
        secondary: 'border-transparent bg-neutral-800 text-neutral-300',
        outline: 'border-neutral-700 text-neutral-300 bg-transparent',
        destructive: 'border-transparent bg-red-950 text-red-300 border border-red-800',
        purple: 'bg-purple-950/60 text-purple-300 border-purple-800',
        green: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
        amber: 'bg-amber-950/60 text-amber-300 border-amber-800',
      },
      size: {
        default: 'px-2 py-0.5 text-[10px]',
        sm: 'px-1.5 py-0.2 text-[9px]',
        lg: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  const dotColors = {
    default: 'bg-black',
    motogp: 'bg-white',
    secondary: 'bg-neutral-400',
    outline: 'bg-neutral-400',
    destructive: 'bg-red-500',
    purple: 'bg-purple-400',
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
  };

  const selectedDotColor = variant ? dotColors[variant] || 'bg-white' : 'bg-black';

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className={cn('w-1.5 h-1.5 mr-1.5 rounded-full inline-block', selectedDotColor)} />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
