/**
 * @fileoverview Strategy base class for pluggable optimizers.
 *
 * Every algorithm in `optimization/` (Brent, Nelder-Mead, simulated
 * annealing, differential evolution, adaptive grid search) extends this
 * base class so the hurstify estimator can dispatch on the concrete
 * subtype through a single uniform method: `minimize(...)`.
 *
 * The estimator holds an `Optimizer` instance, not a string identifier;
 * the registry resolves string keys into instances for callers that
 * prefer that ergonomics.
 */

/**
 * Scalar objective type: a function of a single `H` value that returns
 * the function value (lower is better).
 */
export type Objective = (h: number) => number;

/**
 * Strategy base class. Subclasses implement `minimize` polymorphically.
 */
export class Optimizer {
  /**
   * Minimizes the given objective on the closed interval `[lower, upper]`
   * starting from `initial`. Subclasses implement the algorithm-specific
   * search.
   *
   * @param objective Scalar objective function.
   * @param lower Lower bound of the search interval.
   * @param upper Upper bound of the search interval.
   * @param initial Initial guess inside `[lower, upper]`.
   * @return Argmin `h` inside `[lower, upper]`.
   */
  minimize(
    objective: Objective,
    lower: number,
    upper: number,
    initial: number,
  ): number {
    throw new Error(
      `${this.constructor.name}.minimize() is not implemented; ` +
        `use a concrete Optimizer subclass.`,
    );
  }
}
