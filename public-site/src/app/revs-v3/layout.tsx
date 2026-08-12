import Link from 'next/link';
import { revsStages } from '@/lib/revs';

const tabs = [
  { href: '/revs-v3/foundation', label: 'Foundation' },
  { href: '/revs-v3', label: 'Overview' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/revs-v3/dashboard', label: 'Dashboard' },
  { href: '/revs-v3/content', label: 'Content' },
  { href: '/revs-v3/admin', label: 'Admin' },
];

export default function RevsV3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f5ef_0%,#f1ede4_100%)] text-ink dark:bg-[linear-gradient(180deg,#081019_0%,#0e1620_100%)] dark:text-white">
      <div className="sticky top-0 z-30 border-b border-black/10 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-950/85">
        <div className="mx-auto max-w-6xl px-4 py-3 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">REVS</p>
              <h1 className="mt-1 font-serif text-2xl font-bold text-navy dark:text-white">Assessment and learning space</h1>
              <p className="mt-1 text-sm text-ink-mid dark:text-slate-300">
                Assessment, stage detection, personalization, and modular content delivery.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {revsStages.map((stage) => (
                <span key={stage} className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
                  {stage}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="REVS app" className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-navy dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}
