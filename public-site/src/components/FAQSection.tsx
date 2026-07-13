'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Is this therapy or medical treatment?',
    answer:
      'No. TJR Mind & Body is about practical resilience, self-management, support, and steady rebuilding—not positioned as treatment, cure, or medical advice. If you need clinical support, work with a therapist or doctor. What we offer is the practical coaching and education to build resilience alongside professional care.',
  },
  {
    question: 'How long does resilience building take?',
    answer:
      "It's not a quick fix. Resilience is built through steady, deliberate practice over time. Some people notice changes in weeks (better sleep habits, clearer decisions). Deeper shifts—like handling stress without all-or-nothing thinking—take months. The key is consistency, not intensity. You're not starting from zero each time.",
  },
  {
    question: 'Will this work for my specific situation?',
    answer:
      'This approach works for people navigating real pressure: chronic stress, pain, burnout, life disruption, demanding work. If you're dealing with any of these, the three pillars—Mind, Body, Resilience—give you a practical structure. The coaching and education adapt to your situation. The discovery call is where we figure out if it's the right fit.',
  },
  {
    question: 'What if I've tried everything and nothing works?',
    answer:
      'Most people who say this have tried *harder*, not *differently*. They've pushed through pain, ignored sleep, skipped recovery—the same patterns that got them stuck. Resilience coaching isn't about trying harder. It's about building systems that work with your reality, not against it. That shift changes everything.',
  },
  {
    question: 'How do I know if coaching is right for me?',
    answer:
      "That's what the discovery call is for. It's a free conversation where we talk about what's happening, what you've tried, and whether coaching makes sense for your situation. No obligation. No pitch. Just honest feedback on whether this is the right move.",
  },
  {
    question: 'What makes this different from other coaching?',
    answer:
      'Two things: lived experience and operational discipline. The founder has spent 20+ years managing both chronic pain and operational resilience at scale. This isn't theory. It's grounded in what actually works when life gets hard. Second, the approach is built on the Resilience Cycle—Prepare, Respond, Recover, Grow—not motivational noise.',
  },
  {
    question: 'Is this just motivational content?',
    answer:
      'No. Motivational content gives you a temporary high. This gives you practical systems: daily habits, decision frameworks, recovery protocols. The goal is resilience that works in the real world—not how you feel in the moment.',
  },
  {
    question: "I don't have time for coaching. How does this work?",
    answer:
      "Resilience isn't something you add to your schedule. It's something you build into your existing routines. The coaching is designed around the time you actually have. Whether it's a weekly call or monthly deep-dive, we work with your reality.",
  },
  {
    question: 'What happens after coaching ends?',
    answer:
      "The goal is that you don't need it anymore. You've built the habits, learned the frameworks, and can maintain resilience on your own. Some people check in periodically when life shifts. Others graduate and stay in touch. There's no lock-in—you own the systems you've built.",
  },
  {
    question: 'Can I work with you if I have chronic pain or a diagnosed condition?',
    answer:
      "Yes. Chronic pain and diagnosed conditions are part of real life, and resilience coaching addresses the *whole picture*—managing pain, building sustainable habits, staying engaged. Work with your healthcare provider for the clinical side. We handle the resilience side.",
  },
];

export function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold text-navy sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-ink-mid">
          Everything you need to know about resilience coaching at TJR Mind & Body.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-white overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left hover:bg-white/50 transition-colors flex items-center justify-between"
            >
              <h3 className="font-serif text-lg font-semibold text-navy pr-4">
                {faq.question}
              </h3>
              <svg
                className={`h-5 w-5 text-teal flex-shrink-0 transition-transform ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {expandedIndex === index && (
              <div className="px-6 py-4 bg-white/50 border-t border-border">
                <p className="text-ink-mid leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-white/80 p-8 text-center">
        <h2 className="mb-2 font-serif text-2xl font-bold text-navy">
          Still have questions?
        </h2>
        <p className="mb-6 text-ink-mid">
          Schedule a free discovery call to talk through your specific situation.
        </p>
        <a
          href="/lets-chat"
          className="inline-block rounded-lg bg-navy px-6 py-3 font-medium text-white hover:bg-navy-deep"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
