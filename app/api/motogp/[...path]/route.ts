import { NextRequest, NextResponse } from 'next/server';

const PULSELIVE_BASE = 'https://api.motogp.pulselive.com/motogp/v1';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathJoined = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${PULSELIVE_BASE}/${pathJoined}${searchParams ? `?${searchParams}` : ''}`;

    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'application/json, text/plain, */*',
      },
      next: { revalidate: 1800 }, // 30 mins edge revalidation
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstreamResponse.statusText}` },
        { status: upstreamResponse.status }
      );
    }

    const data = await upstreamResponse.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal proxy error' },
      { status: 500 }
    );
  }
}
