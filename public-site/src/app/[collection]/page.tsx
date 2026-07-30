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
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
        {page.frontmatter.title}
      </h1>
      <div className="prose prose-slate max-w-none">
        <MarkdownContent content={page.content} />
      </div>
    </article>
  );
}
