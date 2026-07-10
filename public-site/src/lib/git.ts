import { spawnSync } from 'node:child_process';

/**
 * Last commit date that touched `relativePath` (resolved from process.cwd()),
 * used as a sitemap `lastmod` fallback for content with no explicit
 * frontmatter date. Returns undefined if git is unavailable or the path has
 * no history in this checkout (e.g. a shallow clone) so callers can fall
 * back further rather than reporting a wrong date.
 */
export function gitLastModified(relativePath: string): Date | undefined {
  try {
    const result = spawnSync('git', ['log', '-1', '--format=%aI', '--', relativePath], {
      encoding: 'utf8',
    });
    const iso = result.stdout?.trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}
