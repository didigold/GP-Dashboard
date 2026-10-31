'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'purple'
    | 'green'
    | 'amber'
    | 'crimson'
    | 'cyan'
    | 'outline'
    | 'subtle';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  children,
  className,
  variant = 'subtle',
  size = 'sm',
  dot = false,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-mono font-bold select-none uppercase tracking-wider';

  const variants = {
    purple: 'bg-apex-purple/20 text-apex-purple border border-apex-purple/40 shadow-glow-purple',
    green: 'bg-apex-green/20 text-apex-green border border-apex-green/40',
    amber: 'bg-apex-amber/20 text-apex-amber border border-apex-amber/40',
    crimson: 'bg-apex-crimson/20 text-apex-crimson border border-apex-crimson/40 shadow-glow-crimson',
    cyan: 'bg-apex-cyan/20 text-apex-cyan border border-apex-cyan/40 shadow-glow-cyan',
    outline: 'border border-surface-border text-text-secondary bg-surface-subtle/50',
    subtle: 'bg-surface-borderSubtle text-text-muted border border-surface-border/50',
  };

  const sizes = {
    xs: 'px-1.5 py-0.2 text-[9px] rounded-apex-xs gap-1',
    sm: 'px-2 py-0.5 text-[10px] rounded-apex-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs rounded-apex-sm gap-2',
  };

  const dotColors = {
    purple: 'bg-apex-purple',
    green: 'bg-apex-green',
    amber: 'bg-apex-amber',
    crimson: 'bg-apex-crimson',
    cyan: 'bg-apex-cyan',
    outline: 'bg-text-secondary',
    subtle: 'bg-text-muted',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]} animate-pulse`} />}
      {children}
    </span>
  );
}
