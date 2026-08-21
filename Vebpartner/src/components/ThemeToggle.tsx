import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import { ThemePreference, ResolvedTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: ResolvedTheme;
  preference: ThemePreference;
  onSelectPreference: (pref: ThemePreference) => void;
  onToggleTheme: () => void;
  variant?: 'button' | 'dropdown' | 'compact';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  preference,
  onSelectPreference,
  onToggleTheme,
  variant = 'button',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'compact') {
    return (
      <button
        onClick={onToggleTheme}
        aria-label={`Current theme: ${preference}. Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Current: ${preference} mode (Click to toggle)`}
        className={`p-2 rounded-full border transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-zinc-900 border-white/[0.1] text-zinc-300 hover:text-white hover:bg-zinc-800'
            : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 shadow-sm'
        } ${className}`}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600" />
        )}
      </button>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme settings"
        title={`Theme: ${preference} (Click to change)`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-zinc-900/90 border-white/[0.1] text-zinc-300 hover:text-white hover:bg-zinc-800'
            : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 shadow-sm'
        } ${className}`}
      >
        {preference === 'system' ? (
          <Laptop className="w-3.5 h-3.5 text-emerald-500" />
        ) : theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
        <span className="hidden sm:inline capitalize text-[11px] font-semibold">
          {preference === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-36 rounded-2xl border shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
            theme === 'dark'
              ? 'bg-[#0e1017] border-white/[0.1] text-zinc-200'
              : 'bg-white border-zinc-200 text-zinc-800'
          }`}
        >
          <button
            onClick={() => {
              onSelectPreference('light');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
              preference === 'light'
                ? theme === 'dark'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'bg-zinc-100 text-zinc-950 font-bold'
                : theme === 'dark'
                ? 'hover:bg-zinc-800/60 text-zinc-300 hover:text-white'
                : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </div>
            {preference === 'light' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
          </button>

          <button
            onClick={() => {
              onSelectPreference('dark');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
              preference === 'dark'
                ? theme === 'dark'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'bg-zinc-100 text-zinc-950 font-bold'
                : theme === 'dark'
                ? 'hover:bg-zinc-800/60 text-zinc-300 hover:text-white'
                : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dark</span>
            </div>
            {preference === 'dark' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
          </button>

          <button
            onClick={() => {
              onSelectPreference('system');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
              preference === 'system'
                ? theme === 'dark'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'bg-zinc-100 text-zinc-950 font-bold'
                : theme === 'dark'
                ? 'hover:bg-zinc-800/60 text-zinc-300 hover:text-white'
                : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950'
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-emerald-500" />
              <span>System</span>
            </div>
            {preference === 'system' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
        </div>
      )}
    </div>
  );
};
