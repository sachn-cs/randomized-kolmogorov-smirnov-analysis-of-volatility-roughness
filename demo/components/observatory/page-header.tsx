import * as React from 'react';
import {cn} from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  meta,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        {eyebrow ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
        {meta ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </header>
  );
}
