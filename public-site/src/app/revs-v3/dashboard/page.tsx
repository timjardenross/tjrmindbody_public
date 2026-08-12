import type { Metadata } from 'next';
import { RevsDashboardClient } from '@/components/RevsDashboardClient';

export const metadata: Metadata = {
  title: 'REVS Dashboard',
  description: 'Dashboard scaffold for stage, capacity, and next steps.',
  robots: { index: false, follow: false },
};

export default function RevsDashboardPage() {
  return <RevsDashboardClient />;
}
