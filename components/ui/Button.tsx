'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tactical' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-bold transition-all focus:outline-none focus:ring-2 focus:ring-apex-cyan/50 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-apex-cyan text-surface-base hover:bg-apex-cyan/90 shadow-glow-cyan border border-apex-cyan',
    secondary:
      'bg-surface-subtle text-text-primary hover:bg-surface-cardHover hover:text-white border border-surface-border hover:border-surface-borderActive/40',
    tactical:
      'bg-surface-card text-text-secondary hover:text-apex-cyan border border-surface-border text-xs tracking-wider uppercase',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-surface-card/60 border border-transparent',
    destructive:
      'bg-apex-crimson/15 text-apex-crimson hover:bg-apex-crimson/25 border border-apex-crimson/40 shadow-glow-crimson',
  };

  const sizes = {
    xs: 'h-6 px-2 text-[10px] rounded-apex-xs gap-1',
    sm: 'h-8 px-3 text-xs rounded-apex-sm gap-1.5',
    md: 'h-10 px-4 text-xs rounded-apex-sm gap-2',
    lg: 'h-12 px-6 text-sm rounded-apex-md gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
