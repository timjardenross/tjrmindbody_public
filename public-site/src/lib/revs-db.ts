import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __revsPgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

export function normalizeRevsEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hasRevsDatabase() {
  return Boolean(connectionString);
}

export function getRevsPool() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }

  if (!global.__revsPgPool) {
    global.__revsPgPool = new Pool({
      connectionString,
      ssl: process.env.PGSSLMODE === 'disable' ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
  }

  return global.__revsPgPool;
}

export async function ensureRevsSchema() {
  const pool = getRevsPool();
  await pool.query(`
    create table if not exists revs_users (
      id bigint generated always as identity primary key,
      email text not null unique,
      password_hash text,
      display_name text not null default '',
      dark_mode_pref boolean not null default false,
      current_stage text not null default 'Recognise',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists revs_invites (
      id bigint generated always as identity primary key,
      code text not null unique,
      label text not null default '',
      active boolean not null default true,
      uses_remaining integer,
      expires_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists revs_allowlist (
      id bigint generated always as identity primary key,
      email text not null unique,
      label text not null default '',
      active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists revs_assessments (
      id bigint generated always as identity primary key,
      user_id bigint not null references revs_users(id) on delete cascade,
      email text not null,
      stage text not null,
      scores jsonb not null,
      capacity_profile jsonb not null,
      notes text not null default '',
      created_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists revs_concepts (
      id bigint generated always as identity primary key,
      slug text not null unique,
      title text not null,
      summary text not null default '',
      stage text not null default 'Recognise',
      status text not null default 'draft',
      sort_order integer not null default 0,
      principles jsonb not null default '[]'::jsonb,
      audience_framings jsonb not null default '[]'::jsonb,
      formats jsonb not null default '[]'::jsonb,
      depths jsonb not null default '[]'::jsonb,
      prerequisites jsonb not null default '[]'::jsonb,
      pairs_with jsonb not null default '[]'::jsonb,
      evidence jsonb not null default '[]'::jsonb,
      accessibility_notes jsonb not null default '[]'::jsonb,
      published_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
  await pool.query(`alter table revs_concepts add column if not exists principles jsonb not null default '[]'::jsonb;`);

  await pool.query(`
    create table if not exists revs_progress_events (
      id bigint generated always as identity primary key,
      email text not null,
      concept_slug text not null default '',
      event_type text not null,
      note text not null default '',
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    );
  `);
}

export type RevsUserRow = {
  id: number;
  email: string;
  password_hash: string | null;
  display_name: string;
  dark_mode_pref: boolean;
  current_stage: string;
  created_at: string;
  updated_at: string;
};

export type RevsInviteRow = {
  id: number;
  code: string;
  label: string;
  active: boolean;
  uses_remaining: number | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RevsAllowlistRow = {
  id: number;
  email: string;
  label: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type RevsAssessmentRow = {
  id: number;
  user_id: number;
  email: string;
  stage: string;
  scores: number[];
  capacity_profile: Record<string, number>;
  notes: string;
  created_at: string;
};

export type RevsConceptRow = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  stage: string;
  status: string;
  sort_order: number;
  principles: string[];
  audience_framings: string[];
  formats: string[];
  depths: string[];
  prerequisites: string[];
  pairs_with: string[];
  evidence: string[];
  accessibility_notes: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RevsConceptVariantRow = {
  id: number;
  concept_id: number;
  variant_key: string;
  audience: string;
  format: string;
  depth: string;
  stage: string;
  status: string;
  body: string;
  notes: string;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RevsConceptFilter = {
  stage?: string;
  audience?: string;
  format?: string;
  depth?: string;
};

export type RevsConceptView = {
  slug: string;
  title: string;
  stage: string;
  summary: string;
  tags: string[];
  principles: string[];
  audiences: string[];
  formats: string[];
  depths: string[];
  prerequisites: string[];
  pairsWith: string[];
  evidence: string[];
  accessibilityNotes: string[];
};

export type RevsRelatedConceptRow = RevsConceptRow & {
  relationship: 'prerequisite' | 'paired' | 'next';
  match_reason: string;
};

export async function getLatestRevsAssessment(email?: string) {
  const pool = getRevsPool();
  const query = email
    ? `
      select id, user_id, email, stage, scores, capacity_profile, notes, created_at
      from revs_assessments
      where email = $1
      order by created_at desc, id desc
      limit 1
    `
    : `
      select id, user_id, email, stage, scores, capacity_profile, notes, created_at
      from revs_assessments
      order by created_at desc, id desc
      limit 1
    `;
  const result = email
    ? await pool.query<RevsAssessmentRow>(query, [normalizeRevsEmail(email)])
    : await pool.query<RevsAssessmentRow>(query);
  return result.rows[0] || null;
}

export async function getRevsUserByEmail(email: string) {
  const pool = getRevsPool();
  const result = await pool.query<RevsUserRow>(
    `
      select id, email, password_hash, display_name, dark_mode_pref, current_stage, created_at, updated_at
      from revs_users
      where email = $1
      limit 1
    `,
    [normalizeRevsEmail(email)]
  );
  return result.rows[0] || null;
}

export async function getRevsInviteByCode(code: string) {
  const pool = getRevsPool();
  const result = await pool.query<RevsInviteRow>(
    `
      select id, code, label, active, uses_remaining, expires_at, created_at, updated_at
      from revs_invites
      where code = $1
      limit 1
    `,
    [code.trim().toUpperCase()]
  );
  return result.rows[0] || null;
}

export async function isRevsAllowedEmail(email: string) {
  const pool = getRevsPool();
  const result = await pool.query<RevsAllowlistRow>(
    `
      select id, email, label, active, created_at, updated_at
      from revs_allowlist
      where email = $1 and active = true
      limit 1
    `,
    [normalizeRevsEmail(email)]
  );
  return result.rows[0] || null;
}

export async function consumeRevsInvite(code: string) {
  const pool = getRevsPool();
  const normalized = code.trim().toUpperCase();
  const invite = await getRevsInviteByCode(normalized);
  if (!invite || !invite.active) {
    return null;
  }
  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
    return null;
  }
  if (invite.uses_remaining !== null && invite.uses_remaining <= 0) {
    return null;
  }

  const nextUses = invite.uses_remaining === null ? null : invite.uses_remaining - 1;
  const result = await pool.query<RevsInviteRow>(
    `
      update revs_invites
      set uses_remaining = $2, updated_at = now()
      where id = $1
      returning id, code, label, active, uses_remaining, expires_at, created_at, updated_at
    `,
    [invite.id, nextUses]
  );
  return result.rows[0] || null;
}

export async function upsertRevsUser(input: { email: string; currentStage?: string }) {
  const pool = getRevsPool();
  const email = normalizeRevsEmail(input.email);
  const currentStage = input.currentStage?.trim() || 'Recognise';
  const result = await pool.query<RevsUserRow>(
    `
      insert into revs_users (email, current_stage)
      values ($1, $2)
      on conflict (email)
      do update set current_stage = excluded.current_stage, updated_at = now()
      returning id, email, password_hash, display_name, dark_mode_pref, current_stage, created_at, updated_at
    `,
    [email, currentStage]
  );
  return result.rows[0] || null;
}

export async function saveRevsAssessment(input: {
  email: string;
  stage: string;
  scores: number[];
  capacityProfile: Record<string, number>;
  notes?: string;
}) {
  const pool = getRevsPool();
  const email = normalizeRevsEmail(input.email);
  const user = await upsertRevsUser({ email, currentStage: input.stage });
  const userId = user?.id;
  if (!userId) {
    throw new Error('Unable to resolve user record.');
  }

  const result = await pool.query<RevsAssessmentRow>(
    `
    insert into revs_assessments (user_id, email, stage, scores, capacity_profile, notes)
    values ($1, $2, $3, $4::jsonb, $5::jsonb, $6)
    returning id, user_id, email, stage, scores, capacity_profile, notes, created_at
    `,
    [
      userId,
      user.email,
      input.stage,
      JSON.stringify(input.scores),
      JSON.stringify(input.capacityProfile),
      input.notes || '',
    ]
  );

  return result.rows[0] || null;
}

export async function createRevsInvite(input: { code: string; label?: string; usesRemaining?: number | null; expiresAt?: string | null }) {
  const pool = getRevsPool();
  const code = input.code.trim().toUpperCase();
  const result = await pool.query<RevsInviteRow>(
    `
      insert into revs_invites (code, label, uses_remaining, expires_at)
      values ($1, $2, $3, $4)
      on conflict (code)
      do update set
        label = excluded.label,
        uses_remaining = excluded.uses_remaining,
        expires_at = excluded.expires_at,
        updated_at = now()
      returning id, code, label, active, uses_remaining, expires_at, created_at, updated_at
    `,
    [code, input.label || '', input.usesRemaining ?? null, input.expiresAt ?? null]
  );
  return result.rows[0] || null;
}

export async function createRevsAllowlistEntry(input: { email: string; label?: string; active?: boolean }) {
  const pool = getRevsPool();
  const email = normalizeRevsEmail(input.email);
  const result = await pool.query<RevsAllowlistRow>(
    `
      insert into revs_allowlist (email, label, active)
      values ($1, $2, $3)
      on conflict (email)
      do update set
        label = excluded.label,
        active = excluded.active,
        updated_at = now()
      returning id, email, label, active, created_at, updated_at
    `,
    [email, input.label || '', input.active ?? true]
  );
  return result.rows[0] || null;
}

function listToJson(values?: string[]) {
  return JSON.stringify((values || []).map((value) => value.trim()).filter(Boolean));
}

function normalizeFilterValue(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function parseJsonArray(values: unknown): string[] {
  if (Array.isArray(values)) {
    return values.map((value) => String(value));
  }
  return [];
}

function conceptMatchesValue(values: string[], needle: string | null) {
  if (!needle) {
    return true;
  }
  return values.some((value) => value.toLowerCase() === needle.toLowerCase());
}

function toTextList(values: unknown, fallback: string[] = []) {
  if (!Array.isArray(values)) {
    return fallback;
  }
  return values.map((value) => String(value)).filter(Boolean);
}

export function toRevsConceptView(row: RevsConceptRow): RevsConceptView {
  const fallbackPrinciples =
    row.stage === 'Recognise'
      ? ['capacity over deficit', 'low cognitive load']
      : row.stage === 'Regulate'
        ? ['sustainability over heroism', 'autonomy and agency']
        : row.stage === 'Rebuild'
          ? ['practical and specific', 'authenticity over masking']
          : ['honour lived experience', 'autonomy and agency'];
  return {
    slug: row.slug,
    title: row.title,
    stage: row.stage,
    summary: row.summary,
    tags: [row.stage, ...row.audience_framings.slice(0, 2)].filter(Boolean),
    principles: toTextList(row.principles, fallbackPrinciples),
    audiences: toTextList(row.audience_framings, ['Individual']),
    formats: toTextList(row.formats, ['Article']),
    depths: toTextList(row.depths, ['5-minute']),
    prerequisites: toTextList(row.prerequisites),
    pairsWith: toTextList(row.pairs_with),
    evidence: toTextList(row.evidence),
    accessibilityNotes: toTextList(row.accessibility_notes),
  };
}

export async function listRevsConcepts() {
  const pool = getRevsPool();
  const result = await pool.query<RevsConceptRow>(
    `
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      order by sort_order asc, stage asc, title asc, id desc
    `
  );
  return result.rows;
}

export async function listPublishedRevsConcepts(filters: RevsConceptFilter = {}) {
  const pool = getRevsPool();
  const stage = normalizeFilterValue(filters.stage);
  const audience = normalizeFilterValue(filters.audience);
  const format = normalizeFilterValue(filters.format);
  const depth = normalizeFilterValue(filters.depth);

  const clauses = ["status = 'published'"];
  const params: string[] = [];

  if (stage) {
    params.push(stage);
    clauses.push(`stage = $${params.length}`);
  }
  if (audience) {
    params.push(audience);
    clauses.push(`audience_framings @> jsonb_build_array($${params.length})`);
  }
  if (format) {
    params.push(format);
    clauses.push(`formats @> jsonb_build_array($${params.length})`);
  }
  if (depth) {
    params.push(depth);
    clauses.push(`depths @> jsonb_build_array($${params.length})`);
  }

  const result = await pool.query<RevsConceptRow>(
    `
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where ${clauses.join(' and ')}
      order by sort_order asc, stage asc, title asc, id desc
    `,
    params
  );
  return result.rows;
}

export async function listRevsConceptsByStatus(statuses: string[] = []) {
  const pool = getRevsPool();
  const normalized = statuses.map((value) => value.trim().toLowerCase()).filter(Boolean);
  const clause = normalized.length ? `status = any($1::text[])` : `status <> 'archived'`;
  const result = normalized.length
    ? await pool.query<RevsConceptRow>(
        `
          select
            id, slug, title, summary, stage, status, sort_order, principles,
            audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
            published_at, created_at, updated_at
          from revs_concepts
          where ${clause}
          order by sort_order asc, stage asc, title asc, id desc
        `,
        [normalized]
      )
    : await pool.query<RevsConceptRow>(
        `
          select
            id, slug, title, summary, stage, status, sort_order, principles,
            audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
            published_at, created_at, updated_at
          from revs_concepts
          where ${clause}
          order by sort_order asc, stage asc, title asc, id desc
        `
      );
  return result.rows;
}

export async function getRevsPublishedConceptBySlug(slug: string) {
  const pool = getRevsPool();
  const result = await pool.query<RevsConceptRow>(
    `
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where slug = $1 and status = 'published'
      limit 1
    `,
    [slug.trim().toLowerCase()]
  );
  return result.rows[0] || null;
}

export async function getRevsConceptBySlug(slug: string) {
  const pool = getRevsPool();
  const result = await pool.query<RevsConceptRow>(
    `
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where slug = $1
      limit 1
    `,
    [slug.trim().toLowerCase()]
  );
  return result.rows[0] || null;
}

export async function listPublishedRevsConceptVariants(conceptId?: number) {
  const pool = getRevsPool();
  const result = conceptId
    ? await pool.query<RevsConceptVariantRow>(
        `
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          where concept_id = $1 and status = 'published'
          order by sort_order asc, updated_at desc, id desc
        `,
        [conceptId]
      )
    : await pool.query<RevsConceptVariantRow>(
        `
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          where status = 'published'
          order by sort_order asc, updated_at desc, id desc
        `
      );
  return result.rows;
}

export async function getRevsRelatedConcepts(input: {
  slug: string;
  stage?: string;
  audience?: string;
  format?: string;
  depth?: string;
  limit?: number;
}) {
  const pool = getRevsPool();
  const source = await getRevsPublishedConceptBySlug(input.slug);
  if (!source) {
    return { source: null, related: [] as RevsRelatedConceptRow[] };
  }

  const stage = normalizeFilterValue(input.stage) || source.stage;
  const audience = normalizeFilterValue(input.audience);
  const format = normalizeFilterValue(input.format);
  const depth = normalizeFilterValue(input.depth);
  const limit = Math.max(1, Math.min(input.limit ?? 5, 10));

  const result = await pool.query<RevsConceptRow>(
    `
      select
        id, slug, title, summary, stage, status, sort_order,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where status = 'published' and slug <> $1
      order by sort_order asc, stage asc, title asc, id desc
    `,
    [source.slug]
  );

  const scored = result.rows
    .map((row) => {
      let relationship: RevsRelatedConceptRow['relationship'] = 'next';
      let score = 0;
      const reasons: string[] = [];

      if (source.prerequisites.includes(row.title) || source.pairs_with.includes(row.title)) {
        relationship = source.prerequisites.includes(row.title) ? 'prerequisite' : 'paired';
        score += 50;
        reasons.push(relationship === 'prerequisite' ? 'Referenced as a prerequisite' : 'Referenced in pairs_with');
      }

      if (row.prerequisites.includes(source.title) || row.pairs_with.includes(source.title)) {
        relationship = row.prerequisites.includes(source.title) ? 'next' : 'paired';
        score += 35;
        reasons.push(row.prerequisites.includes(source.title) ? 'Cited as a prerequisite by this concept' : 'Mutually paired concept');
      }

      if (row.stage === stage) {
        score += 15;
        reasons.push('Matches the requested stage');
      }

      if (conceptMatchesValue(row.audience_framings, audience)) {
        score += audience ? 10 : 0;
        if (audience) reasons.push('Matches the requested audience');
      }
      if (conceptMatchesValue(row.formats, format)) {
        score += format ? 10 : 0;
        if (format) reasons.push('Matches the requested format');
      }
      if (conceptMatchesValue(row.depths, depth)) {
        score += depth ? 10 : 0;
        if (depth) reasons.push('Matches the requested depth');
      }

      if (!reasons.length) {
        reasons.push('Closest published concept by stage and ordering');
      }

      return {
        ...row,
        relationship,
        match_reason: reasons.join('; '),
        __score: score,
      };
    })
    .sort((left, right) => right.__score - left.__score || left.sort_order - right.sort_order || left.title.localeCompare(right.title))
    .slice(0, limit)
    .map(({ __score, ...row }) => row);

  return { source, related: scored };
}

export async function upsertRevsConcept(input: {
  slug: string;
  title: string;
  summary?: string;
  stage?: string;
  status?: string;
  sortOrder?: number;
  principles?: string[];
  audienceFramings?: string[];
  formats?: string[];
  depths?: string[];
  prerequisites?: string[];
  pairsWith?: string[];
  evidence?: string[];
  accessibilityNotes?: string[];
}) {
  const pool = getRevsPool();
  const publishedAt = input.status === 'published' ? 'now()' : 'null';
  const result = await pool.query<RevsConceptRow>(
    `
      insert into revs_concepts (
        slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes
      )
      values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb)
      on conflict (slug)
      do update set
        title = excluded.title,
        summary = excluded.summary,
        stage = excluded.stage,
        status = excluded.status,
        sort_order = excluded.sort_order,
        principles = excluded.principles,
        audience_framings = excluded.audience_framings,
        formats = excluded.formats,
        depths = excluded.depths,
        prerequisites = excluded.prerequisites,
        pairs_with = excluded.pairs_with,
        evidence = excluded.evidence,
        accessibility_notes = excluded.accessibility_notes,
        published_at = case when excluded.status = 'published' then coalesce(revs_concepts.published_at, now()) else null end,
        updated_at = now()
      returning id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
    `,
    [
      input.slug.trim().toLowerCase(),
      input.title.trim(),
      input.summary || '',
      input.stage || 'Recognise',
      input.status || 'draft',
      input.sortOrder ?? 0,
      listToJson(input.principles),
      listToJson(input.audienceFramings),
      listToJson(input.formats),
      listToJson(input.depths),
      listToJson(input.prerequisites),
      listToJson(input.pairsWith),
      listToJson(input.evidence),
      listToJson(input.accessibilityNotes),
    ]
  );
  return result.rows[0] || null;
}

export async function setRevsConceptStatus(input: { id: number; status: string }) {
  const pool = getRevsPool();
  const result = await pool.query<RevsConceptRow>(
    `
      update revs_concepts
      set status = $2,
          published_at = case when $2 = 'published' then coalesce(published_at, now()) else null end,
          updated_at = now()
      where id = $1
      returning id, slug, title, summary, stage, status, sort_order,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
    `,
    [input.id, input.status]
  );
  return result.rows[0] || null;
}

export async function listRevsConceptVariants(conceptId?: number) {
  const pool = getRevsPool();
  const result = conceptId
    ? await pool.query<RevsConceptVariantRow>(
        `
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          where concept_id = $1
          order by sort_order asc, updated_at desc, id desc
        `,
        [conceptId]
      )
    : await pool.query<RevsConceptVariantRow>(
        `
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          order by sort_order asc, updated_at desc, id desc
        `
      );
  return result.rows;
}

export async function upsertRevsConceptVariant(input: {
  conceptId: number;
  variantKey: string;
  audience?: string;
  format?: string;
  depth?: string;
  stage?: string;
  status?: string;
  body?: string;
  notes?: string;
  sortOrder?: number;
}) {
  const pool = getRevsPool();
  const result = await pool.query<RevsConceptVariantRow>(
    `
      insert into revs_concept_variants (
        concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, case when $7 = 'published' then now() else null end)
      on conflict (concept_id, variant_key)
      do update set
        audience = excluded.audience,
        format = excluded.format,
        depth = excluded.depth,
        stage = excluded.stage,
        status = excluded.status,
        body = excluded.body,
        notes = excluded.notes,
        sort_order = excluded.sort_order,
        published_at = case when excluded.status = 'published' then coalesce(revs_concept_variants.published_at, now()) else null end,
        updated_at = now()
      returning id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
    `,
    [
      input.conceptId,
      input.variantKey.trim().toLowerCase(),
      input.audience || 'Individual',
      input.format || 'Article',
      input.depth || '5-minute',
      input.stage || 'Recognise',
      input.status || 'draft',
      input.body || '',
      input.notes || '',
      input.sortOrder ?? 0,
    ]
  );
  return result.rows[0] || null;
}

export async function deleteRevsConceptVariant(input: { id: number }) {
  const pool = getRevsPool();
  const result = await pool.query<RevsConceptVariantRow>(
    `
      delete from revs_concept_variants
      where id = $1
      returning id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
    `,
    [input.id]
  );
  return result.rows[0] || null;
}

export async function listRevsProgressEvents(email?: string) {
  const pool = getRevsPool();
  const result = email
    ? await pool.query(
        `
          select id, email, concept_slug, event_type, note, metadata, created_at
          from revs_progress_events
          where email = $1
          order by created_at desc, id desc
          limit 20
        `,
        [normalizeRevsEmail(email)]
      )
    : await pool.query(`
        select id, email, concept_slug, event_type, note, metadata, created_at
        from revs_progress_events
        order by created_at desc, id desc
        limit 20
      `);
  return result.rows as Array<{
    id: number;
    email: string;
    concept_slug: string;
    event_type: string;
    note: string;
    metadata: Record<string, unknown>;
    created_at: string;
  }>;
}

export async function getRevsProgressSummary(email?: string) {
  const events = await listRevsProgressEvents(email);
  const counts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {});
  return { events, counts };
}

export async function createRevsProgressEvent(input: {
  email: string;
  conceptSlug?: string;
  eventType: string;
  note?: string;
  metadata?: Record<string, unknown>;
}) {
  const pool = getRevsPool();
  const result = await pool.query(
    `
      insert into revs_progress_events (email, concept_slug, event_type, note, metadata)
      values ($1, $2, $3, $4, $5::jsonb)
      returning id, email, concept_slug, event_type, note, metadata, created_at
    `,
    [
      normalizeRevsEmail(input.email),
      input.conceptSlug || '',
      input.eventType,
      input.note || '',
      JSON.stringify(input.metadata || {}),
    ]
  );
  return result.rows[0] as
    | {
        id: number;
        email: string;
        concept_slug: string;
        event_type: string;
        note: string;
        metadata: Record<string, unknown>;
        created_at: string;
      }
    | null;
}
