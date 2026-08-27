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
  'var(--color-chart-series-1)',
  'var(--color-chart-series-2)',
  'var(--color-chart-series-3)',
  'var(--color-chart-series-4)',
  'var(--color-chart-series-5)',
];

type Series = {
  trueH: number;
  rmseByW: number[];
  biasByW: number[];
};

export function BiasVarianceChart({
  windows,
  series,
}: {
  windows: number[];
  series: Series[];
}) {
  return (
    <div
      role="img"
      aria-label={`Bias-variance tradeoff across ${windows.length} windows`}
      className="h-[420px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart margin={{top: 8, left: 8, right: 8, bottom: 8}}>
          <CartesianGrid
            stroke="var(--color-chart-grid)"
            strokeDasharray="2 4"
          />
          <XAxis
            dataKey="w"
            type="number"
            domain={['auto', 'auto']}
            tick={{fontSize: 11, fill: 'var(--color-chart-axis)'}}
            label={{
              value: 'Window Size',
              position: 'insideBottom',
              offset: -2,
              fill: 'var(--color-chart-axis)',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            scale="log"
            domain={['auto', 'auto']}
            tick={{fontSize: 11, fill: 'var(--color-chart-axis)'}}
            width={48}
            label={{
              value: 'RMSE / |Bias|',
              angle: -90,
              position: 'insideLeft',
              fill: 'var(--color-chart-axis)',
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-chart-tooltip-bg)',
              border: '1px solid var(--color-chart-tooltip-border)',
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 11,
            }}
          />
          <Legend wrapperStyle={{fontSize: 10}} />
          {series.flatMap((s, i) => {
            const c = COLORS[i % COLORS.length];
            return [
              <Line
                key={`rmse-${i}`}
                name={`RMSE H=${s.trueH}`}
                data={windows.map((w, idx) => ({w, v: s.rmseByW[idx]}))}
                dataKey="v"
                type="monotone"
                stroke={c}
                strokeWidth={2}
                dot={{r: 5, fill: c}}
                isAnimationActive={false}
              />,
              <Line
                key={`bias-${i}`}
                name={`|Bias| H=${s.trueH}`}
                data={windows.map((w, idx) => ({w, v: s.biasByW[idx]}))}
                dataKey="v"
                type="monotone"
                stroke={c}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{r: 5, fill: c}}
                isAnimationActive={false}
              />,
            ];
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
