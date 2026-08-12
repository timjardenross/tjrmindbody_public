import { revsAssessmentSystems } from '@/lib/revs';
import { getLatestRevsAssessment, hasRevsDatabase } from '@/lib/revs-db';

export const runtime = 'nodejs';

function csvEscape(value: string | number | null | undefined) {
  const stringValue = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function toColumnKey(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function buildCsvRow(values: Array<string | number | null | undefined>) {
  return values.map(csvEscape).join(',');
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email') || undefined;
  const latestAssessment = hasRevsDatabase() ? await getLatestRevsAssessment(email) : null;

  const source = latestAssessment || {
    email: email || 'demo-user@revs.local',
    stage: 'Recognise',
    notes: 'Demo export used because no stored assessment was found.',
    created_at: new Date().toISOString(),
    scores: Array.from({ length: revsAssessmentSystems.length }, () => 2),
    capacity_profile: Object.fromEntries(revsAssessmentSystems.map((system) => [system, 2])),
  };

  const header = [
    'email',
    'current_stage',
    'assessment_created_at',
    'notes',
    'scores_json',
    'capacity_profile_json',
    ...revsAssessmentSystems.flatMap((system) => {
      const key = toColumnKey(system);
      return [`${key}_score`, `${key}_capacity`];
    }),
  ];

  const csv = [
    buildCsvRow(header),
    buildCsvRow([
      source.email,
      source.stage,
      source.created_at,
      source.notes,
      JSON.stringify(source.scores || []),
      JSON.stringify(source.capacity_profile || {}),
      ...revsAssessmentSystems.flatMap((system, index) => [
        source.scores?.[index] ?? '',
        source.capacity_profile?.[system] ?? '',
      ]),
    ]),
  ].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="revs-capacity-export.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
