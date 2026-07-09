# Publishing Guide

This is for whoever is writing content — no code or Git knowledge required
beyond logging in.

## Logging in

Go to `<site-url>/admin` and sign in with GitHub (see `CMS-SETUP.md` if
this is the very first login and the OAuth App isn't configured yet).

## Creating an article

1. Pick a collection in the left sidebar: **Blog**, **Guides**, **REVS
   Articles**, **Operational Resilience Insights** or **Resources**.
2. Click **New [collection]**.
3. Fill in:
   - **Title** — required.
   - **Date** — used for sorting and the published date shown on the page.
   - **Draft** — checked by default. While checked, the article is saved
     but **not shown on the public site**. Uncheck it to publish.
   - **Excerpt** — 1–2 sentences. Shown on listing cards, in search results,
     and as the fallback social-share description.
   - **Category** — optional, picked from a fixed list (Chronic Pain,
     Mindfulness, Coaching, Resilience, General) — the same list across
     every collection, on purpose, so the category filter pages stay
     consistent. Used for the category filter/page.
   - **REVS Pillar** (REVS Articles only) — optional, picked from
     Resilience, Emotion, Vitality, Stability.
   - **Tags** — optional, used for the tag filter/page and related-articles.
   - **Featured image** — optional; upload directly in the editor.
   - **Attachment** (Resources only) — optional; upload a PDF or other
     downloadable file directly in the editor. Adds a Download button to
     the resource page. **Attachment label** sets the button text.
   - **Body** — the article itself, written in the Markdown editor (bold,
     headings, lists, links, images, quotes, tables all supported). Use
     `##`/`###` headings — they automatically populate the on-page table of
     contents.
4. Click **Save** to save a draft, or **Publish** to commit it live.

## Publishing = a Git commit

Every Save/Publish action in the CMS commits directly to the `main` branch
of the `USSTJROS` repository. That push triggers an automatic Vercel
deployment — **there is no separate "deploy" step**. A published article is
typically live within a minute or two of clicking Publish.

## Editing an existing article

Open the collection in the sidebar, click the entry, edit, **Publish**
again. This creates a new commit — full history is kept in Git, so any past
version can be recovered (see `DISASTER-RECOVERY.md`).

## Images

Upload images directly in the **Featured image** field or inline in the
Markdown body via the editor's image button. Uploads are committed into the
repo under `public-site/public/uploads/` and served from `/uploads/...` —
no external image host or subscription required.

## SEO metadata

Every article and page has an optional **SEO** section (collapsed by
default):

- **SEO title override** — overrides the `<title>` tag only, leaving the
  on-page heading as the main Title.
- **Meta description** — overrides the excerpt for search engines/social
  previews if you want something different from the on-page excerpt.
- **Canonical URL** — only needed if this content is also published
  elsewhere and you want search engines to credit the other URL.
- **Social share image override** — overrides the featured image
  specifically for Open Graph/Twitter card previews.
- **Hide from search engines** — sets `noindex`. Use for thank-you pages or
  anything that shouldn't rank.

If you leave the SEO section untouched, sensible defaults are used
automatically (Title, Excerpt, and Featured image).

## Standalone pages

The **Pages** collection is for pages that aren't dated articles — About,
Coaching, Let's Chat, etc. These publish at the root of the site
(`content/pages/about.md` → `/about`) and don't have categories, tags, or a
reading-time/related-articles sidebar.

**Reserved names** — a few slugs/titles-that-become-slugs are off-limits
because the site already uses that URL for something else:

- Any article slug of exactly `rss.xml` (within any collection) — that URL
  is always the collection's own RSS feed.
- A **Pages** slug can't match `admin`, `search`, `search-index.json`,
  `rss.xml`, `sitemap.xml`, `robots.txt`, or any collection name (`blog`,
  `guides`, `revs-articles`, `operational-resilience-insights`,
  `resources`) — those routes always take priority, so a colliding page
  would silently never appear.

If you accidentally hit one of these, the content still saves in the CMS —
it just won't appear on the live site, and a build-log warning will name
the file to rename.

## Categories, tags and search

Categories are a fixed list (see above) rather than free text — this is
deliberate, to stop the category filter pages from splintering into
near-duplicates over time (e.g. "Resilience" vs "resilience "). To add or
change a category option, edit the `options:` list for the relevant
collection in `public/admin/config.yml` (it's the same list repeated across
all five article collections — update all of them together to keep it
consistent).

Tags, by contrast, aren't managed in a separate list — they're created
automatically the first time you type a new one into an article. The
tag filter pages and the sitewide `/search` page pick up new values on the
next deploy with no extra step.
