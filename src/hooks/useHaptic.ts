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
type Pattern = "tap" | "toggle" | "select" | "detent";

const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 10,
  toggle: [6, 40, 6],
  select: 12,
  // A fader notch: barely there, felt rather than heard.
  detent: 5,
};

let audio: AudioContext | null = null;

/**
 * Touch devices without vibration (iOS Safari): a muffled 3 ms tick at about 90 Hz
 * stands in for the fader notch. Only for "detent", never for other patterns.
 */
const tick = () => {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    audio ??= new Ctx();
    if (audio.state === "suspended") void audio.resume();
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = 90;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.0005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.003);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.005);
  } catch {
    // ignore, the tick is purely enhancement
  }
};

export const useHaptic = () => {
  return (pattern: Pattern = "tap") => {
    if (typeof window === "undefined") return;
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
      if (pattern === "detent" && window.matchMedia?.("(hover: none)").matches) tick();
      return;
    }
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
