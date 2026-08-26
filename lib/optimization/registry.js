/**
 * @fileoverview Optimizer registry mapping short string keys to
 * `Optimizer` strategy instances.
 *
 * The estimator can be configured with either:
 *   1. A string key (e.g. `'brent'`) — resolved here into an instance, OR
 *   2. An `Optimizer` instance directly (skips the registry).
 *
 * Either way the estimator dispatches the actual minimization through
 * the polymorphic `Optimizer.minimize(...)` method.
 */

import {BrentOptimizer} from './brent.js';
import {AdaptiveGridSearchOptimizer} from './adaptiveGridSearch.js';
import {NelderMeadOptimizer} from './nelderMead.js';
import {SimulatedAnnealingOptimizer} from './simulatedAnnealing.js';
import {DifferentialEvolutionOptimizer} from './differentialEvolution.js';

/**
 * Names → factory functions producing fresh `Optimizer` instances.
 * A new instance per call ensures no shared mutable state between
 * estimators.
 */
const REGISTRY = {
  brent: () => new BrentOptimizer(),
  ags: () => new AdaptiveGridSearchOptimizer(),
  'nelder-mead': () => new NelderMeadOptimizer(),
  annealing: () => new SimulatedAnnealingOptimizer(),
  de: () => new DifferentialEvolutionOptimizer(),
};

/**
 * Wraps an `Optimizer.minimize(...)` call so that any thrown error
 * becomes `NaN` instead of propagating. This keeps `Hurstify.estimate`
 * resilient: a bad iteration is logged and skipped, not aborting the
 * whole batch.
 *
 * @param {Optimizer} optimizer Optimizer instance.
 * @return {function(number, number, number, number): number} Wrapped
 *   minimize that returns `NaN` on failure.
 */
export function safeOptimizer(optimizer) {
  return function (objective, lower, upper, initial) {
    try {
      return optimizer.minimize(objective, lower, upper, initial);
    } catch {
      return NaN;
    }
  };
}

/**
 * Resolves a string key into an `Optimizer` instance (preferred form).
 *
 * @param {string} name Optimizer identifier.
 * @return {Optimizer|undefined} The strategy instance, or `undefined`
 *   if the key is unknown.
 */
export function getOptimizer(name) {
  const factory = REGISTRY[name];
  return factory ? factory() : undefined;
}

/**
 * Resolves a string key or returns the supplied instance unchanged.
 * Convenience for estimator construction that accepts both.
 *
 * @param {string|Optimizer} candidate Strategy instance or registry key.
 * @return {Optimizer} The resolved instance (a fresh one if a key was
 *   supplied).
 */
export function resolveOptimizer(candidate) {
  if (typeof candidate === 'string') {
    const opt = getOptimizer(candidate) || getOptimizer('brent');
    return opt;
  }
  return candidate;
}

/**
 * Registers or overrides a custom `Optimizer` subclass factory.
 *
 * Useful when you want to plug in a proprietary search algorithm
 * without modifying the library source.
 *
 * @param {string} name Optimizer identifier.
 * @param {function(): Optimizer} factory Factory returning a fresh
 *   instance.
 */
export function registerOptimizer(name, factory) {
  REGISTRY[name] = factory;
}
