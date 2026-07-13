'use client';

import { FormEvent, useState } from 'react';

export function LeadMagnetForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: '' }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing. Check your email.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Error connecting. Please try again.');
    }
  };

  return (
    <section className="my-16 rounded-[34px] border border-border bg-white p-8">
      <div className="max-w-2xl">
        <h2 className="font-serif text-2xl font-bold text-navy mb-2">
          Stay Connected
        </h2>
        <p className="text-ink-mid mb-6">
          Get updates on new coaching resources, insights, and rebuilding strategies delivered to your inbox.
        </p>

        {status === 'success' ? (
          <div className="rounded-lg p-4 text-teal">
            <p className="font-medium">✓ {message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-navy-deep disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>

            {status === 'error' && <p className="text-ink-mid text-sm">{message}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
