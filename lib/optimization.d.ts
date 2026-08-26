/**
 * Type declarations for `lib/optimization/index.js`.
 */

export interface BrentOptions {
  lowerBound: number;
  upperBound: number;
  tolerance?: number;
  maxIterations?: number;
}

export interface NelderMeadOptions {
  initial: number[];
  step?: number;
  tolerance?: number;
  maxIterations?: number;
}

export interface SimulatedAnnealingOptions {
  initial: number[];
  bounds: Array<[number, number]>;
  temperature?: number;
  cooling?: number;
  iterations?: number;
}

export interface DifferentialEvolutionOptions {
  bounds: Array<[number, number]>;
  population?: number;
  iterations?: number;
  crossover?: number;
  f?: number;
}

export interface AGSOptions {
  bounds: [number, number];
  initialGridSize?: number;
  refinementFactor?: number;
  iterations?: number;
}

export declare function brentMinimize(
  fn: (x: number) => number,
  opts: BrentOptions,
): {x: number; fx: number; iterations: number};
export declare function nelderMead(
  fn: (xs: number[]) => number,
  opts: NelderMeadOptions,
): {x: number[]; fx: number; iterations: number};
export declare function simulatedAnnealing(
  fn: (xs: number[]) => number,
  opts: SimulatedAnnealingOptions,
): {x: number[]; fx: number; iterations: number};
export declare function differentialEvolution(
  fn: (xs: number[]) => number,
  opts: DifferentialEvolutionOptions,
): {x: number[]; fx: number; iterations: number};
export declare function adaptiveGridSearch(
  fn: (x: number) => number,
  opts: AGSOptions,
): {x: number; fx: number; iterations: number};

export declare function safeOptimizer(
  name: string,
): (
  fn: (x: number) => number,
  opts: BrentOptions | NelderMeadOptions,
) => {x: number | number[]; fx: number};

export declare function getOptimizerFactory(name: string): unknown;
export declare function registerOptimizerFactory(
  name: string,
  factory: (opts: Record<string, unknown>) => unknown,
): void;
