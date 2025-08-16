import fs from 'node:fs/promises';
import path from 'node:path';
import type { SocialItem } from './providers';

const STORE = path.join(process.cwd(), 'content', 'social-aggregate.json');

export async function readStore(): Promise<SocialItem[]> {
  try {
    const s = await fs.readFile(STORE, 'utf8');
    return JSON.parse(s);
  } catch {
    return [];
  }
}

export async function writeStore(items: SocialItem[]): Promise<void> {
  await fs.mkdir(path.dirname(STORE), { recursive: true });
  await fs.writeFile(STORE, JSON.stringify(items, null, 2), 'utf8');
}


