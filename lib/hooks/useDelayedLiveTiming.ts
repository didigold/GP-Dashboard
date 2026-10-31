'use client';

import { useState, useEffect, useRef } from 'react';
import { LiveTimingState, LiveTimingRider } from '../types/motogp';
import { INITIAL_SIMULATED_LIVE_STATE } from '../data/mock-race-data';

interface BufferedFrame {
  timestamp: number;
  data: LiveTimingState;
}

export function useDelayedLiveTiming(
  liveFeed: LiveTimingState | null,
  delaySeconds: number,
  isSimulationActive: boolean
) {
  const bufferRef = useRef<BufferedFrame[]>([]);
  const [displayedState, setDisplayedState] = useState<LiveTimingState>(INITIAL_SIMULATED_LIVE_STATE);
  const simulationTickRef = useRef<number>(0);

  // If live feed arrives, append to buffer and immediately display if delay is 0
  useEffect(() => {
    if (liveFeed && !isSimulationActive) {
      const now = Date.now();
      bufferRef.current.push({ timestamp: now, data: liveFeed });

      // Clean up frames older than 4 minutes
      const cutoff = now - 240000;
      bufferRef.current = bufferRef.current.filter((f) => f.timestamp >= cutoff);

      if (delaySeconds === 0) {
        setDisplayedState(liveFeed);
      }
    }
  }, [liveFeed, isSimulationActive, delaySeconds]);

  // Simulation generator (generates dynamic lap updates, sector changes, gap shifts)
  useEffect(() => {
    if (!isSimulationActive) return;

    const simInterval = setInterval(() => {
      simulationTickRef.current += 1;
      const tick = simulationTickRef.current;

      setDisplayedState((prev) => {
        const ridersCopy = { ...prev.rider };
        const riderKeys = Object.keys(ridersCopy);

        // Small jitter in sector times and speeds
        riderKeys.forEach((key, idx) => {
          const r = ridersCopy[key];
          const speedJitter = (Math.sin(tick + idx) * 2.5).toFixed(1);
          const t1Val = (28.7 + Math.abs(Math.sin(tick * 0.2 + idx)) * 0.5).toFixed(3);
          const t2Val = (29.2 + Math.abs(Math.cos(tick * 0.15 + idx)) * 0.4).toFixed(3);

          ridersCopy[key] = {
            ...r,
            speed: parseFloat((358 + idx * -1.2 + parseFloat(speedJitter)).toFixed(1)),
            t1: t1Val,
            t2: t2Val,
          };
        });

        // Dynamic overtake simulation every 15 ticks between P1 and P2
        if (tick % 15 === 0 && ridersCopy['1'] && ridersCopy['2']) {
          const p1 = ridersCopy['1'];
          const p2 = ridersCopy['2'];
          const tempPos = p1.pos;
          p1.pos = p2.pos;
          p2.pos = tempPos;
          p1.gap_first = p1.pos === 1 ? 'LEADER' : '+0.210';
          p2.gap_first = p2.pos === 1 ? 'LEADER' : '+0.185';
        }

        const currentLap = 18 + Math.floor(tick / 20);

        return {
          ...prev,
          head: {
            ...prev.head,
            remaining: `Lap ${Math.min(currentLap, 23)}/23`,
          },
          rider: ridersCopy,
        };
      });
    }, 1500);

    return () => clearInterval(simInterval);
  }, [isSimulationActive]);

  // Handle delay extraction
  useEffect(() => {
    if (isSimulationActive) return;

    const interval = setInterval(() => {
      if (delaySeconds === 0) {
        if (liveFeed) setDisplayedState(liveFeed);
        return;
      }

      const targetTimestamp = Date.now() - delaySeconds * 1000;
      // Find closest frame
      const frames = bufferRef.current;
      if (frames.length === 0) return;

      let closest = frames[0];
      let minDiff = Math.abs(frames[0].timestamp - targetTimestamp);

      for (let i = 1; i < frames.length; i++) {
        const diff = Math.abs(frames[i].timestamp - targetTimestamp);
        if (diff < minDiff) {
          minDiff = diff;
          closest = frames[i];
        }
      }

      setDisplayedState(closest.data);
    }, 500);

    return () => clearInterval(interval);
  }, [delaySeconds, liveFeed, isSimulationActive]);

  return displayedState;
}
