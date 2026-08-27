/**
 * @fileoverview Public export surface for the rough-volatility model
 * zoo and forecaster hierarchy.
 *
 * v2.0.0 is a hard break from v1.x: the legacy free functions
 * (`rBergomi`, `rFSV`, `fOU`, `exactOU`, `mPRE`, `mPREExact`,
 * `arfima`, `holtWintersForecast`, `createLSTM`, `createAttentionModel`)
 * have been removed. Consumers should use the polymorphic strategy
 * classes directly:
 *
 * - Stochastic processes: instantiate `RoughBergomiModel`,
 *   `RoughFsvModel`, `FractionalOuModel`, or `MultifractionalPreModel`
 *   and call `simulate(opts)` / `price(sim, opts)`.
 * - H forecasting: instantiate `ArfimaForecaster`,
 *   `HoltWintersForecaster`, `LstmForecaster`, or `AttentionForecaster`
 *   and call `predict(history)`.
 */

export {
  RoughBergomiModel,
  RoughFsvModel,
  FractionalOuModel,
  MultifractionalPreModel,
} from '../strategies/model.js';

export {
  ArfimaForecaster,
  HoltWintersForecaster,
  LstmForecaster,
  AttentionForecaster,
} from '../strategies/forecaster.js';

import {Registry} from '../strategies/registry.js';
import {
  RoughBergomiModel,
  RoughFsvModel,
  FractionalOuModel,
  MultifractionalPreModel,
} from '../strategies/model.js';
import {
  ArfimaForecaster,
  HoltWintersForecaster,
  LstmForecaster,
  AttentionForecaster,
} from '../strategies/forecaster.js';

/**
 * Strategy registry for stochastic models. Use this to dispatch by name
 * without instantiating concrete subclasses explicitly.
 *
 * @type {Registry<import('../strategies/model.js').StochasticModel>}
 */
export const modelRegistry = new Registry();
modelRegistry.register('rBergomi', () => new RoughBergomiModel());
modelRegistry.register('rFSV', () => new RoughFsvModel());
modelRegistry.register('fOU', () => new FractionalOuModel());
modelRegistry.register('mPRE', () => new MultifractionalPreModel());

/**
 * Strategy registry for forecasters.
 *
 * @type {Registry<import('../strategies/forecaster.js').Forecaster>}
 */
export const forecasterRegistry = new Registry();
forecasterRegistry.register('arfima', () => new ArfimaForecaster());
forecasterRegistry.register('holtWinters', () => new HoltWintersForecaster());
forecasterRegistry.register('lstm', () => new LstmForecaster());
forecasterRegistry.register('attention', () => new AttentionForecaster());

/**
 * Retrieves a registered model strategy by name.
 *
 * @param {string} name Model identifier.
 * @return {import('../strategies/model.js').StochasticModel|undefined}
 *   The strategy instance, or `undefined` when the name is unknown.
 */
export function getModel(name) {
  return modelRegistry.resolve(name);
}

/**
 * Registers a new model strategy under the supplied name.
 *
 * @param {string} name Unique identifier.
 * @param {() => import('../strategies/model.js').StochasticModel} factory
 *   Factory returning a fresh instance.
 */
export function registerModel(name, factory) {
  modelRegistry.register(name, factory);
}

/**
 * Lists every registered model strategy identifier.
 *
 * @return {Array<string>} Snapshot of registered model keys.
 */
export function listModels() {
  return modelRegistry.list();
}

/**
 * Retrieves a registered forecaster by name.
 *
 * @param {string} name Forecaster identifier.
 * @return {import('../strategies/forecaster.js').Forecaster|undefined}
 *   The strategy instance.
 */
export function getForecaster(name) {
  return forecasterRegistry.resolve(name);
}

/**
 * Registers a new forecaster strategy under the supplied name.
 *
 * @param {string} name Unique identifier.
 * @param {() => import('../strategies/forecaster.js').Forecaster} factory
 *   Factory returning a fresh instance.
 */
export function registerForecaster(name, factory) {
  forecasterRegistry.register(name, factory);
}

/**
 * Lists every registered forecaster identifier.
 *
 * @return {Array<string>} Snapshot of registered forecaster keys.
 */
export function listForecasters() {
  return forecasterRegistry.list();
}
