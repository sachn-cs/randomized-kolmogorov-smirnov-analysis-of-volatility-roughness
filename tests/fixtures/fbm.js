/**
 * Shared test fixtures for hurstify tests.
 * Reusable paths and seeds exercised across test suites.
 */

import {generateFBM, setSeed, resetSeed} from '../../lib/index.js';

export function fixtureFBM(n = 1000, h = 0.1) {
  setSeed(42);
  const p = generateFBM(n, h);
  resetSeed();
  return p;
}

export const FIXTURE_H = 0.1;
export const FIXTURE_N = 1000;
