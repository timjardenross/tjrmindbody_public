import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { CollectionDef, CollectionKey, articleCollections, collections, getCollection } from './collections';
import { gitLastModified } from './git';
import { SITE_LAUNCH_DATE } from './site';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export interface SeoFields {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
}

export interface ArticleFrontmatter {
  title: string;
  date: string;
  updated?: string;
  draft?: boolean;
  excerpt: string;
  category?: string;
  /** REVS Articles only: which of the four REVS pillars this article covers. */
  revsPillar?: string;
  tags?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  author?: string;
  /** Downloadable file path (e.g. a Resources worksheet/PDF), if any. */
  attachment?: string;
  attachmentLabel?: string;
  seo?: SeoFields;
}

export interface PageFrontmatter {
  title: string;
  updated?: string;
  seo?: SeoFields;
}

export interface ContentEntry<F = ArticleFrontmatter> {
  collection: CollectionKey;
  slug: string;
  frontmatter: F;
  content: string;
  readingTimeMinutes: number;
  /** Absolute site path, e.g. /blog/my-post or /about for pages. */
  url: string;
  /** Markdown source path relative to the project root, e.g. content/blog/my-post.md. */
  sourcePath: string;
}

function collectionDir(def: CollectionDef): string {
  return path.join(CONTENT_ROOT, def.contentDir);
}

function entryUrl(def: CollectionDef, slug: string): string {
  return def.routeBase ? `/${def.routeBase}/${slug}` : `/${slug}`;
}

function readMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .sort();
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, '');
}

// A slug of "rss.xml" inside any article collection would be shadowed by
// that collection's own /[collection]/rss.xml feed route — same 2-segment
// path depth, and Next.js always resolves the literal route.ts over the
// dynamic [slug] segment, so the content would exist but never be reachable
// at its own URL.
const RESERVED_SLUGS = new Set(['rss.xml']);

// Standalone pages render at the site root (/[slug]), so a page slug can't
// reuse anything else already living at that depth: a reserved top-level
// route, or another collection's routeBase (src/app/[collection]/page.tsx
// checks known collections before falling back to a standalone page, so a
// page slug matching one would always lose, silently).
const RESERVED_PAGE_SLUGS = new Set([
  'admin',
  'search',
  'search-index.json',
  'rss.xml',
  'sitemap.xml',
  'robots.txt',
  ...collections.filter((c) => c.routeBase).map((c) => c.routeBase as string),
]);

export function isReservedSlug(key: CollectionKey, slug: string): boolean {
  const reserved = key === 'pages' ? RESERVED_PAGE_SLUGS : RESERVED_SLUGS;
  return reserved.has(slug);
}

function filterReservedSlugs(key: CollectionKey, slugs: string[]): string[] {
  return slugs.filter((slug) => {
    if (!isReservedSlug(key, slug)) return true;
    console.warn(
      `[content] Skipping ${key}/${slug}.md — "${slug}" collides with a reserved route and ` +
        `would never be reachable at its own URL. Rename the file (or its CMS-set slug) to publish it.`
    );
    return false;
  });
}

export function getAllSlugs(key: CollectionKey): string[] {
  const def = getCollection(key);
  const slugs = readMarkdownFiles(collectionDir(def)).map(slugFromFilename);
  return filterReservedSlugs(key, slugs);
}

export function getEntryBySlug<F = ArticleFrontmatter>(
  key: CollectionKey,
  slug: string
): ContentEntry<F> | null {
  const def = getCollection(key);
  const dir = collectionDir(def);
  const mdPath = path.join(dir, `${slug}.md`);
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    collection: key,
    slug,
    frontmatter: data as F,
    content,
    readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
    url: entryUrl(def, slug),
    sourcePath: path.relative(process.cwd(), filePath),
  };
}

/**
 * Best available last-modified date for a content entry: an explicit
 * frontmatter `updated`/`date` field first (editorially controlled, works
 * regardless of clone depth), then the entry's last git commit date, then
 * the site launch date if neither is available.
 */
export function getContentLastModified(entry: ContentEntry<{ date?: string; updated?: string }>): Date {
  const explicit = entry.frontmatter.updated || entry.frontmatter.date;
  if (explicit) return new Date(explicit);
  return gitLastModified(entry.sourcePath) || SITE_LAUNCH_DATE;
}

export interface GetAllEntriesOptions {
  includeDrafts?: boolean;
}

export function getAllEntries(
  key: CollectionKey,
  opts: GetAllEntriesOptions = {}
): ContentEntry<ArticleFrontmatter>[] {
  const slugs = getAllSlugs(key);
  const entries = slugs
    .map((slug) => getEntryBySlug<ArticleFrontmatter>(key, slug))
    .filter((e): e is ContentEntry<ArticleFrontmatter> => e !== null)
    .filter((e) => opts.includeDrafts || !e.frontmatter.draft);

  return entries.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export function getAllArticleEntries(opts: GetAllEntriesOptions = {}): ContentEntry<ArticleFrontmatter>[] {
  return articleCollections
    .flatMap((def) => getAllEntries(def.key, opts))
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getEntriesByCategory(
  key: CollectionKey,
  category: string
): ContentEntry<ArticleFrontmatter>[] {
  return getAllEntries(key).filter(
    (e) => (e.frontmatter.category || '').toLowerCase() === category.toLowerCase()
  );
}

export function getEntriesByTag(key: CollectionKey, tag: string): ContentEntry<ArticleFrontmatter>[] {
  return getAllEntries(key).filter((e) =>
    (e.frontmatter.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllCategories(key: CollectionKey): string[] {
  const set = new Set<string>();
  getAllEntries(key).forEach((e) => e.frontmatter.category && set.add(e.frontmatter.category));
  return Array.from(set).sort();
}

export function getAllTags(key: CollectionKey): string[] {
  const set = new Set<string>();
  getAllEntries(key).forEach((e) => (e.frontmatter.tags || []).forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function getRelatedEntries(
  entry: ContentEntry<ArticleFrontmatter>,
  limit = 3
): ContentEntry<ArticleFrontmatter>[] {
  const pool = getAllEntries(entry.collection).filter((e) => e.slug !== entry.slug);
  const tags = new Set(entry.frontmatter.tags || []);

  const scored = pool.map((candidate) => {
    let score = 0;
    if (candidate.frontmatter.category && candidate.frontmatter.category === entry.frontmatter.category) {
      score += 2;
    }
    (candidate.frontmatter.tags || []).forEach((t) => {
      if (tags.has(t)) score += 1;
    });
    return { candidate, score };
  });

  const related = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.candidate);

  if (related.length >= limit) return related.slice(0, limit);

  const fallback = pool.filter((c) => !related.includes(c)).slice(0, limit - related.length);
  return [...related, ...fallback];
}

export function getPage(slug: string): ContentEntry<PageFrontmatter> | null {
  return getEntryBySlug<PageFrontmatter>('pages', slug);
}

export function getAllPageSlugs(): string[] {
  return getAllSlugs('pages');
}

export function getAllPageEntries(): ContentEntry<PageFrontmatter>[] {
  return getAllPageSlugs()
    .map((slug) => getPage(slug))
    .filter((e): e is ContentEntry<PageFrontmatter> => e !== null);
}
