import { describe, it, expect } from "vitest";
import { sunPath } from "@/lib/parisClock";

const sun = { sunrise: 480, sunset: 1020 };
describe("The hero window light follows the sun continuously", () => {
  it("is off before sunrise and after sunset", () => {
    expect(sunPath(479, sun).up).toBe(false);
    expect(sunPath(1020, sun).up).toBe(false);
  });
  it("is at mid-arc and full height at solar noon", () => {
    expect(sunPath(750, sun)).toEqual({ up: true, progress: 0.5, elevation: 1 });
  });
});

import { sunLight, sunTimes } from "@/lib/parisClock";
describe("Seasons and twilights over Paris", () => {
  it("a December noon is far lower than a June noon", () => {
    const dec = sunTimes("2026-12-21"), jun = sunTimes("2026-06-21");
    expect(dec.noonAltitude!).toBeGreaterThan(16); expect(dec.noonAltitude!).toBeLessThan(19);
    expect(jun.noonAltitude!).toBeGreaterThan(63); expect(jun.noonAltitude!).toBeLessThan(66);
    const noon = (s: typeof dec) => Math.round((s.sunrise + s.sunset) / 2);
    expect(sunLight(noon(dec), dec).height).toBeLessThan(0.3);
    expect(sunLight(noon(jun), jun).height).toBeGreaterThan(0.95);
  });
  it("civil dawn comes before sunrise and civil dusk after sunset", () => {
    const s = sunTimes("2026-11-20");
    expect(sunLight(s.sunrise - 10, s).phase).toBe("dawn");
    expect(sunLight(s.sunset + 10, s).phase).toBe("dusk");
    expect(sunLight(s.dusk! + 5, s).phase).toBe("night");
  });
});
