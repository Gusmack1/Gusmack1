import { NextResponse } from 'next/server';
import { aggregateSocial } from '@/src/lib/social/aggregate';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await aggregateSocial();
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  } catch (e) {
    return NextResponse.json({ items: [], error: 'aggregation_failed' }, { status: 500 });
  }
}


