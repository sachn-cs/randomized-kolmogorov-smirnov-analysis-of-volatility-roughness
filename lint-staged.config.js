/**
 * Lint-staged configuration.
 * Runs eslint + prettier on staged files only, keeping pre-commit snappy.
 */

export default {
  '*.js': ['eslint --fix', 'prettier --write'],
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,yml,yaml}': ['prettier --write'],
  'demo/components/ui/**/*.{ts,tsx}': ['prettier --write'],
};
