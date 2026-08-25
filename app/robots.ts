import type { MetadataRoute } from 'next';
import { lab } from '@/lib/content';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${lab.site_url}/sitemap.xml`,
  };
}
