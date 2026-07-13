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

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Check your email for the guide!');
        setEmail('');
        setFirstName('');
        // Reset form after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch (error) {
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
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
              className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-deep disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Sending...' : 'Get the Guide'}
            </button>

            {status === 'error' && (
              <p className="text-red-600 text-sm">{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
