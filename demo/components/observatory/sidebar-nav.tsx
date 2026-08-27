'use client';

import * as React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {Activity, Search, BarChart3} from 'lucide-react';

const navItems = [
  {href: '/dashboard', label: 'Dashboard', icon: Activity},
  {href: '/explorer', label: 'Explorer', icon: Search},
  {href: '/figures', label: 'Figures', icon: BarChart3},
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({href, label, icon: Icon}) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
              'transition-colors',
              active
                ? 'bg-primary/15 text-primary shadow-[0_0_0_1px_rgba(240,160,48,0.2)]'
                : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
