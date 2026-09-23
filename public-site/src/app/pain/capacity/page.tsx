'use client';

import { useState } from 'react';
import { usePainProfile } from '@/components/pain/PainProfileProvider';

const dimensions = [
  ['Physical', 'Pain, fatigue and movement can all use available capacity.'],
  ['Cognitive', 'Attention, memory and decisions can take mental effort.'],
  ['Emotional', 'Stress, frustration and regulation can add demand.'],
  ['Sensory', 'Noise, light and stimulation can affect what feels manageable.'],
  ['Social', 'Interaction, communication and expectations can use capacity.'],
  ['Practical', 'Work, appointments, caring and household tasks compete for capacity.'],
];

const statePrompts = {
  green: [['What tells you that you have more capacity?', 'signs'], ['What helps you maintain it?', 'maintain'], ['What do you want to use capacity for?', 'useCapacityFor']],
  amber: [['What are your early signs that capacity is reducing?', 'warningSigns'], ['What can you reduce?', 'reduce'], ['What can you delay?', 'delay'], ['What can you change?', 'change'], ['What do you want to protect?', 'protect']],
  red: [['What is essential?', 'essential'], ['What can wait?', 'canWait'], ['What tends to help recovery?', 'recoverySupports'], ['Who or what can reduce the load?', 'loadSupport']],
} as const;

type StateKey = keyof typeof statePrompts;

export default function CapacityPage() {
  const { profile, updateProfile, saveOnDevice, enableDeviceSave } = usePainProfile();
  const [state, setState] = useState<StateKey>('amber');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [today, setToday] = useState<'green' | 'amber' | 'red' | 'notSure'>('notSure');
  const setDraft = (key: string, value: string) => setDrafts((current) => ({ ...current, [key]: value }));
  const save = () => {
    const current = profile.capacity[state];
    const next = { ...current } as Record<string, string[]>;
    for (const [, key] of statePrompts[state]) next[key] = drafts[key] ? [...(current[key as keyof typeof current] || []), drafts[key]] : (current[key as keyof typeof current] || []);
    updateProfile({ ...profile, capacity: { ...profile.capacity, [state]: next, today: { selfSelectedState: today, loadDimensions: [], protectOne: '', adjustOne: '', updatedAt: new Date().toISOString() } } });
  };
  return <main className="pain-page" id="top"><div className="pain-shell"><aside className="pain-rail" aria-label="Pathway navigation"><div className="rail-brand"><span className="brand-mark">✦</span><span>TJR<br /><b>Mind &amp; Body</b></span></div><div className="rail-line" /><nav><a href="/pain/understand"><span>01</span>Understand</a><a href="/pain/care"><span>02</span>Find help</a><a href="#capacity"><span>03</span>Capacity</a><a href="/pain/flare"><span>04</span>Flares</a><a href="/pain/plan"><span>05</span>My plan</a></nav></aside><div className="pain-content"><header className="pain-hero"><div className="profile-status"><span>My Pain Profile · Capacity is optional</span>{saveOnDevice ? <small>Saved on this device</small> : <button onClick={enableDeviceSave}>Save on this device</button>}</div><div className="eyebrow"><span className="eyebrow-dot" /> 04 / Manage your capacity</div><h1>Manage the capacity<br /><em>you have today.</em></h1><p className="hero-lede">Don’t manage only your pain. Manage the capacity you have available today.</p><p className="hero-copy">Capacity is broader than pain intensity. Two activities that take the same amount of time can use very different amounts of physical, cognitive, emotional, sensory, social or practical capacity.</p><a className="button button-dark" href="#capacity">Map your capacity <span>↓</span></a></header><section className="section-block" id="capacity"><div className="section-kicker">01 / Capacity is more than physical</div><div className="section-heading"><h2>Notice what uses<br /><em>your capacity.</em></h2><p>These are prompts for reflection, not a score or diagnosis. Open any dimension that feels useful.</p></div><div className="dimension-grid">{dimensions.map(([title, detail]) => <details key={title}><summary>{title}</summary><p>{detail}</p></details>)}</div></section><section className="section-block pattern-section"><div className="section-kicker">02 / One possible pattern</div><div className="section-heading"><h2>From catch-up<br /><em>to recovery.</em></h2><p>This visual is a pattern to notice, not a claim that every flare is caused by overactivity.</p></div><div className="pattern-visual"><div><b>Better</b><span>→</span><b>Catch up</b><span>→</span><b>Overdo</b><span>→</span><b>Flare</b><span>→</span><b>Stop</b><span>→</span><b>Recover</b></div><strong>Or try: Plan → Do → Pause → Recover → Continue</strong></div></section><section className="section-block map-section"><div className="section-kicker">03 / My Capacity Map</div><div className="section-heading"><h2>Choose your own<br /><em>Green, Amber or Red.</em></h2><p>These are personal states. You decide what they mean for you; TJR does not assign a state from symptoms.</p></div><div className="capacity-tabs" role="tablist">{(['green', 'amber', 'red'] as StateKey[]).map((key) => <button key={key} className={`${key} ${state === key ? 'selected' : ''}`} onClick={() => setState(key)} role="tab" aria-selected={state === key}>{key === 'green' ? 'Green · I have capacity' : key === 'amber' ? 'Amber · Capacity is reducing' : 'Red · Very limited'}</button>)}</div><div className="capacity-editor"><h3>{state === 'green' ? 'Green · I have capacity' : state === 'amber' ? 'Amber · Capacity is reducing' : 'Red · Very limited'}</h3>{statePrompts[state].map(([label, key]) => <label key={key}>{label}<input value={drafts[key] || ''} onChange={(event) => setDraft(key, event.target.value)} placeholder="Add your own words…" /></label>)}<button className="button button-accent" onClick={save}>Save this part of my Capacity Map <span>→</span></button></div></section><section className="section-block today-section"><div className="section-kicker">04 / My Capacity Today</div><div className="section-heading"><h2>How does your available<br /><em>capacity feel today?</em></h2><p>Choose for yourself. This is not a score, a prediction or a health tracker.</p></div><div className="today-grid">{(['green', 'amber', 'red', 'notSure'] as const).map((key) => <button key={key} className={today === key ? 'selected' : ''} onClick={() => setToday(key)}>{key === 'notSure' ? 'Not sure' : key === 'green' ? 'Green · I have capacity' : key === 'amber' ? 'Amber · Capacity is reducing' : 'Red · Very limited'}</button>)}</div><p className="today-note">You can simply review your map and leave today’s reflection blank. There is no required history.</p></section><section className="next-step"><div className="progress-strip"></div><div className="next-step-copy"><div><div className="section-kicker">Capacity becomes part of your plan</div><h2>Keep the useful<br /><em>next step visible.</em></h2><p>Your saved Capacity Map can later help you prepare for difficult pain days. You can return to the Flare Plan whenever you are ready.</p></div><a className="button button-dark" href="/pain/understand">Review your pathway <span>↗</span></a></div></section></div></div></main>;
}
