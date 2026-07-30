import Image from 'next/image';
import type { ContentEntry, InstagramHighlightFrontmatter } from '@/lib/content';

const instagramUrl = 'https://www.instagram.com/tjrmindbody/';

export function InstagramHighlights({
  highlights,
  className = 'mt-16',
}: {
  highlights: ContentEntry<InstagramHighlightFrontmatter>[];
  className?: string;
}) {
  return (
    <section className={`${className} rounded-[34px] border border-border bg-white/80`}>
      <div className="flex flex-col gap-4 border-b border-border px-7 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-teal">From Instagram</p>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-navy">Small moments from the work</h2>
          <p className="mt-2 max-w-2xl text-ink-mid">
            Selected posts from @tjrmindbody, curated here rather than pulled in as a fragile live feed.
          </p>
        </div>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-navy-deep"
        >
          Follow on Instagram
        </a>
      </div>

      {highlights.length > 0 ? (
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {highlights.map((highlight) => (
            <a
              key={highlight.slug}
              href={highlight.frontmatter.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-3xl border border-border bg-white hover:border-teal"
            >
              {highlight.frontmatter.image ? (
                <div className="relative aspect-square overflow-hidden bg-blue-pale">
                  <Image
                    src={highlight.frontmatter.image}
                    alt={highlight.frontmatter.imageAlt || highlight.frontmatter.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 90vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-navy to-teal p-6 text-center text-white">
                  <span className="font-serif text-xl font-bold leading-tight">{highlight.frontmatter.title}</span>
                </div>
              )}
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold leading-tight text-navy">
                  {highlight.frontmatter.title}
                </h3>
                {highlight.frontmatter.caption && (
                  <p className="mt-2 line-clamp-3 text-sm text-ink-mid">{highlight.frontmatter.caption}</p>
                )}
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue">View on Instagram</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="p-6">
          <div className="rounded-3xl border border-dashed border-border bg-white p-6 text-ink-mid">
            Add Instagram Highlights in the CMS by pasting selected post URLs. They will appear here automatically
            after publishing.
          </div>
        </div>
      )}
    </section>
  );
}
