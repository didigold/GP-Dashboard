import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-xs font-semibold tracking-tight transition-[color,background-color,border-color,transform] duration-fast ease-precision focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E10600] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.97] motion-reduce:active:scale-100 rounded-xl',
  {
    variants: {
      variant: {
        default: 'bg-white text-black hover:bg-neutral-200 border border-white shadow-sm',
        motogp: 'bg-[#E10600] text-white hover:bg-[#FF1A1A] border border-[#E10600] shadow-[0_2px_12px_rgba(225,6,0,0.35)]',
        outline: 'border border-neutral-700 text-white bg-transparent hover:border-white hover:bg-neutral-900/60',
        secondary: 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white border border-neutral-800',
        ghost: 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent',
        link: 'text-neutral-300 underline-offset-4 hover:underline lowercase font-normal tracking-normal text-sm',
        destructive: 'bg-red-950 text-red-400 border border-red-800 hover:bg-red-900',
      },
      size: {
        default: 'h-10 px-5 py-2 rounded-xl',
        sm: 'h-8 px-3.5 text-[11px] rounded-lg',
        lg: 'h-12 px-8 text-sm rounded-xl',
        icon: 'h-10 w-10 p-0 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
