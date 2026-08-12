import { NextResponse } from 'next/server';
import { revsConcepts } from '@/lib/revs';
import { hasRevsDatabase, listPublishedRevsConcepts } from '@/lib/revs-db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = {
    stage: url.searchParams.get('stage') || undefined,
    audience: url.searchParams.get('audience') || undefined,
    format: url.searchParams.get('format') || undefined,
    depth: url.searchParams.get('depth') || undefined,
  };

  if (hasRevsDatabase()) {
    const concepts = await listPublishedRevsConcepts(filters);
    return NextResponse.json({ ok: true, concepts, filters });
  }

  return NextResponse.json({ ok: true, concepts: revsConcepts, filters, source: 'static' });
}
