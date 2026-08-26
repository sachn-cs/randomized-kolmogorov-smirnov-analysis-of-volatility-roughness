'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function HTrajChart({
  rolling,
  trueH,
}: {
  rolling: Array<{ t: number; H: number }>;
  trueH: number;
}) {
  const data = rolling.map((r) => ({ t: r.t, H: r.H }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, left: 8, right: 0, bottom: 4 }}>
        <CartesianGrid stroke="hsl(220 22% 28% / 0.4)" strokeDasharray="2 4" />
        <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'hsl(220 18% 70%)' }} />
        <YAxis
          domain={[0, 0.6]}
          tick={{ fontSize: 10, fill: 'hsl(220 18% 70%)' }}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(220 40% 9%)',
            border: '1px solid hsl(220 22% 28%)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 12,
          }}
          formatter={(v: number) => v.toFixed(4)}
        />
        <ReferenceLine
          y={trueH}
          stroke="hsl(220 18% 70%)"
          strokeDasharray="4 4"
          label={{
            value: `True H = ${trueH.toFixed(2)}`,
            position: 'insideTopRight',
            fill: 'hsl(220 18% 70%)',
            fontSize: 10,
          }}
        />
        <Line
          type="monotone"
          dataKey="H"
          stroke="hsl(192 87% 56%)"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
