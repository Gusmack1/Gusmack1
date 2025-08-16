import type { Metadata } from 'next';
import { mockRestaurants } from '@/src/data/mockRestaurants';
import Image from 'next/image';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { generateBreadcrumbListJsonLd } from '@/src/lib/seo';
import ImageGallery from '@/src/components/ui/ImageGallery';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const r = mockRestaurants.find((x) => x.slug === slug);
  if (!r) return { title: 'Restaurant not found' };
  return {
    title: r.name,
    description: r.description || `${r.cuisine} in ${r.location}`,
    alternates: { canonical: `/restaurants/${r.slug}` },
  };
}

export default async function RestaurantPage({ params }: Params) {
  const { slug } = await params;
  const r = mockRestaurants.find((x) => x.slug === slug);
  if (!r) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-semibold">Not found</h1>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/restaurants', label: 'Restaurants' }, { href: `/restaurants/${r.slug}`, label: r.name }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>{r.name}</h1>
        <p className="mt-2 text-neutral-700">{r.cuisine} • {r.location} {r.priceRange ? `• ${r.priceRange}` : ''}</p>
        {r.image && (
          <div className="mt-6">
            <Image src={r.image} alt={`${r.name} cover`} width={1200} height={900} className="w-full aspect-[4/3] object-cover rounded-md border border-black/10" />
          </div>
        )}
        {r.description && <p className="mt-4 text-neutral-700 max-w-3xl">{r.description}</p>}
        <ImageGallery images={[{ src: r.image || '/next.svg', alt: r.name }, { src: '/vercel.svg', alt: r.name }]} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: r.name,
              servesCuisine: r.cuisine,
              address: r.address ? {
                '@type': 'PostalAddress',
                streetAddress: r.address.street,
                addressLocality: 'Glasgow',
                addressRegion: 'Scotland',
                postalCode: r.address.postcode,
                addressCountry: 'GB',
              } : undefined,
              telephone: r.phone,
              url: r.website,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateBreadcrumbListJsonLd([
                { name: 'Home', item: (process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com') + '/' },
                { name: 'Restaurants', item: (process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com') + '/restaurants' },
                { name: r.name, item: (process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com') + `/restaurants/${r.slug}` },
              ])
            ),
          }}
        />
      </div>
    </main>
  );
}


