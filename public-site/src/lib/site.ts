export const site = {
  name: 'TJR Mind & Body',
  tagline: 'Holistic wellness coaching for chronic pain, resilience and recovery.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3200',
  locale: 'en-GB',
  twitter: '@tjrmindbody',
  defaultOgImage: '/og-default.png',
} as const;

export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
