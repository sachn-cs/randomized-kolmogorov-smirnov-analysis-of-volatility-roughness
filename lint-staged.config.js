/**
 * Lint-staged configuration.
 * Runs eslint + prettier on staged files only, keeping pre-commit snappy.
 */

export default {
  // lib/ + tests/ + experiments/ JS: lint + format
  '{lib,tests,experiments}/**/*.js': ['eslint --fix', 'prettier --write'],
  // lib/ + tests/ + experiments/ TS: lint + format
  '{lib,tests,experiments}/**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  // Root-level JS only (lint-staged.config.js itself, eslint.config.js, etc.)
  '*.{js,cjs,mjs}': ['eslint --fix', 'prettier --write'],
  // demo: prettier only — TS-aware eslint is wired in demo/eslint.config.mjs
  // and not yet enabled in lint-staged because typescript-eslint 8.x does
  // not yet support TypeScript 7 (see issue 10940).
  'demo/**/*.{ts,tsx,js,jsx,json,md,css,yml,yaml}': ['prettier --write'],
  // Top-level config + docs.
  '*.{json,md,css,yml,yaml}': ['prettier --write'],
};
