import { currentPageTitle, type InternalTarget } from "./sourceLinks";

/**
 * A reader followed a source link from Rose. The origin (path, section, scroll position) lives in
 * sessionStorage only: it is what the "Back" line needs, and it goes with the tab.
 */
const KEY = "rose-source-jump";
export const JUMP_EVENT = "rose:source-jump";

export type Origin = { path: string; title: string; section: string | null; sectionId: string | null; scrollY: number };
export type Jump = { target: InternalTarget; samePage: boolean; origin: Origin };

const announce = () => { try { window.dispatchEvent(new Event(JUMP_EVENT)); } catch { /* no window */ } };

export const readJump = (): Jump | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Jump) : null;
  } catch { return null; }
};

export const saveJump = (jump: Jump) => {
  try { sessionStorage.setItem(KEY, JSON.stringify(jump)); } catch { /* storage blocked: no return line */ }
  announce();
};

export const clearJump = () => {
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  announce();
};

const safeDecode = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };

/** Is the reader now where this jump was heading? */
export const jumpMatches = (jump: Jump | null, pathname: string, hash: string): jump is Jump =>
  !!jump && jump.target.path === pathname && jump.target.hash === safeDecode(hash.replace(/^#/, ""));

const HEADER_FALLBACK = 80;
export const headerOffset = (doc: Document = document): number => {
  const nav = doc.querySelector("nav.fixed") as HTMLElement | null;
  const line = doc.querySelector("[data-source-context]") as HTMLElement | null;
  return (nav?.getBoundingClientRect().height || HEADER_FALLBACK) + (line?.getBoundingClientRect().height || 0) + 16;
};

/** The section the reader is in: the last heading that has reached the top of the window. */
const currentSection = (doc: Document): { id: string | null; text: string | null } => {
  const offset = headerOffset(doc) + 8;
  let found: HTMLElement | null = null;
  doc.querySelectorAll<HTMLElement>("main h2, main h3").forEach((h) => {
    if (h.getBoundingClientRect().top <= offset) found = h;
  });
  const h = found as HTMLElement | null;
  if (!h) return { id: null, text: null };
  const id = h.id.replace(/-heading$/, "") || h.closest("section")?.id || null;
  return { id: h.id || id, text: h.textContent?.replace(/\s+/g, " ").trim() || null };
};

/** Where the reader is right now, to come back to it. */
export const captureOrigin = (doc: Document = document): Origin => {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const section = currentSection(doc);
  return { path, title: currentPageTitle(path, doc), section: section.text, sectionId: section.id, scrollY: Math.round(window.scrollY) };
};
