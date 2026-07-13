'use client';

import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiry, setInquiry] = useState('coaching');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, inquiry, message }),
      });

      if (response.ok) {
        setStatus('success');
        setResponseMessage("Thanks for reaching out. We'll reply within 2 business days.");
        setName('');
        setEmail('');
        setInquiry('coaching');
        setMessage('');
      } else {
        setStatus('error');
        setResponseMessage('Something went wrong. Try again or email support@tjrmindbody.com directly.');
      }
    } catch {
      setStatus('error');
      setResponseMessage('Error connecting. Please email support@tjrmindbody.com directly.');
    }
  };

  return (
    <div className="max-w-2xl rounded-[34px] border border-border bg-white p-8">
      <h2 className="mb-2 font-serif text-2xl font-bold text-navy">Get in touch</h2>
      <p className="mb-6 text-ink-mid">
        For coaching, support, education, or collaboration enquiries, use the form below or email support@tjrmindbody.com.
      </p>

      {status === 'success' ? (
        <div className="rounded-lg p-4 text-teal">
          <p className="font-medium">✓ {responseMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-navy">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-navy">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>

          <div>
            <label htmlFor="inquiry" className="mb-2 block text-sm font-medium text-navy">
              I&apos;m enquiring about
            </label>
            <select
              id="inquiry"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="coaching">Coaching</option>
              <option value="support">Support</option>
              <option value="education">Education</option>
              <option value="collaboration">Collaboration</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-navy">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Tell us more about your enquiry..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg bg-navy px-6 py-3 font-medium text-white hover:bg-navy-deep disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'error' && <p className="text-sm text-ink-mid">{responseMessage}</p>}
        </form>
      )}
    </div>
  );
}
