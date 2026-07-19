import Link from 'next/link';
import Image from 'next/image';
import type { ArticleFrontmatter, ContentEntry } from '@/lib/content';

export function ArticleCard({ entry }: { entry: ContentEntry<ArticleFrontmatter> }) {
  const { frontmatter, url } = entry;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-white">
      {frontmatter.featuredImage && (
        <Link href={url} className="relative block aspect-[16/9] w-full">
          <Image
            src={frontmatter.featuredImage}
            alt={frontmatter.featuredImageAlt || frontmatter.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          {(frontmatter.contentType || frontmatter.category) && (
            <span className="text-xs font-semibold uppercase tracking-wide text-blue">
              {frontmatter.contentType || frontmatter.category}
            </span>
          )}
          {frontmatter.journeyStage && (
            <span className="rounded-full bg-blue-pale px-2 py-0.5 text-xs font-medium text-blue">
              {frontmatter.journeyStage}
            </span>
          )}
          {frontmatter.attachment && (
            <span className="rounded-full bg-blue-pale px-2 py-0.5 text-xs font-medium text-blue">
              Download
            </span>
          )}
          {frontmatter.revsPillar && (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-navy">
              {frontmatter.revsPillar}
            </span>
          )}
        </div>
        <h3 className="font-serif text-lg font-semibold text-navy">
          <Link href={url} className="hover:text-blue">
            {frontmatter.title}
          </Link>
        </h3>
        {frontmatter.excerpt && (
          <p className="mt-2 flex-1 text-sm text-ink-mid">{frontmatter.excerpt}</p>
        )}
        {frontmatter.capacitySystems && frontmatter.capacitySystems.length > 0 && (
          <p className="mt-3 text-xs text-ink-light">
            {frontmatter.capacitySystems.slice(0, 3).join(' • ')}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-light">
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span>{entry.readingTimeMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
