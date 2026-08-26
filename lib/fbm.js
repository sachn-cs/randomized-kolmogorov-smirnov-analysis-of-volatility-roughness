/**
 * @fileoverview Fractional Brownian motion re-exports.
 *
 * Backward-compatible shim that re-exports the fBM/fGN helpers from the
 * canonical implementation in `random.js`.
 *
 * @see ./random.js for the full documentation and the Hosking-method
 *   implementation.
 */

export {generateFGN, generateFBM} from './stochastic-generators.js';
