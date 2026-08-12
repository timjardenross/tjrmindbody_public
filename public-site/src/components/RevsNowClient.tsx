'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_REVS_NOW_STATE,
  REVS_NOW_STORAGE_KEY,
  buildCapacityProfile,
  createRecommendedConcepts,
  detectRevsStage,
  type RevsNowState,
} from '@/lib/revs-now';
import { revsAssessmentSystems, revsStages } from '@/lib/revs';

const AUTH_KEY = 'revs-v3-auth-draft';
const ASSESSMENT_CHUNK_KEY = 'revs-v3-assessment-chunk';

function loadState(): RevsNowState {
  if (typeof window === 'undefined') return DEFAULT_REVS_NOW_STATE;
  const raw = window.localStorage.getItem(REVS_NOW_STORAGE_KEY);
  if (!raw) return DEFAULT_REVS_NOW_STATE;
  try {
    return { ...DEFAULT_REVS_NOW_STATE, ...JSON.parse(raw) } as RevsNowState;
  } catch {
    return DEFAULT_REVS_NOW_STATE;
  }
}

export function RevsNowClient() {
  const [state, setState] = useState<RevsNowState>(DEFAULT_REVS_NOW_STATE);
  const [authDraft, setAuthDraft] = useState({ email: '', password: '', inviteCode: '' });
  const [saveStatus, setSaveStatus] = useState('Not saved yet');
  const [authError, setAuthError] = useState('');
  const [assessmentChunk, setAssessmentChunk] = useState(0);
  const [completedAssessment, setCompletedAssessment] = useState(false);

  useEffect(() => {
    setState(loadState());
    const saved = window.sessionStorage.getItem(AUTH_KEY);
    if (saved) setAuthDraft(JSON.parse(saved));
    const savedChunk = window.localStorage.getItem(ASSESSMENT_CHUNK_KEY);
    if (savedChunk !== null) {
      const parsed = Number(savedChunk);
      if (Number.isFinite(parsed)) {
        setAssessmentChunk(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(REVS_NOW_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.email) return;
    window.dispatchEvent(new Event('revs:assessment-updated'));
  }, [state.completedAt, state.email]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ASSESSMENT_CHUNK_KEY, String(assessmentChunk));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [assessmentChunk]);

  const progress = useMemo(() => {
    const completed = state.completedAt ? 4 : state.authed ? 2 : 1;
    return `${completed}/4`;
  }, [state.authed, state.completedAt]);
  const progressStageIndex = state.completedAt ? 3 : state.authed ? 1 : 0;
  const assessmentStepIndex = state.completedAt ? 3 : state.authed ? 1 : 0;
  const assessmentSteps = ['Auth', 'Assessment', 'Stage', 'Dashboard'];
  const chunkSize = 3;
  const assessmentChunks = useMemo(() => {
    const chunks: number[][] = [];
    for (let i = 0; i < revsAssessmentSystems.length; i += chunkSize) {
      chunks.push(Array.from({ length: Math.min(chunkSize, revsAssessmentSystems.length - i) }, (_, offset) => i + offset));
    }
    return chunks;
  }, []);
  const visibleAssessmentIndexes = assessmentChunks[assessmentChunk] || [];
  const nextAssessmentChunk = Math.min(assessmentChunks.length - 1, assessmentChunk + 1);
  const previousAssessmentChunk = Math.max(0, assessmentChunk - 1);

  const nextConcepts = useMemo(() => createRecommendedConcepts(state.stage), [state.stage]);

  function signIn() {
    const email = authDraft.email.trim();
    const inviteCode = authDraft.inviteCode.trim();
    if (!email) return;
    fetch('/api/revs/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, inviteCode }),
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!response.ok || !data.ok) {
          throw new Error(data.error || 'Unable to register.');
        }
        window.sessionStorage.setItem(AUTH_KEY, JSON.stringify(authDraft));
        setState((current) => ({
          ...current,
          authed: true,
          email,
        }));
        setAuthError('');
        setSaveStatus('Signed in and linked to a stored user record.');
      })
      .catch((error: Error) => {
        setAuthError(error.message);
        setSaveStatus(error.message);
      });
  }

  function updateScore(index: number, value: number) {
    setState((current) => {
      const scores = [...current.assessment.scores];
      scores[index] = value;
      const stage = detectRevsStage(scores);
      return {
        ...current,
        stage,
        assessment: {
          ...current.assessment,
          scores,
        },
        profile: buildCapacityProfile(scores),
      };
    });
  }

  function completeAssessment() {
    const payload = {
      email: state.email || authDraft.email.trim(),
      scores: state.assessment.scores,
      notes: state.assessment.notes,
    };

    if (!payload.email) {
      setSaveStatus('Enter an email first so the assessment can be saved.');
      return;
    }

    fetch('/api/revs/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = (await response.json()) as
          | { ok?: boolean; stage?: string; stored?: boolean; error?: string; message?: string }
          | null;
        if (!response.ok || !data?.ok) {
          throw new Error(data?.error || 'Unable to save assessment.');
        }
        setState((current) => ({
          ...current,
          stage: (data.stage as RevsNowState['stage']) || detectRevsStage(current.assessment.scores),
          completedAt: new Date().toISOString(),
          authed: true,
          email: payload.email,
          profile: buildCapacityProfile(current.assessment.scores),
        }));
        setCompletedAssessment(true);
        setSaveStatus(data.stored ? 'Assessment saved to PostgreSQL.' : data.message || 'Assessment prepared.');
      })
      .catch((error: Error) => {
        setSaveStatus(error.message);
        setState((current) => ({
          ...current,
          stage: detectRevsStage(current.assessment.scores),
          completedAt: new Date().toISOString(),
          authed: true,
          email: payload.email,
          profile: buildCapacityProfile(current.assessment.scores),
        }));
        setCompletedAssessment(true);
      });
  }

  function saveDraftAndReturnLater() {
    const email = state.email || authDraft.email.trim();
    if (email) {
      setState((current) => ({ ...current, email, authed: true }));
    }
    window.localStorage.setItem(ASSESSMENT_CHUNK_KEY, String(assessmentChunk));
    setSaveStatus('Draft saved locally. You can return here or open the dashboard later.');
    window.dispatchEvent(new Event('revs:assessment-updated'));
  }

  function reset() {
    window.sessionStorage.removeItem(AUTH_KEY);
    setState(DEFAULT_REVS_NOW_STATE);
    setAuthDraft({ email: '', password: '', inviteCode: '' });
    setAssessmentChunk(0);
    setCompletedAssessment(false);
    window.localStorage.removeItem(REVS_NOW_STORAGE_KEY);
    window.localStorage.removeItem(ASSESSMENT_CHUNK_KEY);
    window.dispatchEvent(new Event('revs:assessment-updated'));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Now track</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-navy dark:text-white">Start here if you are a new user</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-mid dark:text-slate-300">
              This is a working mockup for the user journey. It uses local browser storage so we can test the flow without waiting on the database.
            </p>
            <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Journey strip</p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                {revsStages.map((stage, index) => (
                  <div
                    key={stage}
                    className={`rounded-2xl border px-3 py-2 text-center ${
                      index <= progressStageIndex
                        ? 'border-teal/30 bg-teal/10 text-teal'
                        : 'border-black/10 bg-white text-ink-mid dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                    }`}
                  >
                    {stage}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="/revs-v3/foundation" className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/10">
                Start with REVS
              </a>
              <a href="/assessment" className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white">
                Continue to assessment
              </a>
              <a href="/revs-v3/dashboard" className="rounded-full border border-teal/30 bg-teal/5 px-4 py-2 text-sm font-semibold text-teal">
                Resume last setup
              </a>
              <a href="/revs-v3/admin" className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/10">
                Admin access
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm dark:border-white/10">
            <span className="font-semibold text-navy dark:text-white">Progress</span>
            <span className="ml-2 text-ink-mid dark:text-slate-300">{progress}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-mid dark:text-slate-300">{saveStatus}</p>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Foundation</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              REVS starts with understanding, not fixing. It is built on lived experience, capacity, sustainability, autonomy, and low cognitive load.
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
              If you have already started, use resume last setup to return to the dashboard or continue the assessment.
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Who this is for</p>
            <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
              Users use this flow to sign in, assess, and see their next steps. Admins use the same shell to move into the content and invite tools.
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
              Invite-only access is on purpose for this phase. Use a valid invite code to create or resume a cohort account.
            </p>
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold text-navy dark:text-white">1. Auth</h3>
          {state.authed ? (
            <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-900 dark:text-green-100">
              Signed in as <strong>{state.email}</strong>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Email
                <input
                  value={authDraft.email}
                  onChange={(e) => setAuthDraft((current) => ({ ...current, email: e.target.value }))}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="name@example.com"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Invite code
                <input
                  value={authDraft.inviteCode}
                  onChange={(e) => setAuthDraft((current) => ({ ...current, inviteCode: e.target.value }))}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="ENTER-CODE"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Password
                <input
                  type="password"
                  value={authDraft.password}
                  onChange={(e) => setAuthDraft((current) => ({ ...current, password: e.target.value }))}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="••••••••"
                />
              </label>
              <button onClick={signIn} className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">
                Create account / sign in
              </button>
              {authError ? <p className="text-sm text-red-700 dark:text-red-300">{authError}</p> : null}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={reset} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/10">
              Reset
            </button>
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Assessment stepper</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {assessmentSteps.map((step, index) => (
                <div
                  key={step}
                  className={`rounded-2xl border px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] ${
                    index === assessmentStepIndex
                      ? 'border-teal/30 bg-teal/10 text-teal'
                      : index < assessmentStepIndex
                        ? 'border-black/10 bg-white text-ink-mid dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                        : 'border-black/10 bg-white/60 text-ink-light dark:border-white/10 dark:bg-white/5 dark:text-slate-400'
                  }`}
                >
                  <span className="block text-[10px] font-bold tracking-[0.16em]">{index + 1}</span>
                  <span className="mt-1 block">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <h3 className="mt-5 font-serif text-2xl font-bold text-navy dark:text-white">2. Assessment</h3>
          <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
            Rate each system from 0 to 4. The goal is to understand the conditions that help your system function better and identify the best stage to begin.
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            User view: simple assessment flow. Admin view: same flow, plus test/save/debug context.
          </p>
          <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
                  Part {assessmentChunk + 1} of {assessmentChunks.length}
                </p>
                <p className="mt-1 text-sm text-ink-mid dark:text-slate-300">
                  Showing {visibleAssessmentIndexes.length} systems at a time so the flow stays manageable on mobile and tablet.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAssessmentChunk(previousAssessmentChunk)}
                  disabled={assessmentChunk === 0}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-white/10"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentChunk(nextAssessmentChunk)}
                  disabled={assessmentChunk === assessmentChunks.length - 1}
                  className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {visibleAssessmentIndexes.map((index) => {
              const item = revsAssessmentSystems[index];
              return (
              <div
                key={item}
                className={`rounded-2xl border p-4 dark:border-white/10 ${
                  index <= assessmentStepIndex ? 'border-teal/20 bg-teal/5' : 'border-black/10 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">System {index + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-navy dark:text-white">{item}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => updateScore(index, score)}
                        className={`h-10 w-10 rounded-full border text-sm font-semibold ${
                          state.assessment.scores[index] === score
                            ? 'border-navy bg-navy text-white'
                            : 'border-black/10 bg-white text-ink-mid hover:border-teal/40 focus-visible:border-teal dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                        }`}
                        aria-pressed={state.assessment.scores[index] === score}
                        aria-label={`${item} score ${score}`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          <label className="mt-4 grid gap-2 text-sm font-semibold text-navy dark:text-white">
            Notes
            <textarea
              value={state.assessment.notes}
              onChange={(e) =>
                setState((current) => ({
                  ...current,
                  assessment: { ...current.assessment, notes: e.target.value },
                }))
              }
              rows={3}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
              placeholder="Anything the profile should remember?"
            />
          </label>
          <button onClick={completeAssessment} className="mt-4 rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
            Detect stage
          </button>
          <button
            type="button"
            onClick={saveDraftAndReturnLater}
            className="mt-3 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-navy dark:border-white/10 dark:text-white"
          >
            Save draft and return later
          </button>
        </section>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-serif text-2xl font-bold text-navy dark:text-white">3. Stage detection</h3>
          <div className="mt-4 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Current stage</p>
            <p className="mt-2 font-serif text-4xl font-bold">{state.stage}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              The stage is inferred from the assessment profile and can be updated whenever the user reassesses.
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{completedAssessment ? 'Assessment completed' : 'Completion state'}</p>
            <p className="mt-2">
              {completedAssessment
                ? 'The assessment is complete. The next step is the dashboard, where the user can review stage, capacity, and next concepts.'
                : 'The assessment is still in progress. Save a draft now, or continue through the remaining chunks at your own pace.'}
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {revsStages.map((stage) => (
              <div
                key={stage}
                className={`rounded-2xl border p-4 text-sm ${
                  state.stage === stage
                    ? 'border-navy bg-navy text-white'
                    : 'border-black/10 bg-white dark:border-white/10 dark:bg-white/5'
                }`}
              >
                <p className="font-semibold">{stage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-serif text-2xl font-bold text-navy dark:text-white">4. Dashboard</h3>
          <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
            The dashboard should show the current stage, profile summary, and the next most useful concepts.
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            User view: guided next steps. Admin view: verify the flow, then hand off to the live dashboard.
          </p>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Capacity profile</p>
              <div className="mt-3 space-y-2">
                {Object.entries(state.profile).map(([label, value]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-32 text-xs font-semibold text-ink-mid dark:text-slate-300">{label}</span>
                    <div className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-2 rounded-full bg-teal" style={{ width: `${Math.max(12, value * 22)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Next concepts</p>
              <div className="mt-3 space-y-3">
                {nextConcepts.map((concept) => (
                  <div key={concept} className="rounded-xl bg-black/[0.03] px-4 py-3 text-sm font-semibold text-navy dark:bg-white/5 dark:text-white">
                    {concept}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 p-4 text-sm dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Completion</p>
              <p className="mt-2 text-ink-mid dark:text-slate-300">
                {state.completedAt ? `Assessment completed ${new Date(state.completedAt).toLocaleString()}` : 'Assessment not yet completed'}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
                {state.completedAt ? 'The next stop is the dashboard and content queue.' : 'Save a draft now so you can return to the same chunk later.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="/revs-v3/dashboard" className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white">
                  Open dashboard
                </a>
                <button
                  type="button"
                  onClick={saveDraftAndReturnLater}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/10"
                >
                  Save and resume later
                </button>
              </div>
            </div>
          </div>
          {state.completedAt ? (
            <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Recommended next concepts</p>
              <div className="mt-3 space-y-3">
                {nextConcepts.map((concept) => (
                  <div key={concept} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-navy dark:border-white/10 dark:bg-white/5 dark:text-white">
                    {concept}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
