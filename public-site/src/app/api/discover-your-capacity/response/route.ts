import { NextResponse } from 'next/server';
import { updateResponse, readStore } from '@/lib/discover-capacity-store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { responseId?: string; name?: string; answers?: Record<string, string | number | null>; currentIndex?: number }
    | null;

  if (!body?.responseId) {
    return NextResponse.json({ ok: false, error: 'Missing responseId' }, { status: 400 });
  }

  const record = updateResponse(body.responseId, {
    name: body.name,
    answers: body.answers,
  });
  if (!record) {
    return NextResponse.json({ ok: false, error: 'Response not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, response: record });
}

export async function GET(request: Request) {
  const responseId = new URL(request.url).searchParams.get('responseId') || '';
  const record = readStore().responses.find((item) => item.responseId === responseId);
  if (!record) {
    return NextResponse.json({ ok: false, error: 'Response not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, response: record });
}
