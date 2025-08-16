import Link from 'next/link';

type Crumb = { href: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-600">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((c, idx) => (
          <li key={c.href} className="flex items-center gap-2">
            {idx > 0 && <span>/</span>}
            <Link className="hover:underline" href={c.href}>{c.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}


