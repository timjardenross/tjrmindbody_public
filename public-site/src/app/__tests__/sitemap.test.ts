import { describe, expect, it } from 'vitest';
import sitemap from '../sitemap';
import { site } from '@/lib/site';

describe('sitemap', () => {
  const entries = sitemap();

  it('includes the homepage and every public page', () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${site.url}/`);
    expect(urls).toContain(`${site.url}/lets-chat`);
    expect(urls).toContain(`${site.url}/privacy-policy`);
    expect(urls).toContain(`${site.url}/terms-conditions`);
  });

  it('excludes the internal search page', () => {
    const urls = entries.map((e) => e.url);
    expect(urls).not.toContain(`${site.url}/search`);
  });

  it('carries no legacy priority or changeFrequency metadata', () => {
    entries.forEach((entry) => {
      expect(entry).not.toHaveProperty('priority');
      expect(entry).not.toHaveProperty('changeFrequency');
    });
  });

  it('gives every URL a real lastModified date', () => {
    entries.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(Number.isNaN((entry.lastModified as Date).getTime())).toBe(false);
    });
  });

  it('only ever emits URLs under the configured canonical site origin', () => {
    entries.forEach((entry) => {
      expect(entry.url.startsWith(site.url)).toBe(true);
    });
  });
});
