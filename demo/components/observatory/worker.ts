/// <reference lib="webworker" />
import {
  RKSAVR,
  generateFBM,
  rBergomiPrice,
  rFSVPrice,
  fOU,
  mPRE,
  setSeed,
  resetSeed,
  significanceTest,
  confidenceInterval,
  standardError,
} from '../../../lib/index.js';
import type {WorkerRequest, WorkerMessage} from '@/lib/worker-protocol';

declare const self: DedicatedWorkerGlobalScope;

function generatePath(opts: {
  model: string;
  nSteps: number;
  h: number;
  seed: number;
}): number[] {
  setSeed(opts.seed || 42);
  let path: number[];
  switch (opts.model) {
    case 'rBergomi':
      path = rBergomiPrice({nPaths: 1, nSteps: opts.nSteps, h: opts.h})
        .prices[0];
      break;
    case 'rFSV':
      path = rFSVPrice({nSteps: opts.nSteps, h: opts.h}).prices;
      break;
    case 'fOU':
      path = fOU({nSteps: opts.nSteps, h: opts.h}).path;
      break;
    case 'mPRE':
      path = mPRE({
        nSteps: opts.nSteps,
        hMin: 0.05,
        hMax: 0.95,
        h0: opts.h,
      }).path;
      break;
    default:
      path = generateFBM(opts.nSteps, opts.h);
  }
  resetSeed();
  return path;
}

self.onmessage = (e: MessageEvent<WorkerRequest & {id: number}>) => {
  const {id, cmd, payload} = e.data;
  try {
    switch (cmd) {
      case 'generate': {
        const path = generatePath(payload);
        post({type: 'complete', id, result: {path}});
        return;
      }
      case 'single': {
        const rksavr = new RKSAVR(payload.config);
        const {H, minimizedD} = rksavr.estimateSingleWithDiagnostics(
          payload.path,
        );
        const n =
          ((payload.config as Record<string, unknown>).sampleSize as number) ||
          500;
        const sig = significanceTest(minimizedD, n, n, 0.05);
        const se = standardError(
          ((payload.config as Record<string, unknown>).scaleA1 as number) || 1,
          ((payload.config as Record<string, unknown>).scaleA2 as number) || 25,
          n,
          n,
        );
        const ci = confidenceInterval(H, se, 0.05);
        post({
          type: 'complete',
          id,
          result: {H, minimizedD, significance: sig, se, ci},
        });
        return;
      }
      case 'rolling': {
        const rksavr = new RKSAVR(payload.config);
        const results = rksavr.rolling(
          payload.path,
          payload.windowSize,
          payload.step || 1,
          (progress: number) => post({type: 'progress', id, progress}),
        );
        post({type: 'complete', id, result: {results}});
        return;
      }
      case 'explorer': {
        const {
          trueHs,
          windowSizes,
          optimizers,
          nTrials,
          pathLength,
          configBase,
        } = payload;
        const results: Array<{
          trueH: number;
          windowSize: number;
          optimizer: string;
          rmse: number;
          bias: number;
          failRate: number;
          avgTime: number;
        }> = [];
        let completed = 0;
        const total =
          trueHs.length * windowSizes.length * optimizers.length * nTrials;

        for (const trueH of trueHs) {
          for (const w of windowSizes) {
            for (const opt of optimizers) {
              const errors: number[] = [];
              const times: number[] = [];
              for (let t = 0; t < nTrials; t++) {
                const path = generatePath({
                  model: 'fBM',
                  nSteps: pathLength,
                  h: trueH,
                  seed: t + 1,
                });
                const cfg = {
                  ...configBase,
                  optimizerType: opt,
                  sampleSize: Math.min(500, w),
                };
                const rksavr = new RKSAVR(cfg);
                const t0 = performance.now();
                try {
                  const H = rksavr.estimateSingle(path.slice(0, w));
                  errors.push(H - trueH);
                } catch {
                  errors.push(NaN);
                }
                times.push(performance.now() - t0);
                completed++;
                post({
                  type: 'progress',
                  id,
                  progress: completed / total,
                });
              }
              const valid = errors.filter((e) => Number.isFinite(e));
              results.push({
                trueH,
                windowSize: w,
                optimizer: opt,
                rmse: valid.length
                  ? Math.sqrt(
                      valid.reduce((a, b) => a + b * b, 0) / valid.length,
                    )
                  : NaN,
                bias: valid.length
                  ? valid.reduce((a, b) => a + b, 0) / valid.length
                  : NaN,
                failRate: (nTrials - valid.length) / nTrials,
                avgTime: times.reduce((a, b) => a + b, 0) / times.length,
              });
            }
          }
        }
        post({type: 'complete', id, result: {results}});
        return;
      }
      default:
        post({type: 'error', id, message: `Unknown command: ${cmd}`});
    }
  } catch (err) {
    post({
      type: 'error',
      id,
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

function post(msg: WorkerMessage) {
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(msg);
}
