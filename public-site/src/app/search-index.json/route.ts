import { NextResponse } from 'next/server';
import { buildSearchDocuments } from '@/lib/search';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(buildSearchDocuments());
}
