import { Feed } from 'feed';
import { site, absoluteUrl } from './site';
import type { ArticleFrontmatter, ContentEntry } from './content';

export function buildFeed({
  title,
  description,
  feedPath,
  entries,
}: {
  title: string;
  description: string;
  feedPath: string;
  entries: ContentEntry<ArticleFrontmatter>[];
}): Feed {
  const feed = new Feed({
    title,
    description,
    id: absoluteUrl(feedPath),
    link: site.url,
    language: site.locale,
    favicon: absoluteUrl('/favicon.ico'),
    copyright: `All rights reserved ${site.name}`,
    feedLinks: { rss: absoluteUrl(feedPath) },
  });

  entries.forEach((entry) => {
    feed.addItem({
      title: entry.frontmatter.title,
      id: absoluteUrl(entry.url),
      link: absoluteUrl(entry.url),
      description: entry.frontmatter.excerpt,
      date: new Date(entry.frontmatter.date),
      image: entry.frontmatter.featuredImage ? absoluteUrl(entry.frontmatter.featuredImage) : undefined,
      category: (entry.frontmatter.tags || []).map((name) => ({ name })),
    });
  });

  return feed;
}
