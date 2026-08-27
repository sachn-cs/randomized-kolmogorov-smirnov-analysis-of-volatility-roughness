// ESLint flat config for the demo (Next.js + shadcn/ui + recharts).
//
// Run via `npm run lint:demo`, which is invoked from the repo root with
// `eslint --config demo/eslint.config.mjs demo/`. The top-level
// `eslint.config.js` ignores demo/** for the lib lint pass so the two
// configs do not collide.
//
// Note: typescript-eslint 8.x does not yet support TypeScript 7 (see
// https://github.com/typescript-eslint/typescript-eslint/issues/10940), so
// this config uses syntax-only parsing with `project: false`. Once
// upstream supports TS 7 we can enable the type-aware rules.

import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'demo/.next/**',
      'demo/dist/**',
      'demo/node_modules/**',
      'demo/components/ui/**',
      'demo/next-env.d.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {jsx: true},
        // Syntax-only parsing — no type checker, no TS API call.
        project: false,
      },
    },
    rules: {
      // Demo codebase relaxations (shadcn/ui generates terse code):
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];
