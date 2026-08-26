'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

export function RMSEByHChart({
  results,
}: {
  results: Array<{ trueH: number; windowSize: number; rmse: number }>;
}) {
  const byWin = new Map<number, Array<{ trueH: number; rmse: number }>>();
  for (const r of results) {
    if (!Number.isFinite(r.rmse)) continue;
    const arr = byWin.get(r.windowSize) ?? [];
    arr.push({ trueH: r.trueH, rmse: r.rmse });
    byWin.set(r.windowSize, arr);
  }
  const windows = Array.from(byWin.keys()).sort((a, b) => a - b);
  const traces = windows.map((w, i) => ({
    windowSize: w,
    color: COLORS[i % COLORS.length],
    data: (byWin.get(w) ?? []).sort((a, b) => a.trueH - b.trueH),
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart margin={{ top: 8, left: 8, right: 0, bottom: 8 }}>
        <CartesianGrid stroke="hsl(220 22% 28% / 0.4)" strokeDasharray="2 4" />
        <XAxis
          dataKey="trueH"
          type="number"
          domain={['auto', 'auto']}
          tick={{ fontSize: 10, fill: 'hsl(220 18% 70%)' }}
          label={{
            value: 'True H',
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
          tick={{ fontSize: 10, fill: 'hsl(220 18% 70%)' }}
          width={48}
          label={{
            value: 'RMSE',
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
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {traces.map((t) => (
          <Line
            key={t.windowSize}
            data={t.data}
            type="monotone"
            dataKey="rmse"
            name={`W=${t.windowSize}`}
            stroke={t.color}
            strokeWidth={2}
            dot={{ r: 4, fill: t.color }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
