import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center p-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-2 text-neutral-600">The page you are looking for doesn’t exist.</p>
        <Link href="/" className="inline-block mt-6 px-4 py-2 rounded-md bg-[var(--color-accent)] text-white">Go home</Link>
      </div>
    </main>
  );
}


