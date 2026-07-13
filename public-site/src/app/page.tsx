import Link from 'next/link';
import Image from 'next/image';
import { collections } from '@/lib/collections';
import { getAllArticleEntries } from '@/lib/content';
import { site } from '@/lib/site';
import { ArticleCard } from '@/components/ArticleCard';
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
  {
    title: 'How it fits together',
    detail: 'Mind, Body, and Resilience are not separate projects. They work together as one practical rebuilding process.',
  },
];

const resilienceCycle = [
  { title: 'Prepare', detail: 'Build awareness, routines, and capacity before the next demanding period hits.' },
  { title: 'Respond', detail: 'Have a practical response for stressful weeks, pain spikes, burnout patterns, or life disruption.' },
  { title: 'Recover', detail: 'Return to steadier ground without all-or-nothing thinking or the pressure to start from zero.' },
  { title: 'Grow', detail: 'Learn from what worked so resilience becomes more deliberate, more practical, and more repeatable over time.' },
];

export default function HomePage() {
  const latest = getAllArticleEntries().slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <Image src="/brand/logo.svg" alt="TJR Mind & Body cycle mark logo" width={96} height={84} priority />
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
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Founder focus */}
        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-border bg-white p-7">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-navy">Founder story</p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight tracking-tight text-navy">
              Why {site.name} Exists
            </h2>
            <div className="space-y-4 text-ink-mid">
              <p>
                For most of Tim&rsquo;s career, he has helped organisations prepare for, respond to, and recover from
                disruption. Whether leading major incident response, operational resilience, or business continuity,
                the work has always been about helping people and systems keep functioning when the pressure is
                real.
              </p>
              <p>
                Outside of work, he has been learning a different kind of resilience. For more than 20 years, he has
                lived with chronic spinal pain, multiple surgeries, anxiety, setbacks, and the ongoing challenge of
                rebuilding health, confidence, and identity. There wasn&rsquo;t a single breakthrough or quick fix. It
                has been a long process of learning what genuinely helps, letting go of what does not, and finding
                ways to keep moving forward even when progress is slow.
              </p>
              <p>
                {site.name} was created where those two worlds meet. It brings together the discipline of
                operational resilience with the reality of everyday life, recognising that resilience is not about
                pushing harder or pretending everything is okay. It is about building practical habits, making
                thoughtful decisions, and creating systems that help you adapt when life does not go to plan.
              </p>
              <p>
                Whether someone is dealing with chronic pain, burnout, major life change, or simply feeling
                overwhelmed by competing demands, the aim is to help them build resilience that works in the real
                world, not just in theory.
              </p>
              <p className="font-medium text-navy">No hype. No unrealistic promises. Just practical tools, honest conversations, and steady progress.</p>
            </div>
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
            <h2 className="font-serif text-2xl font-bold tracking-tight text-navy">The three pillars</h2>
            <p className="mt-2 text-ink-mid">A simple structure that keeps the support focused and easy to understand.</p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-3xl border border-border bg-white p-5">
                <h3 className="mb-2 font-serif text-lg font-bold text-navy">{pillar.title}</h3>
                <p className="text-ink-mid">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Resilience cycle */}
        <section className="mt-6 rounded-[34px] border border-border bg-white/80">
          <div className="border-b border-border px-7 py-6">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-navy">The Resilience Cycle</h2>
            <p className="mt-2 text-ink-mid">
              The signature framework that runs through the coaching, education, and rebuilding approach.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {resilienceCycle.map((stage) => (
              <div key={stage.title} className="rounded-3xl border border-border bg-white p-5">
                <h3 className="mb-2 font-serif text-lg font-bold text-navy">{stage.title}</h3>
                <p className="text-ink-mid">{stage.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Magnet */}
        <LeadMagnetForm />

        {/* Contact */}
        <section className="mt-6 rounded-[34px] border border-border bg-white/80">
          <div className="border-b border-border px-7 py-6">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-navy">Contact</h2>
            <p className="mt-2 text-ink-mid">A simple place for people to reach out for support, coaching, or education enquiries.</p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-border bg-white p-6">
              <h3 className="mb-2 font-serif text-lg font-bold text-navy">Email</h3>
              <p className="text-ink-mid">For coaching, support, education, or collaboration enquiries, email:</p>
              <a
                href="mailto:support@tjrmindbody.com"
                className="mt-3 inline-block border-b border-navy/25 font-bold text-navy"
              >
                support@tjrmindbody.com
              </a>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6">
              <h3 className="mb-2 font-serif text-lg font-bold text-navy">Approach</h3>
              <p className="text-ink-mid">
                This brand is about practical resilience, self-management, support, and steady rebuilding. It is
                not positioned as treatment, cure, or medical advice.
              </p>
            </div>
          </div>
        </section>

        {/* Explore + Latest (dynamic, CMS-backed) */}
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-navy">Explore</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections
              .filter((c) => c.routeBase)
              .map((c) => (
                <Link
                  key={c.key}
                  href={`/${c.routeBase}`}
                  className="rounded-lg border border-border bg-white p-5 hover:border-teal"
                >
                  <h3 className="font-medium text-navy">{c.label}</h3>
                  <p className="mt-1 text-sm text-ink-light">{c.description}</p>
                </Link>
              ))}
          </div>
        </section>

        {latest.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-serif text-2xl font-bold text-navy">Latest</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((entry) => (
                <ArticleCard key={`${entry.collection}:${entry.slug}`} entry={entry} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
