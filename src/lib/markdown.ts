import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$|_/g, '');
}

export type TocItem = { id: string; text: string; level: number };

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split(/\r?\n/);
  const items: TocItem[] = [];
  for (const line of lines) {
    const m = /^(#{2,4})\s+(.*)$/.exec(line.trim());
    if (m) {
      const level = m[1].length; // 2-4
      const text = m[2].replace(/[#`*]/g, '').trim();
      const id = slugify(text);
      items.push({ id, text, level });
    }
  }
  return items;
}


