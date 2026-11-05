export type WeatherIcon = 'sun' | 'cloud' | 'rain' | 'storm' | 'fog';

export interface TrackWeather {
  airTemp: number;
  humidity: number;
  windSpeed: number; // m/s
  windDirection: number; // degrees
  precipitation: number; // mm
  weatherCode: number;
  isRaining: boolean;
  icon: WeatherIcon;
  description: string;
  fetchedAt: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const cache = new Map<string, TrackWeather>();
const inflight = new Map<string, Promise<TrackWeather | null>>();

function weatherIconFromCode(code: number): { icon: WeatherIcon; desc: string; raining: boolean } {
  if (code === 0) return { icon: 'sun', desc: 'Clear', raining: false };
  if (code >= 1 && code <= 3) return { icon: 'cloud', desc: 'Cloudy', raining: false };
  if (code === 45 || code === 48) return { icon: 'fog', desc: 'Fog', raining: false };
  if (code >= 51 && code <= 67) return { icon: 'rain', desc: 'Rain', raining: true };
  if (code >= 80 && code <= 82) return { icon: 'rain', desc: 'Showers', raining: true };
  if (code >= 95) return { icon: 'storm', desc: 'Thunderstorm', raining: true };
  if (code >= 71 && code <= 86) return { icon: 'rain', desc: 'Snow', raining: true };
  return { icon: 'cloud', desc: 'Cloudy', raining: false };
}

export async function fetchTrackWeather(
  lat: number,
  lng: number,
  force = false
): Promise<TrackWeather | null> {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = cache.get(key);
  if (!force && cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached;
  }
  if (inflight.has(key)) return inflight.get(key)!;

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code`;

  const promise = (async () => {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      const c = data?.current;
      if (!c) return null;

      const meta = weatherIconFromCode(Number(c.weather_code ?? 0));
      const weather: TrackWeather = {
        airTemp: Number(c.temperature_2m ?? 0),
        humidity: Number(c.relative_humidity_2m ?? 0),
        windSpeed: Number(c.wind_speed_10m ?? 0) / 3.6, // km/h -> m/s
        windDirection: Number(c.wind_direction_10m ?? 0),
        precipitation: Number(c.precipitation ?? 0),
        weatherCode: Number(c.weather_code ?? 0),
        isRaining: meta.raining || Number(c.precipitation ?? 0) > 0,
        icon: meta.icon,
        description: meta.desc,
        fetchedAt: Date.now(),
      };
      cache.set(key, weather);
      return weather;
    } catch {
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

export function getCachedWeather(lat: number, lng: number): TrackWeather | null {
  return cache.get(`${lat.toFixed(3)},${lng.toFixed(3)}`) ?? null;
}
