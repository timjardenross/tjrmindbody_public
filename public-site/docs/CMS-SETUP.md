# CMS Setup Guide — Sveltia CMS + GitHub OAuth

This walks through connecting the `/admin` editor to GitHub for the first
time. It's a one-time setup per deployment environment (do it once for
production; repeat for a staging deployment if you add one).

## 1. Create a GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**.
2. **Application name**: `TJR Mind & Body CMS`
3. **Homepage URL**: your production site URL (e.g. `https://www.tjrmindbody.com`)
4. **Authorization callback URL**: `<site-url>/api/auth` — e.g.
   `https://www.tjrmindbody.com/api/auth`. This must match exactly.
5. Create the app, then generate a **Client secret**.

## 2. Set environment variables

In the Vercel project for `public-site/` (Project Settings → Environment
Variables), set:

| Variable | Value |
|---|---|
| `GITHUB_OAUTH_CLIENT_ID` | the OAuth App's Client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | the OAuth App's Client secret |
| `NEXT_PUBLIC_SITE_URL` | the site's production URL, no trailing slash |

Locally, copy `.env.example` to `.env.local` and fill in the same values if
you want to test the `/admin` login flow on your machine (the OAuth App's
callback URL would need to point at your tunnel/localhost for that — in
practice it's easiest to just test auth against the deployed site).

## 3. Point `config.yml` at the right domain

`public/admin/config.yml` → `backend.base_url` must equal
`NEXT_PUBLIC_SITE_URL`. It's a static file served to the browser, so it
can't read the environment variable — update it by hand whenever the
production domain changes:

```yaml
backend:
  name: github
  repo: timjardenross/tjrmindbody_public
  branch: main
  base_url: https://www.tjrmindbody.com   # <- update this
  auth_endpoint: api/auth
```

## 4. How authentication works

Sveltia CMS's GitHub backend opens a popup to `<base_url>/api/auth`. That
route (`src/app/api/auth/route.ts`) is a self-hosted replacement for the
OAuth broker Netlify used to provide for free via Identity/Git Gateway:

1. **No `code` param** → redirects the popup to GitHub's OAuth authorize
   screen (`scope=repo,read:user`), storing a CSRF `state` value in a short-lived
   cookie.
2. User approves access on GitHub → GitHub redirects back to
   `/api/auth?code=...&state=...`.
3. The route verifies `state`, exchanges `code` for an access token via
   GitHub's token endpoint, and returns a small HTML page that performs the
   standard Decap/Sveltia `postMessage` handshake
   (`authorizing:github` → `authorization:github:success:{...}`) back to
   the CMS window, which then closes the popup and is authenticated.

No token is ever stored server-side — it's handed to the browser once and
kept in memory by the CMS for the session, exactly as Netlify's own
Identity/Git Gateway worked.

## 5. Log in

Visit `<site-url>/admin`, click **Login with GitHub**, approve the OAuth
App. Anyone who authenticates this way authenticates *as themselves* against
GitHub, so access control is just "who has write access to
`timjardenross/tjrmindbody_public`" — no separate CMS user database exists.

## 6. Adding a new content collection later

1. Add an entry to `collections` in `src/lib/collections.ts`.
2. Add a matching `- name: ...` block to `public/admin/config.yml` with its
   `folder: "public-site/content/<key>"`.
3. Create `content/<key>/` (an empty directory; Git won't track it until it
   has a file — commit a real entry or a `.gitkeep`).

No other code changes are required — see `ARCHITECTURE.md`.
