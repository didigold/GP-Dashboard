import { cn } from '@/lib/utils';

interface DriverNumberProps {
  number: number | string;
  /** Team / rider brand colour used as the solid background. */
  color?: string;
  /** Optional explicit text colour; auto-contrast is used otherwise. */
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

const SIZE_CLASSES: Record<NonNullable<DriverNumberProps['size']>, string> = {
  sm: 'h-5 min-w-5 px-1 text-[10px]',
  md: 'h-6 min-w-6 px-1.5 text-[11px]',
  lg: 'h-7 min-w-7 px-2 text-xs',
};

/**
 * Pick a readable foreground for a solid badge background.
 * Uses perceived luminance so light liveries (yellow, white) get dark text.
 */
function getReadableTextColor(hex?: string): string {
  if (!hex) return '#FFFFFF';
  const value = hex.replace('#', '').trim();
  if (value.length !== 6) return '#FFFFFF';

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if ([r, g, b].some((channel) => Number.isNaN(channel))) return '#FFFFFF';

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#0A0A0A' : '#FFFFFF';
}

/**
 * Timing-board driver number: the number sits on a solid team-coloured square,
 * mirroring official MotoGP classification tables.
 */
export function DriverNumber({
  number,
  color,
  textColor,
  size = 'md',
  className,
  title,
}: DriverNumberProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md font-mono font-bold tabular-nums leading-none shadow-sm select-none',
        SIZE_CLASSES[size],
        className
      )}
      style={{
        backgroundColor: color || '#E10600',
        color: textColor || getReadableTextColor(color),
      }}
      title={title}
    >
      {number}
    </span>
  );
}
