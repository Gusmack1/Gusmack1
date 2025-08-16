import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  return new NextResponse('User-agent: *\nAllow: /\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}


