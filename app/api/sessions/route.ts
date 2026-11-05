import { NextResponse } from 'next/server';
import { readSavedSessions, saveSession, SavedSession } from '@/lib/server/session-store';
import { SESSION_URL } from '@/lib/server/pulselive';

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const sessions = await readSavedSessions();
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, eventName, sessionId, sessionType } = body || {};
    if (!sessionId || !sessionType) {
      return NextResponse.json({ error: 'sessionId and sessionType required' }, { status: 400 });
    }

    const res = await fetch(`${SESSION_URL}/${sessionId}/classification`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch classification' }, { status: 502 });
    }
    const data = await res.json();

    const saved: SavedSession = {
      eventId: eventId || 'unknown',
      eventName: eventName || 'Grand Prix',
      sessionType,
      classification: data?.classification || [],
      records: data?.records || [],
      savedAt: Date.now(),
    };

    await saveSession(saved);
    return NextResponse.json({ ok: true, saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Save failed' }, { status: 500 });
  }
}
