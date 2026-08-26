/**
 * @fileoverview Re-exports for the optimization layer.
 *
 * Provides a single import surface for every optimizer shipped with the
 * library plus the registry helpers used internally by `Hurstify`.
 *
 * The free-function optimizers (`brentMinimize`, `nelderMead`, etc.) are
 * retained for direct use; the polymorphic `Optimizer` subclasses are
 * the form consumed by the hurstify estimator.
 */

export {Optimizer} from './optimizer.js';
export {brentMinimize} from './brent.js';
export {nelderMead} from './nelderMead.js';
export {simulatedAnnealing} from './simulatedAnnealing.js';
export {differentialEvolution} from './differentialEvolution.js';
export {adaptiveGridSearch} from './adaptiveGridSearch.js';
export {BrentOptimizer} from './brent.js';
export {AdaptiveGridSearchOptimizer} from './adaptiveGridSearch.js';
export {NelderMeadOptimizer} from './nelderMead.js';
export {SimulatedAnnealingOptimizer} from './simulatedAnnealing.js';
export {DifferentialEvolutionOptimizer} from './differentialEvolution.js';
export {
  safeOptimizer,
  getOptimizer,
  resolveOptimizer,
  registerOptimizer,
} from './registry.js';
