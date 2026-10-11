"use client"; // reads/writes localStorage and the <html> data-theme attribute — browser-only

import { useCallback, useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export type { Theme };

const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private browsing / quota — the choice just won't survive a reload
  }
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// The server always renders light; the client snapshot takes over after hydration.
function getServerSnapshot(): Theme {
  return "light";
}

/**
 * The <html data-theme> attribute is the source of truth (set before paint by
 * THEME_INIT_SCRIPT in app/layout.tsx, so a saved choice never flashes light).
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);
  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  return { theme, setTheme };
}
