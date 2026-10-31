import { NextResponse } from 'next/server';

const LIVE_TIMING_URL = 'https://api.motogp.pulselive.com/motogp/v1/timing-gateway/livetiming-lite';

export const runtime = 'edge';

export async function GET() {
  try {
    const upstream = await fetch(LIVE_TIMING_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'application/json, text/plain, */*',
      },
    });

    if (!upstream.ok || upstream.status === 204) {
      return NextResponse.json({ active: false, data: null }, { status: 200 });
    }

    const text = await upstream.text();
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ active: false, data: null }, { status: 200 });
    }

    const data = JSON.parse(text);
    return NextResponse.json(
      { active: true, data },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=2, stale-while-revalidate=5',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { active: false, error: error?.message || 'Error fetching live timing' },
      { status: 200 }
    );
  }
}
