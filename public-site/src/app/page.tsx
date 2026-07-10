import Link from 'next/link';
import { collections } from '@/lib/collections';
import { getAllArticleEntries } from '@/lib/content';
import { site } from '@/lib/site';
import { ArticleCard } from '@/components/ArticleCard';

const pillars = [
  {
    title: 'Support',
    detail: 'Grounded support for people navigating chronic stress, burnout, pain, disruption, and demanding seasons of life.',
  },
  {
    title: 'Coaching',
    detail: 'Practical resilience coaching focused on useful next steps, not motivational noise or all-or-nothing change.',
  },
  {
    title: 'Education',
    detail: 'Plain-English tools and frameworks that help people rebuild capacity, confidence, and steadier day-to-day systems.',
  },
];

export default function HomePage() {
  const latest = getAllArticleEntries().slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="mb-16 max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-navy sm:text-5xl">{site.name}</h1>
        <p className="mt-4 text-lg text-ink-mid">{site.tagline}</p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/blog"
            className="rounded-md bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-navy-deep"
          >
            Read the blog
          </Link>
          <Link
            href="/lets-chat"
            className="rounded-md border border-navy px-5 py-3 text-sm font-medium text-navy hover:bg-blue-pale"
          >
            Let&apos;s chat
          </Link>
        </div>
      </section>

      <section className="mb-16 grid gap-4 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-lg border border-border bg-white p-5">
            <h3 className="font-medium text-navy">{pillar.title}</h3>
            <p className="mt-1 text-sm text-ink-light">{pillar.detail}</p>
          </div>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-navy">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections
            .filter((c) => c.routeBase)
            .map((c) => (
              <Link
                key={c.key}
                href={`/${c.routeBase}`}
                className="rounded-lg border border-border bg-white p-5 hover:border-blue"
              >
                <h3 className="font-medium text-navy">{c.label}</h3>
                <p className="mt-1 text-sm text-ink-light">{c.description}</p>
              </Link>
            ))}
        </div>
      </section>

      {latest.length > 0 && (
        <section>
          <h2 className="mb-6 font-serif text-2xl font-semibold text-navy">Latest</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((entry) => (
              <ArticleCard key={`${entry.collection}:${entry.slug}`} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
