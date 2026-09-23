const steps = [
  ['01', 'Understand', '/pain/understand'],
  ['02', 'Find help', '/pain/care'],
  ['03', 'Capacity', '/pain/capacity'],
  ['04', 'Flares', '/pain/flare'],
  ['05', 'My Pain Plan', '/pain/plan'],
] as const;

export function PathwayGlobalNav() {
  return <nav className="pathway-global-nav" aria-label="Persistent Pain Pathway"><span className="pathway-global-label">Pain Pathway</span>{steps.map(([number, label, href]) => <a href={href} key={href}><b>{number}</b> {label}</a>)}</nav>;
}

export function PathwayRail({ current }: { current: number }) {
  return <aside className="pain-rail" aria-label="Persistent Pain Pathway"><div className="rail-brand"><span className="brand-mark">✦</span><span>TJR<br /><b>Mind &amp; Body</b></span></div><div className="rail-line" /><nav>{steps.map(([number, label, href], index) => <a className={index + 1 === current ? 'current' : ''} href={href} aria-current={index + 1 === current ? 'step' : undefined} key={href}><span>{number}</span>{label}</a>)}</nav><div className="rail-note">Living well with persistent pain<br /><b>— an Australian guide</b></div></aside>;
}

export function PathwayProgress({ current }: { current: number }) {
  return <div className="progress-strip" aria-label="Pathway progress">{steps.map(([number, label, href], index) => <span key={href} className={index + 1 === current ? 'current' : ''}>{number} {label}</span>)}</div>;
}
