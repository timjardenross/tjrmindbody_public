import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revsConcepts, type RevsConcept } from '@/lib/revs';
import {
  getRevsConceptBySlug,
  getRevsRelatedConcepts,
  hasRevsDatabase,
  listPublishedRevsConceptVariants,
  toRevsConceptView,
  type RevsConceptView,
  type RevsConceptRow,
} from '@/lib/revs-db';
import { RevsConceptCard } from '../_components/revs-concept-card';

type Params = { slug: string };
type ConceptLike = {
  slug: string;
  title: string;
  summary: string;
  stage: string;
  tags?: string[];
  principles?: string[];
  audiences?: string[];
  formats?: string[];
  depths?: string[];
  prerequisites?: string[];
  pairsWith?: string[];
  evidence?: string[];
  accessibilityNotes?: string[];
};

const allowStaticFallback = process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build';

function normalizeConceptForDisplay(concept: ConceptLike | RevsConceptView): RevsConceptView {
  if ('tags' in concept) {
    return concept as RevsConceptView;
  }
  return {
    ...concept,
    tags: [concept.stage, ...(concept.audiences || []).slice(0, 2)].filter(Boolean),
    principles: concept.principles || [],
    audiences: concept.audiences || [],
    formats: concept.formats || [],
    depths: concept.depths || [],
    prerequisites: concept.prerequisites || [],
    pairsWith: concept.pairsWith || [],
    evidence: concept.evidence || [],
    accessibilityNotes: concept.accessibilityNotes || [],
  } as RevsConceptView;
}

export function generateStaticParams() {
  return revsConcepts.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = params;
  let concept: ConceptLike | null = revsConcepts.find((item) => item.slug === slug) || null;
  if (hasRevsDatabase()) {
    try {
      const dbConcept = await getRevsConceptBySlug(slug);
      if (dbConcept) {
        concept = toRevsConceptView(dbConcept);
      }
    } catch {
      concept = allowStaticFallback ? revsConcepts.find((item) => item.slug === slug) || null : null;
    }
  }
  if (!concept) {
    return { title: 'REVS Concept', robots: { index: false, follow: false } };
  }
  return {
    title: `${concept.title} | REVS Content`,
    description: concept.summary,
    robots: { index: false, follow: false },
  };
}

export default async function RevsConceptDetailPage({ params }: { params: Params }) {
  const { slug } = params;
  let concept: ConceptLike | RevsConceptView | null = revsConcepts.find((item) => item.slug === slug) || null;
  let conceptRow: RevsConceptRow | null = null;
  if (hasRevsDatabase()) {
    try {
      conceptRow = await getRevsConceptBySlug(slug);
      if (conceptRow) {
        concept = toRevsConceptView(conceptRow);
      }
    } catch {
      conceptRow = null;
    }
  }
  if (!concept) notFound();
  const displayConcept = normalizeConceptForDisplay(concept);
  const recommendedNext = revsConcepts.find((item) => item.slug !== slug && item.stage === displayConcept.stage) || revsConcepts.find((item) => item.stage !== displayConcept.stage) || null;

  let related: Array<RevsConceptView | ConceptLike> = revsConcepts.filter((item) => item.slug !== concept.slug && item.stage === concept.stage).slice(0, 2);
  let variants: Awaited<ReturnType<typeof listPublishedRevsConceptVariants>> = [];
  if (hasRevsDatabase()) {
    try {
      related = (await getRevsRelatedConcepts({ slug, stage: concept.stage, limit: 3 })).related.map(toRevsConceptView);
      variants = conceptRow ? await listPublishedRevsConceptVariants(conceptRow.id) : [];
    } catch {
      related = allowStaticFallback ? revsConcepts.filter((item) => item.slug !== concept.slug && item.stage === concept.stage).slice(0, 2) : [];
      variants = [];
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link href="/revs-v3/content" className="font-semibold text-teal">
          Back to content
        </Link>
        <span className="text-ink-mid dark:text-slate-400">/</span>
        <span className="text-ink-mid dark:text-slate-300">{displayConcept.title}</span>
      </div>

      <section className="mt-4 rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Who this page is for</p>
          <p className="mt-2">
            Users should see the concept in one clear reading path with adjacent concepts nearby. Admins should use this page to sanity-check the published variants, delivery notes, and stage fit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-teal">
            {displayConcept.stage}
          </span>
          {displayConcept.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-4 font-serif text-4xl font-bold text-navy dark:text-white">{displayConcept.title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-ink-mid dark:text-slate-300">{displayConcept.summary}</p>
        <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Principle focus</p>
          <p className="mt-2">{displayConcept.principles.join(' • ') || 'capacity over deficit • low cognitive load'}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Audiences</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">{displayConcept.audiences.join(' • ')}</p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Formats</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">{displayConcept.formats.join(' • ')}</p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Depths</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">{displayConcept.depths.join(' • ')}</p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Stage fit</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              Published for the {displayConcept.stage} stage delivery queue.
            </p>
          </div>
        </div>

        {variants.length ? (
          <div className="mt-6 rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Published variants</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {variants.map((variant) => (
                <div key={variant.id} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                  <p className="text-sm font-semibold text-navy dark:text-white">{variant.variant_key}</p>
                  <p className="mt-1 text-xs text-ink-mid dark:text-slate-300">
                    {variant.audience} • {variant.format} • {variant.depth}
                  </p>
                  {variant.body ? <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">{variant.body}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Delivery notes</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p>
              <span className="font-semibold text-navy dark:text-white">Prerequisites:</span> {displayConcept.prerequisites.join(' • ')}
            </p>
            <p>
              <span className="font-semibold text-navy dark:text-white">Pairs with:</span> {displayConcept.pairsWith.join(' • ')}
            </p>
            <p>
              <span className="font-semibold text-navy dark:text-white">Evidence:</span> {displayConcept.evidence.join(' • ')}
            </p>
            <p>
              <span className="font-semibold text-navy dark:text-white">Accessibility:</span> {displayConcept.accessibilityNotes.join(' • ')}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
              User view: read the concept and choose the format that fits your energy. Admin view: check that the same core concept appears consistently across variants.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Same-stage concepts</h2>
          <div className="mt-4 space-y-4">
            {related.length ? (
              related.map((item) => <RevsConceptCard key={item.slug} concept={normalizeConceptForDisplay(item)} />)
            ) : (
              <p className="text-sm leading-7 text-ink-mid dark:text-slate-300">No additional same-stage concepts are published yet.</p>
            )}
          </div>
        </div>
      </section>

      {recommendedNext ? (
        <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Recommended next</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">{recommendedNext.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">{recommendedNext.summary}</p>
            </div>
            <Link
              href={`/revs-v3/content/${recommendedNext.slug}`}
              className="inline-flex rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white"
            >
              Open next
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
