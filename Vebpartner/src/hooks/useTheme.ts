import { useState, useEffect, useCallback } from 'react';

export type ThemePreference = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

const STORAGE_KEY = 'vebstar_theme';

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved as ThemePreference;
      }
    } catch {
      // fallback
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch {
      // fallback
    }
    return 'dark';
  });

  // Apply theme to DOM
  const applyTheme = useCallback((theme: ResolvedTheme) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      body.classList.remove('bg-zinc-50', 'text-zinc-900');
      body.classList.add('bg-[#08090E]', 'text-zinc-100');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      body.classList.remove('bg-[#08090E]', 'text-zinc-100');
      body.classList.add('bg-zinc-50', 'text-zinc-900');
    }
    setResolvedTheme(theme);
  }, []);

  // Listen to system preference changes if preference is 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (preference === 'system') {
        const systemTheme: ResolvedTheme = mediaQuery.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
      } else {
        applyTheme(preference);
      }
    };

    updateTheme();

    const handleChange = () => {
      if (preference === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference, applyTheme]);

  const setPreference = (newPref: ThemePreference) => {
    setPreferenceState(newPref);
    try {
      localStorage.setItem(STORAGE_KEY, newPref);
    } catch {
      // storage error ignored
    }
    if (newPref === 'system') {
      const systemTheme: ResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);
    } else {
      applyTheme(newPref);
    }
  };

  const toggleTheme = () => {
    const next: ThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark';
    setPreference(next);
  };

  return {
    theme: resolvedTheme,
    preference,
    setPreference,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  };
}
