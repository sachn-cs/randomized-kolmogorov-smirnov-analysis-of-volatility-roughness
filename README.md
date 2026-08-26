# hurstify

> **The problem.** Estimating the Hurst parameter of rough-volatility processes is hard. Parametric models miss the point, and historical estimators carry estimator bias and slow windows.
>
> **The answer.** hurstify gives you a one-call estimator for `H` built on the RK-SAVR algorithm — the rescaled, multi-sample, block-permuted Kolmogorov–Smirnov distance developed by Angelini & Bianchi (2025). Zero dependencies, runs anywhere JavaScript runs.

<p align="center">
  <a href="#installation"><img src="https://img.shields.io/badge/node-26%2B-brightgreen" alt="Node">
<a href="https://github.com/sachncs/hurstify/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sachncs/hurstify/ci.yml?branch=master" alt="Build Status"></a></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
  <a href="https://github.com/sachncs/hurstify/actions"><img src="https://img.shields.io/github/actions/workflow/status/sachncs/hurstify/ci.yml?branch=master" alt="CI"></a>
  <a href="https://www.npmjs.com/package/hurstify"><img src="https://img.shields.io/npm/v/hurstify" alt="npm"></a>
  <a href="https://github.com/sachncs/hurstify/stargazers"><img src="https://img.shields.io/github/stars/sachncs/hurstify" alt="Stars"></a>
</p>

## Features

- **Observatory** — Interactive Next.js 16 + shadcn/ui app (`npm run dev:demo`) for live H estimation, parameter grid search, and replicated paper figures.
- **Distributional scaling** — Compare entire rescaled distributions of increments across scales.
- **Block random permutation** — Decorrelate serial dependence while preserving marginal distributions.
- **Variance reduction** — Repeated subsampling and averaging across `K` independent iterations.
- **Multi-scale analysis** — Vectorized scaling profile across `k` scales with optional weights.
- **Pluggable optimizers** — Brent's method, Nelder-Mead, simulated annealing, differential evolution, and adaptive grid search.
- **Statistical inference** — Asymptotic variance (Prop 2.9), confidence intervals, KS significance testing, Kalman filtering, CUSUM break detection, constancy test, bootstrap CIs.
- **Synthetic data** — Hosking-method fBm/fGn, VIX-style and SPX-RV-style log-volatility generators.
- **Rough-volatility model zoo** — Simulators for rBergomi, rFSV, fOU, and mPRE processes.
- **H-forecasting** — ARFIMA, Holt-Winters, and LSTM-style predictors.
- **Noise correction** — Preaveraging, realized kernel, log-volatility de-biasing.
- **Zero runtime dependencies** — Pure JavaScript, ESM + CJS + IIFE distributions.

## Installation

```bash
npm install hurstify
```

Requires Node.js ≥ 24.

## Quick Start

```javascript
import { Hurstify, generateFBM } from 'hurstify';

// Generate a synthetic rough-volatility path with H = 0.1
const path = generateFBM(2000, 0.1);

// Estimate Ĥ in a single call
const r = new Hurstify({
  scaleA1: 1,
  scaleA2: 25,
  sampleSize: 500,
  iterations: 16,
});
const H = r.estimateSingle(path);
console.log(`Ĥ = ${H.toFixed(3)} (true: 0.100)`);
```

For multi-scale analysis:

```javascript
const r = new Hurstify({
  scales: [1, 2, 5, 10, 20, 50],
  weights: [1.0, 0.8, 0.6, 0.4, 0.2, 0.1],
  sampleSize: 500,
  iterations: 8,
});
const multiResults = r.rollingMultiScale(
  path, 512, [1, 2, 5, 10, 20, 50], [1, 0.8, 0.6, 0.4, 0.2, 0.1], 20,
);
```

For rolling estimation across a long series:

```javascript
const windowSize = 512;
const step = 20;
const results = r.rolling(path, windowSize, step, (p) => {
  console.log(`Progress: ${(p * 100).toFixed(1)}%`);
});
// results: [{ t: 0, H: 0.12 }, { t: 20, H: 0.14 }, ...]
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scaleA1` | `number` | `1` | Lower scale for increment computation |
| `scaleA2` | `number` | `50` | Upper scale for increment computation |
| `sampleSize` | `number` | `500` | Increments sampled per scale |
| `iterations` | `number` | `16` | Variance-reduction iterations |
| `blockSize` | `number` | `16` | Block length for random permutation |
| `optimizerType` | `string` | `'brent'` | Optimizer selection |
| `hMin` | `number` | `0.01` | Lower bound on H |
| `hMax` | `number` | `0.99` | Upper bound on H |
| `scales` | `Array<number>` | `null` | Multi-scale array; overrides `scaleA1`/`scaleA2` |
| `weights` | `Array<number>` | `null` | Per-scale weights |
| `sampler` | `function` | — | Custom `(data, n) => sample` |

### Optimizer selection

| Optimizer | Key | Best for |
|-----------|-----|----------|
| Brent's method | `'brent'` | Smooth 1D (default) |
| Nelder-Mead | `'nelder-mead'` | Multi-dimensional |
| Simulated annealing | `'annealing'` | Global optimization |
| Differential evolution | `'de'` | Population-based |
| Adaptive grid search | `'ags'` | Coarse-to-fine |

## API Reference

| Symbol | Description |
|--------|-------------|
| `Hurstify` | Main estimator (two-scale and multi-scale) |
| `Hurstify#estimate(data)` | Single-shot `H` estimate |
| `Hurstify#estimateSingleWithDiagnostics(data)` | Returns `H`, `D`, significance, SE, CI |
| `Hurstify#rolling(data, w, step, onProgress)` | Sliding-window `H` trajectory |
| `Hurstify#rollingMultiScale(...)` | Multi-scale rolling estimates |
| `asymptoticVariance(a1, a2, n, m)` | Prop 2.9 variance |
| `confidenceInterval(h, a1, a2, n, m, alpha)` | CI for `H` |
| `kalmanFilter(series, opts)` | Kalman-smoothed `H` series |
| `cusumTest(series, opts)` | CUSUM structural-break test |
| `constancyTest(series)` | Constancy-of-H test |
| `bootstrapCI(estimator, data, B, alpha)` | Bootstrap CI |
| `rBergomi / rFSV / fOU / mPRE` | Rough-vol path simulators |
| `arfima / holtWintersForecast / createLSTM` | H-forecasting |
| `preavgReturns / realizedKernel / logVolDebias` | Microstructure-noise correction |

## Methodology

Given a stationary window `X_0, …, X_{W-1}` of a log-volatility series:

1. **Segmentation** — Slice into overlapping windows.
2. **Increments** — Compute `Z_{t,a} = X_{t+a} − X_t` at scales `a₁` and `a₂` (or a multi-scale array).
3. **Block permutation** — Randomly permute blocks to remove temporal correlation, preserving marginals.
4. **Subsampling** — Draw `T` increments per scale via Floyd's reservoir sampler.
5. **Rescaling** — Rescale by `a^(−H)`; under the null of self-similarity the rescaled samples are i.i.d.
6. **KS minimization** — Find `H ∈ (0, 1)` minimizing the two-sample KS distance between rescaled samples.
7. **Variance reduction** — Average across `K` iterations.

The asymptotic variance of `Ĥ` (Proposition 2.9 in the paper):

```
Var(Ĥ) = (2 π e) / (ln(a₂ / a₁))² × (1/√n + 1/√m)²
```

Doubling the sample sizes halves the SE; widening the scale ratio shrinks it quadratically.

## Project Structure

```
hurstify/
├── lib/                       # Core library (zero runtime deps)
│   ├── index.js               # Public API entry
│   ├── hurstify.js            # Main estimator class
│   ├── stats.js               # KS distance, block permutation, sampling
│   ├── optimization/          # Brent, Nelder-Mead, SA, DE, AGS
│   ├── inference/             # Asymptotic variance, Kalman, CUSUM
│   ├── data/                  # Loaders, preprocessing, noise correction
│   ├── models/                # rBergomi, rFSV, fOU, mPRE
│   ├── random.js              # Hosking fGn/fBm
│   ├── prng.js                # Seedable mulberry32 PRNG
│   └── logger.js              # Leveled logger
├── demo/                      # Next.js 16 + shadcn/ui observatory
├── tests/                     # Mocha + Chai test suites
│   ├── unit/                  #   unit tests
│   ├── integration/           #   end-to-end tests
│   └── fixtures/              #   shared test data
├── .github/                   # CI, issue templates, CODEOWNERS
└── docs/                      # Generated JSDoc
```

## Development

```bash
git clone https://github.com/sachncs/hurstify.git
cd hurstify
npm install
npm run lint          # ESLint + Prettier
npm run test          # 190 tests
npm run build         # Rollup → dist/
npm run docs          # JSDoc → docs/ + API.md
npm run dev:demo      # Next.js observatory
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Language | JavaScript (ES2022+) + TypeScript declarations |
| Bundler | Rollup with Babel 8 |
| Test | Mocha + Chai + c8 |
| Lint | ESLint 10 (Google config) + Prettier 3 |
| Docs | JSDoc + jsdoc-to-markdown |
| Demo | Next.js 16 + React 19 + Tailwind 4 + shadcn/ui (new-york) |

## Roadmap

- **v1.0** — Current: core RK-SAVR estimator, multi-scale analysis, statistical inference, model zoo, forecasting.
- **v2.0** — Rebrand to `hurstify`, per-module TypeScript declarations, Next.js 16 + shadcn observatory.
- **v2.1** — React Hook Form for advanced parameter sweeps, persistent demo state, dark/light theme toggle.
- **v3.0** — Real-time WebSocket demo with streaming estimator; integration with VIX/SPX-RV reference datasets.

## License

[MIT](LICENSE) © 2025–2026 Sachin.

This is an **independent implementation** of the RK-SAVR algorithm described in *Randomized Kolmogorov-Smirnov Analysis of Volatility Roughness* (arXiv:2509.20015v3) by Angelini & Bianchi. The author is not affiliated with the paper's authors. Provided as-is for research and educational use. Please cite the original paper when using this library in academic work.

---

**Screenshots**: launch the observatory locally with `npm run dev:demo`.

## References

- Angelini & Bianchi (2025). *Randomized Kolmogorov-Smirnov Analysis of Volatility Roughness*. [arXiv:2509.20015v3](https://arxiv.org/abs/2509.20015v3).
- Bianchi (2004). *A new distribution-based estimator of the self-similarity parameter*.
- Bayer, Friz, Gatheral (2016). *Roughing it up: Connecting rough volatility with option pricing*.
- Gatheral, Jaisson, Rosenbaum (2018). *Volatility is Rough*.
- Hosking (1984). *Modeling persistence in hydrological time series using fractional differencing*.
- Mandelbrot & Van Ness (1968). *Fractional Brownian motions, fractional noises and applications*.
- Brent (1971). *Algorithms for Minimization without Derivatives*.
