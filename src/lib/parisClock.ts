import { useSyncExternalStore } from "react";

/**
 * The one clock of the site: the time in Paris, "HH:MM". The nav clock and the light of the homepage hero both read it,
 * so the page runs a single timer (every 15 s, only while something is subscribed) and the two can never disagree.
 */
const TICK_MS = 15000;

const format = (d: Date): string =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(d);

let current: string | null = null;
let timer: number | null = null;
const subs = new Set<() => void>();

const refresh = () => {
  const next = format(new Date());
  if (next !== current) { current = next; subs.forEach((f) => f()); }
};

const subscribe = (f: () => void) => {
  subs.add(f);
  if (timer === null) { refresh(); timer = window.setInterval(refresh, TICK_MS); }
  return () => {
    subs.delete(f);
    if (subs.size === 0 && timer !== null) { window.clearInterval(timer); timer = null; }
  };
};

const get = (): string => {
  // Nothing is subscribed: the cached value may be old, so read the clock again.
  if (current === null || subs.size === 0) current = format(new Date());
  return current;
};

/** "16:40", the time in Paris, refreshed while the component is mounted. */
export const useParisTime = (): string => useSyncExternalStore(subscribe, get, get);

/** The hour (0 to 23) of a "HH:MM" string. */
export const hourOf = (time: string): number => parseInt(time.slice(0, 2), 10) % 24;

export type HeroLight = "morning" | "midday" | "late" | "dusk";

/**
 * The warmth of the hero light. Day: 06:00-11:00 morning, 11:00-15:00 midday, 15:00-21:00 late afternoon,
 * 21:00-06:00 midday (neutral). Dusk: always the dusk lamp glow. The hour never switches the mood.
 */
export const heroLight = (hour: number, mood: "day" | "dusk"): HeroLight => {
  if (mood === "dusk") return "dusk";
  if (hour >= 6 && hour < 11) return "morning";
  if (hour >= 15 && hour < 21) return "late";
  return "midday";
};

/** Test helper: forget the cached time. */
export const resetParisClock = () => { current = null; };
