import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'REVS Program',
  description: 'A public path into the REVS Program, stages, and assessment pages.',
  robots: { index: false, follow: false },
};

const links = [
  {
    href: '/coaching',
    title: '1:1 Coaching',
    body: 'Personal support for working through capacity with REVS.',
  },
  {
    href: '/stages',
    title: 'The Four Stages',
    body: 'A deeper explainer for Recognise, Regulate, Rebuild, and Redesign.',
  },
  {
    href: '/assessment',
    title: 'Assessment',
    body: 'A low-load assessment to help you find a kind starting point.',
  },
];

export default function RevsPublicHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl font-bold text-navy dark:text-white">REVS Program</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          Start here if you want the REVS way of working in one place. The four stages explain the model, the assessment helps you find your
          starting point, and coaching is here if you want it personalised.
        </p>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Why the program is structured this way</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p>
            You did not become depleted overnight. Capacity usually shifts over time, through pressure, adaptation, and the slow build-up of strain.
          </p>
          <p>
            The REVS Program gives that process a clear shape. It helps you understand what is happening, build steadier rhythms, and make
            decisions that fit your actual life.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Recognise</h2>
          <p className="mt-1 text-sm font-semibold text-ink-mid dark:text-slate-300">Build language and understanding</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              Recognise helps you see what is actually happening in your body and your life. It cuts through the fog so you can understand what is
              connected and what is asking for care.
            </p>
            <p>
              You begin to notice the 12 interconnected capacity systems, your personal pattern, and the early signs that things are shifting.
            </p>
            <p>
              The aim is to stop self-blame and start seeing the system you are working with.
            </p>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Regulate</h2>
          <p className="mt-1 text-sm font-semibold text-ink-mid dark:text-slate-300">Develop tools to manage your nervous system</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              Regulate is where you begin to steady the system through practices that fit how you work.
            </p>
            <p>
              You build a sustainable pacing rhythm, develop a personal regulation toolkit, and learn how pain, fatigue, and nervous system state
              affect each other.
            </p>
            <p>
              This stage is about helping life feel more workable again.
            </p>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Rebuild</h2>
          <p className="mt-1 text-sm font-semibold text-ink-mid dark:text-slate-300">Expand capacity intentionally and sustainably</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              Rebuild is where you grow capacity without pushing hard or crashing. It combines pacing with deeper regulation.
            </p>
            <p>
              You design an expansion rhythm, navigate plateaus and setbacks, and expand at a pace your system can actually hold.
            </p>
            <p>
              This is where many people have felt stuck before, and REVS gives you a different way through.
            </p>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Redesign</h2>
          <p className="mt-1 text-sm font-semibold text-ink-mid dark:text-slate-300">Align your life with what you have learned</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              Redesign is where you use what you have learned to make decisions about work, relationships, and commitments.
            </p>
            <p>
              You build a life that works with your system rather than against it and create patterns that can last.
            </p>
            <p>
              This stage shifts the focus from coping to changing the conditions around you.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {links.map((link) => (
          <article key={link.href} className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">{link.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">{link.body}</p>
            <div className="mt-4">
              <Link href={link.href} className="inline-flex rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
                Learn more
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
