import Link from 'next/link';
import { site } from '@/lib/site';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Assessment', href: '/assessment' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'REVS Program', href: '/revs' },
  { label: 'Library', href: '/library' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-navy/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-navy">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm font-medium text-ink-mid md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-teal">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/lets-chat"
          className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-deep"
        >
          Let&apos;s Chat
        </Link>
      </div>
    </header>
  );
}
