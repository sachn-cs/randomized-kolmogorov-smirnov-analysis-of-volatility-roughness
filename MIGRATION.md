# Migration Guide — `rksavr` → `hurstify`

Version 2.0.0 of the library was published under a new name: **`hurstify`**.

The package was renamed to better reflect what the library does — to *Hurst-ify* a series — rather than the algorithm name (RK-SAVR). The rebrand was cosmetic and ergonomic; **the public API, behavior, and tests are unchanged.**

## What changed

| Item | Before | After |
|------|--------|-------|
| npm package | `rksavr` | `hurstify` |
| GitHub repo | `sachncs/randomized-kolmogorov-smirnov-analysis-of-volatility-roughness` | `sachncs/hurstify` |
| Demo stack | Vite + Chart.js + Plotly.js | Next.js 16 + shadcn/ui + Tailwind v4 + Recharts |
| Node engines | `>=18.x` | `>=24` |
| Test layout | flat under `tests/` | `tests/unit/`, `tests/integration/`, `tests/fixtures/` |

## What did NOT change

- Public API surface (every export from `lib/index.js`).
- The library source files (`lib/*.js`) — only `.d.ts` declarations were added.
- Algorithm behavior — verified by the 190-test suite passing under the new name.
- Distribution bundles — still ESM + CJS + IIFE.
- License — still MIT.
- Citation — still cite Angelini & Bianchi (2025).

## Migration steps

### 1. Update your dependencies

```diff
- "rksavr": "^1.0.0"
+ "hurstify": "^2.0.0"
```

### 2. Update your imports

```diff
- import { RKSAVR } from 'rksavr';
+ import { RKSAVR } from 'hurstify';
```

The class name (`RKSAVR`) and method signatures remain identical.

### 3. Update CI imports (if any)

```diff
- - run: npm install rksavr
+ - run: npm install hurstify
```

### 4. Update README badges (if you reference the package in docs)

```diff
- [![npm](https://img.shields.io/npm/v/rksavr)](https://www.npmjs.com/package/rksavr)
+ [![npm](https://img.shields.io/npm/v/hurstify)](https://www.npmjs.com/package/hurstify)
```

## Cite the original algorithm

Whether you used the old name or the new, please cite the algorithm paper:

```
Angelini, A., & Bianchi, M. (2025).
Randomized Kolmogorov-Smirnov Analysis of Volatility Roughness.
arXiv:2509.20015v3.
```

## Questions?

Open an issue on the GitHub repo or email sachncs@gmail.com.
