/**
 * useHaptic: quiet, opt-out tap feedback.
 *
 * No-ops on:
 * - Devices without the Vibration API (iOS Safari, most desktops)
 * - Users with prefers-reduced-motion
 * - Hover-capable devices (desktop pointers)
 *
 * Use sparingly: only on deliberate actions (toggles, primary CTAs).
 */
type Pattern = "tap" | "toggle" | "select";

const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 10,
  toggle: [6, 40, 6],
  select: 12,
};

export const useHaptic = () => {
  return (pattern: Pattern = "tap") => {
    if (typeof window === "undefined") return;
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(hover: hover)").matches) return;
      navigator.vibrate(PATTERNS[pattern]);
    } catch {
      // ignore, vibration is purely enhancement
    }
  };
};

export default useHaptic;
