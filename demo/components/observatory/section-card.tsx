import * as React from 'react';
import {cn} from '@/lib/utils';

export function SectionCard({
  title,
  description,
  eyebrow,
  actions,
  children,
  footer,
  className,
  contentClassName,
  surface = 'default',
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  surface?: 'default' | 'raised' | 'muted';
}) {
  const surfaceClass =
    surface === 'raised'
      ? 'bg-card shadow-pop border-border/70'
      : surface === 'muted'
        ? 'bg-muted/40 border-border/60 shadow-card'
        : 'bg-card/60 border-border/70 shadow-card';

  return (
    <section
      className={cn(
        'rounded-xl border backdrop-blur-sm',
        surfaceClass,
        className,
      )}
    >
      {(title || description || eyebrow || actions) && (
        <header className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1.5">
            {eyebrow ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="font-serif text-lg leading-tight tracking-tight">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </header>
      )}
      <div className={cn('px-5 py-5', contentClassName)}>{children}</div>
      {footer ? (
        <footer className="border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
