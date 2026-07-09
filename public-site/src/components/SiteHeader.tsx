import Link from 'next/link';
import { site } from '@/lib/site';

const navLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Guides', href: '/guides' },
  { label: 'REVS Articles', href: '/revs-articles' },
  { label: 'Insights', href: '/operational-resilience-insights' },
  { label: 'Resources', href: '/resources' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-xl font-semibold text-navy">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm text-ink-mid md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue">
              {link.label}
            </Link>
          ))}
          <Link href="/search" className="hover:text-blue" aria-label="Search">
            Search
          </Link>
        </nav>
        <Link
          href="/lets-chat"
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-deep"
        >
          Let&apos;s Chat
        </Link>
      </div>
    </header>
  );
}
