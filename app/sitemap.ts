import type { MetadataRoute } from 'next';
import { listReviews } from '@/src/lib/reviews';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com';
  const items: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/reviews`, lastModified: new Date() },
    { url: `${base}/restaurants`, lastModified: new Date() },
    { url: `${base}/closed-restaurants`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
  ];

  // Add all reviews
  const reviews = await listReviews();
  for (const review of reviews) {
    items.push({
      url: `${base}/reviews/${review.slug}`,
      lastModified: new Date(review.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8
    });
  }

  return items;
}


