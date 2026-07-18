'use client';

import { useEffect, useMemo, useState } from 'react';

type AnswerValue = number | null;

type QuestionOption = {
  label: string;
  value: number;
};

type Question = {
  id: string;
  section: string;
  prompt: string;
  helper: string;
  options: QuestionOption[];
};

const STORAGE_KEY_PREFIX = 'revs-discover-your-capacity-v1';
const ACCESS_KEY = 'revs-discover-your-capacity-access';
const RESPONSE_SESSION_KEY = 'revs-discover-your-capacity-response-id';
const ANSWER_SCALE = [
  { label: 'Not at all', value: 0 },
  { label: 'A little', value: 1 },
  { label: 'Somewhat', value: 2 },
  { label: 'Quite a bit', value: 3 },
  { label: 'Very much', value: 4 },
];

const QUESTIONS: Question[] = [
  {
    id: 'capacity-today',
    section: 'Your Capacity Today',
    prompt: 'How would you describe your capacity today?',
    helper: 'This is about how much you feel you can realistically hold today.',
    options: ANSWER_SCALE,
  },
  {
    id: 'capacity-usual',
    section: 'Your Capacity Today',
    prompt: 'Is your capacity different from your usual level?',
    helper: 'Think about today compared with your normal baseline.',
    options: ANSWER_SCALE,
  },
  {
    id: 'daily-demands',
    section: 'Your Capacity Today',
    prompt: 'How hard is it to meet daily demands right now?',
    helper: 'Work, care, admin, routines and social needs all count.',
    options: ANSWER_SCALE,
  },
  {
    id: 'recovery-after-effort',
    section: 'Your Capacity Today',
    prompt: 'After effort, how hard is it to recover?',
    helper: 'This includes physical, mental and emotional effort.',
    options: ANSWER_SCALE,
  },
  {
    id: 'sleep-quality',
    section: 'Energy and Recovery',
    prompt: 'How restorative has your sleep been lately?',
    helper: 'We are looking at quality, not just how many hours you sleep.',
    options: ANSWER_SCALE,
  },
  {
    id: 'waking-refreshed',
    section: 'Energy and Recovery',
    prompt: 'How often do you wake up feeling refreshed?',
    helper: 'This can change from day to day.',
    options: ANSWER_SCALE,
  },
  {
    id: 'fatigue',
    section: 'Energy and Recovery',
    prompt: 'How much fatigue are you carrying right now?',
    helper: 'Fatigue can be physical, mental or both.',
    options: ANSWER_SCALE,
  },
  {
    id: 'switch-off',
    section: 'Energy and Recovery',
    prompt: 'How easy is it to switch off and rest?',
    helper: 'Rest can include real pause, not just scrolling or staying busy.',
    options: ANSWER_SCALE,
  },
  {
    id: 'focus',
    section: 'How Your Mind Works',
    prompt: 'How hard is it to focus when you need to?',
    helper: 'This is about sustaining attention on the task in front of you.',
    options: ANSWER_SCALE,
  },
  {
    id: 'task-initiation',
    section: 'How Your Mind Works',
    prompt: 'How hard is it to get started on important tasks?',
    helper: 'Some people feel stuck before they begin, even when the task matters.',
    options: ANSWER_SCALE,
  },
  {
    id: 'task-switching',
    section: 'How Your Mind Works',
    prompt: 'How hard is it to switch between tasks?',
    helper: 'This includes moving between jobs, roles, tabs or responsibilities.',
    options: ANSWER_SCALE,
  },
  {
    id: 'mental-clutter',
    section: 'How Your Mind Works',
    prompt: 'How crowded does your mind feel?',
    helper: 'Think about mental noise, competing priorities and constant reminders.',
    options: ANSWER_SCALE,
  },
  {
    id: 'stress',
    section: 'Emotional Load',
    prompt: 'How much stress are you carrying?',
    helper: 'Stress can be from pressure, uncertainty or too many moving parts.',
    options: ANSWER_SCALE,
  },
  {
    id: 'worry',
    section: 'Emotional Load',
    prompt: 'How much worry is taking up space right now?',
    helper: 'This can include practical worries and background anxiety.',
    options: ANSWER_SCALE,
  },
  {
    id: 'emotional-exhaustion',
    section: 'Emotional Load',
    prompt: 'How emotionally exhausted do you feel?',
    helper: 'This is about feeling worn down by holding things together.',
    options: ANSWER_SCALE,
  },
  {
    id: 'regulate',
    section: 'Emotional Load',
    prompt: 'How easy is it to calm or steady yourself after being activated?',
    helper: 'This can include after conflict, bad news or overload.',
    options: ANSWER_SCALE,
  },
  {
    id: 'physical-pain',
    section: 'Physical Capacity',
    prompt: 'How much is pain affecting your capacity?',
    helper: 'Pain can affect movement, mood, focus and stamina.',
    options: ANSWER_SCALE,
  },
  {
    id: 'physical-fatigue',
    section: 'Physical Capacity',
    prompt: 'How much physical fatigue are you carrying?',
    helper: 'This includes muscle tiredness, heaviness or low physical stamina.',
    options: ANSWER_SCALE,
  },
  {
    id: 'mobility',
    section: 'Physical Capacity',
    prompt: 'How much does mobility or movement limit what you can do?',
    helper: 'Consider stairs, walking, standing, lifting or reaching.',
    options: ANSWER_SCALE,
  },
  {
    id: 'life-load',
    section: 'Life Context',
    prompt: 'How much is your current life load affecting your capacity?',
    helper: 'This can include caregiving, change, uncertainty or competing demands.',
    options: ANSWER_SCALE,
  },
  {
    id: 'support',
    section: 'Life Context',
    prompt: 'How supported do you feel right now?',
    helper: 'Support can come from people, systems, routines or access to help.',
    options: ANSWER_SCALE,
  },
  {
    id: 'free-text',
    section: 'Life Context',
    prompt: 'Is there anything else that is affecting your capacity today?',
    helper: 'Optional. A few words are enough if you want to add context.',
    options: [],
  },
];

type Answers = Record<string, AnswerValue | string>;

type SavedState = {
  step: 'gate' | 'intro' | 'questions' | 'results';
  name: string;
  consentAccepted: boolean;
  answers: Answers;
  currentIndex: number;
  responseId: string | null;
};

const INITIAL_STATE: SavedState = {
  step: 'gate',
  name: '',
  consentAccepted: false,
  answers: {},
  currentIndex: 0,
  responseId: null,
};

function timeRemaining(total: number, index: number): string {
  const remaining = Math.max(total - index, 0);
  const minutes = Math.max(5, Math.round(remaining * 0.6));
  return `${minutes} minutes left`;
}

function getSectionProgress(index: number): string {
  const question = QUESTIONS[index];
  const section = question?.section || 'Journey';
  const sectionQuestions = QUESTIONS.filter((q) => q.section === section);
  const sectionIndex = sectionQuestions.findIndex((q) => q.id === question?.id) + 1;
  return `${section} ${sectionIndex}/${sectionQuestions.length}`;
}

function scoreBand(score: number): { label: string; detail: string } {
  if (score <= 1.1) {
    return {
      label: 'Low capacity pressure',
      detail: 'Your answers suggest capacity is present, with relatively little current strain.',
    };
  }
  if (score <= 2.2) {
    return {
      label: 'Moderate capacity pressure',
      detail: 'Your capacity looks usable, but several factors are asking more of you than usual.',
    };
  }
  if (score <= 3.2) {
    return {
      label: 'High capacity pressure',
      detail: 'Your capacity seems meaningfully stretched, with multiple areas needing care.',
    };
  }
  return {
    label: 'Very high capacity pressure',
    detail: 'Your current load appears heavy. Smaller steps, rest and support may matter most.',
  };
}

function storageKeys(responseId: string | null) {
  const suffix = responseId || 'unlinked';
  return {
    state: `${STORAGE_KEY_PREFIX}:${suffix}`,
  };
}

function loadState(responseId: string | null): SavedState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(storageKeys(responseId).state);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      ...INITIAL_STATE,
      ...parsed,
      answers: parsed.answers || {},
      responseId,
    };
  } catch {
    return INITIAL_STATE;
  }
}

export default function DiscoverYourCapacityJourney() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<SavedState>(INITIAL_STATE);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');
  const [checkingCode, setCheckingCode] = useState(false);
  const [saveNotice, setSaveNotice] = useState('Saved automatically');
  const [responseId, setResponseId] = useState<string | null>(null);

  useEffect(() => {
    const savedResponseId = window.sessionStorage.getItem(RESPONSE_SESSION_KEY);
    setResponseId(savedResponseId);
    const saved = loadState(savedResponseId);
    setState(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const keys = storageKeys(responseId);
    window.localStorage.setItem(keys.state, JSON.stringify(state));
  }, [hydrated, responseId, state]);

  useEffect(() => {
    if (!hydrated || !responseId) return;
    fetch('/api/discover-your-capacity/response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responseId,
        name: state.name,
        answers: state.answers,
      }),
    }).catch(() => undefined);
  }, [hydrated, responseId, state.answers, state.name]);

  const currentQuestion = QUESTIONS[state.currentIndex];
  const answeredCount = useMemo(
    () =>
      QUESTIONS.filter((question) => {
        const value = state.answers[question.id];
        return value !== null && value !== undefined && value !== '';
      }).length,
    [state.answers]
  );

  const numericValues = useMemo(
    () =>
      QUESTIONS.filter((question) => typeof state.answers[question.id] === 'number').map(
        (question) => state.answers[question.id] as number
      ),
    [state.answers]
  );

  const averageScore =
    numericValues.length > 0
      ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
      : 0;
  const band = scoreBand(averageScore);

  async function submitAccessCode() {
    setCheckingCode(true);
    setAccessError('');
    try {
      const response = await fetch('/api/discover-your-capacity/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; responseId?: string }
        | null;
      if (!response.ok || !data?.ok) {
        setAccessError(data?.error || 'That code did not work.');
        return;
      }
      const newResponseId = data.responseId || crypto.randomUUID();
      window.sessionStorage.setItem(RESPONSE_SESSION_KEY, newResponseId);
      window.sessionStorage.setItem(ACCESS_KEY, 'allowed');
      setResponseId(newResponseId);
      setState((current) => ({ ...current, step: 'intro', responseId: newResponseId }));
    } finally {
      setCheckingCode(false);
    }
  }

  function beginJourney() {
    setState((current) => ({ ...current, step: 'questions' }));
  }

  function continueJourney() {
    setState((current) => ({ ...current, step: current.currentIndex < QUESTIONS.length ? 'questions' : 'results' }));
  }

  function updateAnswer(value: AnswerValue | string) {
    setState((current) => ({
      ...current,
      answers: { ...current.answers, [currentQuestion.id]: value },
    }));
    setSaveNotice('Saved automatically');
  }

  function goNext() {
    if (state.currentIndex >= QUESTIONS.length - 1) {
      setState((current) => ({ ...current, step: 'results' }));
      return;
    }
    setState((current) => ({ ...current, currentIndex: current.currentIndex + 1 }));
  }

  function goBack() {
    if (state.currentIndex === 0) {
      setState((current) => ({ ...current, step: 'intro' }));
      return;
    }
    setState((current) => ({ ...current, currentIndex: current.currentIndex - 1 }));
  }

  function resetJourney() {
    const keys = storageKeys(responseId);
    window.localStorage.removeItem(keys.state);
    window.sessionStorage.removeItem(RESPONSE_SESSION_KEY);
    window.sessionStorage.removeItem(ACCESS_KEY);
    setResponseId(null);
    setState(INITIAL_STATE);
    setSaveNotice('Answers cleared');
  }

  const savedProgressExists = hydrated && (state.step === 'questions' || state.step === 'results' || answeredCount > 0);

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 text-slate-700">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          Loading REVS Discover Your Capacity...
        </div>
      </div>
    );
  }

  if (state.step === 'gate') {
    return (
      <main className="min-h-[calc(100vh-1px)] bg-[radial-gradient(circle_at_top,_rgba(20,67,92,0.18),_transparent_40%),linear-gradient(180deg,_#f7f4ee_0%,_#eef3f2_100%)] px-4 py-6 text-slate-900">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-xl items-center">
          <section className="w-full rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0f5b5d]">REVS™</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#123241]">Discover Your Capacity</h1>
            <p className="mt-2 text-xl font-medium text-[#33515f]">See Yourself Differently.</p>
            <p className="mt-5 text-base leading-7 text-slate-700">
              Enter the access code to begin this private prototype.
            </p>
            <div className="mt-6 space-y-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Access code</span>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(event) => setAccessCode(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none ring-0 transition focus:border-[#0f5b5d] focus:shadow-[0_0_0_4px_rgba(15,91,93,0.14)]"
                  autoComplete="one-time-code"
                  inputMode="text"
                />
              </label>
              {accessError ? <p className="text-sm text-rose-700">{accessError}</p> : null}
              <button
                type="button"
                onClick={submitAccessCode}
                disabled={checkingCode || !accessCode.trim()}
                className="w-full rounded-2xl bg-[#123241] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#0f2834] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkingCode ? 'Checking...' : 'Continue'}
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              If you do not have an access code, this page stays closed.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (state.step === 'intro') {
    return (
      <main className="min-h-[calc(100vh-1px)] bg-[radial-gradient(circle_at_top,_rgba(20,67,92,0.18),_transparent_40%),linear-gradient(180deg,_#f7f4ee_0%,_#eef3f2_100%)] px-4 py-6 text-slate-900">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-2xl items-center">
          <section className="w-full rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0f5b5d]">REVS™</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#123241]">Discover Your Capacity</h1>
            <p className="mt-2 text-xl font-medium text-[#33515f]">See Yourself Differently.</p>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              Explore how your mind, body, environment and life experiences are influencing your
              capacity today.
            </p>
            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Preferred name, if you want one
              </span>
              <input
                type="text"
                value={state.name}
                onChange={(event) =>
                  setState((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-[#0f5b5d] focus:shadow-[0_0_0_4px_rgba(15,91,93,0.14)]"
                placeholder="Optional"
                autoComplete="nickname"
              />
            </label>
            <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <InfoPill>10 to 15 minutes</InfoPill>
              <InfoPill>Answers save automatically</InfoPill>
              <InfoPill>No right or wrong answers</InfoPill>
              <InfoPill>Not a diagnosis</InfoPill>
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <strong>Support note:</strong> This experience is not for emergencies. If you are in
              immediate danger, call 000. For 24/7 support in Australia, call Lifeline on 13 11 14
              or the Suicide Call Back Service on 1300 659 467.
            </div>
            <label className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={state.consentAccepted}
                onChange={(event) =>
                  setState((current) => ({ ...current, consentAccepted: event.target.checked }))
                }
                className="mt-1 h-5 w-5 rounded border-slate-300 text-[#0f5b5d] focus:ring-[#0f5b5d]"
              />
              <span>
                I understand this is an educational reflection tool, not medical advice or a
                diagnosis, not designed for emergencies, may store my answers locally on this
                device during the prototype, and I can clear my answers anytime.
              </span>
            </label>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={beginJourney}
                disabled={!state.consentAccepted}
                className="rounded-2xl bg-[#123241] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#0f2834] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Begin the Journey
              </button>
              {savedProgressExists ? (
                <button
                  type="button"
                  onClick={continueJourney}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-semibold text-[#123241] transition hover:bg-slate-50"
                >
                  Continue Previous Journey
                </button>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-slate-500">You can pause at any time and come back on this device.</p>
          </section>
        </div>
      </main>
    );
  }

  if (state.step === 'results') {
    return (
      <main className="min-h-[calc(100vh-1px)] bg-[linear-gradient(180deg,_#eef3f2_0%,_#f7f4ee_100%)] px-4 py-6 text-slate-900">
        <div className="mx-auto max-w-3xl">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0f5b5d]">Your profile</p>
            <h1 className="mt-3 font-serif text-4xl text-[#123241]">
              {state.name ? `${state.name}, ` : ''}
              {band.label}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">{band.detail}</p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">Estimated capacity pressure</p>
              <p className="mt-1 text-2xl font-semibold text-[#123241]">
                {averageScore ? averageScore.toFixed(1) : '0.0'} / 4.0
              </p>
              <p className="mt-1 text-sm text-slate-600">{answeredCount} questions answered</p>
              {responseId ? <p className="mt-1 text-xs text-slate-500">Response ID: {responseId}</p> : null}
            </div>
            <div className="mt-6 grid gap-4">
              <SummaryCard title="What looks steady">
                {summarise(state.answers, 'steady')}
              </SummaryCard>
              <SummaryCard title="What may be asking most of you">
                {summarise(state.answers, 'pressure')}
              </SummaryCard>
              <SummaryCard title="A gentle next step">
                Keep the next action small. Rest, reduce load where possible, and notice what helps
                your capacity return.
              </SummaryCard>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setState((current) => ({ ...current, step: 'questions', currentIndex: 0 }))}
                className="rounded-2xl bg-[#123241] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#0f2834]"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={resetJourney}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-semibold text-[#123241] transition hover:bg-slate-50"
              >
                Clear Answers
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const currentAnswer = state.answers[currentQuestion.id];
  const isFreeText = currentQuestion.options.length === 0;

  return (
    <main className="min-h-[calc(100vh-1px)] bg-[linear-gradient(180deg,_#eef3f2_0%,_#f7f4ee_100%)] px-4 py-4 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-2xl items-center">
        <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0f5b5d]">
                {currentQuestion.section}
              </p>
              <p className="mt-2 text-sm text-slate-500">{getSectionProgress(state.currentIndex)}</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {timeRemaining(QUESTIONS.length, state.currentIndex)}
            </div>
          </div>

          <div className="mt-6">
            <h1 className="font-serif text-3xl leading-tight text-[#123241] sm:text-4xl">
              {currentQuestion.prompt}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">{currentQuestion.helper}</p>
          </div>

          {currentQuestion.id === 'free-text' ? (
            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Optional notes</span>
              <textarea
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={(event) => updateAnswer(event.target.value)}
                rows={5}
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-[#0f5b5d] focus:shadow-[0_0_0_4px_rgba(15,91,93,0.14)]"
                placeholder="A few words is enough"
              />
            </label>
          ) : (
            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => updateAnswer(option.value)}
                  className={[
                    'rounded-2xl border px-4 py-4 text-left text-base font-medium transition',
                    currentAnswer === option.value
                      ? 'border-[#0f5b5d] bg-[#0f5b5d] text-white shadow-[0_12px_30px_rgba(15,91,93,0.18)]'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-semibold text-[#123241] transition hover:bg-slate-50"
            >
              Back
            </button>
            <div className="text-sm text-slate-500">{saveNotice}</div>
            <button
              type="button"
              onClick={goNext}
              disabled={!isFreeText && currentAnswer === undefined}
              className="rounded-2xl bg-[#123241] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#0f2834] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state.currentIndex === QUESTIONS.length - 1 ? 'See My Profile' : 'Continue'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700">{children}</div>;
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-[#123241]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{children}</p>
    </div>
  );
}

function summarise(answers: Answers, mode: 'steady' | 'pressure') {
  const scored = QUESTIONS.filter((question) => typeof answers[question.id] === 'number').map((question) => ({
    question,
    value: answers[question.id] as number,
  }));
  if (!scored.length) {
    return mode === 'steady'
      ? 'As you answer more questions, we will highlight the areas that seem most steady.'
      : 'As you answer more questions, we will highlight the areas asking most of your capacity.';
  }
  const sorted = [...scored].sort((a, b) => (mode === 'pressure' ? b.value - a.value : a.value - b.value));
  const top = sorted.slice(0, 3).map((item) => item.question.section.toLowerCase());
  const unique = Array.from(new Set(top));
  return mode === 'steady'
    ? `Your steadier areas appear to be around ${unique.join(', ')}.`
    : `The strongest pressure appears in ${unique.join(', ')}.`;
}
