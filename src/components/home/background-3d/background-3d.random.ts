const UINT32_RANGE = 2 ** 32;

/**
 * mulberry32: a tiny seeded generator returning numbers in [0, 1). The same
 * seed always gives the same sequence, so the scene looks the same on every visit.
 */
export function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / UINT32_RANGE;
  };
}
