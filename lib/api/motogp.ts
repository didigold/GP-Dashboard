import {
  Season,
  Event,
  Session,
  ClassificationRider,
  StandingRider,
  Rider,
  LiveTimingState,
} from '../types/motogp';
import { MOCK_STANDINGS, INITIAL_SIMULATED_LIVE_STATE, RIDERS_DATA } from '../data/mock-race-data';

const BASE_URL = 'https://api.motogp.pulselive.com/motogp/v1';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Get all available MotoGP seasons (1949 - 2026)
 */
export async function getSeasons(): Promise<Season[]> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/results/seasons`, {
      next: { revalidate: 86400 }, // 24hr cache
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[MotoGP API] Failed to fetch seasons, using fallback', err);
    return [
      { id: 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e', name: null, year: 2026, current: true },
      { id: 'ae6c6f0d-c652-44f8-94aa-420fc5b3dab4', name: null, year: 2025, current: false },
      { id: 'dd12382e-1d9f-46ee-a5f7-c5104db28e43', name: null, year: 2024, current: false },
    ];
  }
}

/**
 * Get events/calendar for a given season UUID
 */
export async function getEvents(seasonUuid: string): Promise<Event[]> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/results/events?seasonUuid=${seasonUuid}`, {
      next: { revalidate: 43200 }, // 12hr cache
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[MotoGP API] Failed to fetch events', err);
    return [];
  }
}

/**
 * Get sessions for an event and category (MotoGP)
 */
export async function getSessions(eventUuid: string, categoryUuid: string): Promise<Session[]> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/results/sessions?eventUuid=${eventUuid}&categoryUuid=${categoryUuid}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[MotoGP API] Failed to fetch sessions', err);
    return [];
  }
}

/**
 * Get session classification / results
 */
export async function getClassification(sessionId: string): Promise<ClassificationRider[]> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/results/session/${sessionId}/classification`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.classification || [];
  } catch (err) {
    console.warn('[MotoGP API] Failed to fetch classification', err);
    return [];
  }
}

/**
 * Get championship standings
 */
export async function getStandings(seasonUuid: string, categoryUuid: string): Promise<StandingRider[]> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.classification || MOCK_STANDINGS;
  } catch (err) {
    console.warn('[MotoGP API] Failed to fetch standings, returning mock', err);
    return MOCK_STANDINGS;
  }
}

/**
 * Get riders list
 */
export async function getRiders(seasonYear = 2024): Promise<Rider[]> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/riders?seasonYear=${seasonYear}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        full_name: `${r.name || ''} ${r.surname || ''}`.trim(),
        name: r.name || '',
        surname: r.surname || '',
        number: r.current_career_step?.number || 0,
        nickname: r.nickname || undefined,
        country: {
          iso: r.country?.iso || 'XX',
          name: r.country?.name || 'World',
          flag: r.country?.flag,
        },
        team_name: r.current_career_step?.team?.name || 'Independent',
        constructor_name: r.current_career_step?.team?.constructor?.name || 'MotoGP',
        photo_url: r.pictures?.profile?.main || undefined,
        color: r.current_career_step?.team?.color || '#FF2A54',
      }));
    }
    return RIDERS_DATA;
  } catch (err) {
    return RIDERS_DATA;
  }
}

/**
 * Get current live timing feed
 */
export async function getLiveTimingLite(): Promise<LiveTimingState | null> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/timing-gateway/livetiming-lite`,
      { cache: 'no-store' },
      4000
    );
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim().length === 0) return null;
    return JSON.parse(text) as LiveTimingState;
  } catch (err) {
    return null;
  }
}
