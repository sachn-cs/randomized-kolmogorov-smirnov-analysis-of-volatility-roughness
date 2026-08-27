/**
 * @fileoverview Re-exports for the optimization layer.
 *
 * Provides a single import surface for every optimizer shipped with the
 * library plus the registry helpers used internally by `Hurstify`.
 *
 * The free-function optimizers (`runBrent`, `runNelderMead`, etc.) are
 * retained for direct use; the polymorphic `Optimizer` subclasses are
 * the form consumed by the hurstify estimator.
 */

export {Optimizer} from './optimizer.js';
export {runBrent} from './brent.js';
export {runNelderMead} from './nelderMead.js';
export {runSimulatedAnnealing} from './simulatedAnnealing.js';
export {runDifferentialEvolution} from './differentialEvolution.js';
export {runAdaptiveGridSearch} from './adaptiveGridSearch.js';
export {BrentOptimizer} from './brent.js';
export {AdaptiveGridSearchOptimizer} from './adaptiveGridSearch.js';
export {NelderMeadOptimizer} from './nelderMead.js';
export {SimulatedAnnealingOptimizer} from './simulatedAnnealing.js';
export {DifferentialEvolutionOptimizer} from './differentialEvolution.js';
export {
  wrapSafeOptimizer,
  getOptimizer,
  resolveOptimizer,
  registerOptimizer,
  optimizerRegistry,
} from './registry.js';
