import { NextResponse } from 'next/server';
import {
  createRevsInvite,
  createRevsAllowlistEntry,
  ensureRevsSchema,
  getRevsPool,
  type RevsInviteRow,
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
  const pool = getRevsPool();
  const result = await pool.query<RevsInviteRow>(
    `
      select id, code, label, active, uses_remaining, expires_at, created_at, updated_at
      from revs_invites
      order by created_at desc, id desc
    `
  );

  return NextResponse.json({ ok: true, invites: result.rows });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        code?: string;
        label?: string;
        usesRemaining?: number | null;
        expiresAt?: string | null;
        allowlistEmail?: string;
        allowlistLabel?: string;
        allowlistActive?: boolean;
        action?: string;
        id?: number;
        active?: boolean;
      }
    | null;

  await ensureRevsSchema();

  if (body?.action === 'toggle' && typeof body.id === 'number' && typeof body.active === 'boolean') {
    const pool = getRevsPool();
    const result = await pool.query<RevsInviteRow>(
      `
        update revs_invites
        set active = $2, updated_at = now()
        where id = $1
        returning id, code, label, active, uses_remaining, expires_at, created_at, updated_at
      `,
      [body.id, body.active]
    );
    if (!result.rows[0]) {
      return NextResponse.json({ ok: false, error: 'Invite not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, invite: result.rows[0] });
  }

  if (!body?.code) {
    if (body?.allowlistEmail) {
      const entry = await createRevsAllowlistEntry({
        email: body.allowlistEmail,
        label: body.allowlistLabel || '',
        active: body.allowlistActive ?? true,
      });
      return NextResponse.json({ ok: true, allowlist: entry });
    }
    return NextResponse.json({ ok: false, error: 'Missing invite code.' }, { status: 400 });
  }

  const invite = await createRevsInvite({
    code: body.code,
    label: body.label || '',
    usesRemaining: body.usesRemaining ?? null,
    expiresAt: body.expiresAt ?? null,
  });

  return NextResponse.json({ ok: true, invite });
}
