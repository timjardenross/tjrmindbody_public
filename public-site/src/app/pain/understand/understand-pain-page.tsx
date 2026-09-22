'use client';

import { useState } from 'react';
import { usePainProfile } from '@/components/pain/PainProfileProvider';
import { buildPainOutput, countStartedSections, type InfluenceLevel } from '@/lib/pain-profile';

const factors = [
  ['Body', 'Injury, illness, inflammation and physical conditions can contribute to pain.', '◈', 'blue', 'Learn about body and pain'],
  ['Nervous system', 'Nerves, the spinal cord and brain help detect, process and respond to potential threat.', '✦', 'purple', 'Understand pain processing'],
  ['Sleep', 'Pain can disrupt sleep, while poor sleep can also influence the experience of pain.', '☾', 'sky', 'Learn about sleep and pain'],
  ['Movement', 'Movement, activity, strength and physical conditioning can influence function and pain.', '↗', 'green', 'Explore movement options'],
  ['Stress & emotions', 'Stress and emotions interact with the nervous system. That does not make pain less real.', '∿', 'gold', 'Understand mind and body'],
  ['Life & environment', 'Work, relationships, finances, social connection and access to healthcare all matter.', '⌂', 'teal', 'Build your capacity plan'],
  ['Biology', 'Health conditions, genetics, age and other biological factors can contribute.', '✣', 'coral', 'Explore your health context'],
  ['Experiences', 'Previous injuries, treatments and experiences can influence how the protective system responds.', '◷', 'sand', 'Make sense of your pain story'],
];

const nav = [
  ['01', 'Start here', 'top'],
  ['02', 'How pain persists', 'persists'],
  ['03', 'What influences pain', 'factors'],
  ['04', 'Map your pain', 'map'],
  ['05', 'Trusted resources', 'resources'],
];
const influenceKeys = ['body', 'nervousSystem', 'sleep', 'movement', 'stressEmotions', 'lifeEnvironment', 'biology', 'experiences'] as const;

export default function UnderstandPainPage() {
  const [activeFactor, setActiveFactor] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { profile, saveOnDevice, enableDeviceSave, updateProfile, clearProfile } = usePainProfile();

  const updateAnswer = (label: string, value: string) => setAnswers((current) => ({ ...current, [label]: value }));
  const saveSnapshot = () => {
    const next = { ...profile, painSnapshot: { ...profile.painSnapshot, where: answers['Where?'] || '', what: answers['What?'] || '', when: answers['When?'] || '', changes: answers['What changes it?'] || '', affects: answers['What does it affect?'] || '' } };
    updateProfile(next);
    setSaved(true);
    setShowSnapshot(true);
  };
  const exportProfile = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tjr-pain-profile.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="pain-page" id="top">
      <div className="pain-shell">
        <aside className="pain-rail" aria-label="Guide sections">
          <div className="rail-brand"><span className="brand-mark">✦</span><span>TJR<br /><b>Mind &amp; Body</b></span></div>
          <div className="rail-line" />
          <nav>{nav.map(([number, label, href]) => <a href={`#${href}`} key={href}><span>{number}</span>{label}</a>)}</nav>
          <div className="rail-note">Living well with persistent pain<br /><b>— an Australian guide</b></div>
        </aside>

        <div className="pain-content">
          <header className="pain-hero" id="start-here">
            <div className="profile-status"><span>My Pain Profile · {countStartedSections(profile)} of 7 sections started</span>{saveOnDevice ? <><small>Saved on this device</small><button onClick={exportProfile}>Export</button><button onClick={() => { if (window.confirm('Clear your saved Pain Profile from this device?')) clearProfile(); }}>Clear</button></> : <><small>Session only</small><button onClick={enableDeviceSave}>Save on this device</button></>}</div>
            <div className="eyebrow"><span className="eyebrow-dot" /> A practical guide to persistent pain <span className="read-time">4 min read</span></div>
            <h1>Understand<br /><em>your pain.</em></h1>
            <p className="hero-lede">Pain is real. But pain isn’t always a measure of damage.</p>
            <p className="hero-copy">Understanding what’s happening doesn’t make the pain disappear. But it can help you make sense of your experience, communicate with your healthcare team and make more informed choices about managing it.</p>
            <div className="hero-actions"><a href="#persists" className="button button-dark">Start with the basics <span>↓</span></a><span className="hero-footnote">Designed to read in one sitting.<br />Useful to return to when you need it.</span></div>
          </header>

          <section className="section-block" id="persists">
            <div className="section-kicker">01 / The starting point</div>
            <div className="section-heading"><h2>Pain that persists<br /><em>is different.</em></h2><p>Persistent or chronic pain generally means pain lasting for three months or longer, or beyond the expected healing time.</p></div>
            <div className="pain-paths">
              <div className="path-card acute"><div className="path-label">Acute pain <span>usually settles</span></div><div className="path-flow"><b>Something happens</b><i>→</i><b>Protection</b><i>→</i><b>Healing</b><i>→</i><strong>Pain settles</strong></div></div>
              <div className="path-card persistent"><div className="path-label">Persistent pain <span>the system can change</span></div><div className="path-flow"><b>Something happens</b><i>→</i><b>Protection</b><i>→</i><b>Pain system changes</b><i>→</i><strong>Pain continues</strong></div></div>
            </div>
            <details className="explain-card"><summary>What does “the pain system changes” mean?</summary><p>With persistent pain, the nervous system can become more sensitive and protective. Signals that previously caused little or no pain may feel stronger, and the system can stay alert even after an injury has healed.</p><p>This doesn’t mean every person’s pain works the same way, or that an underlying condition no longer matters.</p></details>
            <div className="scan-card"><div className="scan-card-icon">⌕</div><div><b>Why doesn’t my scan explain my pain?</b><p>Scans and tests can be important for diagnosing and monitoring health conditions. But they don’t directly measure how much pain someone experiences.</p><strong>A scan and a pain score answer different questions.</strong><p>Your symptoms, examination, medical history, investigations and the impact on your life all contribute to the clinical picture.</p></div></div>
            <div className="truth-callout"><span className="callout-icon">!</span><div><b>Your pain is still real.</b><p>Changes in the pain system do not mean the pain is imagined or “all in your head.”</p></div></div>
          </section>

          <section className="section-block factors-section" id="factors">
            <div className="section-kicker">02 / The bigger picture</div>
            <div className="section-heading"><h2>Pain is more than<br /><em>one signal.</em></h2><p>Different factors can turn the volume up or down. Tap a factor to see how it can shape your pain experience.</p></div>
            <div className="factor-layout"><div className="factor-wheel"><div className="wheel-ring" /><div className="wheel-center"><span>YOUR</span><b>PAIN<br />EXPERIENCE</b></div>{factors.map(([title, detail, icon, color], index) => <button key={title} className={`factor-chip chip-${color} ${activeFactor === index ? 'active' : ''}`} onClick={() => setActiveFactor(index)}><span>{icon}</span>{title}</button>)}</div><div className="factor-detail"><div className="detail-index">0{activeFactor + 1} / 08</div><div className="detail-icon">{factors[activeFactor][2]}</div><h3>{factors[activeFactor][0]}</h3><p>{factors[activeFactor][1]}</p><div className="influence-choice"><span>Does this affect you?</span><div>{[['notReally', 'Not really'], ['sometimes', 'Sometimes'], ['often', 'Often']].map(([value, label]) => <button key={value} className={profile.influences[influenceKeys[activeFactor]] === value ? 'selected' : ''} onClick={() => updateProfile({ ...profile, influences: { ...profile.influences, [influenceKeys[activeFactor]]: value as InfluenceLevel } })}>{label}</button>)}</div></div><a className="detail-link" href="#resources">{factors[activeFactor][4]} <span>→</span></a><div className="detail-hint">The goal isn’t to find one cause. It’s to notice what may be influencing your experience right now.</div></div></div>
          </section>

          <section className="stat-band"><div className="stat-heading">Pain in Australia · 2026</div><div><b>5.4M+</b><span>Australians live with chronic pain.</span></div><div><b>38%</b><span>of 2026 survey respondents reported developing chronic pain before age 25.</span></div><p>The 38% figure relates to respondents to the 2026 National Pain Survey — not 38% of all Australians with chronic pain.</p></section>

          <section className="section-block map-section" id="map">
            <div className="section-kicker">03 / Turn knowledge into something useful</div>
            <div className="section-heading"><h2>Map your pain.<br /><em>Not just a number.</em></h2><p>A 0–10 pain score tells your healthcare team one thing. Your pain story tells them much more.</p></div>
            <div className="map-grid">{[['Where?', 'Where do you experience pain?'], ['What?', 'Burning · aching · stabbing · shooting'], ['When?', 'Constant · intermittent · during activity'], ['What changes it?', 'Movement · rest · sleep · stress'], ['What does it affect?', 'Sleep · work · mood · relationships'], ['What matters most?', 'If one part of life improved, what would you choose?']].map(([title, prompt]) => <label key={title}><span>{title}</span><p>{prompt}</p><input aria-label={title} value={answers[title] || ''} onChange={(event) => updateAnswer(title, event.target.value)} placeholder="Write a few words…" /></label>)}</div>
            <button className={`button button-accent ${saved ? 'saved' : ''}`} onClick={saveSnapshot}>{saved ? 'Pain Snapshot ready ✓' : 'Save to My Pain Profile'} <span>→</span></button>
            {showSnapshot && <div className="snapshot-preview"><div className="snapshot-head"><div><span>MY PAIN SNAPSHOT</span><h3>A starting point for your next appointment</h3></div><b>TJR<br />Mind &amp; Body</b></div>{[['Where I experience pain', 'Where?'], ['What it feels like', 'What?'], ['When it’s most noticeable', 'When?'], ['What changes it', 'What changes it?'], ['How it affects my life', 'What does it affect?'], ['What matters most to me right now', 'What matters most?']].map(([label, key]) => <div className="snapshot-row" key={label}><b>{label}</b><span>{answers[key] || 'Add a few words above'}</span></div>)}<div className="snapshot-actions"><button onClick={() => window.print()}>Print</button><button onClick={() => navigator.clipboard?.writeText(JSON.stringify(buildPainOutput(profile, 'appointmentSnapshot'), null, 2))}>Copy</button><button onClick={() => setShowSnapshot(false)}>Start again</button></div></div>}
          </section>

          <section className="resources-section" id="resources"><div className="section-kicker">04 / Keep exploring</div><div className="section-heading"><h2>Trusted<br /><em>resources.</em></h2><p><b>Choose what you need today.</b><br />You don’t have to understand everything at once.</p></div><div className="resource-list"><a href="https://www.healthdirect.gov.au/chronic-pain" target="_blank" rel="noreferrer"><span>🇦🇺 I want a straightforward overview</span><b>Healthdirect — Chronic pain<small>Australian information about chronic pain, symptoms, diagnosis, treatment and when to seek help.</small></b><i>↗</i></a><a href="https://www.painaustralia.org.au/about-pain/what-is-pain" target="_blank" rel="noreferrer"><span>🧠 I want to understand pain better</span><b>Painaustralia — What is pain?<small>Learn more about how persistent pain works and why everyone’s experience is different.</small></b><i>↗</i></a><a href="https://www.painaustralia.org.au/" target="_blank" rel="noreferrer"><span>🧭 I want practical help managing pain</span><b>Pathways to Pain Management<small>Structured Australian pain education and self-management resources.</small></b><i>↗</i></a><a href="https://www.chronicpainaustralia.org.au/national-pain-survey" target="_blank" rel="noreferrer"><span>📊 I want to see the source behind the numbers</span><b>Chronic Pain Australia — 2026 National Pain Report<small>Explore the survey data informing the Australian context on this page.</small></b><i>↗</i></a></div></section>

          <section className="next-step"><div className="progress-strip"><b>01 Understand</b><span>→</span><span>02 Find Help</span><span>→</span><span>03 Treatments</span><span>→</span><span>04 Capacity</span><span>→</span><span>05 Flares</span><span>→</span><span>06 My Plan</span></div><div className="next-step-copy"><div><div className="section-kicker">You’ve done 01</div><h2>Understanding your pain<br /><em>is the starting point.</em></h2><p>The next step is understanding who can help — and what each part of the Australian pain-care system actually does.</p></div><a className="button button-dark" href="/pain/care">02 — Find the right help <span>→</span></a></div><div className="next-step-tags">GPs · pain specialists · allied health · multidisciplinary pain services · navigating Australian care</div></section>

          <footer className="pain-footer"><div className="footer-mark">✦</div><div><b>TJR Mind &amp; Body</b><span>Mind. Body. Resilience.</span></div><p>This guide is for education and is not a substitute for medical advice, diagnosis or treatment. Speak with your GP or qualified healthcare professional about your situation.</p></footer>
        </div>
      </div>
    </main>
  );
}
