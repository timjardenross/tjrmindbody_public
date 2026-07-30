# Disaster Recovery Notes

## What's at risk, and what isn't

Because this is a Git-based CMS with no external database:

- **All content, media and configuration live in the `tjrmindbody_public` GitHub
  repository.** There is no separate content database to lose. As long as
  the GitHub repo exists, the entire content platform (every article,
  image, and CMS config) can be reconstructed.
- **Every edit is a Git commit.** Full history of every article — every
  draft, every publish, every past version — is preserved in Git history
  under `public-site/content/`. Nothing is ever silently overwritten.
- **The deployed site is fully static (SSG).** If Vercel is unreachable,
  the last successful deployment continues serving from Vercel's edge
  cache/CDN until a new deploy succeeds.

## Recovering a deleted or corrupted article

```bash
# Find the last commit that touched the file:
git log --follow -- public-site/content/library/my-post.md

# Restore it from a specific commit:
git checkout <commit-sha> -- public-site/content/library/my-post.md
git commit -m "restore: recover my-post.md"
git push
```

## Recovering from a bad deploy

Vercel keeps every previous deployment. In the Vercel dashboard:
Project → Deployments → find the last known-good deployment → **Promote to
Production**. This is instant and doesn't require a new Git commit.

To fix the underlying code/content and redeploy properly:

```bash
git revert <bad-commit-sha>
git push
```

## Recovering the CMS login (GitHub OAuth App)

If the OAuth App's client secret is lost or compromised:

1. GitHub → Developer settings → OAuth Apps → the app → **Generate a new
   client secret**, revoke the old one.
2. Update `GITHUB_OAUTH_CLIENT_SECRET` in the Vercel project's environment
   variables.
3. Redeploy (or wait for the next deploy — env var changes take effect on
   the next build/runtime restart).

No content or media is affected by rotating OAuth credentials — it only
gates who can log in to `/admin`.

## Recovering uploaded media

Uploaded images live under `public-site/public/uploads/` in Git, same as
content — they're recovered the same way as any other file (`git log` /
`git checkout <sha> -- <path>`). There is no separate media host to worry
about losing access to.

## Full repository loss

If the GitHub repository itself were somehow lost:

- Anyone with a local clone (including this repo's collaborators, and any
  CI/CD runner that has checked it out) has a complete copy of content
  history up to their last fetch.
- Vercel also retains the source it built from for each deployment for a
  period of time (see Vercel's own retention policy) — sufficient as a
  secondary recovery path in the worst case, though GitHub itself (with
  standard GitHub-side backups) is the primary source of truth and the
  first thing to restore before anything else.
