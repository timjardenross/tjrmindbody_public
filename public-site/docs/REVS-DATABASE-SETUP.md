# REVS Database Setup

REVS uses PostgreSQL through a single `DATABASE_URL`.
The current MVP writes the user record and assessment snapshot into Postgres
when that connection string is available, and falls back to local-only state
when it is not.

## What the database currently stores

- `revs_users`
- `revs_allowlist`
- `revs_assessments`
- the latest stage, email, capacity scores, profile data, and notes for each assessment

The schema lives in [`db/revs-schema.sql`](../db/revs-schema.sql) and is also
created automatically by the REVS API routes when needed.

For the first cohort, you can also seed repeatable invite codes from
[`db/revs-first-cohort-seed.sql`](../db/revs-first-cohort-seed.sql).

## Recommended provider

Use any managed Postgres service that gives you one connection string you can
copy into your app environment. For the current MVP, Neon, Railway, and
Supabase Postgres all work.

## What to do

1. Create a PostgreSQL database.
2. Copy the provider's connection string.
3. Put it in your local `.env.local` file as `DATABASE_URL=...`.
4. Add the same value to the hosting environment variables for the deployed app.
5. Run the schema file in `db/revs-schema.sql` against the database, or let the
   REVS API create the tables on first write.
6. If you want the first cohort invites preloaded, run
   `db/revs-first-cohort-seed.sql` once after the schema.

## Local example

```bash
DATABASE_URL="postgresql://user:password@host:5432/revs?sslmode=require"
```

## Notes

- Keep the connection string secret.
- The app still runs without the variable, but assessments only persist once
  `DATABASE_URL` is present.
- If the provider gives you multiple URLs, prefer the normal app connection
  string unless the provider tells you otherwise.
- The current flow does not require any browser-exposed Supabase variables.
- MVP recommendation: keep access invite-only for now, then add real password
  auth later once the cohort flow and content model settle down.
