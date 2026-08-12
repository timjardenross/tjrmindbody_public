import { NextResponse } from 'next/server';
import {
  ensureRevsSchema,
  getRevsPool,
  listRevsConcepts,
  listRevsConceptVariants,
  setRevsConceptStatus,
  upsertRevsConcept,
  upsertRevsConceptVariant,
  deleteRevsConceptVariant,
  type RevsConceptRow,
  type RevsConceptVariantRow,
} from '@/lib/revs-db';

export const runtime = 'nodejs';

function isAuthorized(request: Request) {
  const token = request.headers.get('x-revs-admin-token') || '';
  return !!process.env.REVS_ADMIN_TOKEN && token === process.env.REVS_ADMIN_TOKEN;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await ensureRevsSchema();
  const url = new URL(request.url);
  const conceptId = url.searchParams.get('conceptId');

  if (conceptId) {
    const variants = await listRevsConceptVariants(Number(conceptId));
    return NextResponse.json({ ok: true, variants });
  }

  const concepts = await listRevsConcepts();
  return NextResponse.json({ ok: true, concepts });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await ensureRevsSchema();
  const body = (await request.json().catch(() => null)) as
    | {
        id?: number;
        conceptId?: number;
        slug?: string;
        title?: string;
        summary?: string;
        stage?: string;
        status?: string;
        sortOrder?: number;
        principles?: string[];
        audienceFramings?: string[];
        formats?: string[];
        depths?: string[];
        prerequisites?: string[];
        pairsWith?: string[];
        evidence?: string[];
        accessibilityNotes?: string[];
        variantKey?: string;
        audience?: string;
        format?: string;
        depth?: string;
        body?: string;
        notes?: string;
        variantSortOrder?: number;
        kind?: 'concept' | 'variant';
        action?: 'delete' | 'toggle' | 'duplicate';
      }
    | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: 'Missing request body.' }, { status: 400 });
  }

  if (body.action === 'delete' && typeof body.id === 'number') {
    const pool = getRevsPool();
    const result = await pool.query<RevsConceptRow>(
      `
        delete from revs_concepts
        where id = $1
        returning id, slug, title, summary, stage, status, sort_order, principles, audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes, published_at, created_at, updated_at
      `,
      [body.id]
    );
    if (!result.rows[0]) {
      return NextResponse.json({ ok: false, error: 'Concept not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, concept: result.rows[0] });
  }

  if (body.action === 'toggle' && typeof body.id === 'number') {
    if (!body.status) {
      return NextResponse.json({ ok: false, error: 'Missing status.' }, { status: 400 });
    }
    const concept = await setRevsConceptStatus({ id: body.id, status: body.status });
    if (!concept) {
      return NextResponse.json({ ok: false, error: 'Concept not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, concept });
  }

  if (body.kind === 'variant') {
    if (body.action === 'delete' && typeof body.id === 'number') {
      const variant = await deleteRevsConceptVariant({ id: body.id });
      if (!variant) {
        return NextResponse.json({ ok: false, error: 'Variant not found.' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, variant });
    }

    if (body.action === 'duplicate' && typeof body.id === 'number') {
      const pool = getRevsPool();
      const existing = await pool.query<RevsConceptVariantRow>(
        `
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          where id = $1
          limit 1
        `,
        [body.id]
      );
      const source = existing.rows[0];
      if (!source) {
        return NextResponse.json({ ok: false, error: 'Variant not found.' }, { status: 404 });
      }
      const variant = await upsertRevsConceptVariant({
        conceptId: source.concept_id,
        variantKey: `${source.variant_key}-copy`,
        audience: source.audience,
        format: source.format,
        depth: source.depth,
        stage: source.stage,
        status: 'draft',
        body: source.body,
        notes: source.notes,
        sortOrder: source.sort_order + 1,
      });
      return NextResponse.json({ ok: true, variant });
    }

    if (!body.conceptId || !body.variantKey || !body.title) {
      return NextResponse.json({ ok: false, error: 'Missing variant fields.' }, { status: 400 });
    }
    const variant = await upsertRevsConceptVariant({
      conceptId: body.conceptId,
      variantKey: body.variantKey,
      audience: body.audience,
      format: body.format,
      depth: body.depth,
      stage: body.stage,
      status: body.status,
      body: body.body,
      notes: body.notes,
      sortOrder: body.variantSortOrder,
    });
    return NextResponse.json({ ok: true, variant });
  }

  if (!body.slug || !body.title) {
    return NextResponse.json({ ok: false, error: 'Missing concept slug or title.' }, { status: 400 });
  }

  const concept = await upsertRevsConcept({
    slug: body.slug,
    title: body.title,
    summary: body.summary,
    stage: body.stage,
    status: body.status,
    sortOrder: body.sortOrder,
    audienceFramings: body.audienceFramings,
    principles: body.principles,
    formats: body.formats,
    depths: body.depths,
    prerequisites: body.prerequisites,
    pairsWith: body.pairsWith,
    evidence: body.evidence,
    accessibilityNotes: body.accessibilityNotes,
  });

  return NextResponse.json({ ok: true, concept });
}
