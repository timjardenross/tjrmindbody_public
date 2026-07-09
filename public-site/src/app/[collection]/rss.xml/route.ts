import { NextResponse } from 'next/server';
import { collections, getCollectionByRouteBase } from '@/lib/collections';
import { getAllEntries } from '@/lib/content';
import { buildFeed } from '@/lib/rss';
import { buildRssResponseInit } from '@/lib/rss-response';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return collections
    .filter((c) => c.routeBase && c.inFeed)
    .map((c) => ({ collection: c.routeBase as string }));
}

export function GET(_request: Request, { params }: { params: { collection: string } }) {
  const def = getCollectionByRouteBase(params.collection);
  if (!def || !def.inFeed) {
    return new NextResponse('Not found', { status: 404 });
  }

  const feed = buildFeed({
    title: `${def.label} — TJR Mind & Body`,
    description: def.description,
    feedPath: `/${def.routeBase}/rss.xml`,
    entries: getAllEntries(def.key).slice(0, 50),
  });

  return new NextResponse(feed.rss2(), buildRssResponseInit());
}
