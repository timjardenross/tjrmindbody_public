export type CollectionKey =
  | 'blog'
  | 'guides'
  | 'revs-articles'
  | 'operational-resilience-insights'
  | 'resources'
  | 'discover-capacity-codes'
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
    key: 'discover-capacity-codes',
    label: 'Discover Capacity Codes',
    singular: 'Access Code',
    routeBase: null,
    contentDir: 'discover-capacity-codes',
    isArticleType: false,
    description: 'Private access codes for the REVS Discover Your Capacity prototype.',
    inSearch: false,
    inFeed: false,
    inSitemap: false,
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

/**
 * Top-level path segments outside src/app/[collection]/ that Next.js
 * resolves before the [collection] catch-all. A collection whose routeBase
 * matches one of these would be entirely unreachable (no error, no 404 —
 * every one of its routes just silently 404s instead of ever rendering)
 * because Next.js always prefers a literal path match over a dynamic
 * segment at the same depth. Keep in sync with src/app/*'s top-level
 * folders/route files.
 */
export const RESERVED_ROUTE_BASES = [
  'admin',
  'search',
  'search-index.json',
  'rss.xml',
  'sitemap.xml',
  'robots.txt',
];

collections.forEach((def) => {
  if (def.routeBase && RESERVED_ROUTE_BASES.includes(def.routeBase)) {
    throw new Error(
      `Collection "${def.key}" has routeBase "${def.routeBase}", which collides with a ` +
        `reserved top-level route and would be permanently unreachable. Pick a different ` +
        `routeBase or remove it from RESERVED_ROUTE_BASES in src/lib/collections.ts if the ` +
        `reserved route is being removed too.`
    );
  }
});

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
