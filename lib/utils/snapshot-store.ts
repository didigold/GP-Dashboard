'use client';

export interface SnapshotRider {
  n: string; // rider number
  p: number; // position
  g: string; // gap_first
  gp: string; // gap_prev
  lt: string; // lap_time
  s: string; // trac_status ('B' = box/pit)
  lap: number; // num_lap
}

export interface Snapshot {
  t: number; // Date.now()
  remaining: number; // head.remaining in seconds
  riders: SnapshotRider[];
}

export interface GapPoint {
  t: number; // relative ms from window start
  gap: number; // seconds
}

export interface LapPoint {
  lap: number;
  time: number; // seconds
}

export interface PitStop {
  rider: string;
  lap: number;
  entryT: number;
  exitT: number | null;
  duration: number | null; // seconds
}

const STORAGE_KEY = 'gp-snapshots-v1';
const MAX_SNAPSHOTS = 800;

let buffer: Snapshot[] = [];
let hydrated = false;

function hydrate(): void {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) buffer = parsed.slice(-MAX_SNAPSHOTS);
    }
  } catch {
    buffer = [];
  }
}

function persist(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer));
  } catch {
    // Quota exceeded — drop oldest half and retry once
    try {
      buffer = buffer.slice(-Math.floor(MAX_SNAPSHOTS / 2));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer));
    } catch {
      // give up silently
    }
  }
}

export function pushSnapshot(snap: Snapshot): void {
  hydrate();
  buffer.push(snap);
  if (buffer.length > MAX_SNAPSHOTS) buffer = buffer.slice(-MAX_SNAPSHOTS);
  persist();
}

export function getSnapshots(): Snapshot[] {
  hydrate();
  return buffer;
}

export function clearSnapshots(): void {
  buffer = [];
  hydrated = true;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

function parseGap(gap: string, pos: number): number {
  if (!gap) return pos > 1 ? (pos - 1) * 0.5 : 0;
  const upper = gap.toUpperCase();
  if (upper === 'LEADER' || upper === '—' || upper === '-') return 0;
  const num = parseFloat(gap.replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) ? num : pos > 1 ? (pos - 1) * 0.5 : 0;
}

export function parseLapTime(lap: string): number | null {
  if (!lap) return null;
  const trimmed = lap.trim();
  if (!trimmed || trimmed === '0.000' || trimmed === '—') return null;
  const apostrophe = trimmed.split("'");
  if (apostrophe.length === 2) {
    const min = parseInt(apostrophe[0], 10);
    const sec = parseFloat(apostrophe[1]);
    if (Number.isFinite(min) && Number.isFinite(sec)) return min * 60 + sec;
  }
  const colon = trimmed.split(':');
  if (colon.length === 2) {
    const min = parseInt(colon[0], 10);
    const sec = parseFloat(colon[1]);
    if (Number.isFinite(min) && Number.isFinite(sec)) return min * 60 + sec;
  }
  const num = parseFloat(trimmed);
  return Number.isFinite(num) && num > 0 ? num : null;
}

/** Gap-to-leader evolution for one rider over the last N minutes. */
export function getGapSeries(riderNumber: string, lastMinutes = 30): GapPoint[] {
  const snaps = getSnapshots();
  if (snaps.length === 0) return [];
  const cutoff = snaps[snaps.length - 1].t - lastMinutes * 60 * 1000;
  const windowStart = Math.max(snaps[0].t, cutoff);
  const points: GapPoint[] = [];

  for (const snap of snaps) {
    if (snap.t < windowStart) continue;
    const r = snap.riders.find((x) => x.n === riderNumber);
    if (!r) continue;
    points.push({ t: snap.t - windowStart, gap: parseGap(r.g, r.p) });
  }
  return points;
}

/** Lap-time progression for one rider (deduped by lap number). */
export function getLapSeries(riderNumber: string): LapPoint[] {
  const snaps = getSnapshots();
  if (snaps.length === 0) return [];
  const byLap = new Map<number, number>();

  for (const snap of snaps) {
    const r = snap.riders.find((x) => x.n === riderNumber);
    if (!r) continue;
    const time = parseLapTime(r.lt);
    if (time === null) continue;
    // Only store completed laps (lap_time is the last completed lap)
    if (r.lap > 0) byLap.set(r.lap, time);
  }

  return Array.from(byLap.entries())
    .map(([lap, time]) => ({ lap, time }))
    .sort((a, b) => a.lap - b.lap);
}

/** Detects pit entries/exits from trac_status transitions ('B' = box). */
export function getPitStops(): PitStop[] {
  const snaps = getSnapshots();
  if (snaps.length === 0) return [];

  const open = new Map<string, { entryT: number; lap: number }>();
  const stops: PitStop[] = [];

  for (const snap of snaps) {
    for (const r of snap.riders) {
      const inPit = r.s === 'B';
      const active = open.get(r.n);

      if (inPit && !active) {
        open.set(r.n, { entryT: snap.t, lap: r.lap });
      } else if (!inPit && active) {
        const duration = (snap.t - active.entryT) / 1000;
        stops.push({
          rider: r.n,
          lap: active.lap,
          entryT: active.entryT,
          exitT: snap.t,
          duration,
        });
        open.delete(r.n);
      }
    }
  }

  // Riders still in the pit at the end of the window
  for (const [rider, active] of open.entries()) {
    stops.push({
      rider,
      lap: active.lap,
      entryT: active.entryT,
      exitT: null,
      duration: null,
    });
  }

  return stops.sort((a, b) => b.entryT - a.entryT);
}

/** Extract the flat list of riders present in the latest snapshot. */
export function getLatestSnapshot(): Snapshot | null {
  const snaps = getSnapshots();
  return snaps.length ? snaps[snaps.length - 1] : null;
}
