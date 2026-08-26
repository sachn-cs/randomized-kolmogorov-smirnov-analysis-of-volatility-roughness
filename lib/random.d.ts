/**
 * Type declarations for `lib/random.js` and `lib/prng.js`.
 */

export declare function generateFGN(n: number, h: number): number[];
export declare function generateFBM(n: number, h: number): number[];
export declare function randn(): number;
export declare function randnBatch(n: number): number[];
export declare function correlatedGaussian(n: number, rho: number[]): number[];
export declare function fractionalKernel(h: number, size: number): number[];
export declare function fractionalIntegral(
  series: number[],
  h: number,
): number[];

export declare function setSeed(seed: number): void;
export declare function resetSeed(): void;
export declare function random(): number;
