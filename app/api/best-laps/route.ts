import { NextResponse } from 'next/server';

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const EVENTS_URL = 'https://api.motogp.pulselive.com/motogp/v1/results/events';
const SESSIONS_URL = 'https://api.motogp.pulselive.com/motogp/v1/results/sessions';
const SESSION_URL = 'https://api.motogp.pulselive.com/motogp/v1/results/session';

const MOTOGP_CAT_ID = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';
const SEASON_2026_ID = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const SEASON_2025_ID = 'ae6c6f0d-c652-44f8-94aa-420fc5b3dab4';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
  Accept: 'application/json',
};

export interface BestLapRecord {
  type: string;
  time: string;
  rider: string;
  number?: number;
  year?: number | null;
  speed?: string;
}

export interface BestLapsResponse {
  sessionBest: BestLapRecord | null;
  pole: BestLapRecord | null;
  circuitRecord: BestLapRecord | null;
  previousEdition: BestLapRecord | null;
  eventName: string;
  previousEventName: string | null;
}

function normalizeRecord(rec: any): BestLapRecord {
  return {
    type: rec?.type || 'unknown',
    time: rec?.bestLap?.time || '--',
    rider: rec?.rider?.full_name || '—',
    number: rec?.bestLap?.number ?? undefined,
    year: rec?.year ?? null,
    speed: rec?.speed ?? undefined,
  };
}

async function getJson(url: string, revalidate: number) {
  const res = await fetch(url, { headers: HEADERS, next: { revalidate } });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function getRaceClassification(eventId: string) {
  const sessions = await getJson(
    `${SESSIONS_URL}?eventUuid=${eventId}&categoryUuid=${MOTOGP_CAT_ID}`,
    300
  );
  if (!Array.isArray(sessions)) return null;
  const race =
    sessions.find((s: any) => s.type === 'RAC' && s.status === 'FINISHED') ||
    sessions.find((s: any) => s.type === 'RAC') ||
    sessions.find((s: any) => s.type === 'SPR' && s.status === 'FINISHED');
  if (!race) return null;
  const classification = await getJson(`${SESSION_URL}/${race.id}/classification`, 300);
  return classification || null;
}

async function findEventByCountry(seasonId: string, iso: string, shortName: string) {
  const events = await getJson(`${EVENTS_URL}?seasonUuid=${seasonId}`, 3600);
  if (!Array.isArray(events)) return null;
  return (
    events.find(
      (e: any) =>
        !e.test &&
        (e.country?.iso === iso || e.short_name === shortName) &&
        e.status === 'FINISHED'
    ) || null
  );
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventUuid = searchParams.get('eventUuid');
    const countryIso = searchParams.get('countryIso') || '';
    const shortName = searchParams.get('shortName') || '';

    // 1. Resolve current event
    let currentEvent: any = null;
    if (eventUuid) {
      currentEvent = await getJson(`${EVENTS_URL}/${eventUuid}`, 600);
    } else {
      const events = await getJson(`${EVENTS_URL}?seasonUuid=${SEASON_2026_ID}`, 600);
      if (Array.isArray(events)) {
        currentEvent =
          events.find((e: any) => !e.test && e.status === 'FINISHED') ||
          events.find((e: any) => !e.test) ||
          events[0];
      }
    }

    if (!currentEvent) {
      return NextResponse.json({ error: 'No event found' }, { status: 404 });
    }

    // 2. Current event records
    const currentClass = await getRaceClassification(currentEvent.id);
    const records: any[] = currentClass?.records || [];

    const findRec = (type: string) => {
      const rec = records.find((r) => r.type === type);
      return rec ? normalizeRecord(rec) : null;
    };

    const sessionBest = findRec('fastestLap');
    const pole = findRec('poleLap');
    const circuitRecord = findRec('recordLap') || findRec('bestLap');

    // 3. Previous edition (same event, previous season)
    let previousEdition: BestLapRecord | null = null;
    let previousEventName: string | null = null;
    const iso = countryIso || currentEvent.country?.iso;
    const short = shortName || currentEvent.short_name;
    if (iso || short) {
      const prevEvent = await findEventByCountry(SEASON_2025_ID, iso, short);
      if (prevEvent && prevEvent.id !== currentEvent.id) {
        previousEventName = prevEvent.name;
        const prevClass = await getRaceClassification(prevEvent.id);
        const prevRecords: any[] = prevClass?.records || [];
        const prevFastest = prevRecords.find((r) => r.type === 'fastestLap');
        if (prevFastest) previousEdition = normalizeRecord(prevFastest);
      }
    }

    const body: BestLapsResponse = {
      sessionBest,
      pole,
      circuitRecord,
      previousEdition,
      eventName: currentEvent.name || 'Grand Prix',
      previousEventName,
    };

    return NextResponse.json(body, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch best laps' },
      { status: 500 }
    );
  }
}
