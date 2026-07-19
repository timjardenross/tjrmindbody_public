import { NextResponse } from 'next/server';
import { createAccessCode, deleteAccessCode, deleteResponse, getStore, setAccessCodeActive } from '@/lib/discover-capacity-store';

export const runtime = 'nodejs';

function isAuthorized(request: Request) {
  const token = request.headers.get('x-discover-admin-token') || '';
  return !!process.env.DISCOVER_CAPACITY_ADMIN_TOKEN && token === process.env.DISCOVER_CAPACITY_ADMIN_TOKEN;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, ...getStore() });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { action?: string; label?: string; id?: string; active?: boolean } | null;
  if (body?.action === 'create') {
    return NextResponse.json({ ok: true, record: createAccessCode(body.label || '') });
  }
  if (body?.action === 'toggle' && body.id && typeof body.active === 'boolean') {
    const record = setAccessCodeActive(body.id, body.active);
    if (!record) return NextResponse.json({ ok: false, error: 'Code not found' }, { status: 404 });
    return NextResponse.json({ ok: true, record });
  }
  if (body?.action === 'delete-code' && body.id) {
    const deleted = deleteAccessCode(body.id);
    if (!deleted) return NextResponse.json({ ok: false, error: 'Code not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  }
  if (body?.action === 'delete-response' && body.id) {
    const deleted = deleteResponse(body.id);
    if (!deleted) return NextResponse.json({ ok: false, error: 'Response not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: 'Unsupported action' }, { status: 400 });
}
