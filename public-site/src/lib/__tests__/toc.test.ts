import { describe, expect, it } from 'vitest';
import { extractToc } from '../toc';

describe('extractToc', () => {
  it('extracts h2/h3 headings with slugs matching rehype-slug', () => {
    const markdown = `
## Introduction

Some text.

### A subsection

More text.

## Details
`;
    const toc = extractToc(markdown);
    expect(toc).toEqual([
      { depth: 2, text: 'Introduction', slug: 'introduction' },
      { depth: 3, text: 'A subsection', slug: 'a-subsection' },
      { depth: 2, text: 'Details', slug: 'details' },
    ]);
  });

  it('ignores h1 and h4+', () => {
    const markdown = '# Title\n\n#### Too deep\n\n## Kept\n';
    const toc = extractToc(markdown);
    expect(toc).toEqual([{ depth: 2, text: 'Kept', slug: 'kept' }]);
  });

  it('dedupes repeated heading text the way github-slugger does', () => {
    const markdown = '## Overview\n\n## Overview\n';
    const toc = extractToc(markdown);
    expect(toc.map((t) => t.slug)).toEqual(['overview', 'overview-1']);
  });
});
