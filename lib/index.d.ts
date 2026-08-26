/**
 * Type re-exports for hurstify (formerly rksavr).
 * Hand-written: tracks the public API in `lib/index.js` exactly.
 */

export {Hurstify} from './hurstify.js';
export {ksDistance, shuffle, randomSample, blockPermutation} from './stats.js';
export type {Increments} from './stats.js';
export {
  generateFGN,
  generateFBM,
  randn,
  randnBatch,
  correlatedGaussian,
  fractionalKernel,
  fractionalIntegral,
} from './random.js';
export {setSeed, resetSeed, random} from './prng.js';
export {
  LogLevel,
  setLogLevel,
  getLogLevel,
  debug,
  info,
  warn,
  error,
} from './logger.js';
export {
  asymptoticVariance,
  standardError,
  confidenceInterval,
  kalmanFilter,
  ksCriticalValue,
  ksPvalue,
  significanceTest,
  cusumTest,
  detectBreakpoints,
  constancyTest,
  bootstrapCI,
} from './inference.js';
export {
  rBergomi,
  rBergomiPrice,
  rFSV,
  rFSVPrice,
  fOU,
  exactOU,
  mPRE,
  mPREExact,
  arfima,
  holtWintersForecast,
  createLSTM,
  createAttentionModel,
  getModel,
  registerModel,
  listModels,
} from './models/index.js';
export {
  parseCSV,
  extractSeries,
  parseJSON,
  validateNoGaps,
  downsample,
  computeRV,
  computeRVParkinson,
  aggregateDailyRV,
  logTransform,
  centerSeries,
  standardizeSeries,
  preprocessPipeline,
  trainTestSplit,
  createWindows,
  generateVIXLogVol,
  generateSPXLogVol,
  generateIntradayPrices,
  seriesToCSV,
} from './data/index.js';
export {
  brentMinimize,
  nelderMead,
  simulatedAnnealing,
  differentialEvolution,
  adaptiveGridSearch,
  safeOptimizer,
  getOptimizer,
  registerOptimizer,
} from './optimization/index.js';
