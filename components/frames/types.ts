import { LiveTimingRider } from '@/lib/types/motogp';
import { TrackWeather } from '@/lib/utils/weather';
import { TrackCoords } from '@/lib/data/circuit-coords';

export interface FrameContext {
  riders: LiveTimingRider[];
  sessionType: string;
  sessionName: string;
  currentLap: number;
  totalLaps: number;
  remainingSeconds: number;
  totalDurationSeconds: number;
  weather: TrackWeather | null;
  circuitName: string;
  circuitCoords: TrackCoords;
  isLive: boolean;
  standings: any[];
  eventId?: string;
}

export interface FrameContentProps {
  ctx: FrameContext;
}
