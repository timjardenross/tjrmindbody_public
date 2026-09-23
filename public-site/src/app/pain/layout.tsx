import type { Metadata } from 'next';
import { PathwayGlobalNav } from '@/components/pain/PathwayNavigation';

export const metadata: Metadata = {
  title: { default: 'Persistent Pain Pathway', template: '%s — Persistent Pain Pathway' },
  description: 'An Australian guide to understanding persistent pain, finding support, managing capacity and preparing for difficult days.',
  robots: { index: true, follow: true },
  openGraph: { title: 'Persistent Pain Pathway', description: 'An Australian guide to understanding persistent pain, finding support, managing capacity and preparing for difficult days.', type: 'website' },
  twitter: { card: 'summary', title: 'Persistent Pain Pathway', description: 'An Australian guide to understanding persistent pain, finding support, managing capacity and preparing for difficult days.' },
};

export default function PainLayout({ children }: { children: React.ReactNode }) { return <><PathwayGlobalNav />{children}</>; }
