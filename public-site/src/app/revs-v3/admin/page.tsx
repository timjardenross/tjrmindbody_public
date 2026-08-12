import type { Metadata } from 'next';
import { RevsAdminClient } from '@/components/RevsAdminClient';

export const metadata: Metadata = {
  title: 'REVS Admin',
  description: 'Admin scaffold for managing atomic concepts and variants.',
  robots: { index: false, follow: false },
};

export default function RevsAdminPage() {
  return <RevsAdminClient />;
}
