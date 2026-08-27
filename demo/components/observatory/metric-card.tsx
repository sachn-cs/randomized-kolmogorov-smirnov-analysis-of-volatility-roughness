import {cn} from '@/lib/utils';

export function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'primary' | 'secondary' | 'destructive';
}) {
  return (
    <div className="rounded-md border border-border bg-card/60 p-4 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(240,160,48,0.1)]">
      <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          'mt-2 font-mono text-2xl font-semibold tabular-nums',
          tone === 'secondary' && 'text-secondary',
          tone === 'destructive' && 'text-destructive',
          (!tone || tone === 'primary') && 'text-primary',
        )}
      >
        {value}
      </div>
    </div>
  );
}
