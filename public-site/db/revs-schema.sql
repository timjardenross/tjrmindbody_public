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

create table if not exists revs_allowlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  label text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists revs_concepts (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  summary text not null default '',
  stage text not null default 'Recognise',
  status text not null default 'draft',
  sort_order integer not null default 0,
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

create table if not exists revs_concept_variants (
  id bigint generated always as identity primary key,
  concept_id bigint not null references revs_concepts(id) on delete cascade,
  variant_key text not null,
  audience text not null default 'Individual',
  format text not null default 'Article',
  depth text not null default '5-minute',
  stage text not null default 'Recognise',
  status text not null default 'draft',
  body text not null default '',
  notes text not null default '',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (concept_id, variant_key)
);

create index if not exists revs_assessments_user_id_idx on revs_assessments (user_id);
create index if not exists revs_assessments_created_at_idx on revs_assessments (created_at desc);
create index if not exists revs_invites_active_idx on revs_invites (active);
create index if not exists revs_concepts_stage_idx on revs_concepts (stage, sort_order, id desc);
create index if not exists revs_concepts_status_idx on revs_concepts (status);
create index if not exists revs_concept_variants_concept_id_idx on revs_concept_variants (concept_id, sort_order, id desc);
create index if not exists revs_concept_variants_status_idx on revs_concept_variants (status);
