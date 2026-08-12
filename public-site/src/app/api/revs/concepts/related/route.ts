import { NextResponse } from 'next/server';
import { revsConcepts } from '@/lib/revs';
import { getRevsRelatedConcepts, hasRevsDatabase, listPublishedRevsConcepts } from '@/lib/revs-db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || '';
  const filters = {
    stage: url.searchParams.get('stage') || undefined,
    audience: url.searchParams.get('audience') || undefined,
    format: url.searchParams.get('format') || undefined,
    depth: url.searchParams.get('depth') || undefined,
  };
  const limit = Number(url.searchParams.get('limit') || 5);

  if (!slug) {
    return NextResponse.json({ ok: false, error: 'Missing slug.' }, { status: 400 });
  }

  if (hasRevsDatabase()) {
    const result = await getRevsRelatedConcepts({ slug, ...filters, limit: Number.isFinite(limit) ? limit : 5 });
    if (!result.source) {
      return NextResponse.json({ ok: false, error: 'Published concept not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, ...result, filters });
  }

  const source = revsConcepts.find((concept) => concept.slug === slug) || null;
  const concepts = source ? revsConcepts.filter((concept) => concept.slug !== slug) : [];
  return NextResponse.json({
    ok: !!source,
    source,
    related: concepts.slice(0, Number.isFinite(limit) ? limit : 5),
    filters,
    sourceType: 'static',
  });
}
