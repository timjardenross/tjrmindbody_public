import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collections, getCollectionByRouteBase } from '@/lib/collections';
import { getAllCategories, getAllTags, getEntriesByCategory } from '@/lib/content';
import { paginate } from '@/lib/pagination';
import { buildMetadata } from '@/lib/seo';
import { CollectionListing } from '@/components/CollectionListing';

interface RouteParams {
  collection: string;
  category: string;
}

export function generateStaticParams() {
  return collections
    .filter((c) => c.routeBase && c.isArticleType)
    .flatMap((c) =>
      getAllCategories(c.key).map((category) => ({
        collection: c.routeBase as string,
        category: encodeURIComponent(category),
      }))
    );
}

export function generateMetadata({ params }: { params: RouteParams }): Metadata {
  const def = getCollectionByRouteBase(params.collection);
  if (!def) return {};
  const category = decodeURIComponent(params.category);
  return buildMetadata({
    title: `${category} — ${def.label}`,
    description: `${def.label} in the ${category} category.`,
    path: `/${def.routeBase}/category/${params.category}`,
  });
}

export default function CategoryPage({ params }: { params: RouteParams }) {
  const def = getCollectionByRouteBase(params.collection);
  if (!def) notFound();

  const category = decodeURIComponent(params.category);
  const entries = getEntriesByCategory(def.key, category);
  if (entries.length === 0) notFound();

  const { items, currentPage, totalPages } = paginate(entries, 1);

  return (
    <CollectionListing
      def={def}
      heading={`${category} — ${def.label}`}
      entries={items}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/${def.routeBase}/category/${params.category}`}
      categories={getAllCategories(def.key)}
      tags={getAllTags(def.key)}
    />
  );
}
