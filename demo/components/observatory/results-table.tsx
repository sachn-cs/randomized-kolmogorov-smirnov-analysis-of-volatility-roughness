'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fmt } from '@/lib/format';

type Result = {
  trueH: number;
  windowSize: number;
  optimizer: string;
  rmse: number;
  bias: number;
  failRate: number;
  avgTime: number;
};

export function ResultsTable({ results }: { results: Result[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>True H</TableHead>
          <TableHead>Window</TableHead>
          <TableHead>Optimizer</TableHead>
          <TableHead>RMSE</TableHead>
          <TableHead>Bias</TableHead>
          <TableHead>Fail Rate</TableHead>
          <TableHead>Avg Time (ms)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((r, i) => (
          <TableRow key={i}>
            <TableCell className="font-mono">{fmt(r.trueH)}</TableCell>
            <TableCell className="font-mono">{r.windowSize}</TableCell>
            <TableCell className="font-mono">{r.optimizer}</TableCell>
            <TableCell className="font-mono text-primary">
              {fmt(r.rmse, 4)}
            </TableCell>
            <TableCell className="font-mono text-secondary">
              {fmt(r.bias, 4)}
            </TableCell>
            <TableCell className="font-mono text-muted-foreground">
              {fmt(r.failRate, 2)}
            </TableCell>
            <TableCell className="font-mono">
              {Math.round(r.avgTime)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
