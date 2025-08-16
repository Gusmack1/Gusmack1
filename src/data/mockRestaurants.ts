export type MockRestaurant = {
  slug: string;
  name: string;
  cuisine: string;
  location: string;
  priceRange?: string;
  rating?: number;
  image?: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: { street: string; postcode: string };
};

export const mockRestaurants: MockRestaurant[] = [
  {
    slug: 'glasgow-bistro',
    name: 'Glasgow Bistro',
    cuisine: 'Scottish',
    location: 'West End',
    priceRange: '££',
    rating: 4,
    image: '/vercel.svg',
    description: 'Hearty Scottish classics with modern twists in the West End.',
    phone: '+44 141 000 0000',
    website: 'https://example.com/glasgow-bistro',
    address: { street: '12 Great Western Rd', postcode: 'G4 9AF' },
  },
  {
    slug: 'merchant-city-kitchen',
    name: 'Merchant City Kitchen',
    cuisine: 'Modern European',
    location: 'Merchant City',
    priceRange: '£££',
    rating: 5,
    image: '/next.svg',
    description: 'Seasonal European fare in the heart of Merchant City.',
    phone: '+44 141 111 1111',
    website: 'https://example.com/merchant-city-kitchen',
    address: { street: '5 Ingram St', postcode: 'G1 1DN' },
  },
];


