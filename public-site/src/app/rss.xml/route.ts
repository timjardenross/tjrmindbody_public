import { NextResponse } from 'next/server';
import { getAllArticleEntries } from '@/lib/content';
import { buildRssResponseInit } from '@/lib/rss-response';
import { buildFeed } from '@/lib/rss';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const feed = buildFeed({
    title: site.name,
    description: site.tagline,
    feedPath: '/rss.xml',
    entries: getAllArticleEntries().slice(0, 50),
  });

  return new NextResponse(feed.rss2(), buildRssResponseInit());
}
