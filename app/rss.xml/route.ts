import { NextResponse } from 'next/server';
import { listReviews } from '@/src/lib/reviews';

export const dynamic = 'force-static';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com';
  
  // Get latest reviews
  const reviews = await listReviews();
  const latestReviews = reviews.slice(0, 20); // Latest 20 reviews
  
  const rssItems = latestReviews.map(review => `
    <item>
      <title>${escapeXml(review.title)}</title>
      <link>${base}/reviews/${review.slug}</link>
      <description>${escapeXml(review.description)}</description>
      <pubDate>${new Date(review.visitDate).toUTCString()}</pubDate>
      <guid>${base}/reviews/${review.slug}</guid>
    </item>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Gusmack Food Reviews</title>
      <link>${base}</link>
      <description>Latest Instagram food reviews from Glasgow</description>
      <language>en</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${rssItems}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}


