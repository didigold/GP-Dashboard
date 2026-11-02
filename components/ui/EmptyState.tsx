import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Consistent empty / no-data surface with an optional recovery action. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'carbon-texture flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-800 bg-[#0A0A0A] px-6 py-12 text-center',
        className
      )}
    >
      {icon && (
        <div className="text-neutral-500" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-sans text-sm font-semibold text-white">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-xs font-light leading-relaxed text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
