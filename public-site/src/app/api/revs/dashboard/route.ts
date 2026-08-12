import { NextResponse } from 'next/server';
import { revsAssessmentSystems, revsConcepts } from '@/lib/revs';
import { getLatestRevsAssessment, hasRevsDatabase } from '@/lib/revs-db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email') || undefined;
  if (hasRevsDatabase()) {
    const latest = await getLatestRevsAssessment(email);
    if (latest) {
      const nextQueue = revsConcepts
        .filter((concept) => concept.stage === latest.stage)
        .slice(0, 3)
        .map((concept) => concept);
      return NextResponse.json({
        ok: true,
        stage: latest.stage,
        email: latest.email,
        capacityProfile: latest.capacity_profile,
        notes: latest.notes,
        createdAt: latest.created_at,
        systems: revsAssessmentSystems,
        recommendations: nextQueue,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    stage: 'Recognise',
    email: email || null,
    systems: revsAssessmentSystems,
    capacityProfile: Object.fromEntries(revsAssessmentSystems.map((system) => [system, 2])),
    notes: '',
    createdAt: null,
    recommendations: revsConcepts.slice(0, 3).map((concept) => concept),
  });
}
