import { revsAssessmentSystems, type RevsStage } from './revs';

export const REVS_NOW_STORAGE_KEY = 'revs-v3-now-state';

export type RevsAuthState = {
  email: string;
  password: string;
};

export type RevsAssessmentState = {
  scores: number[];
  notes: string;
};

export type RevsCapacityProfile = Record<string, number>;

export type RevsRecommendation = {
  slug: string;
  title: string;
  summary: string;
  stage: RevsStage;
  principles: string[];
};

export type RevsNowState = {
  authed: boolean;
  email: string;
  stage: RevsStage;
  profile: RevsCapacityProfile;
  assessment: RevsAssessmentState;
  completedAt: string | null;
};

export const DEFAULT_REVS_NOW_STATE: RevsNowState = {
  authed: false,
  email: '',
  stage: 'Recognise',
  profile: Object.fromEntries(revsAssessmentSystems.map((item) => [item, 2])),
  assessment: {
    scores: Array.from({ length: revsAssessmentSystems.length }, () => 2),
    notes: '',
  },
  completedAt: null,
};

export type RevsStageMeaning = {
  title: string;
  body: string;
  queueLabel: string;
};

export function detectRevsStage(scores: number[]): RevsStage {
  const average = scores.reduce((sum, score) => sum + score, 0) / Math.max(scores.length, 1);
  if (average < 1.25) return 'Recognise';
  if (average < 2.2) return 'Regulate';
  if (average < 3.1) return 'Rebuild';
  return 'Redesign';
}

export function buildCapacityProfile(scores: number[]): RevsCapacityProfile {
  return Object.fromEntries(revsAssessmentSystems.map((system, index) => [system, scores[index] ?? 0]));
}

export function getRevsStageMeaning(stage: RevsStage): RevsStageMeaning {
  if (stage === 'Recognise') {
    return {
      title: 'Notice what is draining capacity',
      body: 'Start by reducing noise, spotting patterns, and building a shared language for strain before trying to change everything at once.',
      queueLabel: 'Start here',
    };
  }

  if (stage === 'Regulate') {
    return {
      title: 'Stabilise before you build',
      body: 'Use short, practical tools to lower load and protect recovery. Keep the next move small and repeatable.',
      queueLabel: 'Build calm first',
    };
  }

  if (stage === 'Rebuild') {
    return {
      title: 'Design routines that flex with real life',
      body: 'Turn what works into repeatable structures, but keep room for pain, energy changes, and executive function limits.',
      queueLabel: 'Turn tools into routines',
    };
  }

  return {
    title: 'Change the system around you',
    body: 'Use what you know about your capacity to advocate for adjustments, redesign expectations, and reduce friction at the source.',
    queueLabel: 'Move into advocacy',
  };
}

export function getRevsStageGuidance(stage: RevsStage) {
  const guidance: Record<RevsStage, { title: string; body: string; principles: string[] }> = {
    Recognise: {
      title: 'Notice strain before trying to solve it',
      body:
        'This stage helps the user map what is draining capacity across the 12 systems, so the next step is smaller, clearer, and less defensive.',
      principles: ['capacity over deficit', 'low cognitive load'],
    },
    Regulate: {
      title: 'Stabilise the system and reduce load',
      body:
        'This stage focuses on nervous system regulation, boundaries, and protecting recovery so the user can keep moving without tipping further into overload.',
      principles: ['sustainability over heroism', 'autonomy and agency'],
    },
    Rebuild: {
      title: 'Rebuild routines that flex with real life',
      body:
        'This stage supports repeatable structure, practical routines, and environmental changes that fit changing pain, energy, and executive function.',
      principles: ['practical and specific', 'low cognitive load'],
    },
    Redesign: {
      title: 'Change the conditions around the user',
      body:
        'This stage shifts from individual coping to advocacy, accommodation, and system redesign so capacity is supported at the source.',
      principles: ['honour lived experience', 'autonomy and agency'],
    },
  };

  return guidance[stage];
}

function slugifyConcept(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function getStageAwareRecommendations(stage: RevsStage): RevsRecommendation[] {
  const guidance = getRevsStageGuidance(stage);
  const recommendations: Record<RevsStage, RevsRecommendation[]> = {
    Recognise: [
      {
        slug: 'sensory-processing-overload',
        title: 'Sensory Processing & Overload',
        summary: 'Spot how sensory input accumulates and why overload can look different across people and settings.',
        stage: 'Recognise',
        principles: ['capacity over deficit', 'low cognitive load', 'practical and specific'],
      },
      {
        slug: slugifyConcept('Capacity basics'),
        title: 'Capacity basics',
        summary: 'Build a shared language for what capacity is, what strains it, and what helps protect it.',
        stage: 'Recognise',
        principles: guidance.principles,
      },
      {
        slug: 'pacing-and-rest',
        title: 'Pacing and Rest',
        summary: 'Notice the difference between overdoing, recovery, and sustainable pacing without turning rest into a punishment.',
        stage: 'Recognise',
        principles: ['sustainability over heroism', 'autonomy and agency'],
      },
    ],
    Regulate: [
      {
        slug: 'pacing-and-rest',
        title: 'Pacing and Rest',
        summary: 'Use pacing and rest as load-management tools that support recovery without asking the user to do more than needed.',
        stage: 'Regulate',
        principles: ['sustainability over heroism', 'autonomy and agency'],
      },
      {
        slug: slugifyConcept('Workload mapping'),
        title: 'Workload mapping',
        summary: 'Make visible where effort, friction, and overwhelm are building so the next change is specific and practical.',
        stage: 'Regulate',
        principles: guidance.principles,
      },
      {
        slug: slugifyConcept('Task initiation'),
        title: 'Task initiation',
        summary: 'Support the first step with less activation, less ambiguity, and fewer moving parts.',
        stage: 'Regulate',
        principles: guidance.principles,
      },
    ],
    Rebuild: [
      {
        slug: 'sustainable-routines',
        title: 'Sustainable Routines',
        summary: 'Turn what works into repeatable routines that still flex when energy, pain, or attention shifts.',
        stage: 'Rebuild',
        principles: ['practical and specific', 'capacity over deficit', 'low cognitive load'],
      },
      {
        slug: slugifyConcept('Environment design'),
        title: 'Environment design',
        summary: 'Shape the surroundings so the routine is easier to start, maintain, and return to after interruption.',
        stage: 'Rebuild',
        principles: guidance.principles,
      },
      {
        slug: slugifyConcept('Task initiation'),
        title: 'Task initiation',
        summary: 'Reduce activation costs so a routine can start without a heavy executive-function lift.',
        stage: 'Rebuild',
        principles: guidance.principles,
      },
    ],
    Redesign: [
      {
        slug: slugifyConcept('Accommodations and advocacy'),
        title: 'Accommodations and Advocacy',
        summary: 'Translate capacity needs into adjustments, requests, and shared agreements that reduce friction at the source.',
        stage: 'Redesign',
        principles: ['honour lived experience', 'autonomy and agency'],
      },
      {
        slug: slugifyConcept('Boundary setting'),
        title: 'Boundary setting',
        summary: 'Protect capacity by making limits, expectations, and non-negotiables easier to communicate and keep.',
        stage: 'Redesign',
        principles: guidance.principles,
      },
      {
        slug: slugifyConcept('System redesign'),
        title: 'System redesign',
        summary: 'Change structures, defaults, and norms so the environment supports capacity instead of eroding it.',
        stage: 'Redesign',
        principles: guidance.principles,
      },
    ],
  };

  return recommendations[stage];
}

export function createRecommendedConcepts(stage: RevsStage) {
  return getStageAwareRecommendations(stage).map((item) => item.title);
}
