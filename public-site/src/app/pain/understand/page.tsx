import type { Metadata } from 'next';
import UnderstandPainPage from './understand-pain-page';

export const metadata: Metadata = {
  title: 'Understand Your Pain',
  description: 'A practical Australian guide to understanding persistent pain and turning your pain story into useful next steps.',
};

export default function Page() {
  return <UnderstandPainPage />;
}
