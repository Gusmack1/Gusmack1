import Link from 'next/link';
import Image from 'next/image';
import type { MockRestaurant } from '@/src/data/mockRestaurants';

export default function RestaurantCard(restaurant: MockRestaurant) {
  return (
    <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        {restaurant.image && (
          <div className="flex-shrink-0">
            <Image 
              src={restaurant.image} 
              alt={restaurant.name}
              width={60}
              height={60}
              className="rounded-md object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">
            <Link href={`/restaurants/${restaurant.slug}`} className="hover:underline">
              {restaurant.name}
            </Link>
          </h3>
          <p className="text-sm text-neutral-600 mt-1">{restaurant.cuisine}</p>
          <p className="text-sm text-neutral-500 mt-1">{restaurant.location}</p>
          {restaurant.description && (
            <p className="text-sm text-neutral-700 mt-2 line-clamp-2">{restaurant.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
            {restaurant.priceRange && <span>{restaurant.priceRange}</span>}
            {restaurant.rating && (
              <span className="flex items-center gap-1">
                <span>★</span>
                <span>{restaurant.rating}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
