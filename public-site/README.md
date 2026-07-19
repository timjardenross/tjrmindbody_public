# TJR Mind & Body — Public Content Platform

The canonical public publishing platform for TJR Mind & Body: a Next.js 14
site with a free, Git-based CMS (Sveltia CMS), with GitHub as the single
source of truth for every Library item, page and image.

This is a separate app from `lcars-portal/` (the internal, Captain-only
command portal) — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for
why.

## Quick start

```bash
cd public-site
npm install
npm run dev
# open http://localhost:3200
```

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how it all fits together
- [`docs/CMS-SETUP.md`](docs/CMS-SETUP.md) — connect `/admin` to GitHub (GitHub OAuth App)
- [`docs/PUBLISHING-GUIDE.md`](docs/PUBLISHING-GUIDE.md) — how to write and publish content
- [`docs/LOCAL-DEVELOPMENT.md`](docs/LOCAL-DEVELOPMENT.md) — running this app locally
- [`docs/DISASTER-RECOVERY.md`](docs/DISASTER-RECOVERY.md) — recovering content, deployments or CMS access

## Content collections

Library, private Discover Capacity access codes, and Pages — registered
centrally in `src/lib/collections.ts`. Public content is separated by
Library metadata and tags rather than multiple top-level collections; see
`docs/ARCHITECTURE.md`.

## Status

Initial platform build for MSN-0360. Content collections are scaffolded
empty — no content has been migrated in. Hosting cutover (DNS, Vercel
project wiring) is intentionally out of scope of this build; see
`docs/CMS-SETUP.md` for the environment variables a deploy needs.
