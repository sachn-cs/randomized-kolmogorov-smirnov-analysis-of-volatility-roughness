/**
 * Type declarations for `lib/inference.js`.
 */

export interface SignificanceTest {
  statistic: number;
  pValue: number;
  significant: boolean;
  criticalValue: number;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  level: number;
}

export interface KalmanState {
  mean: number;
  variance: number;
}

export interface KalmanResult {
  states: KalmanState[];
  filtered: number[];
  smoothed?: number[];
}

export interface CUSUMResult {
  statistic: number;
  breakpoints: number[];
  significant: boolean;
}

export interface ConstancyResult {
  statistic: number;
  pValue: number;
  constant: boolean;
}

export declare function asymptoticVariance(
  a1: number,
  a2: number,
  n: number,
  m: number,
): number;
export declare function standardError(
  a1: number,
  a2: number,
  n: number,
  m: number,
): number;
export declare function confidenceInterval(
  h: number,
  se: number,
  alpha?: number,
): ConfidenceInterval;
export declare function kalmanFilter(
  series: number[],
  options: {q: number; r: number},
): KalmanResult;
export declare function ksCriticalValue(alpha: number, n: number): number;
export declare function ksPvalue(d: number, n: number): number;
export declare function significanceTest(
  d: number,
  n: number,
  m: number,
  alpha?: number,
): SignificanceTest;
export declare function cusumTest(
  series: number[],
  options?: {threshold?: number},
): CUSUMResult;
export declare function detectBreakpoints(series: number[]): number[];
export declare function constancyTest(series: number[]): ConstancyResult;
export declare function bootstrapCI(
  estimator: (data: number[]) => number,
  data: number[],
  B: number,
  alpha?: number,
): ConfidenceInterval;
