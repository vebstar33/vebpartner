import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vebstar_search_history';
const MAX_HISTORY_ITEMS = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
        }
      }
    } catch (e) {
      console.warn('Failed to load search history', e);
    }
    return [];
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save search history', e);
    }
  }, [history]);

  // Add search term to history
  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    setHistory((prev) => {
      // Remove any existing case-insensitive match
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      // Add new query to the front and cap at max items
      return [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  // Remove individual search term
  const removeSearch = useCallback((queryToRemove: string) => {
    setHistory((prev) => prev.filter((item) => item.toLowerCase() !== queryToRemove.toLowerCase()));
  }, []);

  // Clear all search history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory,
  };
}
