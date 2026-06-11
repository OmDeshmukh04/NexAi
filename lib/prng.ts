/**
 * Deterministic mulberry32 PRNG. Scene geometry generated during render must
 * be stable across re-renders (react-hooks/purity), so seeded randomness
 * replaces Math.random in Three.js components.
 */
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
