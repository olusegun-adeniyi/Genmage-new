"use client"; // subscribes to localStorage, a browser-only external store

import { useCallback, useSyncExternalStore } from "react";

import { normalizeEditState, type EditState } from "@/lib/validation/edit-state";

export type HistoryItem = {
  slug: string;
  imageUrl: string;
  prompt: string;
  style: string;
  editState: EditState;
  createdAt: string; // ISO — relative time is computed at render time, not stored
};

const STORAGE_KEY = "genmage:history";
// Handoff caps "Recently generated" at 20 — also keeps localStorage bounded.
const MAX_ENTRIES = 20;

// Module-level cache + pub-sub: useSyncExternalStore needs a stable snapshot
// reference between reads, and this is the one place that reads/writes the key.
let cachedSnapshot: HistoryItem[] = [];
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();

// Entries outlive edit-state shape changes — re-validate the one field whose
// shape has changed, rather than trusting whatever an older build wrote.
function normalizeHistoryItem(item: HistoryItem): HistoryItem {
  return { ...item, editState: normalizeEditState(item.editState) };
}

function readStorage(): HistoryItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedSnapshot = Array.isArray(parsed) ? parsed.map(normalizeHistoryItem) : [];
  } catch {
    // corrupt/inaccessible storage — fall through with whatever was last cached
  }
  return cachedSnapshot;
}

function writeStorage(items: HistoryItem[]) {
  cachedSnapshot = items;
  cachedRaw = JSON.stringify(items);
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // localStorage can throw in private-browsing/quota-exceeded contexts — history
    // simply won't persist across reloads in that case, not a functional blocker.
  }
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// A stable module-level reference — returning a fresh [] each call defeats
// useSyncExternalStore's reference check and triggers a re-render loop warning.
const EMPTY_HISTORY: HistoryItem[] = [];

function getServerSnapshot(): HistoryItem[] {
  return EMPTY_HISTORY;
}

export function useHistory() {
  const history = useSyncExternalStore(subscribe, readStorage, getServerSnapshot);

  const addEntry = useCallback((item: HistoryItem) => {
    writeStorage([item, ...cachedSnapshot.filter((entry) => entry.slug !== item.slug)].slice(0, MAX_ENTRIES));
  }, []);

  const updateEntryEditState = useCallback((slug: string, editState: EditState) => {
    writeStorage(cachedSnapshot.map((entry) => (entry.slug === slug ? { ...entry, editState } : entry)));
  }, []);

  // Local history only — the generation row and its permalink are untouched.
  const removeEntry = useCallback((slug: string) => {
    writeStorage(cachedSnapshot.filter((entry) => entry.slug !== slug));
  }, []);

  return { history, addEntry, updateEntryEditState, removeEntry };
}
