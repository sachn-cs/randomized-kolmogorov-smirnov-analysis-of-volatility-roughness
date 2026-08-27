'use client';

import Link from 'next/link';
import {Activity, BarChart3, Moon, Search, Sun} from 'lucide-react';
import {useTheme} from '@/components/theme-provider';
import {cn} from '@/lib/utils';

const navItems = [
  {href: '/dashboard', label: 'Dashboard', icon: Activity},
  {href: '/explorer', label: 'Explorer', icon: Search},
  {href: '/figures', label: 'Figures', icon: BarChart3},
] as const;

export const MAIN_CONTENT_ID = 'main-content';

export function AppShell({children}: {children: React.ReactNode}) {
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative z-10 flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card/40 px-6 py-8">
        <header className="mb-12 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-primary">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6 12 Q9 7 12 12 Q15 17 18 12"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-xl leading-tight">hurstify</h1>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Observatory
            </span>
          </div>
        </header>

        <nav className="flex flex-col gap-1" aria-label="Primary">
          {navItems.map(({href, label, icon: Icon}) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                'text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-8">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            aria-pressed={!isDark}
            className="flex w-full items-center gap-3 rounded-md border border-border bg-card/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
          >
            {isDark ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="font-mono uppercase tracking-widest">
              {isDark ? 'Light theme' : 'Dark theme'}
            </span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary shadow-[0_0_6px_var(--color-secondary)]" />
            Observatory online
          </div>
          <a
            href="https://github.com/sachncs/hurstify"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            GitHub ↗
          </a>
        </div>
      </aside>

      <main id={MAIN_CONTENT_ID} className="flex-1 overflow-y-auto p-12">
        {children}
      </main>
    </div>
  );
}
