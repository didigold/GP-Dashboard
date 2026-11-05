import { LiveTimingRider } from '@/lib/types/motogp';
import { SEPANG_CORNERS } from '@/lib/data/sepang-gps-track';
import { getSepangSplineTable, SplineVertex, SEPANG_TRACK_LENGTH_METERS } from './track-geometry';

export interface RiderKinematicTelemetry {
  coords: [number, number];
  progress: number; // 0..1 around full lap
  sector: 1 | 2 | 3 | 4;
  sectorProgress: number; // 0..1 inside active sector
  speedKmh: number;
  gear: 1 | 2 | 3 | 4 | 5 | 6;
  leanAngleDeg: number;
  leanDirection: 'L' | 'R' | 'C';
  throttlePct: number;
  brakePct: number;
  rpm: number;
  isBraking: boolean;
  nearestCorner: string | null;
}

interface PrecomputedVertexPhysics {
  vertex: SplineVertex;
  refSpeedKmh: number;
  refLeanDeg: number;
  leanDir: 'L' | 'R' | 'C';
  isBraking: boolean;
  throttlePct: number;
  brakePct: number;
  sectorNormTime: number; // 0..1 normalized time within this vertex's sector
  nearestCorner: string | null;
}

let cachedPhysicsProfile: PrecomputedVertexPhysics[] | null = null;
let sectorIndexRanges: Record<1 | 2 | 3 | 4, { startIdx: number; endIdx: number }> | null = null;

/**
 * Precomputes a physically grounded MotoGP velocity, braking, acceleration, and lean angle profile
 * along the 720-point Sepang spline using official corner apex speeds and straight-line top speeds.
 */
function getPhysicsProfile(): {
  profile: PrecomputedVertexPhysics[];
  ranges: Record<1 | 2 | 3 | 4, { startIdx: number; endIdx: number }>;
} {
  if (cachedPhysicsProfile && sectorIndexRanges) {
    return { profile: cachedPhysicsProfile, ranges: sectorIndexRanges };
  }

  const table = getSepangSplineTable();
  const n = table.length;
  const maxRefSpeedKmh = 342.8;

  // 1. Initialize ceiling speed at every vertex to max straight speed
  const speedsKmh = new Array<number>(n).fill(maxRefSpeedKmh);
  const cornerNames = new Array<string | null>(n).fill(null);
  const cornerLeanDirs = new Array<'L' | 'R' | 'C'>(n).fill('C');

  // Turn directions for Sepang
  const dirMap: Record<string, 'L' | 'R'> = {
    T1: 'R', T2: 'L', T3: 'R', T4: 'R', T5: 'L',
    T6: 'R', T7: 'R', T8: 'R', T9: 'L', T10: 'R',
    T11: 'R', T12: 'L', T13: 'R', T14: 'R', T15: 'L',
  };

  // 2. Pin minimum apex speeds at each of the 15 official Sepang corners
  SEPANG_CORNERS.forEach((c) => {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const dx = table[i].lng - c.coords[0];
      const dy = table[i].lat - c.coords[1];
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    const apexSpeed = parseFloat(c.speed) || 110;
    const dir = dirMap[c.name] || 'R';

    // Apply Gaussian corner speed well around apex (-8 to +8 vertices)
    for (let offset = -8; offset <= 8; offset++) {
      const idx = (bestIdx + offset + n) % n;
      const weight = Math.exp(-(offset * offset) / 18);
      const targetV = apexSpeed + (1 - weight) * (maxRefSpeedKmh - apexSpeed) * 0.45;
      if (targetV < speedsKmh[idx]) {
        speedsKmh[idx] = targetV;
      }
      if (Math.abs(offset) <= 5) {
        cornerNames[idx] = c.name;
        cornerLeanDirs[idx] = dir;
      }
    }
  });

  // 3. Forward pass: MotoGP prototype acceleration limit (v_next^2 = v_curr^2 + 2 * a_accel * ds)
  const ds = SEPANG_TRACK_LENGTH_METERS / n;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) {
      const prevIdx = (i - 1 + n) % n;
      const vPrevMs = speedsKmh[prevIdx] / 3.6;
      // Acceleration tapers at higher speeds due to aero drag
      const accelMs2 = vPrevMs < 45 ? 10.2 : vPrevMs < 70 ? 7.8 : 4.2;
      const vMaxNextMs = Math.sqrt(vPrevMs * vPrevMs + 2 * accelMs2 * ds);
      const vMaxNextKmh = Math.min(maxRefSpeedKmh, vMaxNextMs * 3.6);
      if (vMaxNextKmh < speedsKmh[i]) {
        speedsKmh[i] = vMaxNextKmh;
      }
    }
  }

  // 4. Backward pass: Brembo carbon braking deceleration limit (v_prev^2 = v_curr^2 + 2 * a_brake * ds)
  for (let pass = 0; pass < 2; pass++) {
    for (let i = n - 1; i >= 0; i--) {
      const nextIdx = (i + 1) % n;
      const vNextMs = speedsKmh[nextIdx] / 3.6;
      const brakeMs2 = 13.8; // ~1.4G deceleration
      const vMaxPrevMs = Math.sqrt(vNextMs * vNextMs + 2 * brakeMs2 * ds);
      const vMaxPrevKmh = Math.min(maxRefSpeedKmh, vMaxPrevMs * 3.6);
      if (vMaxPrevKmh < speedsKmh[i]) {
        speedsKmh[i] = vMaxPrevKmh;
      }
    }
  }

  // 5. Compute sector index boundaries & integrate normalized time within each sector
  const ranges: Record<1 | 2 | 3 | 4, { startIdx: number; endIdx: number }> = {
    1: { startIdx: 0, endIdx: 0 },
    2: { startIdx: 0, endIdx: 0 },
    3: { startIdx: 0, endIdx: 0 },
    4: { startIdx: 0, endIdx: n - 1 },
  };

  for (let i = 0; i < n; i++) {
    const s = table[i].sector;
    const prevS = table[Math.max(0, i - 1)].sector;
    if (i > 0 && s !== prevS) {
      ranges[prevS].endIdx = i - 1;
      ranges[s].startIdx = i;
    }
  }

  const sectorNormTimes = new Array<number>(n).fill(0);
  ([1, 2, 3, 4] as const).forEach((sec) => {
    const { startIdx, endIdx } = ranges[sec];
    let cumTime = 0;
    const times: number[] = [0];
    for (let i = startIdx + 1; i <= endIdx; i++) {
      const vMs = Math.max(15, speedsKmh[i] / 3.6);
      cumTime += ds / vMs;
      times.push(cumTime);
    }
    const totalSecTime = Math.max(0.001, cumTime);
    for (let i = startIdx; i <= endIdx; i++) {
      sectorNormTimes[i] = times[i - startIdx] / totalSecTime;
    }
  });

  // 6. Build final vertex physics records
  const profile: PrecomputedVertexPhysics[] = table.map((vertex, i) => {
    const nextIdx = (i + 1) % n;
    const vCurr = speedsKmh[i];
    const vNext = speedsKmh[nextIdx];
    const dv = vNext - vCurr;
    const isBraking = dv < -0.45;

    // Lean angle derived from corner proximity and curvature
    const speedRatio = (vCurr - 65) / (maxRefSpeedKmh - 65);
    let refLeanDeg = 0;
    if (cornerNames[i]) {
      refLeanDeg = Math.round(52 + (1 - Math.min(1, Math.max(0, speedRatio))) * 11);
    } else {
      const curvMag = Math.min(1, Math.abs(vertex.curvature) * 180);
      refLeanDeg = Math.min(58, Math.round(curvMag * 48));
    }

    const leanDir =
      cornerLeanDirs[i] !== 'C'
        ? cornerLeanDirs[i]
        : refLeanDeg > 8
        ? vertex.curvature > 0
          ? 'L'
          : 'R'
        : 'C';

    const brakePct = isBraking
      ? Math.min(100, Math.max(15, Math.round(Math.abs(dv) * 28)))
      : 0;
    const throttlePct = isBraking
      ? 0
      : dv > 0.15
      ? Math.min(100, Math.max(45, Math.round(65 + dv * 18)))
      : vCurr > 290
      ? 100
      : 35;

    return {
      vertex,
      refSpeedKmh: vCurr,
      refLeanDeg,
      leanDir,
      isBraking,
      throttlePct,
      brakePct,
      sectorNormTime: sectorNormTimes[i],
      nearestCorner: cornerNames[i],
    };
  });

  cachedPhysicsProfile = profile;
  sectorIndexRanges = ranges;
  return { profile, ranges };
}

function parseGapSeconds(gapStr?: string, pos?: number): number {
  if (!gapStr || gapStr === 'LEADER' || gapStr === '—') {
    return pos && pos > 1 ? (pos - 1) * 0.65 : 0;
  }
  const cleaned = gapStr.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return Number.isFinite(val) ? val : (pos && pos > 1 ? (pos - 1) * 0.65 : 0);
}

/**
 * Computes the high-accuracy real-time position and live telemetry for a MotoGP rider
 * at `elapsedSessionSec` using their 4 official transponder sectors, gap to leader,
 * and the circuit's physical velocity/curvature profile.
 */
export function computeRiderLiveKinematics(
  rider: LiveTimingRider,
  elapsedSessionSec: number,
  isWet = false
): RiderKinematicTelemetry {
  const { profile, ranges } = getPhysicsProfile();
  const n = profile.length;

  // 1. Extract rider's 4 real transponder sector durations (seconds)
  const wetPenalty = isWet ? 1.095 : 1.0;
  const t1 = (parseFloat(rider.t1 || '28.250') || 28.25) * wetPenalty;
  const t2 = (parseFloat(rider.t2 || '29.100') || 29.1) * wetPenalty;
  const t3 = (parseFloat(rider.t3 || '23.800') || 23.8) * wetPenalty;
  const t4 = (parseFloat(rider.t4 || '23.200') || 23.2) * wetPenalty;
  const totalLapSec = t1 + t2 + t3 + t4;

  // 2. Offset rider's clock by their real gap to the leader
  const gapSec = parseGapSeconds(rider.gap_first, rider.pos);
  // Add small deterministic offset so P1 starts near Turn 14/15 entry on initial load
  const effectiveElapsed = Math.max(0, elapsedSessionSec - gapSec + 96.5);
  const lapPhaseSec = ((effectiveElapsed % totalLapSec) + totalLapSec) % totalLapSec;

  // 3. Determine active sector (1..4) and local normalized sector time u in [0, 1]
  let activeSector: 1 | 2 | 3 | 4 = 1;
  let u = 0;

  if (lapPhaseSec < t1) {
    activeSector = 1;
    u = lapPhaseSec / t1;
  } else if (lapPhaseSec < t1 + t2) {
    activeSector = 2;
    u = (lapPhaseSec - t1) / t2;
  } else if (lapPhaseSec < t1 + t2 + t3) {
    activeSector = 3;
    u = (lapPhaseSec - (t1 + t2)) / t3;
  } else {
    activeSector = 4;
    u = (lapPhaseSec - (t1 + t2 + t3)) / t4;
  }
  u = Math.min(1, Math.max(0, u));

  // 4. Binary search within activeSector's precomputed time-warped vertices
  const { startIdx, endIdx } = ranges[activeSector];
  let low = startIdx;
  let high = endIdx;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (profile[mid].sectorNormTime < u) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  const idx0 = Math.max(startIdx, low - 1);
  const idx1 = low;
  const p0 = profile[idx0];
  const p1 = profile[idx1];
  const span = Math.max(1e-5, p1.sectorNormTime - p0.sectorNormTime);
  const alpha = Math.min(1, Math.max(0, (u - p0.sectorNormTime) / span));

  const lng = p0.vertex.lng + (p1.vertex.lng - p0.vertex.lng) * alpha;
  const lat = p0.vertex.lat + (p1.vertex.lat - p0.vertex.lat) * alpha;
  const progress = (idx0 + alpha) / n;

  // 5. Scale instantaneous speed by rider's official radar speed trap & wet condition
  const riderPeakSpeed = rider.speed || 342.8;
  const speedScale = (riderPeakSpeed / 342.8) * (isWet ? 0.91 : 1.0);
  const rawSpeed = (p0.refSpeedKmh + (p1.refSpeedKmh - p0.refSpeedKmh) * alpha) * speedScale;
  const speedKmh = Math.round(rawSpeed);

  // 6. Derive MotoGP 6-speed seamless gearbox gear & engine RPM
  let gear: 1 | 2 | 3 | 4 | 5 | 6 = 6;
  if (speedKmh < 96) gear = 1;
  else if (speedKmh < 142) gear = 2;
  else if (speedKmh < 188) gear = 3;
  else if (speedKmh < 236) gear = 4;
  else if (speedKmh < 286) gear = 5;
  else gear = 6;

  const gearMinMax: Record<number, [number, number]> = {
    1: [60, 96],
    2: [96, 142],
    3: [142, 188],
    4: [188, 236],
    5: [236, 286],
    6: [286, 355],
  };
  const [gMin, gMax] = gearMinMax[gear];
  const gearFrac = Math.min(1, Math.max(0, (speedKmh - gMin) / (gMax - gMin)));
  const rpm = Math.round(11200 + gearFrac * 6900);

  const maxLeanCap = isWet ? 53 : 64;
  const leanAngleDeg = Math.min(maxLeanCap, Math.round(p0.refLeanDeg + (p1.refLeanDeg - p0.refLeanDeg) * alpha));

  return {
    coords: [lng, lat],
    progress,
    sector: activeSector,
    sectorProgress: u,
    speedKmh,
    gear,
    leanAngleDeg,
    leanDirection: p0.leanDir,
    throttlePct: p0.throttlePct,
    brakePct: p0.brakePct,
    rpm,
    isBraking: p0.isBraking,
    nearestCorner: p0.nearestCorner,
  };
}
