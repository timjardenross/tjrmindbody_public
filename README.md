# tjrmindbody_public

TJR Mind & Body — the public-facing website repository for USS TJR.

Everything presented to a public visitor lives here: the website, marketing/landing pages,
blog and guides, public tools, CMS configuration, and public-facing assets.

This repo was extracted from `USSTJROS` on 2026-07-19 as part of a three-repo split.
Extraction used `git filter-repo`, so file history predating the split is preserved.

---

## Repository relationships

- **tjrmindbody_public** (this repo) — the public website and digital experience.
- **TJRHQ** — the internal operational platform (workbenches, bots, infrastructure).
- **USSTJROS** — mission, governance, architecture, and institutional-knowledge repository.
  Static HTML design references/mockups that informed this site's pages live there under
  `architecture/design-system/public-site-mockups/` — this repo has the live implementation.

---

## Repository structure

```
tjrmindbody_public/
├── public-site/          # the live Next.js 14 site — see public-site/README.md for the
│                         #   full app-level quick start, architecture, and publishing guide
└── products/
    └── groundwork-planner/   # standalone public tool (static HTML)
```

## Quick start

```bash
cd public-site
npm install
npm run dev
# open http://localhost:3200
```

For CMS setup, content publishing, local development, and disaster recovery, see
[`public-site/README.md`](public-site/README.md) and the docs it links to
(`public-site/docs/ARCHITECTURE.md`, `CMS-SETUP.md`, `PUBLISHING-GUIDE.md`,
`LOCAL-DEVELOPMENT.md`, `DISASTER-RECOVERY.md`).

---

## Governance

This repo implements the public site; it does not define how it's governed. See
`USSTJROS/governance/` for standards and decision records, and `USSTJROS/CLAUDE.md` for
standing operational rules.
