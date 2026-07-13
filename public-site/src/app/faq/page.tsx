import { FAQSection } from '@/components/FAQSection';

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about TJR Mind & Body coaching and resilience building.',
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <FAQSection />
    </div>
  );
}
