import { useEffect } from 'react';

export type ThemePreference = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

const STORAGE_KEY = 'vebpartner_theme';

export function useTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
    body.classList.remove('bg-zinc-50', 'text-zinc-900');
    body.classList.add('bg-vp-bg', 'text-vp-primary');

    try {
      localStorage.setItem(STORAGE_KEY, 'dark');
    } catch {
      // storage error ignored
    }
  }, []);

  const setPreference = (newPref: ThemePreference) => {
    void newPref;
  };

  const toggleTheme = () => {
    // Theme switching has been intentionally removed from the public UI.
  };

  return {
    theme: 'dark' as ResolvedTheme,
    preference: 'dark' as ThemePreference,
    setPreference,
    toggleTheme,
    isDark: true,
  };
}
