const RAINVIEWER_MAPS_URL = 'https://api.rainviewer.com/public/weather-maps.json';

interface RainViewerResponse {
  radar?: {
    past?: Array<{ time: number; path: string }>;
    nowcast?: Array<{ time: number; path: string }>;
  };
}

/**
 * Returns the latest RainViewer radar timestamp (Unix seconds), or null if the
 * service is unreachable / has no frames.
 */
export async function getLatestRadarTimestamp(): Promise<number | null> {
  try {
    const res = await fetch(RAINVIEWER_MAPS_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: RainViewerResponse = await res.json();
    const past = data?.radar?.past ?? [];
    const nowcast = data?.radar?.nowcast ?? [];
    const all = [...past, ...nowcast];
    if (all.length === 0) return null;
    return all[all.length - 1].time;
  } catch {
    return null;
  }
}

/**
 * Builds a RainViewer raster tile URL for MapLibre.
 * Tiles outside radar coverage return transparent images automatically.
 */
export function radarTileUrl(timestamp: number): string {
  return `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/4/1_1.png`;
}

export function getRainViewerMapsUrl(): string {
  return RAINVIEWER_MAPS_URL;
}
