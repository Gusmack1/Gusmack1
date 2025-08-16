const links = [
  { label: 'Instagram', href: 'https://www.instagram.com/gusmack1/' },
  { label: 'Facebook', href: 'https://www.facebook.com/gusmack2/' },
  { label: 'X (Twitter)', href: 'https://x.com/Gusmack12/' },
  { label: 'Threads', href: 'https://www.threads.com/@gusmack1' },
  { label: 'YouTube', href: 'https://www.youtube.com/@GusMack' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@GusMack1' },
  { label: 'LinkedIn', href: 'https://uk.linkedin.com/in/angus-mackay-60344a66' },
  { label: 'Google Maps Reviews', href: 'https://www.google.com/maps/contrib/115222426206211405381/reviews/' },
];

import { aggregateSocial } from '@/src/lib/social/aggregate';

export default async function SocialPage() {
  const items = await aggregateSocial();
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Social</h1>
        <p className="mt-2 text-neutral-700">Latest posts across Instagram, X, YouTube, and Facebook.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((i) => (
            <a key={i.id} href={i.permalink} className="block border border-black/10 rounded-md p-3 hover:bg-black/[0.03]" target="_blank" rel="noopener noreferrer">
              <div className="text-xs uppercase tracking-wide text-neutral-600">{i.platform}</div>
              <div className="mt-1 text-sm font-semibold">{i.author}</div>
              {i.text && <p className="mt-2 text-sm text-neutral-800 line-clamp-3">{i.text}</p>}
            </a>
          ))}
        </div>
        <h2 className="mt-10 text-xl font-semibold">Follow</h2>
        <ul className="mt-3 space-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <a className="hover:underline" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}


