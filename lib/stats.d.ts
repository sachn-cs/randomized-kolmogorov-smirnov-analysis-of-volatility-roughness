/**
 * Type declarations for `lib/stats.js`.
 */

export interface Increments {
  raw: number[];
  sorted: number[];
  scale: number;
}

export declare function ksDistance(s1: number[], s2: number[]): number;
export declare function shuffle<T>(arr: T[]): T[];
export declare function randomSample<T>(arr: T[], n: number): T[];
export declare function blockPermutation(
  arr: number[],
  blockSize: number,
): number[];
