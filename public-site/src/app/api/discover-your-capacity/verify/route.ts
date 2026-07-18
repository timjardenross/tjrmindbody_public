import { NextResponse } from 'next/server';
import { issueResponse, verifyAccessCode } from '@/lib/discover-capacity-store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { accessCode?: string } | null;
  const submitted = (body?.accessCode || '').trim();

  const accessCode = submitted ? verifyAccessCode(submitted) : null;
  if (!accessCode) {
    return NextResponse.json({ ok: false, error: 'Invalid access code.' }, { status: 401 });
  }

  const response = issueResponse(accessCode.id);
  if (!response) {
    return NextResponse.json({ ok: false, error: 'That code is currently inactive.' }, { status: 403 });
  }

  return NextResponse.json({ ok: true, responseId: response.responseId, accessCodeId: accessCode.id });
}
