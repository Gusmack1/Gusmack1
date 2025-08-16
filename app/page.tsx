import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from './components/Hero';
// Reviews removed; homepage will no longer list recent reviews

export const metadata: Metadata = {
  title: 'Gusmack Food Reviews — Glasgow\'s Trusted Food Guide',
  description: 'Curated guides, insider picks, and trusted recommendations across Glasgow & Scotland. Structured, accurate, and regularly updated.',
  alternates: { canonical: '/' },
};

export default async function Home() {
  return (
    <main>
      <Hero />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 bg-white text-black">
        <h2 className="text-2xl font-semibold">Welcome</h2>
        <p className="mt-2 text-neutral-700">Explore our curated guides and restaurant recommendations across Glasgow.</p>
        <div className="mt-6">
          <Link className="text-[var(--scot-accent)] hover:underline" href="/guides">Browse guides →</Link>
        </div>
      </div>
    </main>
  );
}
