import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collections, getCollectionByRouteBase } from '@/lib/collections';
import {
  getAllEntries,
  getAllCategories,
  getAllTags,
  getInstagramHighlights,
  getPage,
  getAllPageSlugs,
} from '@/lib/content';
import { paginate } from '@/lib/pagination';
import { buildMetadata } from '@/lib/seo';
import { CollectionListing } from '@/components/CollectionListing';
import { InstagramHighlights } from '@/components/InstagramHighlights';
import { MarkdownContent } from '@/lib/mdx';

export function generateStaticParams() {
  const collectionSlugs = collections.filter((c) => c.routeBase).map((c) => ({ collection: c.routeBase as string }));
  const pageSlugs = getAllPageSlugs().map((slug) => ({ collection: slug }));
  return [...collectionSlugs, ...pageSlugs];
}

export function generateMetadata({ params }: { params: { collection: string } }): Metadata {
  const def = getCollectionByRouteBase(params.collection);
  if (def) {
    return buildMetadata({
      title: def.label,
      description: def.description,
      path: `/${def.routeBase}`,
    });
  }

  const page = getPage(params.collection);
  if (page) {
    return buildMetadata({
      title: page.frontmatter.title,
      description: page.frontmatter.seo?.description || '',
      path: page.url,
      seo: page.frontmatter.seo,
    });
  }

  return {};
}

export default function CollectionOrPageRoute({ params }: { params: { collection: string } }) {
  const def = getCollectionByRouteBase(params.collection);

  if (def) {
    const entries = getAllEntries(def.key);
    const { items, currentPage, totalPages } = paginate(entries, 1);
    const instagramHighlights = def.key === 'library' ? getInstagramHighlights(3) : [];

    return (
      <>
        <CollectionListing
          def={def}
          heading={def.label}
          description={def.description}
          entries={items}
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/${def.routeBase}`}
          categories={getAllCategories(def.key)}
          tags={getAllTags(def.key)}
        />
        {def.key === 'library' && instagramHighlights.length > 0 && (
          <div className="mx-auto max-w-5xl px-4 pb-16">
            <InstagramHighlights highlights={instagramHighlights} className="mt-0" />
          </div>
        )}
      </>
    );
  }

  const page = getPage(params.collection);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="overflow-hidden rounded-[34px] border border-border bg-gradient-to-br from-white via-offwhite to-blue-pale/50 shadow-[0_18px_50px_rgba(27,54,93,0.08)]">
        <div className="border-b border-border px-6 py-8 sm:px-8 sm:py-10">
          <div className="mt-3 max-w-3xl">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-5xl">
              {page.frontmatter.title}
            </h1>
            {page.frontmatter.seo?.description && (
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink-mid sm:text-lg">
                {page.frontmatter.seo.description}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-p:leading-8 prose-li:leading-7 prose-blockquote:border-l-gold prose-blockquote:bg-white/70 prose-blockquote:py-1 prose-blockquote:font-medium">
            <MarkdownContent content={page.content} />
          </div>
        </div>
      </div>
    </article>
  );
}
