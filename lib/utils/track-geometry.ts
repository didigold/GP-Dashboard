import {
  SEPANG_OFFICIAL_GPS_COORDS,
  SEPANG_CORNERS,
  getInterpolatedSepangSpline,
} from '@/lib/data/sepang-gps-track';

export interface SplineVertex {
  index: number;
  lng: number;
  lat: number;
  distanceMeters: number;
  progress: number; // 0..1
  bearingDeg: number;
  normalLng: number; // unit normal in lng degrees per meter
  normalLat: number; // unit normal in lat degrees per meter
  curvature: number; // signed curvature (rad / meter)
  sector: 1 | 2 | 3 | 4;
}

const METERS_PER_DEG_LAT = 110574;
const METERS_PER_DEG_LNG = 111320 * Math.cos((2.7608 * Math.PI) / 180);
export const SEPANG_TRACK_LENGTH_METERS = 5543;

// Corner turn directions for Sepang T1..T15 (R = Right, L = Left)
const SEPANG_CORNER_DIRS: Record<string, 'L' | 'R'> = {
  T1: 'R',
  T2: 'L',
  T3: 'R',
  T4: 'R',
  T5: 'L',
  T6: 'R',
  T7: 'R',
  T8: 'R',
  T9: 'L',
  T10: 'R',
  T11: 'R',
  T12: 'L',
  T13: 'R',
  T14: 'R',
  T15: 'L',
};

let cachedSplineTable: SplineVertex[] | null = null;

/**
 * Builds and caches a 720-point high-precision geometric lookup table for Sepang.
 */
export function getSepangSplineTable(): SplineVertex[] {
  if (cachedSplineTable) return cachedSplineTable;

  const rawPoints = getInterpolatedSepangSpline(720);
  // Drop duplicate closing point for uniform loop indexing
  const pts = rawPoints.slice(0, rawPoints.length - 1);
  const n = pts.length;

  const cumDist: number[] = [0];
  for (let i = 1; i < n; i++) {
    const dx = (pts[i][0] - pts[i - 1][0]) * METERS_PER_DEG_LNG;
    const dy = (pts[i][1] - pts[i - 1][1]) * METERS_PER_DEG_LAT;
    cumDist.push(cumDist[i - 1] + Math.hypot(dx, dy));
  }
  const totalRawDist = Math.max(1, cumDist[n - 1]);
  const scaleFactor = SEPANG_TRACK_LENGTH_METERS / totalRawDist;

  // Sector split fractions matching official Dorna sector distances (1322m, 1094m, 1562m, 1565m)
  const s1End = 1322 / SEPANG_TRACK_LENGTH_METERS; // ~0.2385
  const s2End = (1322 + 1094) / SEPANG_TRACK_LENGTH_METERS; // ~0.4359
  const s3End = (1322 + 1094 + 1562) / SEPANG_TRACK_LENGTH_METERS; // ~0.7177

  const table: SplineVertex[] = [];

  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 2 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 2) % n];

    const dx1 = (curr[0] - prev[0]) * METERS_PER_DEG_LNG;
    const dy1 = (curr[1] - prev[1]) * METERS_PER_DEG_LAT;
    const dx2 = (next[0] - curr[0]) * METERS_PER_DEG_LNG;
    const dy2 = (next[1] - curr[1]) * METERS_PER_DEG_LAT;

    const tx = dx1 + dx2;
    const ty = dy1 + dy2;
    const tLen = Math.max(1e-6, Math.hypot(tx, ty));
    const ux = tx / tLen;
    const uy = ty / tLen;

    // Bearing in degrees (0 = North, 90 = East)
    const bearingDeg = ((Math.atan2(ux, uy) * 180) / Math.PI + 360) % 360;

    // Right-hand normal in meters: (+uy, -ux)
    const nxMeters = uy;
    const nyMeters = -ux;

    const normalLng = nxMeters / METERS_PER_DEG_LNG;
    const normalLat = nyMeters / METERS_PER_DEG_LAT;

    // Signed curvature from heading change
    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);
    let dAngle = angle2 - angle1;
    while (dAngle > Math.PI) dAngle -= 2 * Math.PI;
    while (dAngle < -Math.PI) dAngle += 2 * Math.PI;
    const ds = Math.max(1, Math.hypot(dx1, dy1) + Math.hypot(dx2, dy2));
    const curvature = dAngle / ds;

    const distanceMeters = cumDist[i] * scaleFactor;
    const progress = i / n;

    let sector: 1 | 2 | 3 | 4 = 4;
    if (progress < s1End) sector = 1;
    else if (progress < s2End) sector = 2;
    else if (progress < s3End) sector = 3;

    table.push({
      index: i,
      lng: curr[0],
      lat: curr[1],
      distanceMeters,
      progress,
      bearingDeg,
      normalLng,
      normalLat,
      curvature,
      sector,
    });
  }

  cachedSplineTable = table;
  return table;
}

/**
 * Generates realistic FIA/FIM red-and-white corner kerbs ("pianos") GeoJSON
 * for both inside apexes and outside corner exits across all 15 corners.
 */
export function generateSepangKerbsGeoJSON() {
  const table = getSepangSplineTable();
  const n = table.length;
  const features: Array<{
    type: 'Feature';
    properties: { corner: string; side: 'apex' | 'exit' };
    geometry: { type: 'LineString'; coordinates: [number, number][] };
  }> = [];

  // Offset distance in meters from centerline to track edge kerb
  const kerbOffsetMeters = 5.4;

  SEPANG_CORNERS.forEach((corner) => {
    // Find closest spline vertex to corner GPS coordinate
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const dLng = (table[i].lng - corner.coords[0]) * METERS_PER_DEG_LNG;
      const dLat = (table[i].lat - corner.coords[1]) * METERS_PER_DEG_LAT;
      const d = dLng * dLng + dLat * dLat;
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    const dir = SEPANG_CORNER_DIRS[corner.name] || 'R';
    // Right turn: inside apex is to the right (+normal), outside exit is to the left (-normal)
    const apexSign = dir === 'R' ? 1 : -1;
    const exitSign = -apexSign;

    // 1. Inside Apex Kerb (-6 to +6 vertices around apex)
    const apexCoords: [number, number][] = [];
    for (let step = -6; step <= 6; step++) {
      const v = table[(bestIdx + step + n) % n];
      apexCoords.push([
        v.lng + v.normalLng * kerbOffsetMeters * apexSign,
        v.lat + v.normalLat * kerbOffsetMeters * apexSign,
      ]);
    }
    features.push({
      type: 'Feature',
      properties: { corner: corner.name, side: 'apex' },
      geometry: { type: 'LineString', coordinates: apexCoords },
    });

    // 2. Outside Exit Kerb (+3 to +16 vertices after apex)
    const exitCoords: [number, number][] = [];
    for (let step = 3; step <= 16; step++) {
      const v = table[(bestIdx + step + n) % n];
      exitCoords.push([
        v.lng + v.normalLng * kerbOffsetMeters * exitSign,
        v.lat + v.normalLat * kerbOffsetMeters * exitSign,
      ]);
    }
    features.push({
      type: 'Feature',
      properties: { corner: corner.name, side: 'exit' },
      geometry: { type: 'LineString', coordinates: exitCoords },
    });
  });

  return {
    type: 'FeatureCollection' as const,
    features,
  };
}

/**
 * Generates Start/Finish line & Pit Lane GeoJSON for realistic track details.
 */
export function generatePitAndStartFinishGeoJSON() {
  const table = getSepangSplineTable();
  const n = table.length;
  const sfVertex = table[0];

  // Perpendicular Start/Finish Line across the main straight
  const sfHalfWidth = 7.5;
  const startFinishLine: [number, number][] = [
    [
      sfVertex.lng - sfVertex.normalLng * sfHalfWidth,
      sfVertex.lat - sfVertex.normalLat * sfHalfWidth,
    ],
    [
      sfVertex.lng + sfVertex.normalLng * sfHalfWidth,
      sfVertex.lat + sfVertex.normalLat * sfHalfWidth,
    ],
  ];

  // Pit Lane running parallel to the main straight (from ~95% lap progress to ~4% lap progress)
  const pitCoords: [number, number][] = [];
  const pitStartIdx = Math.floor(n * 0.955);
  const pitEndIdx = Math.floor(n * 0.035);
  const totalSteps = n - pitStartIdx + pitEndIdx;

  for (let s = 0; s <= totalSteps; s++) {
    const idx = (pitStartIdx + s) % n;
    const v = table[idx];
    // Smooth entry/exit taper
    const t = s / totalSteps;
    const taper = t < 0.12 ? t / 0.12 : t > 0.88 ? (1 - t) / 0.12 : 1;
    const offsetMeters = 13.5 * taper;
    pitCoords.push([
      v.lng + v.normalLng * offsetMeters,
      v.lat + v.normalLat * offsetMeters,
    ]);
  }

  return {
    startFinishGeoJSON: {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: { type: 'start-finish' },
          geometry: { type: 'LineString' as const, coordinates: startFinishLine },
        },
      ],
    },
    pitLaneGeoJSON: {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: { type: 'pit-lane' },
          geometry: { type: 'LineString' as const, coordinates: pitCoords },
        },
      ],
    },
  };
}

/**
 * Extracts the exact track spline segment between 2 selected riders so we can render
 * a live glowing battle gap ribbon connecting them along the asphalt.
 */
export function generateDriverBattleRibbonGeoJSON(progressA: number, progressB: number) {
  const table = getSepangSplineTable();
  const n = table.length;

  const idxA = Math.floor(((progressA % 1) + 1) % 1 * n);
  const idxB = Math.floor(((progressB % 1) + 1) % 1 * n);

  // Determine shortest path along the closed loop
  const forwardSteps = (idxA - idxB + n) % n;
  const backwardSteps = (idxB - idxA + n) % n;

  const coords: [number, number][] = [];
  if (forwardSteps <= backwardSteps) {
    for (let s = 0; s <= forwardSteps; s++) {
      const v = table[(idxB + s) % n];
      coords.push([v.lng, v.lat]);
    }
  } else {
    for (let s = 0; s <= backwardSteps; s++) {
      const v = table[(idxA + s) % n];
      coords.push([v.lng, v.lat]);
    }
  }

  if (coords.length < 2) {
    coords.push(coords[0] || [SEPANG_OFFICIAL_GPS_COORDS[0][0], SEPANG_OFFICIAL_GPS_COORDS[0][1]]);
  }

  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: coords,
        },
      },
    ],
  };
}
