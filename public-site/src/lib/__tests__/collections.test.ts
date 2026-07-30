import { describe, expect, it } from 'vitest';
import { collections, RESERVED_ROUTE_BASES } from '../collections';

describe('collection registry', () => {
  it('imports without throwing (no collection collides with a reserved route base)', () => {
    // The guard in collections.ts throws at module load time if any
    // collection's routeBase collides with RESERVED_ROUTE_BASES — reaching
    // this line at all means the current registry already passed it.
    expect(collections.length).toBeGreaterThan(0);
  });

  it('has no routeBase that overlaps a reserved top-level route', () => {
    const routeBases = collections.map((c) => c.routeBase).filter((r): r is string => r !== null);
    for (const base of routeBases) {
      expect(RESERVED_ROUTE_BASES).not.toContain(base);
    }
  });

  it('has unique routeBase values across collections', () => {
    const routeBases = collections.map((c) => c.routeBase).filter((r): r is string => r !== null);
    expect(new Set(routeBases).size).toBe(routeBases.length);
  });
});
