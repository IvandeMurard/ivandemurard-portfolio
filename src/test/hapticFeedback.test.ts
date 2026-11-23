import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => vi.resetModules());
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
const device = (reduced = false) => {
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({ matches: query === "(hover: none)" || (reduced && query === "(prefers-reduced-motion: reduce)") })));
  const resume = vi.fn(async () => {});
  const start = vi.fn();
  const create = vi.fn();
  class Context {
    constructor() { create(); }
    state = "suspended";
    currentTime = 0;
    destination = {};
    resume = resume;
    createOscillator = () => ({ type: "", frequency: { value: 0 }, connect: () => ({ connect: vi.fn() }), start, stop: vi.fn() });
    createGain = () => ({ gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() } });
  }
  vi.stubGlobal("AudioContext", Context);
  Object.defineProperty(navigator, "vibrate", { configurable: true, value: undefined });
  return { create, resume, start };
};

describe("touch detent feedback", () => {
  it("unlocks on the initial gesture and uses an audio detent when vibration is unavailable", async () => {
    const { resume, start } = device();
    const { unlockHapticFeedback, useHaptic } = await import("@/hooks/useHaptic");
    unlockHapticFeedback();
    expect(resume).toHaveBeenCalled();
    useHaptic()("detent");
    expect(start).toHaveBeenCalledTimes(1);
  });
  it("respects reduced motion even on devices without vibration", async () => {
    const { create, start } = device(true);
    const { unlockHapticFeedback, useHaptic } = await import("@/hooks/useHaptic");
    unlockHapticFeedback();
    useHaptic()("detent");
    expect(create).not.toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
  });
  it("uses vibration where supported", async () => {
    const { start } = device();
    const vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, "vibrate", { configurable: true, value: vibrate });
    const { useHaptic } = await import("@/hooks/useHaptic");
    useHaptic()("detent");
    expect(vibrate).toHaveBeenCalledWith(5);
    expect(start).not.toHaveBeenCalled();
  });
});