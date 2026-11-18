import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { clockLabel, heroLight, heroPeriod, sunTimes } from "@/lib/parisClock";

// The hero light follows the real sun over Paris (lat 48.8566, lon 2.3522): sunrise and sunset by the NOAA method
// (zenith 90.833 degrees), in Paris time. Reference values computed with the same method, consistent with the
// published Paris times; tolerance 5 minutes.

const minutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const TOLERANCE = 5;

describe("Sunrise and sunset in Paris", () => {
  it.each([
    ["2026-03-20", "06:54", "19:02"],
    ["2026-06-21", "05:46", "21:57"],
    ["2026-11-18", "08:03", "17:07"],
    ["2026-12-21", "08:41", "16:55"],
  ])("%s: sunrise %s, sunset %s, within 5 minutes", (date, rise, set) => {
    const s = sunTimes(date);
    expect(Math.abs(s.sunrise - minutes(rise)), `sunrise ${clockLabel(s.sunrise)}`).toBeLessThanOrEqual(TOLERANCE);
    expect(Math.abs(s.sunset - minutes(set)), `sunset ${clockLabel(s.sunset)}`).toBeLessThanOrEqual(TOLERANCE);
  });

  it("is in Paris local time, so summer time is handled: the sunrise jumps an hour on the day the clocks go forward", () => {
    const before = sunTimes("2026-03-28").sunrise; // 29 Mar 2026: 02:00 becomes 03:00
    const after = sunTimes("2026-03-29").sunrise;
    expect(after - before).toBeGreaterThan(50);
    expect(after - before).toBeLessThan(65);
    const back = sunTimes("2026-10-24").sunrise; // 25 Oct 2026: 03:00 becomes 02:00
    expect(back - sunTimes("2026-10-25").sunrise).toBeGreaterThan(50);
  });

  it("computes once per Paris date: the second read is the cached result", () => {
    expect(sunTimes("2026-05-05")).toBe(sunTimes("2026-05-05"));
    expect(sunTimes("2026-05-05")).not.toBe(sunTimes("2026-05-06"));
  });

  it("uses no service and no dependency: the source reads nothing but React", () => {
    const src = readFileSync("src/lib/parisClock.ts", "utf8");
    expect([...src.matchAll(/^import .* from "([^"]+)"/gm)].map((m) => m[1])).toEqual(["react"]);
    expect(src).not.toMatch(/fetch\(|XMLHttpRequest|WebSocket/);
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    expect(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((d) => /suncalc|sunrise|solar|astronomy/i.test(d))).toEqual([]);
  });
});

describe("The period of the hero light", () => {
  const nov = sunTimes("2026-11-18"); // sunrise 08:04, sunset 17:07
  const jun = sunTimes("2026-06-21");
  const period = (sun: typeof nov, hhmm: string) => heroPeriod(minutes(hhmm), "day", sun);

  it("18 Nov: 09:10 morning, 13:00 midday, 15:30 late afternoon, 18:00 neutral", () => {
    expect(period(nov, "09:10")).toBe("morning");
    expect(period(nov, "13:00")).toBe("midday");
    expect(period(nov, "15:30")).toBe("late");
    expect(period(nov, "18:00")).toBe("neutral");
  });

  it("21 Jun: 20:30 late afternoon (the golden hours run to 21:58)", () => {
    expect(period(jun, "20:30")).toBe("late");
    expect(period(jun, "13:00")).toBe("midday");
    expect(period(jun, "07:00")).toBe("morning");
  });

  it("the edges: sunrise to sunrise + 3 h, then until sunset - 2 h, then to sunset, then neutral until sunrise", () => {
    const { sunrise, sunset } = nov;
    expect(heroPeriod(sunrise - 1, "day", nov)).toBe("neutral");
    expect(heroPeriod(sunrise, "day", nov)).toBe("morning");
    expect(heroPeriod(sunrise + 179, "day", nov)).toBe("morning");
    expect(heroPeriod(sunrise + 180, "day", nov)).toBe("midday");
    expect(heroPeriod(sunset - 121, "day", nov)).toBe("midday");
    expect(heroPeriod(sunset - 120, "day", nov)).toBe("late");
    expect(heroPeriod(sunset - 1, "day", nov)).toBe("late");
    expect(heroPeriod(sunset, "day", nov)).toBe("neutral");
    expect(heroPeriod(0, "day", nov)).toBe("neutral");
    expect(heroPeriod(23 * 60 + 59, "day", nov)).toBe("neutral");
  });

  it("the neutral period shows the midday glow", () => {
    expect(heroLight(minutes("18:00"), "day", nov)).toBe("midday");
    expect(heroLight(minutes("03:00"), "day", nov)).toBe("midday");
    expect(heroLight(minutes("09:10"), "day", nov)).toBe("morning");
    expect(heroLight(minutes("15:30"), "day", nov)).toBe("late");
  });

  it("the Dusk mood is always the lamp glow, whatever the sun, and the time never switches the mood", () => {
    for (const hhmm of ["03:00", "09:10", "13:00", "15:30", "18:00", "23:30"]) {
      expect(heroPeriod(minutes(hhmm), "dusk", nov)).toBe("dusk");
      expect(heroLight(minutes(hhmm), "dusk", jun)).toBe("dusk");
    }
    // heroLight takes the mood in and returns a glow: there is no way out of it that returns a mood.
    expect(readFileSync("src/lib/parisClock.ts", "utf8")).not.toMatch(/setMood|toggle\(/);
  });

  it("the old fixed hours are gone from the source", () => {
    const src = readFileSync("src/lib/parisClock.ts", "utf8") + readFileSync("src/components/home/HeroGlow.tsx", "utf8") + readFileSync("src/index.css", "utf8");
    expect(src).not.toMatch(/06:00-11:00|11:00-15:00|15:00-21:00|21:00-06:00/);
  });
});
