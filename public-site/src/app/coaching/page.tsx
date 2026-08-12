import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coaching',
  description: '1:1 coaching and guiding for people who want practical support rebuilding capacity with REVS.',
};

const supportPoints = [
  'Mapping your 12 capacity systems and noticing where the pressure is landing',
  'Understanding your nervous system pattern and early warning signs',
  'Building a pacing rhythm that is realistic for your life',
  'Developing a regulation toolkit that feels usable, not overwhelming',
  'Finding your next sensible step when things feel stuck or uncertain',
  'Making decisions about work, relationships, and commitments with more clarity',
];

const processSteps = [
  {
    title: 'Discovery conversation',
    body: 'We start with a simple conversation about where you are and what would help most.',
  },
  {
    title: 'First session',
    body: 'We slow things down, understand your current situation, and build a practical plan.',
  },
  {
    title: 'Ongoing coaching',
    body: 'Sessions move at a pace that suits you, with room to adjust as things change.',
  },
];

export default function CoachingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl font-bold text-navy dark:text-white">Coaching</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          You do not need another plan you cannot sustain. You need a clearer picture of your own capacity, and someone to help you build a life
          around it instead of constantly fighting it.
        </p>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          1:1 coaching is practical support for understanding your capacity and working with it more gently. It is not therapy or medical
          treatment. It is a space to slow things down, make sense of what is happening, and build a plan that actually fits your real life, not
          the life you think you should be able to live.
        </p>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">What we can work on</h2>
          <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">
            These are the kinds of things we might work through together, depending on what feels most urgent or most useful.
          </p>
          <ul className="mt-4 space-y-3">
            {supportPoints.map((point) => (
              <li key={point} className="text-sm leading-7 text-ink-mid dark:text-slate-300">
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            Most of this work moves through the same Recognise, Regulate, Rebuild, and Redesign framework as the rest of the site. Wherever
            you are starting from, that is where we start too.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Who this is for</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              Coaching may suit you if you are living with chronic pain, burnout, anxiety, sensory overload, or a nervous system that does not work
              the way generic advice assumes it does, and you want personal guidance rather than only self-paced learning. It may also suit you if
              you are worn down from trying to figure this out alone, or you keep making the same decisions and hitting the same wall.
            </p>
            <p>
              You do not need a diagnosis. You do not need to be in crisis. You just need a willingness to work with where you actually are, not
              where you think you should be.
            </p>
            <p>
              This probably is not the right fit if you are in crisis and need immediate clinical support, you are looking for a diagnosis, or you
              want a fixed program with a guaranteed timeline. Coaching here moves at the pace your capacity allows, not a fixed schedule.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">How it works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <h3 className="font-serif text-xl font-bold text-navy dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
                {step.body}
                {step.title === 'Discovery conversation' && ' This is a free, no-obligation call, roughly 20 minutes, over Zoom or phone.'}
                {step.title === 'First session' && ' Typical length: 60 minutes.'}
                {step.title === 'Ongoing coaching' && ' Sessions usually run fortnightly, with room to adjust as things change.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-navy p-6 text-white">
        <h2 className="font-serif text-2xl font-bold">Next step</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
          If this feels like the kind of support you need, get in touch and tell me a little about what you are facing right now, no need to have
          it figured out first. That is enough for us to have a first conversation and work out together whether coaching is the right fit.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/lets-chat" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-blue-pale">
            Let&apos;s Chat
          </Link>
          <Link href="/assessment" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-teal">
            Start Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
