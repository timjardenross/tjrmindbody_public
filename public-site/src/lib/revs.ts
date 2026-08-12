export type RevsStage = 'Recognise' | 'Regulate' | 'Rebuild' | 'Redesign';

export type RevsAudience = 'Individual' | 'Therapist' | 'Workplace' | 'Educator';

export type RevsFormat =
  | 'Poster'
  | 'Video script'
  | 'Article'
  | 'Worksheet'
  | 'Presentation'
  | 'Podcast'
  | 'Social';

export type RevsDepth = '1-minute' | '5-minute' | '20-minute' | '60-minute';

export type RevsConcept = {
  slug: string;
  title: string;
  stage: RevsStage;
  summary: string;
  tags: string[];
  principles: string[];
  audiences: RevsAudience[];
  formats: RevsFormat[];
  depths: RevsDepth[];
  prerequisites: string[];
  pairsWith: string[];
  evidence: string[];
  accessibilityNotes: string[];
};

export const revsStages: RevsStage[] = ['Recognise', 'Regulate', 'Rebuild', 'Redesign'];

export const revsAssessmentSystems = [
  'Sensory load',
  'Energy and fatigue',
  'Pain and movement',
  'Attention and executive function',
  'Emotional regulation',
  'Sleep and recovery',
  'Environment and triggers',
  'Workload and pacing',
  'Relationships and support',
  'Identity and meaning',
  'Access and accommodations',
  'Confidence and readiness',
];

export const revsConcepts: RevsConcept[] = [
  {
    slug: 'sensory-processing-overload',
    title: 'Sensory Processing & Overload',
    stage: 'Recognise',
    summary:
      'How sensory input can become cumulative, why overload looks different across people, and how to reduce avoidable strain.',
    tags: ['sensory', 'overload', 'nervous system'],
    principles: ['capacity over deficit', 'low cognitive load', 'practical and specific'],
    audiences: ['Individual', 'Therapist', 'Workplace', 'Educator'],
    formats: ['Poster', 'Video script', 'Article', 'Worksheet', 'Presentation', 'Podcast', 'Social'],
    depths: ['1-minute', '5-minute', '20-minute', '60-minute'],
    prerequisites: ['Capacity basics'],
    pairsWith: ['Pacing and rest', 'Environment design'],
    evidence: ['Somatic and occupational therapy references', 'Trauma-informed nervous system literature'],
    accessibilityNotes: ['Avoid busy layouts', 'Use plain language', 'Provide audio-first summaries'],
  },
  {
    slug: 'pacing-and-rest',
    title: 'Pacing and Rest',
    stage: 'Regulate',
    summary: 'Why recovery requires intentional boundaries, and how pacing differs from avoidance.',
    tags: ['pacing', 'rest', 'energy'],
    principles: ['sustainability over heroism', 'autonomy and agency', 'honour lived experience'],
    audiences: ['Individual', 'Therapist', 'Workplace', 'Educator'],
    formats: ['Poster', 'Video script', 'Article', 'Worksheet', 'Presentation', 'Podcast', 'Social'],
    depths: ['1-minute', '5-minute', '20-minute', '60-minute'],
    prerequisites: ['Sensory Processing & Overload'],
    pairsWith: ['Task initiation', 'Workload mapping'],
    evidence: ['Fatigue management research', 'Chronic pain self-management evidence'],
    accessibilityNotes: ['Offer short depth first', 'Keep action steps singular'],
  },
  {
    slug: 'sustainable-routines',
    title: 'Sustainable Routines',
    stage: 'Rebuild',
    summary: 'How to design routines that flex with energy, pain, and neurodivergent needs.',
    tags: ['routine', 'habits', 'structure'],
    principles: ['practical and specific', 'capacity over deficit', 'low cognitive load'],
    audiences: ['Individual', 'Therapist', 'Workplace', 'Educator'],
    formats: ['Poster', 'Video script', 'Article', 'Worksheet', 'Presentation', 'Podcast', 'Social'],
    depths: ['1-minute', '5-minute', '20-minute', '60-minute'],
    prerequisites: ['Pacing and rest'],
    pairsWith: ['Environment design', 'Task initiation'],
    evidence: ['Behaviour change models', 'Occupational performance frameworks'],
    accessibilityNotes: ['Include examples and templates', 'Separate idea from action'],
  },
];

export const revsStageStats = [
  { stage: 'Recognise', concepts: 9, timeframe: '3-4 weeks', focus: 'Capacity awareness and shared language' },
  { stage: 'Regulate', concepts: 13, timeframe: '6-8 weeks', focus: 'Tools, boundaries, and load reduction' },
  { stage: 'Rebuild', concepts: 15, timeframe: '8-10 weeks', focus: 'Routines and sustainable design' },
  { stage: 'Redesign', concepts: 9, timeframe: '4-6 weeks', focus: 'Advocacy and system change' },
];

export const revsAssessmentFlow = [
  'Email/password sign-up',
  '60-70 question capacity assessment',
  'Capacity profile across 12 systems',
  'Stage detection and recommended entry stage',
  '3-5 concept recommendations',
];

export const revsApiEndpoints = [
  ['POST', '/api/revs/auth/register', 'Create account'],
  ['POST', '/api/revs/auth/login', 'Start session'],
  ['POST', '/api/revs/assessment', 'Save assessment and infer stage'],
  ['GET', '/api/revs/dashboard', 'Return capacity and progress summary'],
  ['GET', '/api/revs/concepts', 'List concepts and variants'],
  ['POST', '/api/revs/progress', 'Track progress and engagement'],
  ['GET', '/api/revs/export/capacity.csv', 'Download CSV export'],
] as const;

export const revsWeekPlan = [
  ['Week 1', 'Auth, assessment, stage detection, dashboard'],
  ['Week 2', 'Content schema, admin interface, concept delivery'],
  ['Week 3', 'Personalization logic, adjacent concepts, format rendering'],
  ['Week 4', 'Accessibility, testing, and deployment'],
] as const;
