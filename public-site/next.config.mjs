/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/about-me', destination: '/about', permanent: true },
      { source: '/tjrs-blog', destination: '/library', permanent: true },
      { source: '/what-is-coaching', destination: '/coaching', permanent: true },
      { source: '/book-a-call', destination: '/lets-chat', permanent: true },
      { source: '/blog', destination: '/library', permanent: true },
      { source: '/guides', destination: '/library', permanent: true },
      { source: '/revs-articles', destination: '/library', permanent: true },
      { source: '/operational-resilience-insights', destination: '/library', permanent: true },
      { source: '/resources', destination: '/library', permanent: true },
    ];
  },
  async rewrites() {
    // `/admin` has no exact match in public/ (only /admin/index.html does) and
    // would otherwise be swallowed by the [collection] catch-all route, since
    // Next.js doesn't fall back to directory index files the way a static
    // file server would. Rewriting (not redirecting) keeps the URL as /admin
    // while serving the static Sveltia CMS entry point.
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
};

export default nextConfig;
