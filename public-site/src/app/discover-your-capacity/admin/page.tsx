import type { Metadata } from 'next';
import DiscoverCapacityAdmin from './admin-client';

export const metadata: Metadata = {
  title: 'Discover Your Capacity Admin',
  description: 'Private admin panel for managing REVS Discover Your Capacity access codes and responses.',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <DiscoverCapacityAdmin />;
}
