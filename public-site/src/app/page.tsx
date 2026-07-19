import Link from 'next/link';
import Image from 'next/image';
import { getAllArticleEntries, getInstagramHighlights } from '@/lib/content';
import { site } from '@/lib/site';
import { ArticleCard } from '@/components/ArticleCard';
import { InstagramHighlights } from '@/components/InstagramHighlights';
import { LeadMagnetForm } from '@/components/LeadMagnetForm';

const pillars = [
  {
    title: 'Mind',
    detail: 'Support for stress, coping, emotional steadiness, and staying grounded through demanding periods.',
  },
  {
    title: 'Body',
    detail: 'Support for movement, sleep, nutrition, recovery, and the day-to-day habits that make rebuilding more sustainable.',
  },
  {
    title: 'Resilience',
    detail: 'Support for self-management, steady habits, adaptability, and staying engaged when life becomes disrupted.',
  },
];

export default function HomePage() {
  const latest = getAllArticleEntries().slice(0, 6);
  const instagramHighlights = getInstagramHighlights(3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <Image src="/brand/logo.svg" alt="TJR Mind & Body mark" width={96} height={96} priority />
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal">Mind. Body. Resilience.</p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-[1.02] tracking-tight text-navy sm:text-6xl">
              Build resilience that actually works in real life
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink sm:text-lg">
            Stop pushing through pain, burnout, and disruption. Stop all-or-nothing thinking. Start building practical systems that help you stay steady through chronic stress, demanding work, and whatever life throws at you.
          </p>
          <p className="mx-auto mt-5 max-w-2xl border-t border-border pt-4 text-sm font-semibold leading-6 text-navy">
            Practical coaching grounded in lived experience—not motivational noise.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/library"
              className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              Explore the Library
            </Link>
            <Link
              href="/lets-chat"
              className="rounded-lg border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:border-teal"
            >
              Let&apos;s Chat
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Founder snapshot */}
        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[28px] border border-border bg-white p-7">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-navy">Why this exists</p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight tracking-tight text-navy">
              Practical resilience, grounded in lived experience
            </h2>
            <div className="space-y-4 text-ink-mid">
              <p>
                {site.name} brings together Tim&apos;s professional background in operational resilience with the
                personal reality of rebuilding through chronic pain, surgery, anxiety, setbacks, and demanding
                seasons of life.
              </p>
              <p>
                The aim is simple: help people build steadier systems for real life, without hype, shame, or
                all-or-nothing pressure.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex rounded-lg border border-navy/20 px-5 py-3 text-sm font-semibold text-navy hover:border-teal"
            >
              Read the founder story
            </Link>
          </div>

          <div className="grid gap-2.5 rounded-[28px] border border-border bg-gradient-to-br from-navy to-teal p-6 text-white">
            <div className="grid grid-cols-[1.05fr_0.95fr] gap-2.5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] border border-white/15">
                <Image
                  src="/images/founder/founder-portrait.jpg"
                  alt="Tim seated in a reflective setting during a rebuilding stage"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 260px, 40vw"
                />
              </div>
              <div className="grid grid-rows-2 gap-2.5">
                <div className="relative overflow-hidden rounded-[22px] border border-white/15">
                  <Image
                    src="/images/founder/founder-recovery.jpg"
                    alt="Tim in hospital after surgery during a difficult stage of recovery"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 220px, 40vw"
                  />
                </div>
                <div className="relative overflow-hidden rounded-[22px] border border-white/15">
                  <Image
                    src="/images/founder/founder-with-dog.jpg"
                    alt="Tim in a relaxed moment with his dog"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 220px, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three pillars */}
        <section className="mt-10 rounded-[34px] border border-border bg-white/80">
          <div className="border-b border-border px-7 py-6">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-navy">Mind. Body. Resilience.</h2>
            <p className="mt-2 text-ink-mid">
              A simple structure for making support practical, understandable, and easier to keep using.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-3xl border border-border bg-white p-5">
                <h3 className="mb-2 font-serif text-lg font-bold text-navy">{pillar.title}</h3>
                <p className="text-ink-mid">{pillar.detail}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-7 py-5">
            <Link href="/approach" className="text-sm font-semibold text-blue hover:underline">
              See the approach and Resilience Cycle
            </Link>
          </div>
        </section>

        {/* Lead Magnet */}
        <LeadMagnetForm />

        <section className="mt-10 rounded-[34px] border border-border bg-navy p-7 text-white">
          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-teal">Start somewhere steady</p>
              <h2 className="font-serif text-2xl font-bold tracking-tight">Choose the next useful step</h2>
              <p className="mt-2 text-white/75">
                Read practical resources, learn the approach, or get in touch if you want to talk through support,
                coaching, education, or collaboration.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link href="/library" className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-navy hover:bg-blue-pale">
                Visit Library
              </Link>
              <Link href="/lets-chat" className="rounded-lg border border-white/25 px-5 py-3 text-center text-sm font-semibold text-white hover:border-teal">
                Let&apos;s Chat
              </Link>
            </div>
          </div>
        </section>

        {latest.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-serif text-2xl font-bold text-navy">Latest from the Library</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((entry) => (
                <ArticleCard key={`${entry.collection}:${entry.slug}`} entry={entry} />
              ))}
            </div>
          </section>
        )}

        <InstagramHighlights highlights={instagramHighlights} />
      </div>
    </div>
  );
}
