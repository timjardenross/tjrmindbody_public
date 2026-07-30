import { describe, expect, it } from 'vitest';
import { isReservedSlug } from '../content';

describe('isReservedSlug', () => {
  it('reserves rss.xml as an article slug in any collection', () => {
    expect(isReservedSlug('library', 'rss.xml')).toBe(true);
  });

  it('does not reserve category/tag/page as article slugs (Next falls through to [slug])', () => {
    expect(isReservedSlug('library', 'category')).toBe(false);
    expect(isReservedSlug('library', 'tag')).toBe(false);
    expect(isReservedSlug('library', 'page')).toBe(false);
  });

  it('allows an ordinary article slug', () => {
    expect(isReservedSlug('library', 'my-first-post')).toBe(false);
  });

  it('reserves top-level routes and every collection routeBase as a page slug', () => {
    expect(isReservedSlug('pages', 'admin')).toBe(true);
    expect(isReservedSlug('pages', 'search')).toBe(true);
    expect(isReservedSlug('pages', 'rss.xml')).toBe(true);
    expect(isReservedSlug('pages', 'sitemap.xml')).toBe(true);
    expect(isReservedSlug('pages', 'robots.txt')).toBe(true);
    expect(isReservedSlug('pages', 'library')).toBe(true);
  });

  it('allows an ordinary page slug', () => {
    expect(isReservedSlug('pages', 'about')).toBe(false);
    expect(isReservedSlug('pages', 'lets-chat')).toBe(false);
  });
});
