'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { NAV_ITEMS } from '@/components/navigation/TopTacticalHUD';

const SHORTCUTS = [
  { keys: 'Ctrl / ⌘ + K', label: 'Open command palette' },
  { keys: '?', label: 'Show keyboard shortcuts' },
  { keys: '↑ / ↓', label: 'Move through results' },
  { keys: 'Enter', label: 'Open the selected page' },
  { keys: 'Esc', label: 'Close this panel' },
];

type Mode = 'nav' | 'help';

/** Global command palette (Ctrl/⌘+K) and shortcut reference (?). */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('nav');
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setMode('nav');
        setOpen((value) => !value);
        return;
      }

      if (event.key === '?' && !isTyping) {
        event.preventDefault();
        setMode('help');
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = NAV_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, mode]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (mode !== 'nav') return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) navigate(target.href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0 gap-0">
        <div className="border-b border-neutral-800 px-4 py-3">
          <DialogTitle className="text-sm">
            {mode === 'nav' ? 'Jump to telemetry' : 'Keyboard shortcuts'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'nav'
              ? 'Search and open any telemetry page.'
              : 'Reference of available keyboard shortcuts.'}
          </DialogDescription>
        </div>

        {mode === 'nav' ? (
          <>
            <div className="flex items-center gap-2 border-b border-neutral-800 px-4">
              <Search className="h-4 w-4 text-neutral-400" aria-hidden="true" />
              <label htmlFor="command-palette-search" className="sr-only">
                Search telemetry pages
              </label>
              <input
                ref={inputRef}
                id="command-palette-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleListKeyDown}
                placeholder="Search pages…"
                autoComplete="off"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-palette-results"
                aria-activedescendant={
                  results[activeIndex] ? `command-item-${activeIndex}` : undefined
                }
                className="h-12 w-full bg-transparent font-mono text-sm text-white placeholder:text-neutral-500 focus:outline-none"
              />
            </div>

            <ul
              id="command-palette-results"
              role="listbox"
              aria-label="Telemetry pages"
              className="max-h-80 overflow-y-auto p-2"
            >
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-xs font-mono text-neutral-400">
                  No pages match “{query}”.
                </li>
              ) : (
                results.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;
                  return (
                    <li key={item.href} role="option" aria-selected={isActive}>
                      <button
                        id={`command-item-${index}`}
                        type="button"
                        onClick={() => navigate(item.href)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-mono transition-colors ${
                          isActive
                            ? 'bg-neutral-800 text-white'
                            : 'text-neutral-300 hover:bg-neutral-900'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${isActive ? 'text-[#E10600]' : 'text-neutral-400'}`}
                          aria-hidden="true"
                        />
                        <span>{item.name}</span>
                        {item.isLive && (
                          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-[#E10600]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] motion-safe:animate-pulse" />
                            LIVE
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </>
        ) : (
          <dl className="divide-y divide-neutral-800/60 px-4 py-2">
            {SHORTCUTS.map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center justify-between py-3">
                <dt className="text-xs text-neutral-300">{shortcut.label}</dt>
                <dd>
                  <kbd className="border border-neutral-700 bg-neutral-900 px-2 py-0.5 font-mono text-[11px] text-white rounded-md">
                    {shortcut.keys}
                  </kbd>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}
