import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { renderMarkdownToHtml, extractToc, TocItem } from './markdown';

export type ReviewMeta = {
  title: string;
  description: string;
  restaurantName: string;
  location: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  visitDate: string;
  author: string;
  authorBio: string;
  authorImage?: string;
  featuredImage: string;
  images: string[];
  pros: string[];
  cons: string[];
  highlights: string[];
  dishes: {
    name: string;
    description: string;
    rating: number;
    price: string;
    image?: string;
  }[];
  atmosphere: {
    rating: number;
    description: string;
  };
  service: {
    rating: number;
    description: string;
  };
  value: {
    rating: number;
    description: string;
  };
  accessibility: string[];
  dietaryOptions: string[];
  bookingInfo: {
    phone: string;
    website: string;
    address: string;
    openingHours: string;
  };
  tags: string[];
  seoKeywords: string[];
  relatedRestaurants: string[];
};

export type ReviewListItem = {
  slug: string;
  title: string;
  description: string;
  restaurantName: string;
  location: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  visitDate: string;
  featuredImage: string;
  author: string;
  tags: string[];
  seoKeywords: string[];
  updatedAt: string;
};

export type ReviewDoc = ReviewListItem & {
  html: string;
  toc: TocItem[];
  meta: ReviewMeta;
  structuredData: Record<string, unknown>;
};

function reviewsDir(): string {
  return path.join(process.cwd(), 'content', 'reviews');
}

async function safeReadDir(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export async function listReviews(): Promise<ReviewListItem[]> {
  const dir = reviewsDir();
  const entries = await safeReadDir(dir);
  const items: ReviewListItem[] = [];
  
  for (const file of entries) {
    if (!file.endsWith('.md')) continue;
    const full = path.join(dir, file);
    try {
      const raw = await fs.readFile(full, 'utf8');
      const { data } = matter(raw);
      const slug = file.replace(/\.md$/, '');
      const stat = await fs.stat(full);
      
      items.push({
        slug,
        title: (data.title as string) || slug,
        description: (data.description as string) || '',
        restaurantName: (data.restaurantName as string) || '',
        location: (data.location as string) || '',
        cuisine: (data.cuisine as string) || '',
        priceRange: (data.priceRange as string) || '',
        rating: (data.rating as number) || 0,
        visitDate: (data.visitDate as string) || '',
        featuredImage: (data.featuredImage as string) || '',
        author: (data.author as string) || 'Gus Mack',
        tags: (data.tags as string[]) || [],
        seoKeywords: (data.seoKeywords as string[]) || [],
        updatedAt: stat.mtime.toISOString(),
      });
    } catch {
      // skip invalid files
    }
  }
  
  // sort by visit date desc, then by rating desc
  items.sort((a, b) => {
    const dateCompare = new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    return b.rating - a.rating;
  });
  
  return items;
}

export async function getReview(slug: string): Promise<ReviewDoc | null> {
  const file = path.join(reviewsDir(), `${slug}.md`);
  try {
    const raw = await fs.readFile(file, 'utf8');
    const { data, content } = matter(raw);
    const html = await renderMarkdownToHtml(content || '');
    const toc = extractToc(content || '');
    const stat = await fs.stat(file);
    
    const meta: ReviewMeta = {
      title: (data.title as string) || slug,
      description: (data.description as string) || '',
      restaurantName: (data.restaurantName as string) || '',
      location: (data.location as string) || '',
      cuisine: (data.cuisine as string) || '',
      priceRange: (data.priceRange as string) || '',
      rating: (data.rating as number) || 0,
      visitDate: (data.visitDate as string) || '',
      author: (data.author as string) || 'Gus Mack',
      authorBio: (data.authorBio as string) || 'Glasgow food expert and restaurant reviewer',
      authorImage: (data.authorImage as string) || undefined,
      featuredImage: (data.featuredImage as string) || '',
      images: (data.images as string[]) || [],
      pros: (data.pros as string[]) || [],
      cons: (data.cons as string[]) || [],
      highlights: (data.highlights as string[]) || [],
      dishes: (data.dishes as ReviewMeta['dishes']) || [],
      atmosphere: (data.atmosphere as ReviewMeta['atmosphere']) || { rating: 0, description: '' },
      service: (data.service as ReviewMeta['service']) || { rating: 0, description: '' },
      value: (data.value as ReviewMeta['value']) || { rating: 0, description: '' },
      accessibility: (data.accessibility as string[]) || [],
      dietaryOptions: (data.dietaryOptions as string[]) || [],
      bookingInfo: (data.bookingInfo as ReviewMeta['bookingInfo']) || {
        phone: '',
        website: '',
        address: '',
        openingHours: ''
      },
      tags: (data.tags as string[]) || [],
      seoKeywords: (data.seoKeywords as string[]) || [],
      relatedRestaurants: (data.relatedRestaurants as string[]) || [],
    };

    // Generate structured data for SEO
    const structuredData: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Restaurant",
        "name": meta.restaurantName,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": meta.location,
          "addressRegion": "Glasgow",
          "addressCountry": "GB"
        },
        "servesCuisine": meta.cuisine,
        "priceRange": meta.priceRange
      },
      "author": {
        "@type": "Person",
        "name": meta.author,
        "description": meta.authorBio
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": meta.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": meta.description,
      "datePublished": meta.visitDate,
      "image": meta.featuredImage,
      "publisher": {
        "@type": "Organization",
        "name": "Gusmack Food Reviews",
        "url": "https://gusmack1.com"
      }
    };

    return {
      slug,
      title: meta.title,
      description: meta.description,
      restaurantName: meta.restaurantName,
      location: meta.location,
      cuisine: meta.cuisine,
      priceRange: meta.priceRange,
      rating: meta.rating,
      visitDate: meta.visitDate,
      featuredImage: meta.featuredImage,
      author: meta.author,
      tags: meta.tags,
      seoKeywords: meta.seoKeywords,
      updatedAt: stat.mtime.toISOString(),
      html,
      toc,
      meta,
      structuredData,
    };
  } catch {
    return null;
  }
}

export async function getReviewsByRestaurant(restaurantName: string): Promise<ReviewListItem[]> {
  const allReviews = await listReviews();
  return allReviews.filter(review => 
    review.restaurantName.toLowerCase().includes(restaurantName.toLowerCase())
  );
}

export async function getReviewsByCuisine(cuisine: string): Promise<ReviewListItem[]> {
  const allReviews = await listReviews();
  return allReviews.filter(review => 
    review.cuisine.toLowerCase().includes(cuisine.toLowerCase())
  );
}

export async function getReviewsByLocation(location: string): Promise<ReviewListItem[]> {
  const allReviews = await listReviews();
  return allReviews.filter(review => 
    review.location.toLowerCase().includes(location.toLowerCase())
  );
}

export async function getTopRatedReviews(limit: number = 10): Promise<ReviewListItem[]> {
  const allReviews = await listReviews();
  return allReviews
    .filter(review => review.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export async function getRecentReviews(limit: number = 10): Promise<ReviewListItem[]> {
  const allReviews = await listReviews();
  return allReviews
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
    .slice(0, limit);
}
