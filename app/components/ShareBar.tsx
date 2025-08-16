"use client";

import Link from 'next/link';

type Props = { url: string; title: string };

export default function ShareBar({ url, title }: Props) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return (
    <div className="flex items-center gap-3">
      <Link
        className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-black/10 hover:bg-black/[0.03]"
        href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.7.4-1.5.8-2.4 1C18.3 4.5 17.3 4 16.2 4c-2.1 0-3.8 1.7-3.8 3.8 0 .3 0 .6.1.9-3.2-.2-6.1-1.7-8-4-.3.5-.5 1.2-.5 1.8 0 1.3.7 2.5 1.7 3.2-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.4 3.5 3.2 3.9-.3.1-.6.1-1 .1-.2 0-.5 0-.7-.1.5 1.6 2 2.8 3.7 2.9-1.4 1.1-3.1 1.8-5.1 1.8H2c1.8 1.2 4 1.9 6.3 1.9 7.6 0 11.8-6.3 11.8-11.8v-.5c.8-.6 1.4-1.2 1.9-2z"/></svg>
        X
      </Link>
      <Link
        className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-black/10 hover:bg-black/[0.03]"
        href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.7V12h2.7V9.8c0-2.6 1.5-4 3.8-4 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z"/></svg>
        Facebook
      </Link>
      <Link
        className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-black/10 hover:bg-black/[0.03]"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M19 0H5C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM7.2 19.3H4.3V9.1h2.9v10.2zM5.8 7.7c-.9 0-1.6-.7-1.6-1.6S4.9 4.5 5.8 4.5s1.6.7 1.6 1.6-.7 1.6-1.6 1.6zM20 19.3h-2.9v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H10V9.1h2.8v1.4h.1c.4-.7 1.4-1.4 2.8-1.4 3 0 3.6 2 3.6 4.6v5.6z"/></svg>
        LinkedIn
      </Link>
      <Link
        className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-black/10 hover:bg-black/[0.03]"
        href={`mailto:?subject=${t}&body=${u}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M2 4h20v16H2z"/><path d="M22 6l-10 7L2 6" fill="#fff"/></svg>
        Email
      </Link>
      <button
        type="button"
        className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-black/10 hover:bg-black/[0.03]"
        onClick={() => navigator.clipboard?.writeText(url)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14h13c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        Copy link
      </button>
    </div>
  );
}


