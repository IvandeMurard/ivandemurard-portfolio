import { useMemo, useSyncExternalStore } from "react";

/**
 * The one clock of the site: the date and the time in Paris. The nav clock and the light of the homepage hero both read it,
 * so the page runs a single timer (every 15 s, only while something is subscribed) and the two can never disagree.
 * The store holds one string, "YYYY-MM-DD HH:MM", read in Paris time with Intl (summer time included).
 */
const TICK_MS = 15000;
const TZ = "Europe/Paris";

const parts = (d: Date) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(d).map((x) => [x.type, x.value]),
  ) as Record<string, string>;
  return { date: `${p.year}-${p.month}-${p.day}`, h: Number(p.hour) % 24, m: Number(p.minute) };
};
const pad = (n: number) => String(n).padStart(2, "0");
const format = (d: Date): string => { const p = parts(d); return `${p.date} ${pad(p.h)}:${pad(p.m)}`; };

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
export const useParisTime = (): string => useSyncExternalStore(subscribe, get, get).slice(11);

/** The date ("2026-11-18") and the minutes since midnight in Paris, from the same clock and the same timer. */
export const useParisNow = (): { date: string; minutes: number } => {
  const key = useSyncExternalStore(subscribe, get, get);
  return useMemo(() => ({ date: key.slice(0, 10), minutes: Number(key.slice(11, 13)) * 60 + Number(key.slice(14, 16)) }), [key]);
};

/** Test helper: forget the cached time. */
export const resetParisClock = () => { current = null; };

/* ---------------------------------------------------------------------------------------------------------------
 * The sun over Paris. The hero light follows it, not fixed hours.
 *
 * Sunrise and sunset by the NOAA method (Meeus; zenith 90.833 degrees, which counts the refraction and the radius of
 * the solar disc), computed in the browser for the Paris date: no service, no dependency. Paris is lat 48.8566, lon 2.3522.
 * The result is in minutes after midnight in Paris, so summer time is handled by Intl, not by a table. One computation
 * per Paris date, cached.
 */
export const PARIS = { lat: 48.8566, lon: 2.3522 } as const;
const ZENITH = 90.833;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Julian day at 0 h UT of a calendar date. */
const julianDay = (y: number, m: number, d: number): number => {
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
};

/** Sunrise or sunset, in minutes after 0 h UT, for a Julian day, one pass. */
const sunEventUtc = (rise: boolean, jd: number): number => {
  const t = (jd - 2451545) / 36525;
  const l0 = (280.46646 + t * (36000.76983 + 0.0003032 * t)) % 360;
  const m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const c = Math.sin(rad(m)) * (1.914602 - t * (0.004817 + 0.000014 * t)) + Math.sin(rad(2 * m)) * (0.019993 - 0.000101 * t) + Math.sin(rad(3 * m)) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const apparent = l0 + c - 0.00569 - 0.00478 * Math.sin(rad(omega));
  const obliquity = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(rad(omega));
  const decl = Math.asin(Math.sin(rad(obliquity)) * Math.sin(rad(apparent)));
  const y = Math.tan(rad(obliquity) / 2) ** 2;
  const eqTime = 4 * deg(y * Math.sin(2 * rad(l0)) - 2 * e * Math.sin(rad(m)) + 4 * e * y * Math.sin(rad(m)) * Math.cos(2 * rad(l0)) - 0.5 * y * y * Math.sin(4 * rad(l0)) - 1.25 * e * e * Math.sin(2 * rad(m)));
  let ha = Math.acos(Math.cos(rad(ZENITH)) / (Math.cos(rad(PARIS.lat)) * Math.cos(decl)) - Math.tan(rad(PARIS.lat)) * Math.tan(decl));
  if (!rise) ha = -ha;
  return 720 - 4 * (PARIS.lon + deg(ha)) - eqTime;
};

export type SunTimes = { sunrise: number; sunset: number };

const sunCache = new Map<string, SunTimes>();

/** Minutes after midnight in Paris of an instant. */
const parisMinutes = (instant: Date): number => { const p = parts(instant); return p.h * 60 + p.m; };

/**
 * Sunrise and sunset in Paris on a Paris date ("2026-11-18"), in minutes after midnight in Paris
 * (06:54 is 414). Computed once per date.
 */
export const sunTimes = (date: string): SunTimes => {
  const cached = sunCache.get(date);
  if (cached) return cached;
  const [y, mo, d] = date.split("-").map(Number);
  const jd = julianDay(y, mo, d);
  const at = (rise: boolean) => {
    // The second pass, at the time the first one found, as the NOAA calculator does.
    const utc = sunEventUtc(rise, jd + sunEventUtc(rise, jd) / 1440);
    return parisMinutes(new Date(Date.UTC(y, mo - 1, d) + Math.round(utc) * 60000));
  };
  const result = { sunrise: at(true), sunset: at(false) };
  sunCache.set(date, result);
  return result;
};

/** "08:03" for 483 minutes. */
export const clockLabel = (minutes: number): string => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

export type HeroLight = "morning" | "midday" | "late" | "dusk";
export type HeroPeriod = HeroLight | "neutral";

/**
 * The period of the hero light in Paris. Day mood: sunrise to sunrise + 3 h is the morning; then midday until
 * sunset - 2 h; sunset - 2 h to sunset is the late afternoon (golden hour); from sunset to sunrise the light is neutral.
 * Dusk mood: always the lamp glow. The hour never switches the mood.
 */
export const heroPeriod = (minutes: number, mood: "day" | "dusk", sun: SunTimes): HeroPeriod => {
  if (mood === "dusk") return "dusk";
  if (minutes < sun.sunrise || minutes >= sun.sunset) return "neutral";
  if (minutes < sun.sunrise + 180) return "morning";
  if (minutes < sun.sunset - 120) return "midday";
  return "late";
};

/** The glow to show: the neutral period uses the midday glow. */
export const heroLight = (minutes: number, mood: "day" | "dusk", sun: SunTimes): HeroLight => {
  const p = heroPeriod(minutes, mood, sun);
  return p === "neutral" ? "midday" : p;
};
