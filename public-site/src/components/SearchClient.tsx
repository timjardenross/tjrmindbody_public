'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import MiniSearch from 'minisearch';
import type { SearchDocument } from '@/lib/search';

export function SearchClient() {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<SearchDocument[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchDocument[]) => {
        if (!cancelled) setDocuments(data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const index = useMemo(() => {
    if (!documents) return null;
    const mini = new MiniSearch<SearchDocument>({
      fields: ['title', 'excerpt', 'tags'],
      storeFields: ['title', 'excerpt', 'url', 'collectionLabel'],
      searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
    });
    mini.addAll(documents);
    return mini;
  }, [documents]);

  const results = useMemo(() => {
    if (!index || query.trim().length < 2) return [];
    return index.search(query);
  }, [index, query]);

  return (
    <div>
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the Library..."
        className="w-full rounded-md border border-border px-4 py-3 text-ink focus:border-blue focus:outline-none"
        autoFocus
      />

      {!documents && <p className="mt-6 text-ink-light">Loading search index...</p>}

      {documents && query.trim().length >= 2 && (
        <p className="mt-6 text-sm text-ink-light">
          {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
        </p>
      )}

      <ul className="mt-4 space-y-4">
        {results.map((result) => (
          <li key={result.id} className="rounded-lg border border-border bg-white p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue">
              {result.collectionLabel as string}
            </span>
            <h2 className="mt-1 font-serif text-lg font-semibold text-navy">
              <Link href={result.url as string} className="hover:text-blue">
                {result.title as string}
              </Link>
            </h2>
            {result.excerpt ? <p className="mt-1 text-sm text-ink-mid">{result.excerpt as string}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
