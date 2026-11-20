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
