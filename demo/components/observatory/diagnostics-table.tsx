'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { fmt } from '@/lib/format';

export function DiagnosticsTable({
  diag,
}: {
  diag: {
    minimizedD?: number;
    significance?: { pValue?: number; significant?: boolean };
    se?: number;
    ci?: { lower?: number; upper?: number };
  } | null;
}) {
  const placeholder = '—';
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            KS Distance D
          </TableCell>
          <TableCell className="font-mono text-primary">
            {diag?.minimizedD !== undefined ? fmt(diag.minimizedD, 4) : placeholder}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">p-Value</TableCell>
          <TableCell className="font-mono text-secondary">
            {diag?.significance?.pValue !== undefined
              ? fmt(diag.significance.pValue, 4)
              : placeholder}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono text-muted-foreground">
            Significant?
          </TableCell>
          <TableCell
            className={
              diag?.significance?.significant
                ? 'font-mono text-secondary'
                : 'font-mono text-muted-foreground'
            }
          >
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
          <TableCell className="font-mono text-muted-foreground">95% CI</TableCell>
          <TableCell className="font-mono">
            {diag?.ci?.lower !== undefined && diag?.ci?.upper !== undefined
              ? `[${fmt(diag.ci.lower, 3)}, ${fmt(diag.ci.upper, 3)}]`
              : placeholder}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
