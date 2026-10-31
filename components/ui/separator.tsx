'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    motogp?: boolean;
  }
>(
  (
    { className, orientation = 'horizontal', decorative = true, motogp = false, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0',
        orientation === 'horizontal'
          ? motogp
            ? 'h-[3px] w-full bg-[#E10600]'
            : 'h-[1px] w-full bg-neutral-800'
          : motogp
          ? 'h-full w-[3px] bg-[#E10600]'
          : 'h-full w-[1px] bg-neutral-800',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
