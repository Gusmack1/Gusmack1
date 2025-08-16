import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getReview } from '@/src/lib/reviews';
import ReviewGallery from '@/src/components/ReviewGallery';
import ReviewQuickFacts from '@/src/components/ReviewQuickFacts';
import SocialShare from '@/src/components/SocialShare';
import CommentSection from '@/src/components/CommentSection';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) return { title: 'Review not found' };
  
  return {
    title: `${review.restaurantName} Review - ${review.title} | Gusmack Food Reviews`,
    description: review.description,
    keywords: review.seoKeywords.join(', '),
    alternates: { canonical: `/reviews/${review.slug}` },
    openGraph: {
      title: `${review.restaurantName} Review - ${review.title}`,
      description: review.description,
      url: `/reviews/${review.slug}`,
      type: 'article',
      images: [
        {
          url: review.featuredImage,
          width: 1200,
          height: 630,
          alt: `${review.restaurantName} - ${review.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${review.restaurantName} Review - ${review.title}`,
      description: review.description,
      images: [review.featuredImage],
    },
  };
}

export default async function ReviewPage({ params }: Params) {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) return notFound();

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(review.structuredData),
        }}
      />
      
      <main className="min-h-screen bg-white text-black">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <Image
              src={review.featuredImage}
              alt={`${review.restaurantName} - ${review.title}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 text-white">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {review.restaurantName}
                  </h1>
                  <p className="text-xl text-white/90 mb-4">
                    {review.title}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <span>{review.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts Bar */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
            <ReviewQuickFacts review={review} />
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-neutral-50 rounded-lg">
                {review.meta.authorImage && (
                  <Image
                    src={review.meta.authorImage}
                    alt={review.author}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{review.author}</h3>
                  <p className="text-sm text-neutral-600">{review.meta.authorBio}</p>
                  <p className="text-sm text-neutral-500">
                    Reviewed on {new Date(review.visitDate).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-8 p-6 border border-neutral-200 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Review</h2>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: review.html }} />
                </div>
              </div>

              {/* Pros & Cons */}
              {(review.meta.pros.length > 0 || review.meta.cons.length > 0) && (
                <div className="mb-8 grid md:grid-cols-2 gap-6">
                  {review.meta.pros.length > 0 && (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-3">What We Loved</h3>
                      <ul className="space-y-2">
                        {review.meta.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-green-700">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.meta.cons.length > 0 && (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-800 mb-3">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {review.meta.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-red-700">
                            <span className="text-red-500 mt-1">×</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Photo Gallery */}
              {review.meta.images.length > 1 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
                  <ReviewGallery images={review.meta.images} restaurantName={review.restaurantName} />
                </div>
              )}

              {/* Social Share */}
              <div className="mb-8">
                <SocialShare 
                  title={review.title}
                  description={review.description}
                  url={`/reviews/${review.slug}`}
                  image={review.featuredImage}
                />
              </div>

              {/* Comments */}
              <div className="mb-8">
                <CommentSection reviewSlug={review.slug} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Booking Info */}
              {review.meta.bookingInfo.phone || review.meta.bookingInfo.website || review.meta.bookingInfo.address && (
                <div className="mb-8 p-6 border border-neutral-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Restaurant Information</h3>
                  <div className="space-y-3">
                    {review.meta.bookingInfo.phone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <a href={`tel:${review.meta.bookingInfo.phone}`} className="ml-2 text-[var(--scot-accent)] hover:underline">
                          {review.meta.bookingInfo.phone}
                        </a>
                      </div>
                    )}
                    {review.meta.bookingInfo.website && (
                      <div>
                        <span className="font-medium">Website:</span>
                        <a href={review.meta.bookingInfo.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-[var(--scot-accent)] hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                    {review.meta.bookingInfo.address && (
                      <div>
                        <span className="font-medium">Address:</span>
                        <p className="ml-2 text-neutral-600">{review.meta.bookingInfo.address}</p>
                      </div>
                    )}
                    {review.meta.bookingInfo.openingHours && (
                      <div>
                        <span className="font-medium">Hours:</span>
                        <p className="ml-2 text-neutral-600">{review.meta.bookingInfo.openingHours}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Reviews */}
              {review.meta.relatedRestaurants.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Related Reviews</h3>
                  <div className="space-y-3">
                    {review.meta.relatedRestaurants.map((relatedSlug) => (
                      <Link
                        key={relatedSlug}
                        href={`/reviews/${relatedSlug}`}
                        className="block p-3 border border-neutral-200 rounded-lg hover:border-[var(--scot-accent)] transition-colors"
                      >
                        <span className="text-[var(--scot-accent)] hover:underline">View Related Review</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
