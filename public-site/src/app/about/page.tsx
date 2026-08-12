import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Tim and the story behind TJR Mind & Body.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mt-6 space-y-4">
        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">About</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              For more than 15 years, I&apos;ve worked in operational resilience, business continuity, crisis management, and major incident response
              across some of Australia&apos;s most complex organisations.
            </p>
            <p>
              Increasingly, that work has sat at the intersection of two things: how systems and organisations hold up under pressure, and how the
              people inside them do. You can build the most resilient process in the world and still watch it fail because the human running it was
              never given a way to sustain the load. That&apos;s the human performance side of resilience - not a separate field, just the other half
              of the same problem.
            </p>
            <p>At the same time, I&apos;ve been living a very different resilience story.</p>
            <p>
              For more than 20 years, I&apos;ve lived with chronic spinal pain, multiple surgeries, anxiety, depression, burnout, and the ongoing work
              of rebuilding my health while still showing up for a demanding career.
            </p>
            <p>
              Those two things - the professional side and the lived side - aren&apos;t separate. They taught me the same lesson twice.
            </p>
            <p className="text-base font-semibold leading-7 text-navy dark:text-white">
              I&apos;ve spent my career helping organisations become more resilient. Now my mission is to help people do the same, one practical step at a time.
            </p>
            <p>
              I&apos;ve always been a strategic thinker. A pattern-recognizer. Someone who builds frameworks to make sense of complexity, does the deep
              research, and doesn&apos;t stop at the first answer. Hard-working, curious, detail-oriented - the kind of person who does their best work
              when focused and given real autonomy, and who cares, sometimes to a fault, about doing things properly.
            </p>
            <p>
              Those same traits that made me useful in a crisis room made it easy, for a long time, to keep performing everywhere else too - even when
              the cost wasn&apos;t visible from the outside. For years, my version of resilience looked like &quot;head down, bum up&quot;: push through,
              don&apos;t make it anyone else&apos;s problem, keep functioning no matter what it cost. It worked, in the sense that nobody noticed. It also
              wasn&apos;t sustainable, and eventually it stopped working at all.
            </p>
            <p>
              Some of what I was managing quietly went beyond pain and exhaustion. For a long time, I kept my sexuality to myself too - another thing
              edited out to keep functioning in a world that expected something else. Masking isn&apos;t only about hiding symptoms; it&apos;s about how
              much of yourself you learn to leave out. Understanding that cost, and slowly unlearning it, has become as much a part of my resilience
              story as the physical recovery.
            </p>
            <p>
              I&apos;m also currently in the process of exploring whether ADHD and autism are part of how my brain has always worked - something that&apos;s
              already helped make sense of patterns I&apos;ve carried since childhood: attention, sensory sensitivity, and a tendency to push through
              rather than pace myself. I don&apos;t have a final answer yet, but the process itself has already changed how I think about my own capacity.
            </p>
            <p>
              There was never a single breakthrough. No miracle treatment or overnight transformation. Early adulthood had its own rough edges too -
              leaning on alcohol more than was healthy was one of them, alongside everything else I was carrying at the time.
            </p>
            <p>
              Instead, progress came through thousands of small decisions: learning what actually helped, letting go of what didn&apos;t, rebuilding after
              setbacks, and accepting that recovery is rarely a straight line - professionally or personally.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Who this is for</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              TJR Mind & Body is for people who feel like life has become heavier than it used to be. You might be living with chronic pain,
              burnout, anxiety, overwhelming stress, neurodivergence, major life changes, or simply the quiet exhaustion that comes from trying to keep
              everything together while your capacity continues to shrink.
            </p>
            <p>You do not need to be at rock bottom. You simply need a place to start rebuilding.</p>
            <p>This is not about becoming the most productive version of yourself. It is about creating a life that is sustainable.</p>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">What makes this different</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>Most resilience advice assumes everyone has the same amount of energy, time, and capacity. Real life does not work that way.</p>
            <p>
              Instead of fighting that reality, TJR Mind & Body helps you work with it through practical strategies that help you understand your
              capacity, reduce unnecessary pressure, recover more effectively, and make better decisions during difficult periods.
            </p>
            <p>The goal is not perfection. The goal is helping you continue moving forward, even when life does not go to plan.</p>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">What shapes the approach</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          The work draws from four connected perspectives.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm font-semibold text-navy dark:text-white">Operational resilience</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              Understanding how people and systems prepare for, respond to, and recover from disruption.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm font-semibold text-navy dark:text-white">Human performance</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              The same discipline turned toward people instead of processes: understanding that focus, capacity, and output under pressure aren&apos;t
              fixed - they&apos;re something you can design for, protect, and rebuild. It&apos;s usually the missing piece when organisations plan for
              resilience.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm font-semibold text-navy dark:text-white">Lived experience</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              More than two decades navigating chronic pain, mental health, identity, possible neurodivergence, and rebuilding, while still carrying
              real professional responsibility.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm font-semibold text-navy dark:text-white">Systems thinking</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              Recognising that lasting change comes from improving the environment, routines, and decisions around you, not from willpower alone.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-navy p-6 text-white">
        <h2 className="font-serif text-2xl font-bold">A simple belief</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
          You do not need to become someone else to build resilience. You need to better understand your capacity, work with it instead of against it,
          and build systems that support the life you want to live.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/revs" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-blue-pale">
            Explore REVS Program
          </Link>
          <Link href="/assessment" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-teal">
            Start Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
