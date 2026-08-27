/**
 * Rough volatility model strategy tests.
 */

import {describe, it} from 'mocha';
import {expect} from 'chai';
import {
  RoughBergomiModel,
  RoughFsvModel,
  FractionalOuModel,
  MultifractionalPreModel,
  getModel,
  listModels,
  registerModel,
  modelRegistry,
} from '../../lib/models/index.js';

describe('RoughBergomiModel', function () {
  const model = new RoughBergomiModel();

  it('generates volatility paths', function () {
    const result = model.simulate({nPaths: 2, nSteps: 100, h: 0.1});
    expect(result.paths).to.have.lengthOf(2);
    expect(result.times).to.have.lengthOf(101);
    expect(result.paths[0]).to.have.lengthOf(101);
    expect(result.paths[0].every((v) => Number.isFinite(v) && v >= 0)).to.equal(
      true,
    );
  });

  it('generates price paths', function () {
    const sim = model.simulate({nPaths: 1, nSteps: 50, h: 0.1});
    const result = model.price(sim, {nSteps: 50, h: 0.1});
    expect(result.prices).to.have.lengthOf(1);
    expect(result.prices[0]).to.have.lengthOf(51);
    expect(result.prices[0][0]).to.equal(100);
  });
});

describe('RoughFsvModel', function () {
  const model = new RoughFsvModel();

  it('generates volatility path', function () {
    const result = model.simulate({nSteps: 100, h: 0.1});
    expect(result.paths).to.have.lengthOf(1);
    expect(result.paths[0]).to.have.lengthOf(101);
    expect(result.times).to.have.lengthOf(101);
    expect(result.paths[0].every((v) => Number.isFinite(v))).to.equal(true);
  });

  it('generates price path', function () {
    const sim = model.simulate({nSteps: 50, h: 0.1});
    const result = model.price(sim, {nSteps: 50, h: 0.1});
    expect(result.prices).to.have.lengthOf(1);
    expect(result.prices[0]).to.have.lengthOf(51);
    expect(result.prices[0][0]).to.equal(100);
    expect(result.volatilities).to.have.lengthOf(1);
  });
});

describe('FractionalOuModel', function () {
  const model = new FractionalOuModel();

  it('generates OU path at H=0.5', function () {
    const result = model.simulate({nSteps: 100, h: 0.5});
    expect(result.paths[0]).to.have.lengthOf(101);
    expect(result.times).to.have.lengthOf(101);
    expect(result.paths[0].every((v) => Number.isFinite(v))).to.equal(true);
  });

  it('generates exact OU path', function () {
    const result = model.simulate({nSteps: 100, h: 0.3, discretization: 'exact'});
    expect(result.paths[0]).to.have.lengthOf(101);
    expect(result.times).to.have.lengthOf(101);
  });
});

describe('MultifractionalPreModel', function () {
  const model = new MultifractionalPreModel();

  it('generates MPRE path with local-holder discretization', function () {
    const result = model.simulate({nSteps: 100, hMin: 0.05, hMax: 0.95, h0: 0.1});
    expect(result.paths[0]).to.have.lengthOf(101);
    expect(result.times).to.have.lengthOf(101);
  });

  it('generates exact MPRE path', function () {
    const result = model.simulate({
      nSteps: 50,
      hMin: 0.05,
      hMax: 0.95,
      h0: 0.1,
      discretization: 'exact',
    });
    expect(result.paths[0]).to.have.lengthOf(51);
    expect(result.times).to.have.lengthOf(51);
  });
});

describe('Model Registry', function () {
  it('lists built-in models', function () {
    const models = listModels();
    expect(models).to.include('rBergomi');
    expect(models).to.include('rFSV');
    expect(models).to.include('fOU');
    expect(models).to.include('mPRE');
  });

  it('retrieves models', function () {
    const model = getModel('rBergomi');
    expect(model).to.be.instanceOf(RoughBergomiModel);
    expect(model.simulate).to.be.a('function');
    expect(model.price).to.be.a('function');
  });

  it('registers custom models', function () {
    class CustomModel {
      simulate() {
        return {paths: [], times: [], brownians: []};
      }
    }
    registerModel('testModel', () => new CustomModel());
    const retrieved = getModel('testModel');
    expect(retrieved).to.be.instanceOf(CustomModel);
  });

  it('exposes the registry itself', function () {
    expect(modelRegistry.list()).to.include('rBergomi');
  });
});