import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Coming Soon',
  description: 'TJR Mind & Body is being built in public.',
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f5ef_36%,#f1ede4_100%)] px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center">
        <section className="w-full rounded-[2rem] border border-navy/10 bg-white/90 p-8 shadow-sm backdrop-blur md:p-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <Image src="/brand/logo.svg" alt="TJR Mind & Body mark" width={96} height={96} priority />
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal">Mind. Body. Resilience.</p>
          </div>

          <div className="mt-10 max-w-3xl">
            <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-navy sm:text-6xl md:text-7xl">Build practical resilience, together</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-mid sm:text-xl">
              Practical coaching and educational resources grounded in lived experience, offered with a gentler pace. Start by noticing what is asking
              for more care, then build steadier systems one step at a time.
            </p>
            <p className="mt-6 max-w-2xl border-l-4 border-teal pl-4 text-base font-semibold leading-7 text-navy">
              TJR Mind & Body is still being built, and that work continues to evolve openly and thoughtfully.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
