import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'REVS Foundation',
  description: 'What REVS is and why it works.',
  robots: { index: false, follow: false },
};

export default function RevsFoundationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Foundation</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-white">What REVS is and why it works</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          REVS is a capacity-aware recovery framework for people whose foundational capacity is compromised by chronic pain, neurodivergence, burnout, sensory overload, or long-term illness.
        </p>
        <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Why REVS exists</p>
          <p className="mt-2">
            Unlike generic wellness advice that ignores real limits, REVS starts from three core realities: capacity depletion is physiological, nervous system state determines what is possible, and sustainable change requires slow, consistent integration rather than heroic effort.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">What is REVS?</h2>
          <div className="mt-3 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              REVS (Resilience Explained Visually System) is a capacity-aware recovery framework designed for people whose foundational capacity is compromised.
            </p>
            <p>
              It maps 12 interconnected capacity systems and shows how they rebuild together, not in isolation. It is built for people who have tried to push harder, crashed, and need a different approach.
            </p>
            <p>
              Capacity depletion is not a character flaw. Nervous system state changes what is possible. Sustainable change comes from slow integration, not heroic effort.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">The four stages</h2>
          <div className="mt-3 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <div>
              <p className="font-semibold text-navy dark:text-white">Recognise</p>
              <p className="mt-1">
                Build language and understanding. Map the 12 capacity systems and learn personal patterns, warning signs, and what dysregulates the system.
              </p>
            </div>
            <div>
              <p className="font-semibold text-navy dark:text-white">Regulate</p>
              <p className="mt-1">
                Develop tools to manage the nervous system, create pacing that actually prevents overload, and stabilise at the current capacity level.
              </p>
            </div>
            <div>
              <p className="font-semibold text-navy dark:text-white">Rebuild</p>
              <p className="mt-1">
                Expand capacity intentionally and sustainably by combining pacing with deeper regulation, then navigate plateaus without crashing.
              </p>
            </div>
            <div>
              <p className="font-semibold text-navy dark:text-white">Redesign</p>
              <p className="mt-1">
                Align work, relationships, and commitments with what the capacity map shows, so life works with the system rather than against it.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/revs-v3/stages" className="inline-flex rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
              Read the full four-stage guide
            </Link>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Next Step</h2>
          <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">
            Take the REVS Assessment. It is a three-part system that takes 10-15 minutes.
          </p>
          <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">
            First, answer questions about your current situation to identify which stage you are ready for
            ({` `}Recognise, Regulate, or Rebuild{` `}). Then map your 12 interconnected capacity systems to see which are most depleted and how
            they are connected. Finally, get personalised recommendations based on your answers so you can see which REVS concepts matter most for your
            situation.
          </p>
          <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">
            No diagnostic testing. Not medical advice. Just clarity on where you are and what to focus on first.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/assessment" className="inline-flex rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
              Take the REVS Assessment
            </Link>
            <Link href="/revs-v3" className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-semibold dark:border-white/10">
              Back to overview
            </Link>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            Admin cue: treat this page as the canonical framework intro
          </p>
        </div>
      </section>
    </div>
  );
}
