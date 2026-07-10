import { describe, expect, it } from 'vitest';
import { isReservedSlug } from '../content';

describe('isReservedSlug', () => {
  it('reserves rss.xml as an article slug in any collection', () => {
    expect(isReservedSlug('blog', 'rss.xml')).toBe(true);
    expect(isReservedSlug('guides', 'rss.xml')).toBe(true);
  });

  it('does not reserve category/tag/page as article slugs (Next falls through to [slug])', () => {
    expect(isReservedSlug('blog', 'category')).toBe(false);
    expect(isReservedSlug('blog', 'tag')).toBe(false);
    expect(isReservedSlug('blog', 'page')).toBe(false);
  });

  it('allows an ordinary article slug', () => {
    expect(isReservedSlug('blog', 'my-first-post')).toBe(false);
  });

  it('reserves top-level routes and every collection routeBase as a page slug', () => {
    expect(isReservedSlug('pages', 'admin')).toBe(true);
    expect(isReservedSlug('pages', 'search')).toBe(true);
    expect(isReservedSlug('pages', 'rss.xml')).toBe(true);
    expect(isReservedSlug('pages', 'sitemap.xml')).toBe(true);
    expect(isReservedSlug('pages', 'robots.txt')).toBe(true);
    expect(isReservedSlug('pages', 'blog')).toBe(true);
    expect(isReservedSlug('pages', 'guides')).toBe(true);
    expect(isReservedSlug('pages', 'revs-articles')).toBe(true);
    expect(isReservedSlug('pages', 'operational-resilience-insights')).toBe(true);
    expect(isReservedSlug('pages', 'resources')).toBe(true);
  });

  it('allows an ordinary page slug', () => {
    expect(isReservedSlug('pages', 'about')).toBe(false);
    expect(isReservedSlug('pages', 'lets-chat')).toBe(false);
  });
});
