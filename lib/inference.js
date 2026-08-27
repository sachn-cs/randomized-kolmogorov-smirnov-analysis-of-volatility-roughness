/**
 * @fileoverview Statistical inference facade for hurstify.
 *
 * Re-exports the focused submodule APIs and adds a tiny convenience
 * layer that instantiates the {@link HypothesisTest} strategy classes
 * for direct use without subclassing.
 *
 * - {@link getAsymptoticVariance}, {@link getStandardError},
 *   {@link getConfidenceInterval}: analytical-variance / CI helpers.
 * - {@link runKalmanFilter}: 1D Kalman filter state-space smoothing.
 * - {@link runSignificanceTest}, {@link runCusumTest},
 *   {@link runConstancyTest}, {@link bootstrapConfidenceInterval}: thin
 *   wrappers around the `HypothesisTest` strategies that accept raw
 *   data and options.
 *
 * The module depends on the seeded `nextRandom()` dispatcher in
 * `prng.js`, so bootstrap samples are reproducible across runs.
 *
 * @see ./inference/asymptotic.js for the analytical-variance helpers.
 * @see ./inference/filtering.js for the Kalman filter and LRT.
 * @see ../strategies/hypothesis-test.js for the polymorphic
 * * `HypothesisTest` strategy hierarchy.
 */

export {
  getAsymptoticVariance,
  getStandardError,
  getConfidenceInterval,
} from './inference/asymptotic.js';

export {runKalmanFilter, runConstancyTest} from './inference/filtering.js';

import {
  KsSignificanceTest,
  CusumBreakTest,
  ConstancyTest,
  BootstrapConfidenceInterval,
} from './strategies/hypothesis-test.js';

const _ksSignificance = new KsSignificanceTest();
const _cusumBreak = new CusumBreakTest();
const _constancy = new ConstancyTest();
const _bootstrap = new BootstrapConfidenceInterval();

/**
 * Runs the KS-distance significance test on a previously minimized
 * statistic returned by `Hurstify.estimateSingle`.
 *
 * @param {number} D Minimized KS distance.
 * @param {number} n Sample size at scale `a_1`.
 * @param {number} m Sample size at scale `a_2`.
 * @param {number} alpha Significance level (default `0.05`).
 * @return {{significant: boolean, pValue: number, statistic: number,
 *   criticalValue: number}} Test result.
 * @throws {Error} When `D` is non-finite or negative.
 */
export function runSignificanceTest(D, n, m, alpha = 0.05) {
  return _ksSignificance.run({D, n, m}, {alpha});
}

/**
 * One-sided CUSUM structural-break test on a series of H estimates.
 *
 * @param {Array<number>} hHistory Time-ordered series of `H` estimates.
 * @param {number} targetH Target value of `H` under the null of
 *   structural stability (typically the series mean).
 * @param {number} threshold Alarm threshold (default `3.0`).
 * @return {{breakDetected: boolean, maxCusum: number, breakIndex: number}}
 *   Test result.
 */
export function runCusumTest(hHistory, targetH, threshold = 3.0) {
  return _cusumBreak.run(hHistory, {targetH, threshold});
}

/**
 * Detects breakpoints in a series of H estimates via a sliding-window
 * CUSUM.
 *
 * @param {Array<number>} hHistory Time-ordered series of `H` estimates.
 * @param {number} windowSize Sliding window size (default `50`).
 * @param {number} threshold CUSUM threshold (default `3.0`).
 * @return {Array<{index: number, H_before: number, H_after: number}>}
 *   Detected breakpoints in chronological order.
 */
export function detectCusumBreakpoints(hHistory, windowSize = 50, threshold = 3.0) {
  const breakpoints = [];
  for (let i = windowSize; i < hHistory.length - windowSize; i++) {
    const before = hHistory.slice(i - windowSize, i);
    const after = hHistory.slice(i, i + windowSize);
    const meanBefore = before.reduce((a, b) => a + b, 0) / before.length;
    const meanAfter = after.reduce((a, b) => a + b, 0) / after.length;
    const stdBefore = Math.sqrt(
      before.map((x) => (x - meanBefore) ** 2).reduce((a, b) => a + b, 0) /
        before.length,
    );
    if (stdBefore === 0) continue;
    const result = runCusumTest(after, meanBefore, threshold);
    if (result.breakDetected) {
      breakpoints.push({index: i, H_before: meanBefore, H_after: meanAfter});
    }
  }
  return breakpoints;
}

/**
 * Nonparametric bootstrap confidence interval for an arbitrary
 * `H` estimator.
 *
 * @param {function(Array<number>): number} estimator Function that
 *   returns `H` from a window.
 * @param {Array<number>} window Data window.
 * @param {number} nBoot Bootstrap iterations (default `1000`).
 * @param {number} alpha Significance level (default `0.05`).
 * @return {{lower: number, upper: number, pointEstimate: number}}
 *   Percentile bootstrap CI.
 * @throws {Error} When `window` is empty.
 */
export function bootstrapConfidenceInterval(estimator, window, nBoot = 1000, alpha = 0.05) {
  return _bootstrap.run({window}, {estimator, nBoot, alpha});
}

/**
 * Convenience: runs the constancy test on a series of `H` estimates.
 *
 * @param {Array<number>} observations Time-ordered `H` estimates.
 * @param {Object=} opts Filter options.
 * @return {{lrStat: number, pValue: number, constant: boolean}}
 *   Test result.
 */
export function constancyTestVia(observations, opts = {}) {
  return _constancy.run(observations, opts);
}

void constancyTestVia;