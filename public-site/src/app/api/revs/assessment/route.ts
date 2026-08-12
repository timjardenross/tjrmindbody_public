import { NextResponse } from 'next/server';
import { buildCapacityProfile, detectRevsStage, getRevsStageGuidance, getStageAwareRecommendations } from '@/lib/revs-now';
import {
  ensureRevsSchema,
  hasRevsDatabase,
  normalizeRevsEmail,
  saveRevsAssessment,
} from '@/lib/revs-db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; scores?: number[]; notes?: string }
    | null;
  const payload = body ?? {};

  const email = payload.email ? normalizeRevsEmail(payload.email) : '';
  if (!email || !Array.isArray(payload.scores)) {
    return NextResponse.json({ ok: false, error: 'Missing email or scores.' }, { status: 400 });
  }

  const scores = payload.scores.map((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  });
  const stage = detectRevsStage(scores);
  const capacityProfile = buildCapacityProfile(scores);
  const stageGuidance = getRevsStageGuidance(stage);
  const recommendations = getStageAwareRecommendations(stage);

  if (!hasRevsDatabase()) {
    return NextResponse.json(
      {
        ok: true,
        stage,
        capacityProfile,
        stageGuidance,
        recommendations,
        stored: false,
        message: 'DATABASE_URL is not set yet, so this assessment was not persisted.',
      },
      { status: 200 }
    );
  }

  await ensureRevsSchema();
  const saved = await saveRevsAssessment({
    email,
    stage,
    scores,
    capacityProfile,
    notes: payload.notes || '',
  });

  return NextResponse.json({
    ok: true,
    stage,
    capacityProfile,
    stageGuidance,
    stored: true,
    assessment: saved,
    recommendations,
  });
}
