'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'pitwall' | 'subtle' | 'outline';
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  variant = 'pitwall',
  hoverable = false,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-apex-md overflow-hidden transition-all';

  const variants = {
    pitwall: 'pitwall-card',
    subtle: 'bg-surface-subtle/80 border border-surface-border',
    outline: 'bg-transparent border border-surface-border',
  };

  const hoverStyles = hoverable
    ? 'hover:border-apex-cyan/40 hover:shadow-glow-cyan/20 cursor-pointer'
    : '';

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], hoverStyles, className))} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'px-5 py-4 border-b border-surface-border/60 flex items-center justify-between gap-3 bg-surface-subtle/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge('text-sm font-bold text-text-primary tracking-wide flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge('text-xs text-text-muted mt-0.5', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge('px-5 py-3 border-t border-surface-border/50 bg-surface-base/50 flex items-center justify-between text-xs', className)}
      {...props}
    >
      {children}
    </div>
  );
}
