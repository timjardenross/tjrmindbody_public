import GithubSlugger from 'github-slugger';

export interface TocEntry {
  depth: number;
  text: string;
  slug: string;
}

/**
 * Extracts h2/h3 headings from raw Markdown for a table of contents.
 * Uses github-slugger — the same slugger rehype-slug uses internally — so
 * the generated ids line up with the anchors rendered into the page.
 */
export function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TocEntry[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim().replace(/[*_`]/g, '');
    toc.push({ depth, text, slug: slugger.slug(text) });
  }
  return toc;
}
