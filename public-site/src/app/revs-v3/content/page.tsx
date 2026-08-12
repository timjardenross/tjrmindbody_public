import type { Metadata } from 'next';
import Link from 'next/link';
import { revsConcepts, revsStages, type RevsConcept } from '@/lib/revs';
import { hasRevsDatabase, listPublishedRevsConcepts, toRevsConceptView } from '@/lib/revs-db';

import { RevsConceptCard } from './_components/revs-concept-card';

type SearchParams = Record<string, string | string[] | undefined>;
type ConceptListItem = RevsConcept | ReturnType<typeof toRevsConceptView>;
const allowStaticFallback = process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build';

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalize(value?: string) {
  return value?.trim().toLowerCase() || '';
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

const revsAudiences = uniqueSorted(revsConcepts.flatMap((concept) => concept.audiences));
const revsFormats = uniqueSorted(revsConcepts.flatMap((concept) => concept.formats));
const revsDepths = uniqueSorted(revsConcepts.flatMap((concept) => concept.depths));

function buildLink(params: { stage?: string; audience?: string; format?: string; depth?: string; principle?: string; q?: string }) {
  const search = new URLSearchParams();
  if (params.stage) search.set('stage', params.stage);
  if (params.audience) search.set('audience', params.audience);
  if (params.format) search.set('format', params.format);
  if (params.depth) search.set('depth', params.depth);
  if (params.principle) search.set('principle', params.principle);
  if (params.q) search.set('q', params.q);
  const query = search.toString();
  return query ? `/revs-v3/content?${query}` : '/revs-v3/content';
}

export const metadata: Metadata = {
  title: 'REVS Content Library',
  description: 'Stage-based browsing for published REVS concepts and content variants.',
  robots: { index: false, follow: false },
};

export default async function RevsContentPage({ searchParams }: { searchParams?: SearchParams }) {
  const stage = normalize(firstParam(searchParams?.stage));
  const audience = normalize(firstParam(searchParams?.audience));
  const format = normalize(firstParam(searchParams?.format));
  const depth = normalize(firstParam(searchParams?.depth));
  const principle = normalize(firstParam(searchParams?.principle));
  const q = normalize(firstParam(searchParams?.q));

  let sourceConcepts: ConceptListItem[] = revsConcepts;
  if (hasRevsDatabase()) {
    try {
      sourceConcepts = (await listPublishedRevsConcepts({ stage, audience, format, depth })).map(toRevsConceptView);
    } catch {
      sourceConcepts = allowStaticFallback ? revsConcepts : [];
    }
  }

  const filteredConcepts = sourceConcepts.filter((concept) => {
    if (stage && concept.stage.toLowerCase() !== stage) return false;
    if (audience && !concept.audiences.some((item) => item.toLowerCase() === audience)) return false;
    if (format && !concept.formats.some((item) => item.toLowerCase() === format)) return false;
    if (depth && !concept.depths.some((item) => item.toLowerCase() === depth)) return false;
    if (principle && !concept.principles.some((item) => item.toLowerCase() === principle)) return false;
    if (q && !`${concept.title} ${concept.summary} ${concept.slug}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Content</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-white">Browse published REVS concepts by stage and delivery shape</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-mid dark:text-slate-300">
          Filter concepts by stage, audience, format, and depth, then open a concept to view its supporting notes, pairings, and delivery details.
        </p>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <form action="/revs-v3/content" method="get" className="mb-4 grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Search</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search concepts by title or topic"
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
          />
        </form>
        <div className="mb-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Principle cues</p>
          <p className="mt-2">
            Browse content that is calm, practical, and capacity-first. If a concept feels heroic, shaming, or overloaded,
            it needs revision before publishing.
          </p>
        </div>
        <div className="sticky top-[4.75rem] z-20 -mx-6 mb-4 border-y border-black/10 bg-white/90 px-6 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/90 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
          <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Stage</span>
          <Link href="/revs-v3/content" className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
            All
          </Link>
          {revsStages.map((item) => (
            <Link
              key={item}
              href={buildLink({ stage: item, audience: firstParam(searchParams?.audience), format: firstParam(searchParams?.format), depth: firstParam(searchParams?.depth), q: firstParam(searchParams?.q) })}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                stage === item.toLowerCase()
                  ? 'bg-teal text-white'
                  : 'border border-black/10 dark:border-white/10'
              }`}
            >
              {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Audience', key: 'audience', values: revsAudiences },
            { label: 'Format', key: 'format', values: revsFormats },
            { label: 'Depth', key: 'depth', values: revsDepths },
            { label: 'Principle', key: 'principle', values: uniqueSorted(sourceConcepts.flatMap((concept) => concept.principles)) },
          ].map((filter) => (
            <div key={filter.key} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{filter.label}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={buildLink({ stage: firstParam(searchParams?.stage), audience: filter.key === 'audience' ? undefined : firstParam(searchParams?.audience), format: filter.key === 'format' ? undefined : firstParam(searchParams?.format), depth: filter.key === 'depth' ? undefined : firstParam(searchParams?.depth), principle: filter.key === 'principle' ? undefined : firstParam(searchParams?.principle), q: firstParam(searchParams?.q) })} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
                  All
                </Link>
                {filter.values.map((value) => {
                  const active =
                    (filter.key === 'audience' && audience === value.toLowerCase()) ||
                    (filter.key === 'format' && format === value.toLowerCase()) ||
                    (filter.key === 'depth' && depth === value.toLowerCase()) ||
                    (filter.key === 'principle' && principle === value.toLowerCase());
                  const next = {
                    stage: firstParam(searchParams?.stage),
                    audience: filter.key === 'audience' ? value : firstParam(searchParams?.audience),
                    format: filter.key === 'format' ? value : firstParam(searchParams?.format),
                    depth: filter.key === 'depth' ? value : firstParam(searchParams?.depth),
                    principle: filter.key === 'principle' ? value : firstParam(searchParams?.principle),
                    q: firstParam(searchParams?.q),
                  };
                  return (
                    <Link
                      key={value}
                      href={buildLink(next)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        active ? 'bg-navy text-white' : 'border border-black/10 dark:border-white/10'
                      }`}
                    >
                      {value}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-ink-mid dark:text-slate-300">
          <p>
            Showing {filteredConcepts.length} of {sourceConcepts.length} concepts
          </p>
          <Link href="/revs-v3/content" className="font-semibold text-teal">
            Reset all filters
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {filteredConcepts.map((concept) => (
          <RevsConceptCard key={concept.slug} concept={concept} />
        ))}
        {filteredConcepts.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-white p-6 text-sm text-ink-mid dark:border-white/10 dark:bg-white/5 dark:text-slate-300 lg:col-span-2">
            No concepts match those filters yet. Try broadening the stage, audience, format, or depth selection.
          </div>
        ) : null}
      </section>
    </div>
  );
}
