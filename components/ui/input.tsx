'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  shortcut?: string;
  onClear?: () => void;
  isSearch?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, shortcut, onClear, isSearch = false, value, onChange, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {isSearch && !icon && (
          <div className="absolute left-3 text-text-muted pointer-events-none flex items-center">
            <Search className="w-4 h-4" />
          </div>
        )}
        {icon && !isSearch && (
          <div className="absolute left-3 text-text-muted pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          className={twMerge(
            clsx(
              'w-full h-9 rounded-apex-sm bg-surface-subtle border border-surface-border px-3 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-apex-cyan focus:ring-1 focus:ring-apex-cyan/50 transition-all disabled:opacity-50',
              (isSearch || icon) && 'pl-9',
              (shortcut || onClear) && 'pr-12',
              className
            )
          )}
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1">
          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-text-muted hover:text-white rounded hover:bg-surface-card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {shortcut && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface-base border border-surface-border rounded-apex-xs shadow-inner">
              {shortcut}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
