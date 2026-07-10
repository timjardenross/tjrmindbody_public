import { searchableCollections } from './collections';
import { getAllEntries } from './content';

export interface SearchDocument {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  collection: string;
  collectionLabel: string;
  tags: string[];
}

/** Builds the flat document list the client-side MiniSearch index is built from. */
export function buildSearchDocuments(): SearchDocument[] {
  return searchableCollections.flatMap((def) =>
    getAllEntries(def.key).map((entry) => ({
      id: `${def.key}:${entry.slug}`,
      title: entry.frontmatter.title,
      excerpt: entry.frontmatter.excerpt || '',
      url: entry.url,
      collection: def.key,
      collectionLabel: def.label,
      tags: entry.frontmatter.tags || [],
    }))
  );
}
