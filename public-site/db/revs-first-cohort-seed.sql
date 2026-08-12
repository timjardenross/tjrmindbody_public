-- REVS first cohort seed
-- Run this after `db/revs-schema.sql` in Supabase or any PostgreSQL client.
-- It is safe to re-run: each row uses `on conflict` to keep the seed repeatable.

insert into revs_invites (code, label, active, uses_remaining, expires_at)
values
  ('REVS-FIRST-COHORT', 'First cohort bootstrap invite', true, 25, null),
  ('REVS-ADMIN-BOOTSTRAP', 'Admin testing invite', true, 5, null),
  ('REVS-TRIAL-1', 'Internal trial invite', true, 10, null)
on conflict (code)
do update set
  label = excluded.label,
  active = excluded.active,
  uses_remaining = excluded.uses_remaining,
  expires_at = excluded.expires_at,
  updated_at = now();

