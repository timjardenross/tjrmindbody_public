export const site = {
  name: 'TJR Mind & Body',
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
