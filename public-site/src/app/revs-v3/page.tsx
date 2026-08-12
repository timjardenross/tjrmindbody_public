import type { Metadata } from 'next';
import { RevsNowClient } from '@/components/RevsNowClient';

export const metadata: Metadata = {
  title: 'REVS v3.0 App',
  description:
    'Hidden REVS v3.0 app shell for assessment, stage detection, personalization, and modular content delivery.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RevsV3Page() {
  return <RevsNowClient />;
}
