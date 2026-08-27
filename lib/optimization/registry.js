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
 *
 * Built on top of the generic {@link Registry} from `strategies/`.
 */

import {BrentOptimizer} from './brent.js';
import {AdaptiveGridSearchOptimizer} from './adaptiveGridSearch.js';
import {NelderMeadOptimizer} from './nelderMead.js';
import {SimulatedAnnealingOptimizer} from './simulatedAnnealing.js';
import {DifferentialEvolutionOptimizer} from './differentialEvolution.js';
import {Registry} from '../strategies/registry.js';

/**
 * Global optimizer registry.
 *
 * @type {Registry<import('./optimizer.js').Optimizer>}
 */
export const optimizerRegistry = new Registry();

optimizerRegistry.register('brent', () => new BrentOptimizer());
optimizerRegistry.register('ags', () => new AdaptiveGridSearchOptimizer());
optimizerRegistry.register('nelder-mead', () => new NelderMeadOptimizer());
optimizerRegistry.register(
  'annealing',
  () => new SimulatedAnnealingOptimizer(),
);
optimizerRegistry.register('de', () => new DifferentialEvolutionOptimizer());

/**
 * Wraps an `Optimizer.minimize(...)` call so that any thrown error
 * becomes `NaN` instead of propagating. This keeps `Hurstify.estimate`
 * resilient: a bad iteration is logged and skipped, not aborting the
 * whole batch.
 *
 * @param {import('./optimizer.js').Optimizer} optimizer Optimizer
 *   instance.
 * @return {function(number, number, number, number): number} Wrapped
 *   minimize that returns `NaN` on failure.
 */
export function wrapSafeOptimizer(optimizer) {
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
 * @return {import('./optimizer.js').Optimizer|undefined} The strategy
 *   instance, or `undefined` if the key is unknown.
 */
export function getOptimizer(name) {
  return optimizerRegistry.resolve(name);
}

/**
 * Resolves a string key or returns the supplied instance unchanged.
 * Convenience for estimator construction that accepts both.
 *
 * @param {string|import('./optimizer.js').Optimizer} candidate Strategy
 *   instance or registry key.
 * @return {import('./optimizer.js').Optimizer} The resolved instance
 *   (a fresh one if a key was supplied).
 */
export function resolveOptimizer(candidate) {
  if (typeof candidate === 'string') {
    return optimizerRegistry.resolveOr(candidate, 'brent');
  }
  return candidate;
}

/**
 * Registers or overrides a custom `Optimizer` subclass factory.
 *
 * Useful when you want to a proprietary search algorithm without
 * modifying the library source.
 *
 * @param {string} name Optimizer identifier.
 * @param {function(): import('./optimizer.js').Optimizer} factory
 *   Factory returning a fresh instance.
 */
export function registerOptimizer(name, factory) {
  optimizerRegistry.register(name, factory);
}
