'use client';

import * as React from 'react';
import { AppShell } from '@/components/observatory/app-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useWorker } from '@/components/observatory/worker-client';
import { ResultsTable } from '@/components/observatory/results-table';
import { RMSEByHChart } from '@/components/observatory/charts/rmse-by-h-chart';
import { OptimizerBar } from '@/components/observatory/charts/optimizer-bar';

type Result = Parameters<typeof ResultsTable>[0]['results'][number];

const ALL_OPTIMIZERS = ['brent', 'nelder-mead', 'annealing', 'de', 'ags'];

export default function ExplorerPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="max-w-2xl">
          <h2 className="font-serif text-3xl">Parameter Explorer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Grid search across Hurst values, window sizes, and optimizers with
            comparative visualization.
          </p>
        </header>
        <ExplorerView />
      </div>
    </AppShell>
  );
}

function ExplorerView() {
  const worker = useWorker();
  const [hStart, setHStart] = React.useState(0.05);
  const [hEnd, setHEnd] = React.useState(0.45);
  const [hStep, setHStep] = React.useState(0.05);
  const [winsText, setWinsText] = React.useState('250, 500, 1000');
  const [trials, setTrials] = React.useState(5);
  const [pathLength, setPathLength] = React.useState(1500);
  const [selectedOpts, setSelectedOpts] = React.useState<string[]>(
    [...ALL_OPTIMIZERS],
  );
  const [results, setResults] = React.useState<Result[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState('idle');

  const toggleOpt = (o: string) => {
    setSelectedOpts((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o],
    );
  };

  const runGrid = async () => {
    setStatus('running');
    setProgress(0);
    const trueHs: number[] = [];
    for (let h = hStart; h <= hEnd + 1e-9; h += hStep) {
      trueHs.push(Math.round(h * 100) / 100);
    }
    const windowSizes = winsText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    try {
      const { results } = await worker.dispatch<{ results: Result[] }>(
        {
          cmd: 'explorer',
          payload: {
            trueHs,
            windowSizes,
            optimizers: selectedOpts,
            nTrials: trials,
            pathLength,
            configBase: {
              scaleA1: 1,
              scaleA2: 25,
              sampleSize: 500,
              iterations: 8,
            },
          },
        },
        setProgress,
      );
      setResults(results);
      setStatus('complete');
    } catch {
      setStatus('error');
    } finally {
      setProgress(1);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Search Space</CardTitle>
          <CardDescription>
            Sweep Hurst values, window sizes, and optimizers.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>H Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0.01}
                max={0.99}
                step={0.01}
                value={hStart}
                onChange={(e) => setHStart(parseFloat(e.target.value))}
              />
              <Input
                type="number"
                min={0.01}
                max={0.99}
                step={0.01}
                value={hEnd}
                onChange={(e) => setHEnd(parseFloat(e.target.value))}
              />
              <Input
                type="number"
                min={0.01}
                max={0.5}
                step={0.01}
                value={hStep}
                onChange={(e) => setHStep(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Window Sizes (comma-separated)</Label>
            <Input value={winsText} onChange={(e) => setWinsText(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Trials / Config</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={trials}
              onChange={(e) => setTrials(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label>Path Length</Label>
            <Input
              type="number"
              min={500}
              max={5000}
              step={100}
              value={pathLength}
              onChange={(e) => setPathLength(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label>Optimizers</Label>
            <div className="flex flex-wrap gap-4">
              {ALL_OPTIMIZERS.map((o) => (
                <label
                  key={o}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Checkbox
                    checked={selectedOpts.includes(o)}
                    onCheckedChange={() => toggleOpt(o)}
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={runGrid} disabled={status === 'running'}>
          {status === 'running' ? 'Running...' : 'Run Grid Search'}
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
          {status}
        </Badge>
      </div>

      {progress > 0 && progress < 1 ? <Progress value={progress * 100} /> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>RMSE per H</CardTitle>
            <CardDescription>H × Window Size</CardDescription>
          </CardHeader>
          <CardContent>
            <RMSEByHChart results={results} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Optimizer Comparison</CardTitle>
            <CardDescription>Mean RMSE per Optimizer</CardDescription>
          </CardHeader>
          <CardContent>
            <OptimizerBar results={results} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ResultsTable results={results} />
        </CardContent>
      </Card>
    </div>
  );
}
