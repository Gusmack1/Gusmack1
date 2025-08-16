"use client";

import { useMemo, useState } from 'react';
import RestaurantCard from '@/src/components/RestaurantCard';
import { mockRestaurants as mock } from '@/src/data/mockRestaurants';

export default function RestaurantsPage() {
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');

  const cuisines = useMemo(() => Array.from(new Set(mock.map((m) => m.cuisine))).sort(), []);

  const filtered = useMemo(() => {
    return mock.filter((r) => {
      const matchQ = q ? (r.name.toLowerCase().includes(q.toLowerCase()) || r.location.toLowerCase().includes(q.toLowerCase())) : true;
      const matchCuisine = cuisine ? r.cuisine === cuisine : true;
      const matchPrice = price ? r.priceRange === price : true;
      const matchRating = rating ? (r.rating || 0) >= Number(rating) : true;
      return matchQ && matchCuisine && matchPrice && matchRating;
    });
  }, [q, cuisine, price, rating]);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Restaurants</h1>
        <p className="mt-2 text-neutral-700">Explore Glasgow & Scotland restaurants.</p>
        <form className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3" onSubmit={(e) => e.preventDefault()}>
          <input value={q} onChange={(e) => setQ(e.target.value)} className="h-10 px-3 rounded-md border border-black/10" placeholder="Search..." />
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="h-10 px-3 rounded-md border border-black/10">
            <option value="">All cuisines</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={price} onChange={(e) => setPrice(e.target.value)} className="h-10 px-3 rounded-md border border-black/10">
            <option value="">Any price</option>
            <option value="£">£</option>
            <option value="££">££</option>
            <option value="£££">£££</option>
          </select>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="h-10 px-3 rounded-md border border-black/10">
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="5">5 stars</option>
          </select>
        </form>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <RestaurantCard key={r.slug} {...r} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-neutral-600">No results match your filters.</p>
          )}
        </div>
      </div>
    </main>
  );
}


