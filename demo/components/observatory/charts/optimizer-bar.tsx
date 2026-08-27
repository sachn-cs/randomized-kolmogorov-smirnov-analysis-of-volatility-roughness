'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = [
  'hsl(35 87% 56%)',
  'hsl(192 87% 56%)',
  'hsl(346 78% 48%)',
  'hsl(220 18% 60%)',
  'hsl(35 87% 70%)',
];

export function OptimizerBar({
  results,
}: {
  results: Array<{optimizer: string; rmse: number}>;
}) {
  const byOpt = new Map<string, number[]>();
  for (const r of results) {
    if (!Number.isFinite(r.rmse)) continue;
    const arr = byOpt.get(r.optimizer) ?? [];
    arr.push(r.rmse);
    byOpt.set(r.optimizer, arr);
  }
  const data = Array.from(byOpt.entries()).map(([k, v]) => ({
    optimizer: k,
    rmse: v.reduce((a, b) => a + b, 0) / v.length,
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{top: 8, left: 8, right: 0, bottom: 8}}>
        <CartesianGrid stroke="hsl(220 22% 28% / 0.4)" strokeDasharray="2 4" />
        <XAxis
          dataKey="optimizer"
          tick={{fontSize: 11, fill: 'hsl(220 18% 70%)'}}
          label={{
            value: 'Optimizer',
            position: 'insideBottom',
            offset: -2,
            fill: 'hsl(220 18% 70%)',
            fontSize: 11,
          }}
        />
        <YAxis
          type="number"
          scale="log"
          domain={['auto', 'auto']}
          tick={{fontSize: 11, fill: 'hsl(220 18% 70%)'}}
          width={48}
          label={{
            value: 'Mean RMSE',
            angle: -90,
            position: 'insideLeft',
            fill: 'hsl(220 18% 70%)',
            fontSize: 11,
          }}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(220 40% 9%)',
            border: '1px solid hsl(220 22% 28%)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 11,
          }}
        />
        <Bar dataKey="rmse">
          {data.map((_, i) => (
            <Bar
              key={i}
              dataKey="rmse"
              fill={COLORS[i % COLORS.length]}
              isAnimationActive={false}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
