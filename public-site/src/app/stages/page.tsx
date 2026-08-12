import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'The Four Stages',
  description: 'A deeper explainer for the four REVS stages.',
  robots: { index: false, follow: false },
};

const stages = [
  { title: 'Recognise', image: '/images/revs-stages/recognise.png' },
  { title: 'Regulate', image: '/images/revs-stages/regulate.png' },
  { title: 'Rebuild', image: '/images/revs-stages/rebuild.png' },
  { title: 'Redesign', image: '/images/revs-stages/redesign.png' },
];

export default function StagesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/revs" className="font-semibold text-teal">
          REVS Program
        </Link>
        <span className="text-ink-mid dark:text-slate-400">/</span>
        <span className="text-ink-mid dark:text-slate-300">Four Stages</span>
      </div>
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl font-bold text-navy dark:text-white">The four stages of REVS</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          Recovery is not a single fix. The REVS stages are a way of understanding what is happening now, what needs to steady first, where growth
          is realistically possible, and when it is time to change the conditions around you.
        </p>
        <div className="mt-6 space-y-5 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p>
            You didn&apos;t become depleted overnight. Your capacity system did not break in one moment. It unraveled over time through accumulated pressure,
            dysregulation, and pushing beyond what your nervous system could sustain.
          </p>
          <p>
            REVS is built for people who have tried everything, crashed from pushing too hard, and need a different way of moving forward.
          </p>
          <p className="font-semibold text-navy dark:text-white">The four stages are not a ladder. They are a sequence for making sense of change.</p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {stages.map((stage) => (
          <article key={stage.title} className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <Image
              src={stage.image}
              alt={`${stage.title} stage illustration`}
              width={1200}
              height={1600}
              className="h-auto w-full rounded-[1.25rem]"
            />
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">What comes next</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          If the four-stage model makes sense, the next step is the assessment. That helps REVS map your current capacity and suggest the best place to begin.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/assessment" className="inline-flex rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
            Take the REVS Assessment
          </Link>
          <Link href="/revs" className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-semibold dark:border-white/10">
            Back to REVS Program
          </Link>
        </div>
      </section>
    </div>
  );
}
