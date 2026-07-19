import type { Metadata } from 'next';
import DiscoverYourCapacityJourney from './journey';

export const metadata: Metadata = {
  title: 'REVS Discover Your Capacity',
  description:
    'A private guided self-discovery journey that helps users explore what is affecting their capacity today.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DiscoverYourCapacityPage() {
  return <DiscoverYourCapacityJourney />;
}
