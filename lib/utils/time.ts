/**
 * Converts "1'47.617" or "01:47.617" or "39:34.869" into float seconds
 */
export function parseLapTimeToSeconds(timeStr: string | null | undefined): number {
  if (!timeStr || timeStr === '--' || timeStr === '0.000') return 0;

  // Handle format: 1'47.617
  if (timeStr.includes("'")) {
    const [minStr, rest] = timeStr.split("'");
    const [secStr, msStr] = rest.split('.');
    return (parseInt(minStr, 10) * 60) + parseInt(secStr, 10) + (parseInt(msStr || '0', 10) / 1000);
  }

  // Handle format: 39:34.869 or 01:52.657
  if (timeStr.includes(':')) {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const sec = parseFloat(parts[1]);
      return (min * 60) + sec;
    }
  }

  // Handle pure float string: "29.522"
  const val = parseFloat(timeStr);
  return isNaN(val) ? 0 : val;
}

/**
 * Converts float seconds into "1'47.617" format
 */
export function formatLapTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '--';

  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const secsFormatted = remainingSecs.toFixed(3).padStart(6, '0');

  if (mins > 0) {
    return `${mins}'${secsFormatted}`;
  }
  return secsFormatted;
}

/**
 * Calculates gap string e.g. "+0.342" or "-0.115"
 */
export function formatDelta(deltaSec: number): string {
  if (Math.abs(deltaSec) < 0.001) return '0.000';
  const prefix = deltaSec > 0 ? '+' : '-';
  return `${prefix}${Math.abs(deltaSec).toFixed(3)}`;
}

/**
 * Return CSS color classes for sector indicators
 */
export function getSectorColorClass(type: 'fastest' | 'personal' | 'normal' | 'pit' | 'inactive') {
  switch (type) {
    case 'fastest':
      return 'bg-racing-purple text-white shadow-glow-purple'; // Purple: Session best
    case 'personal':
      return 'bg-racing-green text-black font-semibold'; // Green: Personal best
    case 'normal':
      return 'bg-racing-yellow text-black'; // Yellow: Slower sector
    case 'pit':
      return 'bg-racing-red text-white'; // Pit
    case 'inactive':
    default:
      return 'bg-racing-border text-racing-subtle';
  }
}
