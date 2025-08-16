import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ApiComment {
  id: string;
  author: string;
  content: string;
  rating?: number;
  createdAt: string;
  reviewSlug: string;
}

// Simple in-memory storage for comments (in production, use a database)
const comments: Record<string, ApiComment[]> = {};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';
  const items = comments[slug] || [];
  return NextResponse.json({ items }, { headers: { 'Cache-Control': 'public, max-age=30' } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, name, message, rating } = body || {};
    if (!slug || !name || !message) return NextResponse.json({ error: 'invalid' }, { status: 400 });
    
    const newComment: ApiComment = {
      id: Date.now().toString(),
      author: String(name).slice(0, 80),
      content: String(message).slice(0, 1000),
      rating: typeof rating === 'number' ? rating : undefined,
      createdAt: new Date().toISOString(),
      reviewSlug: String(slug),
    };
    
    if (!comments[slug]) {
      comments[slug] = [];
    }
    comments[slug].push(newComment);
    
    return NextResponse.json({ ok: true, comment: newComment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}


