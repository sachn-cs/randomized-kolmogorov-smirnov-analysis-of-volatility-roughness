import * as React from 'react';
import {cn} from '@/lib/utils';

type Tone = 'primary' | 'muted' | 'destructive' | 'success';

const toneClass: Record<Tone, string> = {
  primary: 'text-primary',
  muted: 'text-foreground',
  destructive: 'text-destructive',
  success: 'text-success',
};

export function StatTile({
  label,
  value,
  unit,
  hint,
  tone = 'muted',
  emphasis = false,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  hint?: React.ReactNode;
  tone?: Tone;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-2 rounded-lg border border-border/70 bg-card/60 p-4 shadow-card transition-shadow hover:shadow-pop',
        emphasis && 'border-primary/40 shadow-glow',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        {hint ? (
          <span className="font-mono text-[10px] text-muted-foreground/80">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'font-mono text-2xl font-semibold tabular-nums leading-none md:text-3xl',
            toneClass[tone],
          )}
        >
          {value}
        </span>
        {unit ? (
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}
