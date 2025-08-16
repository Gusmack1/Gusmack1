export type Coordinates = { lat: number; lng: number };
export type Address = { street: string; postcode: string };

export type Review = {
  author: { name: string };
  rating: number;
  content: string;
  createdAt: Date;
};

export type Restaurant = {
  name: string;
  description: string;
  address: Address;
  coordinates: Coordinates;
  phone?: string;
  website?: string;
  priceRange?: string;
  cuisine: string[] | string;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
};

export const generateReviewSchema = (review: Review) => ({
  "@type": "Review",
  author: {
    "@type": "Person",
    name: review.author.name,
  },
  reviewRating: {
    "@type": "Rating",
    ratingValue: review.rating,
    bestRating: "5",
  },
  reviewBody: review.content,
  datePublished: review.createdAt.toISOString(),
});

export const generateRestaurantSchema = (restaurant: Restaurant) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: restaurant.name,
  description: restaurant.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: restaurant.address.street,
    addressLocality: "Glasgow",
    addressRegion: "Scotland",
    postalCode: restaurant.address.postcode,
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: restaurant.coordinates.lat,
    longitude: restaurant.coordinates.lng,
  },
  telephone: restaurant.phone,
  url: restaurant.website,
  priceRange: restaurant.priceRange,
  servesCuisine: restaurant.cuisine,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: restaurant.averageRating,
    reviewCount: restaurant.reviewCount,
  },
  review: restaurant.reviews.map(generateReviewSchema),
});


