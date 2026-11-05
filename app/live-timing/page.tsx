'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { LayoutGroup } from 'framer-motion';
import { LiveTimingRider } from '@/lib/types/motogp';
import { SessionHeader, AvailableSession } from '@/components/frames/SessionHeader';
import { FrameSlot } from '@/components/frames/FrameSlot';
import { FrameContext } from '@/components/frames/types';
import {
  DEFAULT_LAYOUT,
  LAYOUT_STORAGE_KEY,
} from '@/components/frames/frame-registry';
import { getCircuitCoords, TrackCoords } from '@/lib/data/circuit-coords';
import { fetchTrackWeather, TrackWeather } from '@/lib/utils/weather';
import { pushSnapshot, SnapshotRider } from '@/lib/utils/snapshot-store';

function parseSeconds(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (!v) return 0;
  const s = String(v).trim();
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  const parts = s.split(':');
  if (parts.length >= 2) {
    const nums = parts.map((p) => parseFloat(p));
    if (nums.every((n) => Number.isFinite(n))) {
      return nums.reduce((acc, n) => acc * 60 + n, 0);
    }
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

const SLOT_CLASS: Record<number, string> = {
  0: 'lg:col-span-3 lg:row-span-4 lg:col-start-1 lg:row-start-1 h-[520px] lg:h-auto',
  1: 'lg:col-span-6 lg:row-span-1 lg:col-start-4 lg:row-start-1 h-[240px] lg:h-auto',
  2: 'lg:col-span-6 lg:row-span-1 lg:col-start-4 lg:row-start-2 h-[240px] lg:h-auto',
  3: 'lg:col-span-6 lg:row-span-1 lg:col-start-4 lg:row-start-3 h-[200px] lg:h-auto',
  4: 'lg:col-span-6 lg:row-span-1 lg:col-start-4 lg:row-start-4 h-[220px] lg:h-auto',
  5: 'lg:col-span-3 lg:row-span-2 lg:col-start-10 lg:row-start-1 h-[360px] lg:h-auto',
  6: 'lg:col-span-3 lg:row-span-1 lg:col-start-10 lg:row-start-3 h-[220px] lg:h-auto',
  7: 'lg:col-span-3 lg:row-span-1 lg:col-start-10 lg:row-start-4 h-[200px] lg:h-auto',
};

export default function LiveSessionPage() {
  const [selectedSessionType, setSelectedSessionType] = useState<string>('RAC');
  const [liveData, setLiveData] = useState<any>(null);
  const [isGatewayActive, setIsGatewayActive] = useState<boolean>(false);
  const [sessionName, setSessionName] = useState<string>('MotoGP Session');
  const [circuitName, setCircuitName] = useState<string>('Petronas Sepang International Circuit');
  const [availableSessions, setAvailableSessions] = useState<AvailableSession[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [trackCoords, setTrackCoords] = useState<TrackCoords>(getCircuitCoords());
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [weather, setWeather] = useState<TrackWeather | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const [layoutMap, setLayoutMap] = useState<Record<number, string>>(DEFAULT_LAYOUT);

  const savedSessionsRef = useRef<Set<string>>(new Set());

  // Hydrate layout from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setLayoutMap({ ...DEFAULT_LAYOUT, ...parsed });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutMap));
    } catch {
      // ignore
    }
  }, [layoutMap]);

  const checkLiveGateway = useCallback(async (sessionType?: string) => {
    try {
      const type = sessionType || selectedSessionType;
      const res = await fetch(`/api/live?sessionType=${type}`, { cache: 'no-store' });
      const data = await res.json();
      if (!data) return;

      setLiveData(data);
      setIsGatewayActive(Boolean(data.isTrackLive));
      if (data.sessionName) setSessionName(data.sessionName);
      if (data.event?.circuit?.name) setCircuitName(data.event.circuit.name);
      if (data.trackCoords) setTrackCoords(data.trackCoords);
      if (data.event?.id) setEventId(data.event.id);
      if (Array.isArray(data.availableSessions)) setAvailableSessions(data.availableSessions);
      if (Array.isArray(data.standings)) setStandings(data.standings);
      setLastUpdated(Date.now());

      // Auto-save finished sessions once per event+type
      if (data.session && data.session.status === 'FINISHED' && data.event?.id) {
        const key = `${data.event.id}:${data.session.type}`;
        if (!savedSessionsRef.current.has(key)) {
          savedSessionsRef.current.add(key);
          fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventId: data.event.id,
              eventName: data.event.name,
              sessionId: data.session.id,
              sessionType: data.session.type,
            }),
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Live gateway fetch failed:', err);
    }
  }, [selectedSessionType]);

  // Poll every 3 seconds
  useEffect(() => {
    checkLiveGateway();
    const interval = setInterval(() => checkLiveGateway(), 3000);
    return () => clearInterval(interval);
  }, [checkLiveGateway]);

  // Weather fetch (on coord change + every 15 min)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const w = await fetchTrackWeather(trackCoords.lat, trackCoords.lng);
      if (!cancelled && w) setWeather(w);
    };
    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [trackCoords.lat, trackCoords.lng]);

  const timingState: any = liveData?.data ?? { head: {}, rider: {} };

  const ridersList: LiveTimingRider[] = useMemo(() => {
    return (Object.values(timingState.rider || {}) as LiveTimingRider[]).sort(
      (a, b) => a.pos - b.pos
    );
  }, [timingState.rider]);

  // Build + store snapshot every time riders change
  useEffect(() => {
    if (ridersList.length === 0) return;
    const head = (timingState as any).head || {};
    const remaining = parseSeconds(head.remaining);
    const snapRiders: SnapshotRider[] = ridersList.map((r) => ({
      n: r.rider_number,
      p: r.pos,
      g: r.gap_first || '',
      gp: r.gap_prev || '',
      lt: r.lap_time || '',
      s: r.trac_status || '',
      lap: r.num_lap || 0,
    }));
    pushSnapshot({ t: Date.now(), remaining, riders: snapRiders });
  }, [ridersList, timingState]);

  const sessionType =
    (timingState as any)?.head?.session_shortname || selectedSessionType;

  const remainingSeconds = useMemo(() => {
    const head = (timingState as any)?.head || {};
    return parseSeconds(head.remaining);
  }, [timingState]);

  const totalDurationSeconds = useMemo(() => {
    const head = (timingState as any)?.head || {};
    const raw = parseSeconds(head.duration);
    return raw > 100000 ? raw / 1000 : raw;
  }, [timingState]);

  const totalLaps = useMemo(() => {
    const head = (timingState as any)?.head || {};
    const n = parseSeconds(head.num_laps);
    if (n > 0) return n;
    return ridersList.reduce((max, r) => Math.max(max, r.num_lap || 0), 0);
  }, [timingState, ridersList]);

  const currentLap = useMemo(() => {
    return ridersList.reduce((max, r) => Math.max(max, r.num_lap || 0), 0) || 1;
  }, [ridersList]);

  const ctx: FrameContext = useMemo(
    () => ({
      riders: ridersList,
      sessionType,
      sessionName,
      currentLap,
      totalLaps,
      remainingSeconds,
      totalDurationSeconds,
      weather,
      circuitName,
      circuitCoords: trackCoords,
      isLive: isGatewayActive,
      standings,
      eventId,
    }),
    [
      ridersList,
      sessionType,
      sessionName,
      currentLap,
      totalLaps,
      remainingSeconds,
      totalDurationSeconds,
      weather,
      circuitName,
      trackCoords,
      isGatewayActive,
      standings,
      eventId,
    ]
  );

  const handleSwap = useCallback((from: number, to: number) => {
    setLayoutMap((prev) => {
      const next = { ...prev };
      const tmp = next[from];
      next[from] = next[to];
      next[to] = tmp;
      return next;
    });
  }, []);

  const handleSelectSession = useCallback(
    (type: string) => {
      setSelectedSessionType(type);
      checkLiveGateway(type);
    },
    [checkLiveGateway]
  );

  return (
    <div className="w-full bg-[#07080B] text-white px-3 sm:px-4 py-2.5 max-w-[1920px] mx-auto select-none font-sans flex flex-col gap-2.5 min-h-screen lg:h-[calc(100dvh-48px)] lg:overflow-hidden">
      <SessionHeader
        eventName={sessionName.split('·')[0].trim()}
        circuitName={circuitName}
        sessionType={sessionType}
        sessionName={sessionName}
        isLive={isGatewayActive}
        remainingSeconds={remainingSeconds}
        totalDurationSeconds={totalDurationSeconds}
        currentLap={currentLap}
        totalLaps={totalLaps}
        weather={weather}
        lastUpdated={lastUpdated}
        availableSessions={availableSessions}
        onSelectSession={handleSelectSession}
      />

      <LayoutGroup>
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-4 gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((slot) => (
            <FrameSlot
              key={slot}
              slotIndex={slot}
              contentType={layoutMap[slot] || DEFAULT_LAYOUT[slot]}
              ctx={ctx}
              onSwap={handleSwap}
              className={SLOT_CLASS[slot]}
            />
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
