/**
 * Type declarations for `lib/models/index.js`.
 */

export interface RBergomiOptions {
  nPaths?: number;
  nSteps: number;
  h: number;
  eta?: number;
  rho?: number;
  xi?: number;
}

export interface RBergomiResult {
  paths: number[][];
  prices: number[][];
  times: number[];
}

export interface RFSVOptions {
  nSteps: number;
  h: number;
  theta?: number;
  mu?: number;
  nu?: number;
}

export interface RFSVResult {
  volPath: number[];
  prices: number[];
  times: number[];
}

export interface FOUOptions {
  nSteps: number;
  h: number;
  theta?: number;
  mu?: number;
  sigma?: number;
}

export interface FOUResult {
  path: number[];
}

export interface MPREOptions {
  nSteps: number;
  hMin?: number;
  hMax?: number;
  h0?: number;
}

export interface MPREResult {
  path: number[];
  hPath: number[];
}

export declare function rBergomi(opts: RBergomiOptions): RBergomiResult;
export declare function rBergomiPrice(opts: RBergomiOptions): {
  prices: number[][];
  times: number[];
};
export declare function rFSV(opts: RFSVOptions): RFSVResult;
export declare function rFSVPrice(opts: RFSVOptions): {
  prices: number[];
  times: number[];
};
export declare function fOU(opts: FOUOptions): FOUResult;
export declare function exactOU(opts: {
  nSteps: number;
  theta: number;
  mu: number;
  sigma: number;
}): FOUResult;
export declare function mPRE(opts: MPREOptions): MPREResult;
export declare function mPREExact(opts: MPREOptions): MPREResult;

export interface ArfimaOptions {
  p: number;
  d: number;
  q: number;
  window: number;
}

export declare function arfima(
  opts: ArfimaOptions,
): (series: number[]) => number;
export declare function holtWintersForecast(
  series: number[],
  alpha: number,
  beta: number,
): number;

export interface LstmOptions {
  hiddenSize: number;
  learningRate?: number;
}

export declare function createLSTM(opts: LstmOptions): {
  predict: (input: number[]) => number;
  train: (data: number[][], labels: number[]) => void;
};
export declare function createAttentionModel(opts: {dim: number}): {
  predict: (input: number[]) => number;
};

export interface ModelRegistryEntry<T = unknown> {
  factory: (...args: unknown[]) => T;
  meta?: Record<string, unknown>;
}
export declare function getModel(name: string): unknown;
export declare function registerModel(
  name: string,
  factory: (...args: unknown[]) => unknown,
): void;
export declare function listModels(): string[];
