import { NextResponse } from 'next/server';
import {
  consumeRevsInvite,
  ensureRevsSchema,
  isRevsAllowedEmail,
  normalizeRevsEmail,
  upsertRevsUser,
} from '@/lib/revs-db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; inviteCode?: string } | null;
  const email = body?.email ? normalizeRevsEmail(body.email) : '';
  const inviteCode = body?.inviteCode?.trim().toUpperCase() || '';
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Missing email.' }, { status: 400 });
  }
  if (!inviteCode) {
    const allowlisted = await isRevsAllowedEmail(email);
    if (!allowlisted) {
      return NextResponse.json({ ok: false, error: 'Missing invite code.' }, { status: 400 });
    }
    const user = await upsertRevsUser({ email });
    return NextResponse.json({ ok: true, user, allowlisted: true });
  }

  await ensureRevsSchema();
  const invite = await consumeRevsInvite(inviteCode);
  if (!invite) {
    return NextResponse.json({ ok: false, error: 'Invalid or expired invite code.' }, { status: 403 });
  }
  const user = await upsertRevsUser({ email });
  return NextResponse.json({ ok: true, user, invite });
}
