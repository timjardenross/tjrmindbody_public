import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink-light">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/blog/rss.xml" className="hover:text-blue">
              RSS
            </Link>
            <Link href="/sitemap.xml" className="hover:text-blue">
              Sitemap
            </Link>
            <Link href="/lets-chat" className="hover:text-blue">
              Let&apos;s Chat
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
