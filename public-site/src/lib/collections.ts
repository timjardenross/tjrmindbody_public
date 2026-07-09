export type CollectionKey =
  | 'blog'
  | 'guides'
  | 'revs-articles'
  | 'operational-resilience-insights'
  | 'resources'
  | 'pages';

export interface CollectionDef {
  key: CollectionKey;
  label: string;
  singular: string;
  /** Route segment the collection is served under, e.g. /blog. `null` means
   *  entries are flat top-level routes (used for the `pages` collection). */
  routeBase: string | null;
  /** Directory under public-site/content/ holding this collection's Markdown files. */
  contentDir: string;
  /** Whether entries carry date/category/tags/reading-time/TOC/related articles. */
  isArticleType: boolean;
  description: string;
  inSearch: boolean;
  inFeed: boolean;
  inSitemap: boolean;
}

/**
 * Central collection registry. Every content type the CMS and the public
 * site know about is declared here once — adding a new collection later
 * means adding one entry to this array (plus a matching Sveltia CMS config
 * block), not redesigning routes or content loading.
 */
export const collections: CollectionDef[] = [
  {
    key: 'blog',
    label: 'Blog',
    singular: 'Post',
    routeBase: 'blog',
    contentDir: 'blog',
    isArticleType: true,
    description: 'Regular articles on wellness, coaching and chronic pain recovery.',
    inSearch: true,
    inFeed: true,
    inSitemap: true,
  },
  {
    key: 'guides',
    label: 'Guides',
    singular: 'Guide',
    routeBase: 'guides',
    contentDir: 'guides',
    isArticleType: true,
    description: 'In-depth, evergreen guides.',
    inSearch: true,
    inFeed: true,
    inSitemap: true,
  },
  {
    key: 'revs-articles',
    label: 'REVS Articles',
    singular: 'REVS Article',
    routeBase: 'revs-articles',
    contentDir: 'revs-articles',
    isArticleType: true,
    description: 'Resilience, Emotion, Vitality and Stability articles.',
    inSearch: true,
    inFeed: true,
    inSitemap: true,
  },
  {
    key: 'operational-resilience-insights',
    label: 'Operational Resilience Insights',
    singular: 'Insight',
    routeBase: 'operational-resilience-insights',
    contentDir: 'operational-resilience-insights',
    isArticleType: true,
    description: 'Insights on building resilience into everyday operations.',
    inSearch: true,
    inFeed: true,
    inSitemap: true,
  },
  {
    key: 'resources',
    label: 'Resources',
    singular: 'Resource',
    routeBase: 'resources',
    contentDir: 'resources',
    isArticleType: true,
    description: 'Practical tools, worksheets and reference material.',
    inSearch: true,
    inFeed: true,
    inSitemap: true,
  },
  {
    key: 'pages',
    label: 'Pages',
    singular: 'Page',
    routeBase: null,
    contentDir: 'pages',
    isArticleType: false,
    description: 'Standalone site pages (About, Contact, etc).',
    inSearch: false,
    inFeed: false,
    inSitemap: true,
  },
];

export function getCollection(key: CollectionKey): CollectionDef {
  const def = collections.find((c) => c.key === key);
  if (!def) throw new Error(`Unknown collection: ${key}`);
  return def;
}

export function getCollectionByRouteBase(routeBase: string): CollectionDef | undefined {
  return collections.find((c) => c.routeBase === routeBase);
}

export const articleCollections = collections.filter((c) => c.isArticleType);
export const searchableCollections = collections.filter((c) => c.inSearch);
export const feedCollections = collections.filter((c) => c.inFeed);
export const sitemapCollections = collections.filter((c) => c.inSitemap);
