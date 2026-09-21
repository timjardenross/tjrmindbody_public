import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink-light">
        <p className="mb-4 text-ink-mid">
          Support, coaching, education, practical resilience, self-management, and rebuilding.
        </p>
        <p className="mb-4 text-sm leading-6 text-ink-mid">
          TJR Mind &amp; Body offers coaching and educational support only. It does not provide medical advice,
          diagnosis, or treatment, and it does not claim to cure or treat any condition.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-teal">
              Privacy
            </Link>
            <Link href="/terms-conditions" className="hover:text-teal">
              Terms
            </Link>
            <Link href="/library/rss.xml" className="hover:text-teal">
              RSS
            </Link>
            <Link href="/sitemap.xml" className="hover:text-teal">
              Sitemap
            </Link>
            <Link href="/lets-chat" className="hover:text-teal">
              Let&apos;s Chat
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
