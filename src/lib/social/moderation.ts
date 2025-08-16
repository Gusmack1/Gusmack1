import { z } from 'zod';
import type { SocialItem } from './providers';

export const socialItemSchema = z.object({
  id: z.string(),
  platform: z.enum(['instagram', 'twitter', 'youtube', 'facebook']),
  author: z.string(),
  text: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  permalink: z.string().url().optional(),
  createdAt: z.string(),
});

export function filterItems(items: SocialItem[]): SocialItem[] {
  return items
    .filter((i) => !i.text || !/\b(?:gambling|crypto pump|nsfw)\b/i.test(i.text))
    .slice(0, 100);
}

export function validateItems(items: SocialItem[]): SocialItem[] {
  return items.map((i) => socialItemSchema.parse(i));
}


