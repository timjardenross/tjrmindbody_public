'use client';

import { useState } from 'react';
import { usePainProfile } from '@/components/pain/PainProfileProvider';
import { buildPainOutput, type PainProfile } from '@/lib/pain-profile';

const prompts = [
  ['helps', 'What usually helps, and what tends to make things worse', 'A few words about what helps or makes a difficult period harder…'],
  ['reduce', 'What you reduce first, and what you still try to maintain', 'A few words about what can reduce, delay, change or protect…'],
  ['support', 'Who can help, and when you would contact your healthcare team', 'A person, service or existing plan…'],
] as const;
type FlareKey = (typeof prompts)[number][0];
const displayPlanValue = (value: string | string[]) => Array.isArray(value) ? value.join(' · ') : value;

function Nav() {
  return <aside className="pain-rail" aria-label="Pathway navigation"><div className="rail-brand"><span className="brand-mark">✦</span><span>TJR<br /><b>Mind &amp; Body</b></span></div><div className="rail-line" /><nav><a href="/pain/understand"><span>01</span>Understand</a><a href="/pain/care"><span>02</span>Find help</a><a href="/pain/capacity"><span>03</span>Capacity</a><a href="#flare"><span>04</span>Flares</a><a href="/pain/plan"><span>05</span>My plan</a></nav></aside>;
}

function FlareCard({ profile, onClose }: { profile: PainProfile; onClose: () => void }) {
  const output = buildPainOutput(profile, 'flareCard');
  return <section className="section-block flare-card-section"><div className="flare-card"><div className="flare-card-head"><span>MY FLARE CARD</span><b>TJR Mind &amp; Body</b></div><p className="flare-card-note">Your own preparation — not a clinical record or medical treatment plan.</p>{output.sections.filter(([, value]) => value).map(([label, value]) => <div className="flare-card-row" key={label}><b>{label}</b><p>{value}</p></div>)}<div className="snapshot-actions"><button onClick={() => window.print()}>Print / save a copy</button><button onClick={onClose}>Close</button></div><small>Saved or printed copies may contain personal information. Keep them somewhere appropriate.</small></div></section>;
}

export default function FlarePage() {
  const { profile, updateProfile, saveOnDevice, enableDeviceSave } = usePainProfile();
  const [mode, setMode] = useState<'prepare' | 'badDay'>('prepare');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [showCard, setShowCard] = useState(false);
  const plan = profile.flarePlan;
  const savedSections = [plan.usualPattern, ...plan.warningSigns, ...plan.helps, ...plan.worsens, ...plan.reduce, ...plan.maintain, ...plan.support, plan.escalationPlan].filter(Boolean);
  const add = (key: FlareKey) => {
    const value = drafts[key]?.trim();
    if (!value) return;
    const current = plan[key];
    const nextValue = Array.isArray(current) ? [...current, value] : value;
    updateProfile({ ...profile, flarePlan: { ...plan, [key]: nextValue, updatedAt: new Date().toISOString() } });
    setDrafts((currentDrafts) => ({ ...currentDrafts, [key]: '' }));
  };
  return <main className="pain-page flare-page" id="top"><div className="pain-shell"><Nav /><div className="pain-content"><header className="pain-hero"><div className="profile-status"><span>My Pain Profile · Flare plan {savedSections.length ? 'started' : 'not started'}</span>{saveOnDevice ? <small>Saved on this device</small> : <button onClick={enableDeviceSave}>Save on this device</button>}</div><div className="eyebrow"><span className="eyebrow-dot" /> 05 / Prepare for flares</div><h1>Be prepared for<br /><em>a difficult day.</em></h1><p className="hero-lede">Make decisions while capacity is available. Retrieve them when capacity isn’t.</p><p className="hero-copy">A flare is a planning concept, not a diagnosis. You can describe what a difficult pain period usually looks like for you, then keep your own choices close by.</p><div className="mode-switch"><button className={mode === 'prepare' ? 'selected' : ''} onClick={() => setMode('prepare')}>Prepare my Flare Plan</button><button className={mode === 'badDay' ? 'selected bad' : ''} onClick={() => setMode('badDay')}>I’m having a bad pain day</button></div></header>{mode === 'prepare' ? <section className="section-block" id="flare"><div className="section-kicker">01 / Prepare while you have capacity</div><div className="section-heading"><h2>A practical plan<br /><em>in your own words.</em></h2><p>Every section is optional. Add one useful thing and come back later.</p></div><div className="flare-editor">{prompts.map(([key, label, placeholder]) => { const stored = plan[key]; return <label key={key}><span>{label}</span>{Array.isArray(stored) && stored.length > 0 && <small>Saved: {displayPlanValue(stored)}</small>}<input value={drafts[key] || ''} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} onKeyDown={(event) => { if (event.key === 'Enter') add(key); }} /><button onClick={() => add(key)}>Add</button></label>; })}</div><button className="button button-accent" onClick={() => setShowCard(true)}>View My Flare Card <span>→</span></button></section> : <section className="bad-day-section" id="flare"><div className="bad-day-inner"><div className="section-kicker">Bad pain day mode</div><h2>You don’t need to work through the whole website.</h2><p>Use what you have already chosen, or go straight to help. You do not need to type anything here.</p>{savedSections.length > 0 ? <button className="bad-day-primary" onClick={() => setShowCard(true)}>Use My Flare Plan <span>→</span></button> : <div className="bad-day-empty"><b>No Flare Plan has been saved yet.</b><p>You can still get health advice or emergency help now. Prepare a plan later when you have more capacity.</p></div>}<div className="bad-day-routes"><a href="https://www.healthdirect.gov.au/" target="_blank" rel="noreferrer"><b>I need health advice</b><span>Healthdirect Australia ↗</span></a><a href="https://www.healthdirect.gov.au/when-to-call-000" target="_blank" rel="noreferrer"><b>Something feels different or seriously wrong</b><span>Seek appropriate health assessment ↗</span></a><a className="emergency-route" href="tel:000"><b>Emergency — call 000</b><span>Triple Zero in an emergency</span></a></div><button className="back-to-prepare" onClick={() => setMode('prepare')}>Back to Prepare my Flare Plan</button></div></section>}{showCard && <FlareCard profile={profile} onClose={() => setShowCard(false)} />}<section className="next-step"><div className="progress-strip"></div><div className="next-step-copy"><div><div className="section-kicker">Next</div><h2>Review your choices<br /><em>when you’re ready.</em></h2><p>Your Flare Plan is part of the same profile used by the future My Pain Plan. You can return to the care and options guide whenever you are ready.</p></div><a className="button button-dark" href="/pain/capacity">Review capacity <span>↗</span></a></div></section></div></div></main>;
}
