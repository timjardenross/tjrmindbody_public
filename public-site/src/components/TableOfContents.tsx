import type { TocEntry } from '@/lib/toc';

export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  if (toc.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-lg border border-border bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-light">
        On this page
      </h2>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li key={item.slug} className={item.depth === 3 ? 'pl-4' : undefined}>
            <a href={`#${item.slug}`} className="text-ink-mid hover:text-blue">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
