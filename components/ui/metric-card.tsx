'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  delta?: string;
  status?: 'cyan' | 'purple' | 'green' | 'amber' | 'crimson' | 'default';
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  sublabel,
  trend,
  delta,
  status = 'default',
  icon,
  className,
}: MetricCardProps) {
  const statusBorders = {
    cyan: 'border-l-2 border-l-apex-cyan',
    purple: 'border-l-2 border-l-apex-purple',
    green: 'border-l-2 border-l-apex-green',
    amber: 'border-l-2 border-l-apex-amber',
    crimson: 'border-l-2 border-l-apex-crimson',
    default: 'border-l-2 border-l-surface-border',
  };

  const statusGlows = {
    cyan: 'text-apex-cyan',
    purple: 'text-apex-purple',
    green: 'text-apex-green',
    amber: 'text-apex-amber',
    crimson: 'text-apex-crimson',
    default: 'text-text-primary',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'p-4 rounded-apex-md bg-surface-card border border-surface-border relative overflow-hidden transition-all hover:border-surface-borderActive/40',
          statusBorders[status],
          className
        )
      )}
    >
      <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-1.5">
        <span className="uppercase tracking-wider font-semibold">{label}</span>
        {icon && <div className="text-text-secondary">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className={twMerge('text-2xl font-mono font-black tabular-nums tracking-tight', statusGlows[status])}>
          {value}
        </span>
        {unit && <span className="text-xs font-mono font-medium text-text-muted">{unit}</span>}
      </div>

      {(sublabel || delta) && (
        <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-2 border-t border-surface-border/40">
          {sublabel && <span className="text-text-muted truncate">{sublabel}</span>}
          {delta && (
            <div
              className={twMerge(
                'inline-flex items-center gap-0.5 font-bold',
                trend === 'up' && 'text-apex-green',
                trend === 'down' && 'text-apex-crimson',
                trend === 'neutral' && 'text-text-secondary'
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{delta}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
