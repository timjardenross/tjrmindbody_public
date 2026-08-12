import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Assessment',
  description: 'Understand what the REVS Assessment is, what it asks, and how it helps you get started.',
};

const sections = [
  {
    title: 'What is the assessment?',
    body: [
      'The REVS Assessment is a self-guided tool designed to help you understand where you are in your capacity-building journey and give you personalized recommendations for what to explore next.',
      "It is not diagnostic. It doesn't assess for conditions, disorders, or medical status. It is a self-awareness tool that helps you navigate the REVS framework based on your current situation.",
      'Time to complete: 10-15 minutes. Cost: Free. Result: A personalized learning pathway tailored to where you are right now.',
    ],
  },
  {
    title: 'What the assessment will ask',
    body: [
      'The assessment has three sections:',
      'Section 1: Learning Path Assessment. Three to five questions about your current situation, what you understand already, and what your main goal is right now.',
      'Section 2: Capacity System Audit. Twelve questions, one for each of your interconnected capacity systems, so you can see which are most compromised and need the most support.',
      'Section 3: Learning Preferences. Questions about how you like to learn and how much time you can realistically commit.',
    ],
  },
  {
    title: 'What the assessment will do',
    body: [
      'After you complete the assessment, you get four key outputs: your starting stage, your most depleted systems, personalized concept recommendations, and format recommendations.',
      'That means you get a learning sequence that matches your situation instead of a generic pathway that assumes everyone starts in the same place.',
    ],
  },
  {
    title: 'How this tailors your journey',
    body: [
      'No one-size-fits-all learning. Two people with the same diagnosis might have completely different capacity maps, and the assessment honors that difference.',
      'Stage-appropriate recommendations. You are not pushed to expand capacity if you are still trying to understand what is happening.',
      'Respect for how you learn. Some people learn best with video, others with worksheets, others with listening or reading.',
      'Pace that works for you. The assessment gives you a sequence, but you move at your own speed.',
    ],
  },
  {
    title: 'Who should take the assessment',
    body: [
      'You should take the REVS Assessment if you know you are depleted but do not understand why, have tried generic wellness advice and it did not work, want a personalized pathway through the REVS framework, are curious about your capacity systems, or need clarity on where to start.',
      "You don't need a diagnosis or condition label. You don't need to be in crisis. You don't need to have already tried everything. And you don't need to know what REVS is before you begin.",
    ],
  },
  {
    title: 'What happens after you get your results',
    body: [
      'You get a learning sequence, choose where to start, learn at your pace, implement what you learn, and can retake the assessment later if your situation changes.',
      'The assessment is there to help you make a useful next step, not to lock you into one path forever.',
    ],
  },
  {
    title: 'Important limitations',
    body: [
      "This assessment is not diagnostic, not a medical assessment, not a replacement for professional support, and not a scoring system.",
      'It is a self-awareness tool, a framework navigator, a way to understand your capacity systems, and a personalized learning recommendation engine.',
    ],
  },
  {
    title: 'How to use your results',
    body: [
      'Review your stage recommendation, look at your depleted systems, choose the first concept in the sequence, and move at the pace that fits your life.',
      'The goal is not to do everything at once. It is to start where your system actually is.',
    ],
  },
];

export default function AssessmentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="font-serif text-3xl font-bold text-navy dark:text-white">The REVS Assessment</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          Understand where you are and get personalized recommendations.
        </p>
      </section>

      <section className="mt-6 grid gap-4">
        {sections.map((section) => (
          <article key={section.title} className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-navy p-6 text-white">
        <h2 className="font-serif text-2xl font-bold">A simple belief</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
          The assessment is not about judging where you are. It is about helping you see your capacity clearly enough to take the next useful step.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/coaching" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-blue-pale">
            Explore Coaching
          </Link>
          <Link href="/revs" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-teal">
            Explore REVS Program
          </Link>
        </div>
      </section>
    </div>
  );
}
