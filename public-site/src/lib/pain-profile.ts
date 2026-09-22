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
  capacity: { green: string[]; amber: string[]; red: string[] };
  flarePlan: Record<string, string>;
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
  capacity: { green: [], amber: [], red: [] },
  flarePlan: {},
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
    capacity: { ...base.capacity, ...(value.capacity || {}) },
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
    profile.capacity.green.length > 0 || profile.capacity.amber.length > 0 || profile.capacity.red.length > 0,
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
    return { title: 'My Flare Card', purpose: 'A quick reference built from choices you have saved.', sections: Object.entries(profile.flarePlan) };
  }
  return {
    title: 'My Pain Plan',
    purpose: 'A personal self-management summary built from information you chose to save.',
    sections: [
      ['What matters to me', profile.whatMatters.priority],
      ['Pain snapshot', Object.values(profile.painSnapshot).filter(Boolean).join(' · ')],
      ['Care team', Object.values(profile.care.roles).filter(Boolean).join(' · ')],
      ['Capacity', [...profile.capacity.green, ...profile.capacity.amber, ...profile.capacity.red].join(' · ')],
      ['Treatments to discuss', profile.treatmentMap.discuss.join(' · ')],
      ['My next steps', profile.nextSteps.join(' · ')],
    ],
  };
}
