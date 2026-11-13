import { useSyncExternalStore } from "react";

/**
 * The visitor's choice to see Rose's page notes or not. One small store read by every note, every RoseMark and the
 * dock. localStorage key "rose_notes" is "off" when the notes are hidden; anything else (or nothing) means on.
 * Every read and write is in a try/catch: a blocked or throwing storage never breaks the page, it only means the
 * choice lasts for the visit instead of surviving a reload.
 */
export const ROSE_NOTES_KEY = "rose_notes";

const read = (): boolean => {
  try { return window.localStorage.getItem(ROSE_NOTES_KEY) !== "off"; } catch { return true; }
};

let current: boolean | null = null;
const subs = new Set<() => void>();

const get = (): boolean => {
  if (current === null) current = read();
  return current;
};

export const setRoseNotes = (on: boolean) => {
  current = on;
  try {
    if (on) window.localStorage.removeItem(ROSE_NOTES_KEY);
    else window.localStorage.setItem(ROSE_NOTES_KEY, "off");
  } catch { /* the choice holds for this visit only */ }
  subs.forEach((f) => f());
};

const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

/** True while Rose's notes are shown (the default). */
export const useRoseNotes = (): boolean => useSyncExternalStore(subscribe, get, () => true);

/** Test helper: forget the cached value so the next read goes back to storage (a reload). */
export const resetRoseNotesCache = () => { current = null; subs.forEach((f) => f()); };

/* ---------------- Which note is first on the page ----------------
 * The first note, in document order, carries the footer (who wrote the notes, and the way to hide them). Notes
 * register their element while mounted; the first one is recomputed when one comes or goes. */
const registry = new Map<string, HTMLElement>();
const regSubs = new Set<() => void>();
let firstId: string | null = null;

const recompute = () => {
  let best: [string, HTMLElement] | null = null;
  for (const entry of registry) {
    if (!best || (best[1].compareDocumentPosition(entry[1]) & Node.DOCUMENT_POSITION_PRECEDING)) best = entry;
  }
  const next = best ? best[0] : null;
  if (next !== firstId) { firstId = next; regSubs.forEach((f) => f()); }
};

export const registerRoseNote = (id: string, el: HTMLElement) => {
  registry.set(id, el);
  recompute();
  return () => { registry.delete(id); recompute(); };
};

const subscribeFirst = (f: () => void) => { regSubs.add(f); return () => { regSubs.delete(f); }; };
/** The id of the first note in document order on the page, or null. */
export const useFirstRoseNoteId = (): string | null => useSyncExternalStore(subscribeFirst, () => firstId, () => null);
