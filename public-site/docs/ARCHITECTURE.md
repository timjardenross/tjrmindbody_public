# Architecture Overview — TJR HQ Public Content Platform

## Summary

`public-site/` is a standalone Next.js 14 (App Router) application, separate
from `lcars-portal/` (the internal, Captain-only command portal). It is the
canonical public publishing platform for TJR HQ: a Git-based CMS
(Sveltia CMS) authors Markdown content directly into this repository, and
Vercel deploys a statically generated site on every push.

```
public-site/
  content/                  # Canonical content — Markdown + frontmatter
    blog/
    guides/
    revs-articles/
    operational-resilience-insights/
    resources/
    pages/                  # Flat standalone pages (About, Let's Chat, ...)
  public/
    admin/                  # Sveltia CMS (static, no build step)
      index.html
      config.yml
    uploads/                # CMS-uploaded media, committed to Git
  src/
    app/                    # Routes (see below)
    components/
    lib/
      collections.ts        # Central collection registry
      content.ts            # Filesystem content loader (gray-matter)
      mdx.tsx                # Markdown/MDX renderer
      seo.ts                 # Metadata + JSON-LD builders
      search.ts               # Search index builder
      rss.ts                  # RSS feed builder
```

## Why a separate app from `lcars-portal/`

`lcars-portal` is an internal, authenticated, LCARS-themed command dashboard
for Captain TJR. The public content platform is a different product with a
different audience, brand and deployment lifecycle (it must be indexable,
fast, and publicly cacheable). Keeping them as separate Next.js apps means:

- Independent Vercel projects/deployments — a content publish never risks
  the internal portal, and vice versa.
- Independent branding/design systems (TJR HQ vs. LCARS).
- No shared auth boundary to reason about — the public site has none; the
  internal portal is fully gated.

Both apps live in the same GitHub repository (`USSTJROS`) so GitHub remains
the single canonical source of truth for the whole USS TJR system, per
`REPOSITORY-MAP.md`.

## Content model

Every content type is declared once in `src/lib/collections.ts`
(`CollectionDef[]`). Adding a new collection later — the mission's explicit
requirement — means:

1. Add one entry to `collections` in `src/lib/collections.ts`.
2. Add a matching block to `public/admin/config.yml`.
3. Create `content/<new-collection>/`.

No route, component or rendering code needs to change: the dynamic
`src/app/[collection]/...` routes, search index, RSS, and sitemap are all
generic over the registry.

Five of the six collections are "article type" (blog, guides, REVS
articles, operational resilience insights, resources) — they carry a date,
excerpt, optional category/tags, featured image, author and SEO block, and
get listing/detail/category/tag/pagination routes plus an RSS feed.

The sixth, `pages`, is flat: standalone pages like About or Let's Chat,
rendered at the site root (`/about`) rather than nested under a route base.

## Routing

| Route | Handles |
|---|---|
| `/[collection]` | Collection listing (page 1) **or** a standalone page, whichever `collection` matches |
| `/[collection]/[slug]` | Article detail: TOC, reading time, related articles, JSON-LD |
| `/[collection]/category/[category]` | Category-filtered listing |
| `/[collection]/tag/[tag]` | Tag-filtered listing |
| `/[collection]/page/[pageNum]` | Pagination overflow (page 2+) |
| `/[collection]/rss.xml` | Per-collection RSS feed |
| `/rss.xml` | Site-wide RSS feed (all article collections) |
| `/search` | Client-side search (MiniSearch) over `/search-index.json` |
| `/sitemap.xml`, `/robots.txt` | Next.js built-in metadata routes |

`[collection]` and standalone pages share one dynamic route segment because
Next.js's App Router requires all sibling folders at the same depth to use
the same dynamic parameter name — this is why pages render through the same
`page.tsx` rather than a second, conflicting `[slug]` folder.

### Reserved routeBase values

Next.js always resolves a literal path segment before a dynamic one at the
same depth. That means a **collection's `routeBase`** must never equal
`admin`, `search`, `search-index.json`, `rss.xml`, `sitemap.xml`, or
`robots.txt` — every route belonging to that collection (index, articles,
category/tag pages, its own feed) would silently 404 forever, since
`src/app/[collection]/` would never receive that value as `params.collection`.
`src/lib/collections.ts` enforces this with a module-load assertion that
throws immediately (fails the build) if a registered collection's
`routeBase` collides with the reserved list — update
`RESERVED_ROUTE_BASES` there if a reserved top-level route is ever added,
renamed, or removed.

Two narrower slug-level collisions are guarded (with a build-log warning,
not a hard failure, since they depend on content rather than code) in
`src/lib/content.ts`'s `getAllSlugs` — see `docs/PUBLISHING-GUIDE.md` for
the exact reserved-slug list.

## Rendering strategy: SSG, not ISR

All content routes are statically generated at build time
(`generateStaticParams`). Because publishing goes through Git (CMS commit →
GitHub → Vercel build), every publish already triggers a fresh, full
deployment — there is no scenario where content changes without a rebuild.
Incremental Static Regeneration would only help if content could change
*without* a new deploy (e.g. a database-backed CMS), which is explicitly
not this architecture. SSG-on-every-push gives the strongest Core Web
Vitals and cache guarantees with no added complexity.

## SEO

`src/lib/seo.ts` centralises metadata generation (`buildMetadata`) and
JSON-LD (`articleJsonLd`, `breadcrumbJsonLd`), consumed by every content
route's `generateMetadata`. Every article/page frontmatter can carry an
optional `seo` block (title override, description, canonical URL, OG image
override, noindex) — see `public-site/docs/PUBLISHING-GUIDE.md`.

## CMS integration

See `CMS-SETUP.md` for the full GitHub OAuth App setup. In short: Sveltia
CMS (`public/admin`) is a static, client-side editor loaded from a CDN
(no build step, no server component of its own). It commits Markdown files
straight into `public-site/content/<collection>/` on the `main` branch via
the GitHub API, authenticated through a small self-hosted OAuth proxy at
`src/app/api/auth/route.ts` (replacing what Netlify Identity/Git Gateway
would have provided).
