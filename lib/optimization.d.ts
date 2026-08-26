/**
 * Type declarations for the Optimizer strategy hierarchy.
 */

export declare class Optimizer {
  minimize(
    objective: (h: number) => number,
    lower: number,
    upper: number,
    initial: number,
  ): number;
}

export declare class BrentOptimizer extends Optimizer {}
export declare class AdaptiveGridSearchOptimizer extends Optimizer {}
export declare class NelderMeadOptimizer extends Optimizer {}
export declare class SimulatedAnnealingOptimizer extends Optimizer {}
export declare class DifferentialEvolutionOptimizer extends Optimizer {}

export declare function safeOptimizer(
  optimizer: Optimizer,
): (
  objective: (h: number) => number,
  lower: number,
  upper: number,
  initial: number,
) => number;

export declare function getOptimizer(name: string): Optimizer | undefined;

export declare function resolveOptimizer(
  candidate: string | Optimizer,
): Optimizer;

export declare function registerOptimizer(
  name: string,
  factory: () => Optimizer,
): void;

export interface BrentResult {
  x: number;
  f: number;
}

export declare function brentMinimize(
  f: (x: number) => number,
  ax: number,
  bx: number,
  cx: number,
  tol?: number,
): BrentResult;

export declare function nelderMead(
  f: (xs: number[]) => number,
  x0: number[],
  opts?: {
    maxIter?: number;
    tol?: number;
    alpha?: number;
    gamma?: number;
    rho?: number;
    sigma?: number;
  },
): {x: number[]; f: number};

export declare function simulatedAnnealing(
  f: (xs: number[]) => number,
  x0: number[],
  opts?: {maxIter?: number; coolingRate?: number; stepSize?: number},
): {x: number[]; f: number};

export declare function differentialEvolution(
  f: (xs: number[]) => number,
  x0: number[],
  opts?: {maxIter?: number; popSize?: number; crossover?: number; f?: number},
): {x: number[]; f: number};

export declare function adaptiveGridSearch(
  f: (x: number) => number,
  min: number,
  max: number,
  opts?: {gridSize?: number; refineIters?: number; tol?: number},
): BrentResult;
