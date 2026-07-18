// Date the public site went live (ADR-023 cutover). Used as the sitemap
// `lastmod` fallback for routes with no frontmatter date and no git history
// (e.g. a shallow build checkout) — a real, fixed anchor rather than
// `new Date()`, which would falsely signal "just updated" on every build.
export const SITE_LAUNCH_DATE = new Date('2026-07-10T00:00:00Z');

export const site = {
  name: 'TJR HQ',
  tagline:
    'Practical resilience coaching and education for people navigating pressure, burnout, chronic pain, disruption, and steady rebuilding.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3200',
  locale: 'en-GB',
  twitter: '@tjrmindbody',
  defaultOgImage: '/og-default.png',
} as const;

export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
