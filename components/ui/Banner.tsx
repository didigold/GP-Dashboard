'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertTriangle, Flag, CloudRain, CheckCircle, Info } from 'lucide-react';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'green' | 'yellow' | 'red' | 'rain' | 'info';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Banner({
  type = 'green',
  title,
  description,
  action,
  className,
  ...props
}: BannerProps) {
  const configs = {
    green: {
      border: 'border-apex-green/40',
      bg: 'bg-apex-green/10',
      text: 'text-apex-green',
      icon: CheckCircle,
    },
    yellow: {
      border: 'border-apex-amber/40',
      bg: 'bg-apex-amber/10',
      text: 'text-apex-amber',
      icon: AlertTriangle,
    },
    red: {
      border: 'border-apex-crimson/40',
      bg: 'bg-apex-crimson/10',
      text: 'text-apex-crimson',
      icon: Flag,
    },
    rain: {
      border: 'border-apex-blue/40',
      bg: 'bg-apex-blue/10',
      text: 'text-apex-blue',
      icon: CloudRain,
    },
    info: {
      border: 'border-apex-cyan/40',
      bg: 'bg-apex-cyan/10',
      text: 'text-apex-cyan',
      icon: Info,
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={twMerge(
        clsx(
          'p-3.5 rounded-apex-md border flex items-center justify-between gap-3 backdrop-blur-md transition-all',
          config.border,
          config.bg,
          className
        )
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-apex-xs bg-surface-base/80 ${config.text} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-text-primary tracking-wide flex items-center gap-2">
            <span>{title}</span>
          </div>
          {description && <div className="text-[11px] text-text-muted mt-0.5">{description}</div>}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
