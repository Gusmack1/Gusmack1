import type { SocialItem } from './providers';
import { fetchInstagramBusinessRecent, fetchTwitterViaTwitterApiIo, fetchYouTubeChannelVideos, fetchFacebookPagePosts } from './providers';
import { filterItems, validateItems } from './moderation';

export async function aggregateSocial(): Promise<SocialItem[]> {
  const [ig, tw, yt, fb] = await Promise.all([
    fetchInstagramBusinessRecent().catch(() => []),
    fetchTwitterViaTwitterApiIo().catch(() => []),
    fetchYouTubeChannelVideos().catch(() => []),
    fetchFacebookPagePosts().catch(() => []),
  ]);
  const merged = [...ig, ...tw, ...yt, ...fb].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return validateItems(filterItems(merged));
}


