import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { CollectionDef, CollectionKey, articleCollections, getCollection } from './collections';

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
  tags?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  author?: string;
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

export function getAllSlugs(key: CollectionKey): string[] {
  const def = getCollection(key);
  return readMarkdownFiles(collectionDir(def)).map(slugFromFilename);
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
  };
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
