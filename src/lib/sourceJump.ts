import { currentReturnName, type InternalTarget } from "./sourceLinks";
import { activeRailItem } from "./railRegistry";

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

/** A heading's text as a reader sees it: without the copy-link affordance that sits inside it. */
export const headingText = (el: HTMLElement): string => {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('a[href^="#"], [aria-hidden="true"]').forEach((n) => n.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
};

const HEADER_FALLBACK = 80;
export const headerOffset = (doc: Document = document): number => {
  const nav = doc.querySelector("nav.fixed") as HTMLElement | null;
  const line = doc.querySelector("[data-source-context]") as HTMLElement | null;
  return (nav?.getBoundingClientRect().height || HEADER_FALLBACK) + (line?.getBoundingClientRect().height || 0) + 16;
};

/** Fixed and sticky bars (the site header, the context line, the dock) are not part of the page's own content. */
const inStickyBar = (el: HTMLElement): boolean => {
  for (let n: HTMLElement | null = el; n; n = n.parentElement) {
    if (typeof n.className !== "string") continue;
    if (n.className.split(/\s+/).some((c) => /(^|:)(fixed|sticky)$/.test(c))) return true;
  }
  return false;
};

/** The line a heading must have passed to count as the section the reader is in: 40% down the window. */
export const READING_LINE = 0.4;

/**
 * The section the reader is in when a link is clicked. The page's own rail decides when it has one (its active
 * item, the same logic as its highlight, with its number when the rail shows one). Otherwise the last content
 * heading whose top is above 40% of the window.
 */
const currentSection = (doc: Document): { id: string | null; text: string | null } => {
  const rail = activeRailItem();
  if (rail) return { id: rail.id, text: rail.label };
  const line = window.innerHeight * READING_LINE;
  let found: HTMLElement | null = null;
  doc.querySelectorAll<HTMLElement>("main h2, main h3").forEach((h) => {
    if (!inStickyBar(h) && h.getBoundingClientRect().top <= line) found = h;
  });
  const h = found as HTMLElement | null;
  if (!h) return { id: null, text: null };
  const id = h.id.replace(/-heading$/, "") || h.closest("section")?.id || null;
  return { id: h.id || id, text: headingText(h) || null };
};

/** Where the reader is right now, to come back to it. `title` is the page's name in "Back to ...". */
export const captureOrigin = (doc: Document = document): Origin => {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const section = currentSection(doc);
  return { path, title: currentReturnName(path, doc), section: section.text, sectionId: section.id, scrollY: Math.round(window.scrollY) };
};
