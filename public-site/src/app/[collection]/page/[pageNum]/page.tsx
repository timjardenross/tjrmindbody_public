import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collections, getCollectionByRouteBase } from '@/lib/collections';
import { getAllCategories, getAllEntries, getAllTags } from '@/lib/content';
import { paginate, PAGE_SIZE } from '@/lib/pagination';
import { buildMetadata } from '@/lib/seo';
import { CollectionListing } from '@/components/CollectionListing';

interface RouteParams {
  collection: string;
  pageNum: string;
}

export function generateStaticParams() {
  return collections
    .filter((c) => c.routeBase && c.isArticleType)
    .flatMap((c) => {
      const total = Math.max(1, Math.ceil(getAllEntries(c.key).length / PAGE_SIZE));
      return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
        collection: c.routeBase as string,
        pageNum: String(i + 2),
      }));
    });
}

export function generateMetadata({ params }: { params: RouteParams }): Metadata {
  const def = getCollectionByRouteBase(params.collection);
  if (!def) return {};
  return buildMetadata({
    title: `${def.label} — Page ${params.pageNum}`,
    description: def.description,
    path: `/${def.routeBase}/page/${params.pageNum}`,
  });
}

export default function CollectionPaginatedPage({ params }: { params: RouteParams }) {
  const def = getCollectionByRouteBase(params.collection);
  if (!def) notFound();

  const pageNum = Number(params.pageNum);
  if (!Number.isInteger(pageNum) || pageNum < 2) notFound();

  const entries = getAllEntries(def.key);
  const { items, currentPage, totalPages } = paginate(entries, pageNum);
  if (pageNum > totalPages) notFound();

  return (
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
  );
}
