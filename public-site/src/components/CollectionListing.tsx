import Link from 'next/link';
import type { CollectionDef } from '@/lib/collections';
import type { ArticleFrontmatter, ContentEntry } from '@/lib/content';
import { ArticleCard } from './ArticleCard';
import { Pagination } from './Pagination';

export function CollectionListing({
  def,
  heading,
  description,
  entries,
  currentPage,
  totalPages,
  basePath,
  categories,
  tags,
}: {
  def: CollectionDef;
  heading: string;
  description?: string;
  entries: ContentEntry<ArticleFrontmatter>[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  categories?: string[];
  tags?: string[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-navy sm:text-4xl">{heading}</h1>
        {description && <p className="mt-3 text-ink-mid">{description}</p>}
      </header>

      {(categories?.length || tags?.length) ? (
        <div className="mb-10 flex flex-wrap gap-6 text-sm">
          {categories && categories.length > 0 && (
            <div>
              <span className="mr-2 font-semibold text-ink-light">Categories:</span>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/${def.routeBase}/category/${encodeURIComponent(c)}`}
                  className="mr-3 text-blue hover:underline"
                >
                  {c}
                </Link>
              ))}
            </div>
          )}
          {tags && tags.length > 0 && (
            <div>
              <span className="mr-2 font-semibold text-ink-light">Tags:</span>
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/${def.routeBase}/tag/${encodeURIComponent(t)}`}
                  className="mr-3 text-blue hover:underline"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {entries.length === 0 ? (
        <p className="text-ink-light">Nothing published here yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <ArticleCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}

      <Pagination basePath={basePath} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
