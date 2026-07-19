import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collections, getCollectionByRouteBase } from '@/lib/collections';
import { getAllCategories, getAllTags, getEntriesByTag } from '@/lib/content';
import { paginate } from '@/lib/pagination';
import { buildMetadata } from '@/lib/seo';
import { CollectionListing } from '@/components/CollectionListing';

interface RouteParams {
  collection: string;
  tag: string;
}

export function generateStaticParams() {
  return collections
    .filter((c) => c.routeBase && c.isArticleType)
    .flatMap((c) =>
      getAllTags(c.key).map((tag) => ({ collection: c.routeBase as string, tag: encodeURIComponent(tag) }))
    );
}

export function generateMetadata({ params }: { params: RouteParams }): Metadata {
  const def = getCollectionByRouteBase(params.collection);
  if (!def) return {};
  const tag = decodeURIComponent(params.tag);
  return buildMetadata({
    title: `#${tag} — ${def.label}`,
    description: `${def.label} tagged #${tag}.`,
    path: `/${def.routeBase}/tag/${params.tag}`,
  });
}

export default function TagPage({ params }: { params: RouteParams }) {
  const def = getCollectionByRouteBase(params.collection);
  if (!def) notFound();

  const tag = decodeURIComponent(params.tag);
  const entries = getEntriesByTag(def.key, tag);
  if (entries.length === 0) notFound();

  const { items, currentPage, totalPages } = paginate(entries, 1);

  return (
    <CollectionListing
      def={def}
      heading={`#${tag} — ${def.label}`}
      entries={items}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/${def.routeBase}/tag/${params.tag}`}
      categories={getAllCategories(def.key)}
      tags={getAllTags(def.key)}
    />
  );
}
