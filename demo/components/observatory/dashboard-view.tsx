'use client';

import * as React from 'react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Slider} from '@/components/ui/slider';
import {Badge} from '@/components/ui/badge';
import {Progress} from '@/components/ui/progress';
import {AppShell} from '@/components/observatory/app-shell';
import {MetricCard} from '@/components/observatory/metric-card';
import {DiagnosticsTable} from '@/components/observatory/diagnostics-table';
import {PathChart} from '@/components/observatory/charts/path-chart';
import {HTrajChart} from '@/components/observatory/charts/h-traj-chart';
import {fmt} from '@/lib/format';
import {useWorker} from '@/components/observatory/worker-client';
import type {WorkerRequest} from '@/lib/worker-protocol';

type Diagnostics = Parameters<typeof DiagnosticsTable>[0]['diag'];

const MODELS = [
  {value: 'fBM', label: 'Fractional Brownian Motion'},
  {value: 'rBergomi', label: 'Rough Bergomi'},
  {value: 'rFSV', label: 'Rough FSV'},
  {value: 'fOU', label: 'Fractional OU'},
  {value: 'mPRE', label: 'MPRE'},
];

const OPTIMIZERS = [
  {value: 'brent', label: 'Brent'},
  {value: 'nelder-mead', label: 'Nelder-Mead'},
  {value: 'annealing', label: 'Simulated Annealing'},
  {value: 'de', label: 'Differential Evolution'},
  {value: 'ags', label: 'Adaptive Grid Search'},
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Real-Time Estimation"
          description="Live Hurst-parameter estimation with animated trajectory and diagnostic readouts."
        />
        <DashboardView />
      </div>
    </AppShell>
  );
}

export const metadata = {
  title: 'Dashboard',
  description:
    'Real-time Hurst parameter estimation with animated trajectory and diagnostic readouts.',
};

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="max-w-2xl">
      <h2 className="font-serif text-3xl leading-tight">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </header>
  );
}

function DashboardView() {
  const worker = useWorker();

  const [model, setModel] = React.useState<
    'fBM' | 'rBergomi' | 'rFSV' | 'fOU' | 'mPRE'
  >('fBM');
  const [trueH, setTrueH] = React.useState(0.1);
  const [nSteps, setNSteps] = React.useState(2000);
  const [windowSize, setWindowSize] = React.useState(500);
  const [sampleSize, setSampleSize] = React.useState(500);
  const [iterations, setIterations] = React.useState(16);
  const [optimizer, setOptimizer] = React.useState<
    'brent' | 'nelder-mead' | 'annealing' | 'de' | 'ags'
  >('brent');
  const [path, setPath] = React.useState<number[]>([]);
  const [rolling, setRolling] = React.useState<Array<{t: number; H: number}>>(
    [],
  );
  const [diag, setDiag] = React.useState<Diagnostics>(null);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState<
    'idle' | 'generating' | 'estimating' | 'complete' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = React.useState('');

  const runGenerate = React.useCallback(async () => {
    setStatus('generating');
    setErrorMsg('');
    try {
      const res = await worker.dispatch<{path: number[]}>({
        cmd: 'generate',
        payload: {
          model,
          nSteps,
          h: trueH,
          seed: Math.floor(Math.random() * 1e9),
        },
      });
      setPath(res.path);
      setRolling([]);
      setDiag(null);
      setStatus('complete');
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      toast.error(`Path generation failed: ${msg}`);
    }
  }, [worker, model, nSteps, trueH]);

  const runEstimation = React.useCallback(async () => {
    if (path.length === 0) return;
    setStatus('estimating');
    setProgress(0);
    setErrorMsg('');
    const step = Math.max(1, Math.floor(windowSize / 8));
    try {
      const config = {
        scaleA1: 1,
        scaleA2: 25,
        sampleSize,
        iterations,
        optimizerType: optimizer,
      };
      const {results} = await worker.dispatch<{
        results: Array<{t: number; H: number}>;
      }>(
        {
          cmd: 'rolling',
          payload: {path, windowSize, step, config},
        },
        setProgress,
      );
      setRolling(results);
      setStatus('complete');

      const valid = results.filter((r) => Number.isFinite(r.H));
      if (valid.length > 0) {
        const last = valid[valid.length - 1];
        const slice = path.slice(last.t, last.t + windowSize);
        if (slice.length === windowSize) {
          const d = await worker.dispatch<
            Parameters<typeof DiagnosticsTable>[0]['diag']
          >({cmd: 'single', payload: {path: slice, config}});
          setDiag(d);
        }
      }
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      toast.error(`Estimation failed: ${msg}`);
    } finally {
      setProgress(1);
    }
  }, [worker, path, windowSize, sampleSize, iterations, optimizer]);

  React.useEffect(() => {
    runGenerate();
  }, []);

  const metrics = React.useMemo(() => {
    const valid = rolling.filter((r) => Number.isFinite(r.H));
    if (valid.length === 0)
      return {avg: null, bias: null, rmse: null, std: null};
    const avg = valid.reduce((a, b) => a + b.H, 0) / valid.length;
    return {
      avg,
      bias: avg - trueH,
      rmse: Math.sqrt(
        valid.reduce((a, b) => a + (b.H - trueH) ** 2, 0) / valid.length,
      ),
      std: Math.sqrt(
        valid.reduce((a, b) => a + (b.H - avg) ** 2, 0) / valid.length,
      ),
    };
  }, [rolling, trueH]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
          <CardDescription>
            Generate a synthetic path, then run a sliding-window Hurst estimate.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={model}
              onValueChange={(v: string) => setModel(v as typeof model)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="true-h-slider">True H — {trueH.toFixed(2)}</Label>
            <Slider
              id="true-h-slider"
              aria-label="True Hurst parameter"
              min={0.01}
              max={0.49}
              step={0.01}
              value={[trueH]}
              onValueChange={(v) => setTrueH(v[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Path Length</Label>
            <Input
              type="number"
              min={500}
              max={10000}
              step={100}
              value={nSteps}
              onChange={(e) => setNSteps(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label>Window Size</Label>
            <Input
              type="number"
              min={100}
              max={5000}
              step={50}
              value={windowSize}
              onChange={(e) => setWindowSize(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label>Sample Size</Label>
            <Input
              type="number"
              min={50}
              max={2000}
              step={50}
              value={sampleSize}
              onChange={(e) => setSampleSize(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label>Iterations</Label>
            <Input
              type="number"
              min={1}
              max={64}
              step={1}
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label>Optimizer</Label>
            <Select
              value={optimizer}
              onValueChange={(v: string) => setOptimizer(v as typeof optimizer)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPTIMIZERS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={runGenerate}>Generate Path</Button>
        <Button
          variant="secondary"
          onClick={runEstimation}
          disabled={!path.length}
        >
          Run Estimation
        </Button>
        <Badge
          variant={
            status === 'error'
              ? 'destructive'
              : status === 'complete'
                ? 'default'
                : 'secondary'
          }
        >
          {status === 'error' ? errorMsg : status}
        </Badge>
      </div>

      {progress > 0 && progress < 1 ? (
        <Progress value={progress * 100} />
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Synthetic Path</CardTitle>
          </CardHeader>
          <CardContent>
            <PathChart path={path} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>H Trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            <HTrajChart rolling={rolling} trueH={trueH} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Mean Ĥ" value={fmt(metrics.avg)} />
        <MetricCard label="Bias" value={fmt(metrics.bias)} tone="secondary" />
        <MetricCard label="RMSE" value={fmt(metrics.rmse)} tone="destructive" />
        <MetricCard label="Std Dev" value={fmt(metrics.std)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last Window Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <DiagnosticsTable diag={diag} />
        </CardContent>
      </Card>
    </div>
  );
}
