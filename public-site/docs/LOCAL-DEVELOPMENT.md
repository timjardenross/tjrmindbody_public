# Local Development Guide

## Requirements

Node.js ≥ 18.18 (matches `lcars-portal`'s requirement).

## Setup

```bash
cd public-site
npm install
cp .env.example .env.local   # fill in values you need locally (optional for content-only work)
npm run dev
# open http://localhost:3200
```

Port `3200` was chosen to avoid colliding with `lcars-portal` (`3100`) and
the other local services documented in `lcars-portal/README.md`.

## Working on content without the CMS

Content is just Markdown files under `public-site/content/<collection>/`.
You can create/edit `.md` files directly with any editor — the dev server
picks up filesystem changes on refresh, no CMS login required. Frontmatter
schema per collection is documented in `PUBLISHING-GUIDE.md` and enforced
(loosely, via TypeScript types) in `src/lib/content.ts`.

## Working on the CMS editor locally

The `/admin` editor is fully static (loaded from a CDN) and will run at
`http://localhost:3200/admin`, but the GitHub OAuth login flow requires the
OAuth App's callback URL to match wherever `/api/auth` is reachable. For
most local work this isn't necessary — edit Markdown files directly instead
(see above). If you do need to test the live editor+auth flow locally,
either:

- Register a second GitHub OAuth App with callback URL
  `http://localhost:3200/api/auth`, and set `GITHUB_OAUTH_CLIENT_ID` /
  `GITHUB_OAUTH_CLIENT_SECRET` in `.env.local` to that app's credentials
  (don't reuse the production OAuth App's secret locally); or
- Test against a Vercel preview deployment instead, which already has a
  real HTTPS URL.

## Scripts

```bash
npm run dev     # dev server on :3200
npm run build   # production build (also type-checks + lints)
npm run start   # serve the production build on :3200
npm run lint    # eslint (next/core-web-vitals)
npm test        # vitest
```

## Adding a collection

See `ARCHITECTURE.md` → "Content model" and `CMS-SETUP.md` → "Adding a new
content collection later".
