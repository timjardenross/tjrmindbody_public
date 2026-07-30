import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /search is an internal site-search shell (no indexable content of
        // its own, already excluded from the sitemap) and /search-index.json
        // is its raw data feed — Google explicitly recommends blocking
        // internal search result pages from crawling.
        disallow: ['/admin', '/api', '/search', '/search-index.json'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
