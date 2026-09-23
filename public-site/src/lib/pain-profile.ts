/**
 * Versioned, local-first data contract for the Persistent Pain Pathway.
 * This is a self-management aid, not a clinical record.
 */
export const PAIN_PROFILE_SCHEMA_VERSION = 1;

export type InfluenceKey =
  | 'body'
  | 'nervousSystem'
  | 'sleep'
  | 'movement'
  | 'stressEmotions'
  | 'lifeEnvironment'
  | 'biology'
  | 'experiences';

export type InfluenceLevel = 'notReally' | 'sometimes' | 'often';

export type PainProfile = {
  schemaVersion: 1;
  createdAt: string;
  updatedAt: string;
  whatMatters: { priority: string };
  painSnapshot: {
    where: string;
    what: string;
    when: string;
    changes: string;
    affects: string;
  };
  influences: Partial<Record<InfluenceKey, InfluenceLevel>>;
  care: { needs: string[]; roles: Record<string, string>; questions: string[] };
  capacity: {
    green: { signs: string[]; maintain: string[]; useCapacityFor: string[] };
    amber: { warningSigns: string[]; reduce: string[]; delay: string[]; change: string[]; protect: string[] };
    red: { signs: string[]; essential: string[]; canWait: string[]; recoverySupports: string[]; loadSupport: string[] };
    today?: { selfSelectedState: 'green' | 'amber' | 'red' | 'notSure'; loadDimensions: string[]; protectOne: string; adjustOne: string; updatedAt: string };
  };
  flarePlan: {
    usualPattern: string;
    warningSigns: string[];
    helps: string[];
    worsens: string[];
    reduce: string[];
    maintain: string[];
    support: string[];
    escalationPlan: string;
    updatedAt: string;
  };
  treatmentMap: { current: string[]; previous: string[]; discuss: string[] };
  nextSteps: string[];
};

export const EMPTY_PAIN_PROFILE: PainProfile = {
  schemaVersion: PAIN_PROFILE_SCHEMA_VERSION,
  createdAt: '',
  updatedAt: '',
  whatMatters: { priority: '' },
  painSnapshot: { where: '', what: '', when: '', changes: '', affects: '' },
  influences: {},
  care: { needs: [], roles: {}, questions: [] },
  capacity: {
    green: { signs: [], maintain: [], useCapacityFor: [] },
    amber: { warningSigns: [], reduce: [], delay: [], change: [], protect: [] },
    red: { signs: [], essential: [], canWait: [], recoverySupports: [], loadSupport: [] },
  },
  flarePlan: { usualPattern: '', warningSigns: [], helps: [], worsens: [], reduce: [], maintain: [], support: [], escalationPlan: '', updatedAt: '' },
  treatmentMap: { current: [], previous: [], discuss: [] },
  nextSteps: [],
};

export function createEmptyPainProfile(now = new Date().toISOString()): PainProfile {
  return { ...structuredClone(EMPTY_PAIN_PROFILE), createdAt: now, updatedAt: now };
}

export function mergePainProfile(raw: unknown): PainProfile {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Partial<PainProfile>;
  const base = createEmptyPainProfile();
  return {
    ...base,
    ...value,
    schemaVersion: PAIN_PROFILE_SCHEMA_VERSION,
    whatMatters: { ...base.whatMatters, ...(value.whatMatters || {}) },
    painSnapshot: { ...base.painSnapshot, ...(value.painSnapshot || {}) },
    influences: { ...base.influences, ...(value.influences || {}) },
    care: { ...base.care, ...(value.care || {}) },
    capacity: {
      ...base.capacity,
      ...(value.capacity || {}),
      green: { ...base.capacity.green, ...(value.capacity?.green || {}) },
      amber: { ...base.capacity.amber, ...(value.capacity?.amber || {}) },
      red: { ...base.capacity.red, ...(value.capacity?.red || {}) },
    },
    flarePlan: { ...base.flarePlan, ...(value.flarePlan || {}) },
    treatmentMap: { ...base.treatmentMap, ...(value.treatmentMap || {}) },
    nextSteps: value.nextSteps || [],
  };
}

export function countStartedSections(profile: PainProfile): number {
  const sections = [
    profile.whatMatters.priority,
    Object.values(profile.painSnapshot).some(Boolean),
    Object.keys(profile.influences).length > 0,
    profile.care.needs.length > 0 || Object.keys(profile.care.roles).length > 0 || profile.care.questions.length > 0,
    Object.values(profile.capacity.green).some((items) => items.length > 0) || Object.values(profile.capacity.amber).some((items) => items.length > 0) || Object.values(profile.capacity.red).some((items) => items.length > 0),
    Object.keys(profile.flarePlan).length > 0,
    profile.treatmentMap.current.length > 0 || profile.treatmentMap.previous.length > 0 || profile.treatmentMap.discuss.length > 0,
  ];
  return sections.filter(Boolean).length;
}

export type PainOutput = 'painPlan' | 'appointmentSnapshot' | 'flareCard';

export function buildPainOutput(profile: PainProfile, output: PainOutput) {
  if (output === 'appointmentSnapshot') {
    return {
      title: 'My Appointment Snapshot',
      purpose: 'A concise aid for a healthcare conversation. It is not a clinical record.',
      sections: [
        ['What matters to me', profile.whatMatters.priority],
        ['My pain snapshot', Object.values(profile.painSnapshot).filter(Boolean).join(' · ')],
        ['Influences I notice', Object.keys(profile.influences).join(', ')],
        ['What I want to discuss', profile.care.questions.join(' · ')],
      ],
    };
  }
  if (output === 'flareCard') {
    return { title: 'My Flare Card', purpose: 'A quick reference built from choices you have saved.', sections: [['What I notice', [...profile.flarePlan.warningSigns, profile.flarePlan.usualPattern].filter(Boolean).join(' · ')], ['What helps', profile.flarePlan.helps.join(' · ')], ['What tends to make it harder', profile.flarePlan.worsens.join(' · ')], ['What I can reduce', profile.flarePlan.reduce.join(' · ')], ['What I maintain', profile.flarePlan.maintain.join(' · ')], ['Support', profile.flarePlan.support.join(' · ')], ['My health plan', profile.flarePlan.escalationPlan]] };
  }
  return {
    title: 'My Pain Plan',
    purpose: 'A personal self-management summary built from information you chose to save.',
    sections: [
      ['What matters to me', profile.whatMatters.priority],
      ['Pain snapshot', Object.values(profile.painSnapshot).filter(Boolean).join(' · ')],
      ['Care team', Object.values(profile.care.roles).filter(Boolean).join(' · ')],
      ['Capacity', [...Object.values(profile.capacity.green), ...Object.values(profile.capacity.amber), ...Object.values(profile.capacity.red)].flat().join(' · ')],
      ['Treatments to discuss', profile.treatmentMap.discuss.join(' · ')],
      ['My next steps', profile.nextSteps.join(' · ')],
    ],
  };
}
