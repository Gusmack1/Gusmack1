import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="opacity-80">© {new Date().getFullYear()} Gusmack Food Reviews</p>
          <nav className="flex items-center gap-4">
            <Link className="hover:underline" href="/about">About</Link>
            <Link className="hover:underline" href="/guides">Guides</Link>
            
            <Link className="hover:underline" href="/restaurants">Restaurants</Link>
            <Link className="hover:underline" href="/search">Search</Link>
            <Link className="hover:underline" href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="text-xs text-neutral-700">
          A MACKAY (PUBLISHER) LTD — Company number SC858624
        </div>
      </div>
    </footer>
  );
}


