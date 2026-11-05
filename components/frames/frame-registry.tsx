'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { IconType } from 'react-icons';
import {
  GiTrophyCup,
  GiSpeedometer,
  GiStopwatch,
  GiCheckeredFlag,
  GiRoad,
  GiCarWheel,
} from 'react-icons/gi';
import { FrameContentProps } from './types';
import { LeaderboardFrame } from './LeaderboardFrame';
import { GapEvolutionFrame } from './GapEvolutionFrame';
import { LapProgressionFrame } from './LapProgressionFrame';
import { PitStopLogFrame } from './PitStopLogFrame';
import { BestLapFrame } from './BestLapFrame';
import { SessionTimelineFrame } from './SessionTimelineFrame';
import { LiveChampionshipFrame } from './LiveChampionshipFrame';

const TrackMapFrame = dynamic(
  () => import('./TrackMapFrame').then((m) => m.TrackMapFrame),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-xs text-neutral-500">
        Loading circuit…
      </div>
    ),
  }
);

export interface FrameMeta {
  title: string;
  icon: IconType;
}

export const FRAME_META: Record<string, FrameMeta> = {
  leaderboard: { title: 'Leaderboard', icon: GiTrophyCup },
  'gap-evolution': { title: 'Gap Evolution', icon: GiSpeedometer },
  'lap-progression': { title: 'Lap Progression', icon: GiStopwatch },
  'session-timeline': { title: 'Session Timeline', icon: GiCheckeredFlag },
  'live-championship': { title: 'Live Championship', icon: GiTrophyCup },
  'track-map': { title: 'Track Map', icon: GiRoad },
  'best-lap': { title: 'Best Lap Benchmarks', icon: GiCheckeredFlag },
  'pit-stop-log': { title: 'Pit Stops', icon: GiCarWheel },
};

export const FRAME_COMPONENTS: Record<string, React.ComponentType<FrameContentProps>> = {
  leaderboard: LeaderboardFrame,
  'gap-evolution': GapEvolutionFrame,
  'lap-progression': LapProgressionFrame,
  'session-timeline': SessionTimelineFrame,
  'live-championship': LiveChampionshipFrame,
  'track-map': TrackMapFrame as unknown as React.ComponentType<FrameContentProps>,
  'best-lap': BestLapFrame,
  'pit-stop-log': PitStopLogFrame,
};

// Fixed slot positions → default content type
export const DEFAULT_LAYOUT: Record<number, string> = {
  0: 'leaderboard',
  1: 'gap-evolution',
  2: 'lap-progression',
  3: 'session-timeline',
  4: 'live-championship',
  5: 'track-map',
  6: 'best-lap',
  7: 'pit-stop-log',
};

export const LAYOUT_STORAGE_KEY = 'gp-layout-v1';
