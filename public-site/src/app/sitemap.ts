import type { MetadataRoute } from 'next';
import { collections, sitemapCollections } from '@/lib/collections';
import { getAllEntries, getAllPageSlugs } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/search'), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const collectionIndexRoutes: MetadataRoute.Sitemap = collections
    .filter((c) => c.routeBase && c.inSitemap)
    .map((c) => ({ url: absoluteUrl(`/${c.routeBase}`), changeFrequency: 'weekly', priority: 0.6 }));

  const entryRoutes: MetadataRoute.Sitemap = sitemapCollections
    .filter((c) => c.isArticleType)
    .flatMap((c) =>
      getAllEntries(c.key).map((entry) => ({
        url: absoluteUrl(entry.url),
        lastModified: entry.frontmatter.updated || entry.frontmatter.date,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    );

  const pageRoutes: MetadataRoute.Sitemap = getAllPageSlugs().map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...collectionIndexRoutes, ...entryRoutes, ...pageRoutes];
}
