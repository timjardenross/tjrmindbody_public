import type { MetadataRoute } from 'next';
import { collections, sitemapCollections } from '@/lib/collections';
import { getAllPageEntries, getContentLastModified, getAllEntries, ContentEntry, ArticleFrontmatter } from '@/lib/content';
import { absoluteUrl, SITE_LAUNCH_DATE } from '@/lib/site';

function latestOf(dates: Date[]): Date {
  return dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : SITE_LAUNCH_DATE;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Article-type collections only, minus drafts (already excluded by
  // getAllEntries) and anything an editor has explicitly marked noindex via
  // the CMS's "Hide from search engines" field.
  const articleEntries: ContentEntry<ArticleFrontmatter>[] = sitemapCollections
    .filter((c) => c.isArticleType)
    .flatMap((c) => getAllEntries(c.key).filter((e) => !e.frontmatter.seo?.noindex));

  const homeRoute: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: latestOf(articleEntries.map(getContentLastModified)) },
  ];

  const collectionIndexRoutes: MetadataRoute.Sitemap = collections
    .filter((c) => c.routeBase && c.inSitemap)
    .map((c) => {
      const entriesInCollection = articleEntries.filter((e) => e.collection === c.key);
      return {
        url: absoluteUrl(`/${c.routeBase}`),
        lastModified: latestOf(entriesInCollection.map(getContentLastModified)),
      };
    });

  const entryRoutes: MetadataRoute.Sitemap = articleEntries.map((entry) => ({
    url: absoluteUrl(entry.url),
    lastModified: getContentLastModified(entry),
  }));

  const pageRoutes: MetadataRoute.Sitemap = getAllPageEntries()
    .filter((e) => !e.frontmatter.seo?.noindex)
    .map((entry) => ({
      url: absoluteUrl(entry.url),
      lastModified: getContentLastModified(entry),
    }));

  // `/search` is an internal site-search shell with no indexable content of
  // its own — intentionally not listed. The private `/discover-your-capacity`
  // prototype is also intentionally excluded. Category/tag/pagination pages
  // are likewise excluded as thin/duplicate listing views.
  return [...homeRoute, ...collectionIndexRoutes, ...entryRoutes, ...pageRoutes];
}
