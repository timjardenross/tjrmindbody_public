import { describe, expect, it } from 'vitest';
import { paginate } from '../pagination';

describe('paginate', () => {
  const items = Array.from({ length: 20 }, (_, i) => i);

  it('slices the first page by page size', () => {
    const result = paginate(items, 1, 9);
    expect(result.items).toEqual(items.slice(0, 9));
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
  });

  it('slices a middle page', () => {
    const result = paginate(items, 2, 9);
    expect(result.items).toEqual(items.slice(9, 18));
  });

  it('clamps below page 1 up to page 1', () => {
    const result = paginate(items, 0, 9);
    expect(result.currentPage).toBe(1);
  });

  it('clamps above the last page down to the last page', () => {
    const result = paginate(items, 99, 9);
    expect(result.currentPage).toBe(3);
    expect(result.items).toEqual(items.slice(18, 20));
  });

  it('handles an empty list as a single empty page', () => {
    const result = paginate([], 1, 9);
    expect(result.totalPages).toBe(1);
    expect(result.items).toEqual([]);
  });
});
