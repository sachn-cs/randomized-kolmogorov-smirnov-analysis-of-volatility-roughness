'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import type {ChartConfig} from '@/components/ui/chart';

const config = {
  path: {label: 'Path', color: 'hsl(35 87% 56%)'},
} satisfies ChartConfig;

export function PathChart({path}: {path: number[]}) {
  const data = path.map((y, i) => ({i, y}));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{top: 4, left: 0, right: 0, bottom: 0}}>
        <defs>
          <linearGradient id="fillPath" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={config.path.color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={config.path.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(220 22% 28% / 0.4)" strokeDasharray="2 4" />
        <XAxis dataKey="i" hide />
        <Tooltip
          contentStyle={{
            background: 'hsl(220 40% 9%)',
            border: '1px solid hsl(220 22% 28%)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="y"
          stroke={config.path.color}
          strokeWidth={1.5}
          fill="url(#fillPath)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
