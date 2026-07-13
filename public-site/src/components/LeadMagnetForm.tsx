'use client';

import { FormEvent, useState } from 'react';

export function LeadMagnetForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Check your email for the guide!');
        setEmail('');
        setFirstName('');
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
          Free Guide: The Resilience Checklist
        </h2>
        <p className="text-ink-mid mb-6">
          Get a practical checklist for building resilience in challenging times. Enter your email and we'll send it instantly.
        </p>

        {status === 'success' ? (
          <div className="rounded-lg p-4 text-teal">
            <p className="font-medium">✓ {message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-navy mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Tim"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-deep disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Get the Guide'}
            </button>

            {status === 'error' && <p className="text-ink-mid text-sm">{message}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
