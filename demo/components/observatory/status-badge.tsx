import * as React from 'react';
import {cn} from '@/lib/utils';
import {Badge, type BadgeProps} from '@/components/ui/badge';

type StatusTone = 'neutral' | 'live' | 'success' | 'warning' | 'destructive';

const toneMap: Record<StatusTone, BadgeProps['variant']> = {
  neutral: 'secondary',
  live: 'default',
  success: 'default',
  warning: 'secondary',
  destructive: 'destructive',
};

const toneRing: Record<StatusTone, string> = {
  neutral: 'ring-border',
  live: 'ring-primary/40',
  success: 'ring-success/40',
  warning: 'ring-warning/40',
  destructive: 'ring-destructive/40',
};

export function StatusBadge({
  label,
  tone = 'neutral',
  pulse = false,
  className,
}: {
  label: string;
  tone?: StatusTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <Badge
      variant={toneMap[tone]}
      className={cn(
        'gap-2 rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        toneRing[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-full',
          tone === 'live' || tone === 'success'
            ? 'bg-primary shadow-glow'
            : tone === 'destructive'
              ? 'bg-destructive'
              : tone === 'warning'
                ? 'bg-warning'
                : 'bg-muted-foreground/60',
          pulse && 'animate-pulse',
        )}
      />
      {label}
    </Badge>
  );
}
