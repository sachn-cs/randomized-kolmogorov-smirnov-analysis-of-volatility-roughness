'use client';

import * as React from 'react';

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);
  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Booting observatory…
      </div>
    );
  }
  return null;
}
