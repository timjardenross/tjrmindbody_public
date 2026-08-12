import { NextResponse } from 'next/server';
import { ensureRevsSchema, getRevsUserByEmail, normalizeRevsEmail } from '@/lib/revs-db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email ? normalizeRevsEmail(body.email) : '';
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Missing email.' }, { status: 400 });
  }

  await ensureRevsSchema();
  const user = await getRevsUserByEmail(email);
  if (!user) {
    return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user });
}
