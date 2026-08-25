import type { MetadataRoute } from 'next';
import { lab, lastUpdated, memberPages } from '@/lib/content';

const PATHS = ['', 'research', 'publications', 'members', 'gallery', 'news', 'teaching', 'join'];

export default function sitemap(): MetadataRoute.Sitemap {
  // 멤버 개인 페이지도 넣는다. 어느 멤버에게 페이지가 있는지는 lib/content.ts 가 파생한다.
  const paths = [...PATHS, ...memberPages.map((m) => `members/${m.slug}`)];
  return paths.map((p) => ({
    url: `${lab.site_url}/${p ? `${p}/` : ''}`,
    lastModified: lastUpdated,
  }));
}
