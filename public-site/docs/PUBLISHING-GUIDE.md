# Publishing Guide

This is for whoever is writing content — no code or Git knowledge required
beyond logging in.

## Logging in

Go to `<site-url>/admin` and sign in with GitHub (see `CMS-SETUP.md` if
this is the very first login and the OAuth App isn't configured yet).

## Creating a Library item

1. Pick **Library** in the left sidebar.
2. Click **New Library Item**.
3. Fill in:
   - **Title** — required.
   - **Date** — used for sorting and the published date shown on the page.
   - **Draft** — checked by default. While checked, the article is saved
     but **not shown on the public site**. Uncheck it to publish.
   - **Excerpt** — 1–2 sentences. Shown on listing cards, in search results,
     and as the fallback social-share description.
   - **Content type** — Article, Guide, Resource, Visual Explainer,
     Worksheet, Poster, Carousel, Video Script or Presentation Script.
     This replaces the old separate Blog/Guides/Resources collections.
   - **Journey stage** — where the item fits in the REVS ecosystem:
     Discover, Profile, Build, Track, Grow, Coach-Supported Growth or
     Library of Resources.
   - **REVS Pillar** — optional, picked from Resilience, Emotion, Vitality
     or Stability.
   - **Capacity systems** — optional multi-select covering the 12 capacity
     systems from the REVS Creative Bible.
   - **REVS poster class** and **Icon family** — optional Creative Bible
     production metadata for visual explainers, posters and design assets.
   - **Tags** — optional, used for tag pages, related articles and search.
   - **Featured image** — optional; upload directly in the editor.
   - **Attachment** — optional; upload a PDF or other downloadable file
     directly in the editor. Adds a Download button to the page.
     **Attachment label** sets the button text.
   - **Body** — the article itself, written in the Markdown editor (bold,
     headings, lists, links, images, quotes, tables all supported). Use
     `##`/`###` headings — they automatically populate the on-page table of
     contents.
4. Click **Save** to save a draft, or **Publish** to commit it live.

## Publishing = a Git commit

Every Save/Publish action in the CMS commits directly to the `main` branch
of the `timjardenross/tjrmindbody_public` repository. That push triggers an
automatic deployment — **there is no separate "deploy" step**. A published article is
typically live within a minute or two of clicking Publish.

## Editing an existing Library item

Open the collection in the sidebar, click the entry, edit, **Publish**
again. This creates a new commit — full history is kept in Git, so any past
version can be recovered (see `DISASTER-RECOVERY.md`).

## Curating Instagram highlights

The **Instagram Highlights** collection is for selected posts from
`@tjrmindbody`. It is not a live feed and does not use Instagram's API,
which keeps the homepage fast and avoids fragile third-party dependencies.

1. Pick **Instagram Highlights** in the CMS sidebar.
2. Click **New Instagram Highlight**.
3. Paste the public Instagram post or reel URL.
4. Add a short site-friendly caption.
5. Optionally upload a square preview image or screenshot. If you skip this,
   the homepage uses a branded text card instead.
6. Use **Display order** if you want a specific order. Lower numbers appear
   first.
7. Keep **Active** on to show it, or turn it off to hide the highlight
   without deleting it.

The homepage shows up to three active highlights and links each one back to
Instagram.

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
  `rss.xml`, `sitemap.xml`, `robots.txt`, or any collection name
  (`library`) — those routes always take priority, so a colliding page
  would silently never appear.

If you accidentally hit one of these, the content still saves in the CMS —
it just won't appear on the live site, and a build-log warning will name
the file to rename.

## Content types, tags and search

Content types and REVS metadata are fixed lists rather than free text. This
is deliberate: it stops filter pages from splintering into near-duplicates
over time, while still letting the one Library hold articles, guides,
resources, posters and visual explainers together. To add or change an
option, edit the Library fields in `public/admin/config.yml`.

Tags, by contrast, aren't managed in a separate list — they're created
automatically the first time you type a new one into a Library item. Tag
filter pages and the sitewide `/search` page pick up new values on the next
deploy with no extra step.
