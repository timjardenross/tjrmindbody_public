import { NextResponse } from 'next/server';
import { createRevsProgressEvent, ensureRevsSchema, getRevsProgressSummary } from '@/lib/revs-db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email') || undefined;

  if (!email) {
    return NextResponse.json({ ok: true, events: [], counts: {} });
  }

  try {
    const summary = await getRevsProgressSummary(email);
    return NextResponse.json({ ok: true, ...summary });
  } catch {
    return NextResponse.json({ ok: true, events: [], counts: {} });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; conceptSlug?: string; eventType?: string; note?: string; metadata?: Record<string, unknown> }
    | null;

  if (!body?.email || !body.eventType) {
    return NextResponse.json({ ok: false, error: 'Missing email or eventType.' }, { status: 400 });
  }

  try {
    await ensureRevsSchema();
    const event = await createRevsProgressEvent({
      email: body.email,
      conceptSlug: body.conceptSlug,
      eventType: body.eventType,
      note: body.note,
      metadata: body.metadata,
    });
    return NextResponse.json({ ok: true, event });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to record progress.' },
      { status: 500 }
    );
  }
}
