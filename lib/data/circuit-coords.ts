export interface TrackCoords {
  lat: number;
  lng: number;
}

/**
 * Circuit coordinates used for weather lookups (Open-Meteo) and map centering.
 * Keys are matched case-insensitively against the circuit name returned by the API.
 */
export const CIRCUIT_COORDS: Record<string, TrackCoords> = {
  'petronas sepang international circuit': { lat: 2.7608, lng: 101.7375 },
  'sepang international circuit': { lat: 2.7608, lng: 101.7375 },
  'circuit ricardo tormo': { lat: 39.4894, lng: -0.6281 },
  'chang international circuit': { lat: 14.9524, lng: 103.0752 },
  'termas de río hondo': { lat: -27.3839, lng: -64.8667 },
  'circuit of the americas': { lat: 30.1328, lng: -97.6411 },
  'lusail international circuit': { lat: 25.49, lng: 51.4542 },
  'circuito de jerez - ángel nieto': { lat: 36.7089, lng: -6.0347 },
  'le mans': { lat: 47.9567, lng: 0.2075 },
  'silverstone circuit': { lat: 52.0733, lng: -1.0142 },
  'motorland aragón': { lat: 41.1833, lng: -0.2 },
  'autodromo internazionale del mugello': { lat: 43.9975, lng: 11.3719 },
  'tt circuit assen': { lat: 52.9608, lng: 6.5236 },
  'sachsenring': { lat: 50.7919, lng: 12.7256 },
  'creditas autodrom brno': { lat: 49.2036, lng: 16.4525 },
  'red bull ring - spielberg': { lat: 47.2197, lng: 14.7647 },
  'balaton park circuit': { lat: 46.9103, lng: 18.0758 },
  'circuit de barcelona-catalunya': { lat: 41.57, lng: 2.2611 },
  'misano world circuit marco simoncelli': { lat: 43.9614, lng: 12.6833 },
  'mobility resort motegi': { lat: 36.5333, lng: 140.2267 },
  'pertamina mandalika circuit': { lat: -8.8958, lng: 116.1203 },
  'phillip island': { lat: -38.5072, lng: 145.2394 },
  'autódromo internacional do algarve': { lat: 37.2306, lng: -8.6267 },
  'autodromo internacional do algarve': { lat: 37.2306, lng: -8.6267 },
};

const FALLBACK: TrackCoords = { lat: 2.7608, lng: 101.7375 };

export function getCircuitCoords(circuitName?: string): TrackCoords {
  if (!circuitName) return FALLBACK;
  const key = circuitName.trim().toLowerCase();
  if (CIRCUIT_COORDS[key]) return CIRCUIT_COORDS[key];

  // Try partial match
  for (const [name, coords] of Object.entries(CIRCUIT_COORDS)) {
    if (key.includes(name) || name.includes(key)) return coords;
  }
  return FALLBACK;
}
