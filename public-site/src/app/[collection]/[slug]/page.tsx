import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { collections, getCollectionByRouteBase } from '@/lib/collections';
import { getAllSlugs, getEntryBySlug, getRelatedEntries } from '@/lib/content';
import { extractToc } from '@/lib/toc';
import { MarkdownContent } from '@/lib/mdx';
import { buildMetadata, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { TableOfContents } from '@/components/TableOfContents';
import { ArticleCard } from '@/components/ArticleCard';

interface RouteParams {
  collection: string;
  slug: string;
}

export function generateStaticParams() {
  return collections
    .filter((c) => c.routeBase)
    .flatMap((c) => getAllSlugs(c.key).map((slug) => ({ collection: c.routeBase as string, slug })));
}

function loadEntry(params: RouteParams) {
  const def = getCollectionByRouteBase(params.collection);
  if (!def || !def.isArticleType) return null;
  const entry = getEntryBySlug(def.key, params.slug);
  if (!entry || entry.frontmatter.draft) return null;
  return { def, entry };
}

export function generateMetadata({ params }: { params: RouteParams }): Metadata {
  const loaded = loadEntry(params);
  if (!loaded) return {};
  const { entry } = loaded;

  return buildMetadata({
    title: entry.frontmatter.title,
    description: entry.frontmatter.excerpt,
    path: entry.url,
    seo: entry.frontmatter.seo,
    image: entry.frontmatter.featuredImage,
    type: 'article',
    publishedTime: entry.frontmatter.date,
    modifiedTime: entry.frontmatter.updated || entry.frontmatter.date,
    tags: entry.frontmatter.tags,
  });
}

export default function ArticlePage({ params }: { params: RouteParams }) {
  const loaded = loadEntry(params);
  if (!loaded) notFound();
  const { def, entry } = loaded;

  const toc = extractToc(entry.content);
  const related = getRelatedEntries(entry, 3);
  const jsonLd = articleJsonLd(entry, def.label);
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: def.label, path: `/${def.routeBase}` },
    { name: entry.frontmatter.title, path: entry.url },
  ]);

  return (
    <article className="mx-auto max-w-5xl px-4 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-light">
        <Link href="/" className="hover:text-blue">
          Home
        </Link>{' '}
        &rsaquo;{' '}
        <Link href={`/${def.routeBase}`} className="hover:text-blue">
          {def.label}
        </Link>{' '}
        &rsaquo; <span className="text-ink-mid">{entry.frontmatter.title}</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        {entry.frontmatter.category && (
          <Link
            href={`/${def.routeBase}/category/${encodeURIComponent(entry.frontmatter.category)}`}
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-wide text-blue"
          >
            {entry.frontmatter.category}
          </Link>
        )}
        <h1 className="font-serif text-3xl font-semibold text-navy sm:text-4xl">
          {entry.frontmatter.title}
        </h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-light">
          {entry.frontmatter.author && <span>{entry.frontmatter.author}</span>}
          <span aria-hidden="true">&middot;</span>
          <time dateTime={entry.frontmatter.date}>
            {new Date(entry.frontmatter.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span>{entry.readingTimeMinutes} min read</span>
        </div>
      </header>

      {entry.frontmatter.featuredImage && (
        <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={entry.frontmatter.featuredImage}
            alt={entry.frontmatter.featuredImageAlt || entry.frontmatter.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="prose prose-slate max-w-none">
          <MarkdownContent content={entry.content} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <TableOfContents toc={toc} />
          {entry.frontmatter.tags && entry.frontmatter.tags.length > 0 && (
            <div className="rounded-lg border border-border bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-light">Tags</h2>
              <div className="flex flex-wrap gap-2 text-sm">
                {entry.frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${def.routeBase}/tag/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-blue-pale px-3 py-1 text-blue hover:bg-blue hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-navy">Related {def.label}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.slug} entry={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
