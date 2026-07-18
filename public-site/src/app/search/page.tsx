import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SearchClient } from '@/components/SearchClient';

export const metadata: Metadata = buildMetadata({
  title: 'Search',
  description: 'Search TJR HQ articles, guides, REVS articles, insights and resources.',
  path: '/search',
});

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">Search</h1>
      <SearchClient />
    </div>
  );
}
