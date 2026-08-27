'use client';

import * as React from 'react';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = 'hurstify-theme';
const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

/**
 * Reads the persisted theme from localStorage (if available) and
 * synchronizes the `dark` class on `<html>` to match. Falls back to
 * `dark` (the historical default) when running on the server or when
 * localStorage is unavailable.
 */
function readPersistedTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [theme, setThemeState] = React.useState<Theme>('dark');

  React.useEffect(() => {
    const persisted = readPersistedTheme();
    setThemeState(persisted);
    applyTheme(persisted);
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (privacy mode); silently skip.
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = React.useMemo(
    () => ({theme, setTheme, toggleTheme}),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
