/**
 * Type declarations for `lib/data/index.js`.
 */

export interface ParseOptions {
  delimiter?: string;
  hasHeader?: boolean;
}

export interface SeriesPoint {
  [key: string]: number | string;
}

export interface DataWindow {
  start: number;
  end: number;
  data: number[];
}

export interface PreprocessOptions {
  logTransform?: boolean;
  center?: boolean;
  standardize?: boolean;
  downsampleFactor?: number;
}

export declare function parseCSV(
  csv: string,
  opts?: ParseOptions,
): SeriesPoint[];
export declare function extractSeries(
  rows: SeriesPoint[],
  field: string,
): number[];
export declare function parseJSON(input: string): unknown;
export declare function validateNoGaps(
  series: number[],
  maxGap?: number,
): boolean;
export declare function downsample(
  series: number[],
  factor: number,
): number[];
export declare function computeRV(returns: number[]): number;
export declare function computeRVParkinson(
  high: number[],
  low: number[],
): number;
export declare function aggregateDailyRV(
  intraday: number[],
  nPerDay: number,
): number[];
export declare function logTransform(series: number[]): number[];
export declare function centerSeries(series: number[]): number[];
export declare function standardizeSeries(series: number[]): number[];
export declare function preprocessPipeline(
  series: number[],
  opts: PreprocessOptions,
): number[];
export declare function trainTestSplit<T>(
  data: T[],
  ratio: number,
): { train: T[]; test: T[] };
export declare function createWindows(
  series: number[],
  size: number,
  step?: number,
): DataWindow[];
export declare function generateVIXLogVol(n: number): number[];
export declare function generateSPXLogVol(n: number): number[];
export declare function generateIntradayPrices(
  n: number,
  h: number,
): number[];
export declare function seriesToCSV(
  series: number[],
  fields?: string[],
): string;
