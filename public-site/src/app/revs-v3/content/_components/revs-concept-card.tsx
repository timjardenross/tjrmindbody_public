import Link from 'next/link';
import type { RevsConcept } from '@/lib/revs';
import type { RevsConceptView } from '@/lib/revs-db';

type RevsConceptCardModel = RevsConcept | RevsConceptView;

export function RevsConceptCard({ concept }: { concept: RevsConceptCardModel }) {
  return (
    <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-teal">
          {concept.stage}
        </span>
        {concept.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mt-4 font-serif text-2xl font-bold text-navy dark:text-white">
        <Link href={`/revs-v3/content/${concept.slug}`} className="hover:text-teal">
          {concept.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">{concept.summary}</p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Audiences</p>
          <p className="mt-1 text-ink-mid dark:text-slate-300">{concept.audiences.join(' • ')}</p>
        </div>
        <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Formats</p>
          <p className="mt-1 text-ink-mid dark:text-slate-300">{concept.formats.join(' • ')}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Principles</p>
        <p className="mt-1 text-ink-mid dark:text-slate-300">{'principles' in concept ? concept.principles.join(' • ') : 'capacity over deficit • low cognitive load'}</p>
      </div>
      <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Pairs with</p>
        <p className="mt-1 text-sm leading-7 text-ink-mid dark:text-slate-300">{concept.pairsWith.join(' • ')}</p>
      </div>
    </article>
  );
}
