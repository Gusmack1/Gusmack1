"use client";

import { useEffect, useState } from 'react';

type Comment = { id: string; name: string; message: string; createdAt: string };

export default function CommentEmbed({ slug }: { slug: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      const json = await res.json();
      setItems(json.items || []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: name.trim(), message: message.trim() }),
      });
      setName('');
      setMessage('');
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 border-t border-black/10 pt-6">
      <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>Comments</h2>
      <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3 max-w-xl">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="h-10 px-3 rounded-md border border-black/10" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Comment" className="h-24 px-3 py-2 rounded-md border border-black/10" />
        <button disabled={loading} className="h-10 w-fit px-4 rounded-md bg-black text-white disabled:opacity-50">{loading ? 'Posting…' : 'Post comment'}</button>
      </form>
      <ul className="mt-6 space-y-3">
        {items.map((c) => (
          <li key={c.id} className="border border-black/10 rounded-md p-3 bg-white/60">
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="text-xs text-neutral-600">{new Date(c.createdAt).toLocaleString()}</div>
            <p className="mt-2 text-sm">{c.message}</p>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-neutral-600">Be the first to comment.</li>}
      </ul>
    </section>
  );
}


