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
    <ResponsiveContainer width="100%" height={420}>
      <LineChart margin={{top: 8, left: 8, right: 8, bottom: 8}}>
        <CartesianGrid stroke="hsl(220 22% 28% / 0.4)" strokeDasharray="2 4" />
        <XAxis
          dataKey="w"
          type="number"
          domain={['auto', 'auto']}
          tick={{fontSize: 11, fill: 'hsl(220 18% 70%)'}}
          label={{
            value: 'Window Size',
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
            value: 'RMSE / |Bias|',
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
  );
}
