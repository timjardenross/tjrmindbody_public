'use client';

import { useState } from 'react';

const factors = [
  ['Body', 'Injury, illness, inflammation and physical conditions can contribute to pain.', '◈', 'blue'],
  ['Nervous system', 'Nerves, the spinal cord and brain help detect, process and respond to potential threat.', '✦', 'purple'],
  ['Sleep', 'Pain can disrupt sleep, while poor sleep can also influence the experience of pain.', '☾', 'sky'],
  ['Movement', 'Movement, activity, strength and physical conditioning can influence function and pain.', '↗', 'green'],
  ['Stress & emotions', 'Stress and emotions interact with the nervous system. That does not make pain less real.', '∿', 'gold'],
  ['Life & environment', 'Work, relationships, finances, social connection and access to healthcare all matter.', '⌂', 'teal'],
  ['Biology', 'Health conditions, genetics, age and other biological factors can contribute.', '✣', 'coral'],
  ['Experiences', 'Previous injuries, treatments and experiences can influence how the protective system responds.', '◷', 'sand'],
];

const nav = [
  ['01', 'Start here', 'top'],
  ['02', 'How pain persists', 'persists'],
  ['03', 'What influences pain', 'factors'],
  ['04', 'Map your pain', 'map'],
  ['05', 'Trusted resources', 'resources'],
];

export default function UnderstandPainPage() {
  const [activeFactor, setActiveFactor] = useState(0);
  const [saved, setSaved] = useState(false);

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
            <div className="truth-callout"><span className="callout-icon">!</span><div><b>Your pain is still real.</b><p>Changes in the pain system do not mean the pain is imagined or “all in your head.”</p></div></div>
          </section>

          <section className="section-block factors-section" id="factors">
            <div className="section-kicker">02 / The bigger picture</div>
            <div className="section-heading"><h2>Pain is more than<br /><em>one signal.</em></h2><p>Different factors can turn the volume up or down. Tap a factor to see how it can shape your pain experience.</p></div>
            <div className="factor-layout"><div className="factor-wheel"><div className="wheel-ring" /><div className="wheel-center"><span>YOUR</span><b>PAIN<br />EXPERIENCE</b></div>{factors.map(([title, detail, icon, color], index) => <button key={title} className={`factor-chip chip-${color} ${activeFactor === index ? 'active' : ''}`} onClick={() => setActiveFactor(index)}><span>{icon}</span>{title}</button>)}</div><div className="factor-detail"><div className="detail-index">0{activeFactor + 1} / 08</div><div className="detail-icon">{factors[activeFactor][2]}</div><h3>{factors[activeFactor][0]}</h3><p>{factors[activeFactor][1]}</p><div className="detail-hint">The goal isn’t to find one cause. It’s to notice what may be influencing your experience right now.</div></div></div>
          </section>

          <section className="stat-band"><div><b>5.4M+</b><span>Australians live with chronic pain.</span></div><div><b>38%</b><span>of 2026 survey respondents reported developing chronic pain before age 25.</span></div><p>The 38% figure relates to respondents to the 2026 National Pain Survey — not 38% of all Australians with chronic pain.</p></section>

          <section className="section-block map-section" id="map">
            <div className="section-kicker">03 / Turn knowledge into something useful</div>
            <div className="section-heading"><h2>Map your pain.<br /><em>Not just a number.</em></h2><p>A 0–10 pain score tells your healthcare team one thing. Your pain story tells them much more.</p></div>
            <div className="map-grid">{[['Where?', 'Where do you experience pain?'], ['What?', 'Burning · aching · stabbing · shooting'], ['When?', 'Constant · intermittent · during activity'], ['What changes it?', 'Movement · rest · sleep · stress'], ['What does it affect?', 'Sleep · work · mood · relationships'], ['What matters most?', 'If one part of life improved, what would you choose?']].map(([title, prompt]) => <label key={title}><span>{title}</span><p>{prompt}</p><input aria-label={title} placeholder="Write a few words…" /></label>)}</div>
            <button className={`button button-accent ${saved ? 'saved' : ''}`} onClick={() => setSaved(true)}>{saved ? 'Pain Snapshot started ✓' : 'Create my Pain Snapshot'} <span>→</span></button>
          </section>

          <section className="resources-section" id="resources"><div className="section-kicker">04 / Keep exploring</div><div className="section-heading"><h2>Trusted<br /><em>resources.</em></h2><p>You don’t have to understand everything at once. Start with the source that fits the question you have today.</p></div><div className="resource-list"><a href="https://www.healthdirect.gov.au/chronic-pain" target="_blank" rel="noreferrer"><span>Healthdirect</span><b>Chronic pain</b><i>↗</i></a><a href="https://www.painaustralia.org.au/about-pain/what-is-pain" target="_blank" rel="noreferrer"><span>Painaustralia</span><b>What is pain?</b><i>↗</i></a><a href="https://www.painaustralia.org.au/" target="_blank" rel="noreferrer"><span>Pathways to Pain Management</span><b>Find support in Australia</b><i>↗</i></a></div></section>

          <footer className="pain-footer"><div className="footer-mark">✦</div><div><b>TJR Mind &amp; Body</b><span>Mind. Body. Resilience.</span></div><p>This guide is for education and is not a substitute for medical advice, diagnosis or treatment. Speak with your GP or qualified healthcare professional about your situation.</p></footer>
        </div>
      </div>
    </main>
  );
}
