'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { revsAssessmentSystems, type RevsStage } from '@/lib/revs';
import { getRevsStageMeaning } from '@/lib/revs-now';

type DashboardPayload = {
  ok?: boolean;
  stage?: string;
  email?: string | null;
  capacityProfile?: Record<string, number>;
  notes?: string;
  createdAt?: string | null;
  recommendations?: { slug: string; title: string; summary: string; stage: string; principles?: string[] }[];
};

type ProgressEvent = {
  id: number;
  email: string;
  concept_slug: string;
  event_type: string;
  note: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

type ProgressSummary = {
  events?: ProgressEvent[];
  counts?: Record<string, number>;
};

export function RevsDashboardClient() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [status, setStatus] = useState('Loading dashboard...');
  const [linkedEmail, setLinkedEmail] = useState<string>('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [resumeState, setResumeState] = useState<{ hasDraft: boolean; completedAt: string | null }>({
    hasDraft: false,
    completedAt: null,
  });
  const [events, setEvents] = useState<ProgressEvent[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const fetchDashboard = useCallback(async () => {
    const stateRaw = window.localStorage.getItem('revs-v3-now-state');
    const saved = stateRaw ? (JSON.parse(stateRaw) as { email?: string; completedAt?: string | null }) : null;
    const email = saved?.email?.trim() || '';
    setLinkedEmail(email);
    setResumeState({ hasDraft: Boolean(stateRaw), completedAt: saved?.completedAt ?? null });

    const url = email ? `/api/revs/dashboard?email=${encodeURIComponent(email)}` : '/api/revs/dashboard';
    const response = await fetch(url);
    const payload = (await response.json()) as DashboardPayload;
    if (!response.ok || !payload.ok) {
      throw new Error('Unable to load dashboard.');
    }

    setData(payload);
    setStatus(payload.createdAt ? 'Loaded from PostgreSQL for the linked user record.' : 'No saved assessment yet.');

    if (email) {
      const progressResponse = await fetch(`/api/revs/progress?email=${encodeURIComponent(email)}`);
      const progressPayload = (await progressResponse.json()) as { ok?: boolean } & ProgressSummary;
      if (progressResponse.ok && progressPayload.ok) {
        setEvents(progressPayload.events || []);
        setCounts(progressPayload.counts || {});
      }
    }
  }, []);

  useEffect(() => {
    setAdminUnlocked(Boolean(window.sessionStorage.getItem('revs-admin-token')));
    fetchDashboard().catch(() => {
      setStatus('Using fallback dashboard state.');
    });

    const handleRefresh = () => {
      fetchDashboard().catch(() => {
        setStatus('Using fallback dashboard state.');
      });
    };

    window.addEventListener('revs:assessment-updated', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    return () => {
      window.removeEventListener('revs:assessment-updated', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
    };
  }, [fetchDashboard]);

  async function logEvent(eventType: string, note: string) {
    if (!linkedEmail) return;
    await fetch('/api/revs/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: linkedEmail, eventType, note }),
    });
    fetchDashboard().catch(() => {
      setStatus('Using fallback dashboard state.');
    });
  }

  const profile = data?.capacityProfile || Object.fromEntries(revsAssessmentSystems.map((system) => [system, 2]));
  const recommendations = data?.recommendations || [];
  const recentEvents = events.slice(0, 5);
  const reviewedCount = counts.reviewed || 0;
  const completedCount = counts.completed || 0;
  const skippedCount = counts.skipped_concept || 0;
  const currentStage = (data?.stage || 'Recognise') as RevsStage;
  const stageMeaning = getRevsStageMeaning(currentStage);
  const nextConceptQueue = recommendations.slice(0, 4);
  const queueLabels = ['Start here', 'Then', 'After that', 'If you have energy'];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Dashboard</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-white">Current stage, progress, and next concepts</h1>
        <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">{status}</p>
        <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Who this is for</p>
          <p className="mt-2">
            Users see their stage, capacity profile, and next steps here. Admins can use the same page to sanity-check progress data and confirm the invite flow is working.
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="inline-flex rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink-mid dark:border-white/10 dark:text-slate-300">
            Linked record: {linkedEmail || 'none yet'}
          </p>
          <p
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              adminUnlocked
                ? 'border border-teal/30 bg-teal/10 text-teal'
                : 'border border-black/10 text-ink-mid dark:border-white/10 dark:text-slate-300'
            }`}
          >
            Admin console: {adminUnlocked ? 'unlocked' : 'locked'}
          </p>
          <Link
            href="/revs-v3/admin"
            className="inline-flex rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-navy dark:border-white/10 dark:text-white"
          >
            Invite admin
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Latest assessment</h2>
          {resumeState.hasDraft ? (
            <div className="mt-4 rounded-2xl border border-teal/25 bg-teal/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
                {resumeState.completedAt ? 'Saved assessment available' : 'Resume last assessment'}
              </p>
              <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
                {resumeState.completedAt
                  ? 'Your latest assessment is already saved. Reopen it to review or make changes.'
                  : 'You have an in-progress assessment. Jump back in where you left off.'}
              </p>
              <Link
                href="/assessment"
                className="mt-3 inline-flex rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
              >
                {resumeState.completedAt ? 'Review assessment' : 'Continue assessment'}
              </Link>
              <Link
                href="/revs-v3"
                className="mt-3 ml-0 inline-flex rounded-full border border-teal/30 bg-teal/5 px-4 py-2 text-sm font-semibold text-teal"
              >
                Back to overview
              </Link>
            </div>
          ) : null}
          <div className="mt-4 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Current stage</p>
            <p className="mt-2 font-serif text-4xl font-bold">{data?.stage || 'Recognise'}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {data?.email ? `Loaded from the stored record for ${data.email}` : 'No saved user yet. Complete an assessment to populate this view.'}
            </p>
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
              <button onClick={() => logEvent('viewed_dashboard', 'Opened dashboard') } className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                Log view
              </button>
              <button onClick={() => logEvent('started_concept_session', 'Started a concept session') } className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                Log session
              </button>
              <button onClick={() => logEvent('reviewed_concept', 'Reviewed a concept') } className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                Log review
              </button>
              <button onClick={() => logEvent('completed', 'Completed a step') } className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                Log completion
              </button>
              <button onClick={() => logEvent('skipped_concept', 'Skipped a concept for now') } className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                Log skip
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">What your profile means</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              Your scores show which conditions are asking for attention. Lower capacity often means the next best move is to reduce load, protect recovery, or return to a simpler stage.
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
              If you are an admin, use this as a quick read on whether the assessment and stage logic are behaving as expected.
            </p>
            <div className="mt-3 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{currentStage} focus</p>
              <p className="mt-1 text-sm font-semibold text-navy dark:text-white">{stageMeaning.title}</p>
              <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">{stageMeaning.body}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-teal">{stageMeaning.queueLabel}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Capacity profile</p>
            <div className="mt-3 space-y-2">
              {Object.entries(profile).map(([label, value]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-32 text-xs font-semibold text-ink-mid dark:text-slate-300">{label}</span>
                  <div className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-2 rounded-full bg-teal" style={{ width: `${Math.max(12, value * 22)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Reviewed</p>
              <p className="mt-2 text-2xl font-bold text-navy dark:text-white">{reviewedCount}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Completed</p>
              <p className="mt-2 text-2xl font-bold text-navy dark:text-white">{completedCount}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Skipped</p>
              <p className="mt-2 text-2xl font-bold text-navy dark:text-white">{skippedCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Next up</h2>
          <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
            Pick one small step. The rest can wait until you have space.
          </p>
          <div className="mt-4 space-y-3">
            {nextConceptQueue.length ? (
              nextConceptQueue.map((concept, index) => (
                <article key={concept.slug} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
                        {queueLabels[index] || 'Next'}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-navy dark:text-white">{concept.title}</h3>
                    </div>
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-teal/20 bg-teal/10 px-2 text-xs font-bold text-teal">
                      {index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">{concept.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(concept.principles || ['capacity over deficit', 'low cognitive load']).slice(0, 3).map((principle) => (
                      <span
                        key={principle}
                        className="inline-flex rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-mid dark:border-white/10 dark:text-slate-300"
                      >
                        {principle}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-black/10 p-4 text-sm text-ink-mid dark:border-white/10 dark:text-slate-300">
                No next steps are queued yet. Complete or refresh an assessment to populate this view.
              </div>
            )}
          </div>
          {recommendations.length > nextConceptQueue.length ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
              {recommendations.length - nextConceptQueue.length} more concepts are available when you are ready.
            </p>
          ) : null}

          <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Completion</p>
            <p className="mt-2 text-sm text-ink-mid dark:text-slate-300">
              {data?.createdAt ? `Saved ${new Date(data.createdAt).toLocaleString()}` : 'No saved timestamp yet'}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Recent activity</p>
            <div className="mt-3 space-y-3">
              {recentEvents.length ? (
                recentEvents.map((event) => (
                  <article key={event.id} className="rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.05]">
                    <p className="text-sm font-semibold text-navy dark:text-white">{event.event_type}</p>
                    <p className="text-xs text-ink-mid dark:text-slate-300">{event.note || event.concept_slug || 'No note'}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-ink-mid dark:text-slate-300">No progress activity yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
