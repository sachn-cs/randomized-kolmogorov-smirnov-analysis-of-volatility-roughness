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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RKSAVR, generateFBM, setSeed, resetSeed } from '@/lib/rksavr';
import { fmt } from '@/lib/format';
import { HTrajChart } from '@/components/observatory/charts/h-traj-chart';
import { HeatmapGrid } from '@/components/observatory/charts/heatmap-grid';
import { BiasVarianceChart } from '@/components/observatory/charts/bias-variance-chart';
import { FigureExportButton } from '@/components/observatory/charts/figure-export-button';

export default function FiguresPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="max-w-2xl">
          <h2 className="font-serif text-3xl">Paper Figures</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Replicated figures from Angelini &amp; Bianchi with configurable
            parameters and export.
          </p>
        </header>
        <FiguresView />
      </div>
    </AppShell>
  );
}

function FiguresView() {
  const [tab, setTab] = React.useState('fig-ks-curve');
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="fig-ks-curve">Fig 1: KS Curve</TabsTrigger>
        <TabsTrigger value="fig-multi-scale">Fig 2: Multi-Scale</TabsTrigger>
        <TabsTrigger value="fig-rolling">Fig 3: Rolling</TabsTrigger>
        <TabsTrigger value="fig-bias-variance">Fig 4: Bias/Variance</TabsTrigger>
      </TabsList>

      <TabsContent value="fig-ks-curve">
        <Figure1 />
      </TabsContent>
      <TabsContent value="fig-multi-scale">
        <Figure2 />
      </TabsContent>
      <TabsContent value="fig-rolling">
        <Figure3 />
      </TabsContent>
      <TabsContent value="fig-bias-variance">
        <Figure4 />
      </TabsContent>
    </Tabs>
  );
}

function CommonFigureInputs({
  trueH,
  setTrueH,
  n,
  setN,
  windowSize,
  setWindowSize,
}: {
  trueH: number;
  setTrueH: (v: number) => void;
  n: number;
  setN: (v: number) => void;
  windowSize: number;
  setWindowSize: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label>True H</Label>
        <Input
          type="number"
          min={0.01}
          max={0.99}
          step={0.01}
          value={trueH}
          onChange={(e) => setTrueH(parseFloat(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label>Path Length</Label>
        <Input
          type="number"
          min={500}
          max={10000}
          step={100}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
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
    </div>
  );
}

function Figure1() {
  const [trueH, setTrueH] = React.useState(0.1);
  const [n, setN] = React.useState(2000);
  const [windowSize, setWindowSize] = React.useState(500);
  const [res, setRes] = React.useState(0.005);
  const [a1, setA1] = React.useState(1);
  const [a2, setA2] = React.useState(25);
  const [chartData, setChartData] = React.useState<{
    hs: number[];
    ds: number[];
    minH: number;
  } | null>(null);

  const render = React.useCallback(() => {
    setSeed(42);
    const path = generateFBM(n, trueH);
    resetSeed();
    const slice = path.slice(0, windowSize);
    const inc1 = RKSAVR.getIncrements(slice, a1);
    const inc2 = RKSAVR.getIncrements(slice, a2);
    const s1 = inc1.slice().sort((a, b) => a - b);
    const s2 = inc2.slice().sort((a, b) => a - b);
    const hs: number[] = [];
    const ds: number[] = [];
    for (let h = 0.01; h <= 0.99; h += res) {
      const f1 = Math.pow(a1, -h);
      const f2 = Math.pow(a2, -h);
      ds.push(ksRescaled(s1, s2, f1, f2));
      hs.push(h);
    }
    const minIdx = ds.indexOf(Math.min(...ds));
    setChartData({ hs, ds, minH: hs[minIdx] });
  }, [n, trueH, windowSize, a1, a2, res]);

  React.useEffect(render, [render]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Figure 1 — KS Distance vs H</CardTitle>
        <CardDescription>KS objective D(H) over candidate H.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <CommonFigureInputs {...{ trueH, setTrueH, n, setN, windowSize, setWindowSize }} />
          <div className="space-y-2">
            <Label>H Resolution</Label>
            <Input
              type="number"
              min={0.001}
              max={0.05}
              step={0.001}
              value={res}
              onChange={(e) => setRes(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Scale A1</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={a1}
              onChange={(e) => setA1(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="space-y-2">
            <Label>Scale A2</Label>
            <Input
              type="number"
              min={2}
              max={100}
              value={a2}
              onChange={(e) => setA2(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={render}>Re-render</Button>
          <FigureExportButton targetId="fig1-chart" filename="fig-ks-curve" />
        </div>
        <div id="fig1-chart" className="text-sm text-muted-foreground">
          {chartData && `Ĥ ≈ ${fmt(chartData.minH)}`}
        </div>
      </CardContent>
    </Card>
  );
}

function Figure2() {
  const [trueH, setTrueH] = React.useState(0.1);
  const [n, setN] = React.useState(2000);
  const [windowSize, setWindowSize] = React.useState(500);
  const [scalesText, setScalesText] = React.useState('1, 2, 5, 10, 20, 50');
  const [grid, setGrid] = React.useState<{
    scales: number[];
    cells: Array<{ i: number; j: number; value: number | null }>;
  } | null>(null);

  const render = React.useCallback(() => {
    const scales = scalesText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((s) => !isNaN(s));
    setSeed(42);
    const path = generateFBM(n, trueH);
    resetSeed();
    const slice = path.slice(0, windowSize);
    const rksavr = new RKSAVR({ scales, sampleSize: Math.min(300, windowSize) });
    const raw = rksavr._estimateSingleRaw(slice, { scales });
    const cells: Array<{ i: number; j: number; value: number | null }> = [];
    for (let i = 0; i < scales.length; i++) {
      for (let j = 0; j < scales.length; j++) {
        let v: number | null = null;
        if (i === j) v = 0;
        else if (j < i) {
          const fi = Math.pow(raw.scaleValues[i], -raw.H);
          const fj = Math.pow(raw.scaleValues[j], -raw.H);
          v = ksRescaled(
            raw.sortedSamples[i],
            raw.sortedSamples[j],
            fi,
            fj,
          );
        } else {
          v = null;
        }
        cells.push({ i, j, value: v });
      }
    }
    setGrid({ scales, cells });
  }, [n, trueH, windowSize, scalesText]);

  React.useEffect(render, [render]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Figure 2 — Multi-Scale Profile</CardTitle>
        <CardDescription>
          Pairwise KS distances across scales (lower = more similar).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <CommonFigureInputs {...{ trueH, setTrueH, n, setN, windowSize, setWindowSize }} />
          <div className="space-y-2">
            <Label>Scales (comma)</Label>
            <Input value={scalesText} onChange={(e) => setScalesText(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={render}>Re-render</Button>
          <FigureExportButton targetId="fig2-chart" filename="fig-multi-scale" />
        </div>
        <div id="fig2-chart">
          {grid ? <HeatmapGrid scales={grid.scales} cells={grid.cells} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Figure3() {
  const [trueH, setTrueH] = React.useState(0.1);
  const [n, setN] = React.useState(2000);
  const [windowSize, setWindowSize] = React.useState(500);
  const [step, setStep] = React.useState(25);
  const [iterations, setIterations] = React.useState(8);
  const [rolling, setRolling] = React.useState<Array<{ t: number; H: number }>>([]);

  const render = React.useCallback(() => {
    setSeed(42);
    const path = generateFBM(n, trueH);
    resetSeed();
    const rksavr = new RKSAVR({
      scaleA1: 1,
      scaleA2: 25,
      sampleSize: 500,
      iterations,
    });
    const results = rksavr.rolling(path, windowSize, step);
    setRolling(results.filter((r) => Number.isFinite(r.H)));
  }, [n, trueH, windowSize, step, iterations]);

  React.useEffect(render, [render]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Figure 3 — Rolling Estimation</CardTitle>
        <CardDescription>
          Sliding-window estimates on a rough-volatility path.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <CommonFigureInputs {...{ trueH, setTrueH, n, setN, windowSize, setWindowSize }} />
          <div className="space-y-2">
            <Label>Step</Label>
            <Input
              type="number"
              min={1}
              max={500}
              value={step}
              onChange={(e) => setStep(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="space-y-2">
            <Label>Iterations</Label>
            <Input
              type="number"
              min={1}
              max={64}
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={render}>Re-render</Button>
          <FigureExportButton targetId="fig3-chart" filename="fig-rolling" />
        </div>
        <div id="fig3-chart">
          <HTrajChart rolling={rolling} trueH={trueH} />
        </div>
      </CardContent>
    </Card>
  );
}

function Figure4() {
  const [hsText, setHsText] = React.useState('0.05, 0.1, 0.2, 0.3');
  const [wsText, setWsText] = React.useState('200, 400, 600, 800, 1000');
  const [trials, setTrials] = React.useState(10);
  const [series, setSeries] = React.useState<
    Array<{ trueH: number; rmseByW: number[]; biasByW: number[] }>
  >([]);
  const [windows, setWindows] = React.useState<number[]>([]);

  const render = React.useCallback(() => {
    const hs = hsText
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((v) => !isNaN(v));
    const ws = wsText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((v) => !isNaN(v));
    setWindows(ws);
    const out: Array<{ trueH: number; rmseByW: number[]; biasByW: number[] }> = [];
    for (const h of hs) {
      const rmseByW: number[] = [];
      const biasByW: number[] = [];
      for (const w of ws) {
        const errors: number[] = [];
        for (let t = 0; t < trials; t++) {
          setSeed(t + 1);
          const path = generateFBM(Math.min(2000, w), h);
          resetSeed();
          const rksavr = new RKSAVR({ sampleSize: Math.min(300, w) });
          try {
            const H = rksavr.estimateSingle(path.slice(0, w));
            errors.push(H - h);
          } catch {
            errors.push(NaN);
          }
        }
        const valid = errors.filter((e) => Number.isFinite(e));
        rmseByW.push(
          valid.length
            ? Math.sqrt(valid.reduce((a, b) => a + b * b, 0) / valid.length)
            : NaN,
        );
        biasByW.push(
          valid.length
            ? Math.abs(valid.reduce((a, b) => a + b, 0) / valid.length)
            : NaN,
        );
      }
      out.push({ trueH: h, rmseByW, biasByW });
    }
    setSeries(out);
  }, [hsText, wsText, trials]);

  React.useEffect(render, [render]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Figure 4 — Bias–Variance Tradeoff</CardTitle>
        <CardDescription>
          RMSE (solid) and |Bias| (dashed) per window, per true H.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>H Values (comma)</Label>
            <Input value={hsText} onChange={(e) => setHsText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Window Sizes (comma)</Label>
            <Input value={wsText} onChange={(e) => setWsText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Trials per Config</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={trials}
              onChange={(e) => setTrials(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={render}>Re-render</Button>
          <FigureExportButton targetId="fig4-chart" filename="fig-bias-variance" />
        </div>
        <div id="fig4-chart">
          <BiasVarianceChart windows={windows} series={series} />
        </div>
      </CardContent>
    </Card>
  );
}

function ksRescaled(s1: number[], s2: number[], f1: number, f2: number): number {
  let i = 0;
  let j = 0;
  let d = 0;
  let cdf1 = 0;
  let cdf2 = 0;
  const n1 = s1.length;
  const n2 = s2.length;
  while (i < n1 && j < n2) {
    const v1 = s1[i] * f1;
    const v2 = s2[j] * f2;
    if (v1 <= v2) {
      cdf1 += 1 / n1;
      i++;
    } else {
      cdf2 += 1 / n2;
      j++;
    }
    d = Math.max(d, Math.abs(cdf1 - cdf2));
  }
  return d;
}
