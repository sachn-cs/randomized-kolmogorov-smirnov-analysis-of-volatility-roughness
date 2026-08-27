'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {fmt} from '@/lib/format';
import {
  ReliabilityBadge,
  deriveReliability,
} from '@/components/observatory/reliability-badge';

export function DiagnosticsTable({
  diag,
}: {
  diag: {
    minimizedD?: number;
    significance?: {pValue?: number; significant?: boolean};
    se?: number;
    ci?: {lower?: number; upper?: number};
  } | null;
}) {
  const placeholder = '—';
  const reliability =
    diag?.significance?.significant !== undefined &&
    diag?.minimizedD !== undefined
      ? deriveReliability({
          significant: diag.significance.significant,
          bias: diag.minimizedD,
        })
      : null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-44 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Metric
          </TableHead>
          <TableHead className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Value
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            KS Distance D
          </TableCell>
          <TableCell className="font-mono text-primary">
            {diag?.minimizedD !== undefined
              ? fmt(diag.minimizedD, 4)
              : placeholder}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            p-Value
          </TableCell>
          <TableCell className="font-mono">
            {diag?.significance?.pValue !== undefined
              ? fmt(diag.significance.pValue, 4)
              : placeholder}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            Significant?
          </TableCell>
          <TableCell className="font-mono">
            {diag?.significance?.significant === true
              ? 'Yes'
              : diag?.significance?.significant === false
                ? 'No'
                : placeholder}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            Standard Error
          </TableCell>
          <TableCell className="font-mono">
            {diag?.se !== undefined ? fmt(diag.se, 4) : placeholder}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            95% CI
          </TableCell>
          <TableCell className="font-mono">
            {diag?.ci?.lower !== undefined && diag?.ci?.upper !== undefined
              ? `[${fmt(diag.ci.lower, 3)}, ${fmt(diag.ci.upper, 3)}]`
              : placeholder}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            Reliability
          </TableCell>
          <TableCell>
            {reliability ? (
              <ReliabilityBadge reliability={reliability} />
            ) : (
              placeholder
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
