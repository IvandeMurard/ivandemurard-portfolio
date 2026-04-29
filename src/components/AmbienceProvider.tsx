import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useMood } from "./MoodProvider";

/**
 * AmbienceProvider
 *
 * Plays a soundtrack bound to the day/dusk mood toggle:
 *  - day  → /audio/day.mp3   (smooth Brazilian downtempo register)
 *  - dusk → /audio/dusk.mp3  (uptempo UK new-jazz / soul register)
 *
 * Playback rules:
 *  - Off by default. First play requires a user gesture (browser policy + tasteful default).
 *  - Mute state persisted in localStorage.
 *  - When the user unmutes, the current mood's track fades in.
 *  - Switching mood while unmuted crossfades between tracks.
 *  - If a track file is missing (404 / decode error), the control hides itself gracefully.
 */

type AmbienceContextValue = {
  /** True when the user has explicitly muted (or never unmuted yet). */
  muted: boolean;
  /** True when both audio elements are confirmed available. Hide the UI when false. */
  available: boolean;
  /** Toggle mute. First call also acts as the user-gesture unlock. */
  toggleMute: () => void;
};

const AmbienceContext = createContext<AmbienceContextValue | undefined>(undefined);

const STORAGE_KEY = "ambience-muted";
const FADE_MS = 800;
const TARGET_VOLUME = 0.55;
const DAY_SRC = "/audio/day.mp3";
const DUSK_SRC = "/audio/dusk.mp3";

const readInitialMuted = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "false") return false;
  } catch {
    // ignore
  }
  return true; // default: muted
};

/** Animate audio volume to `target` over `duration` ms. Resolves when done. */
const fadeVolume = (el: HTMLAudioElement, target: number, duration: number) => {
  return new Promise<void>((resolve) => {
    const start = el.volume;
    const delta = target - start;
    if (Math.abs(delta) < 0.01 || duration <= 0) {
      el.volume = target;
      resolve();
      return;
    }
    const startedAt = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      // ease-in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      el.volume = Math.max(0, Math.min(1, start + delta * eased));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    raf = requestAnimationFrame(step);
    // safety cleanup
    setTimeout(() => cancelAnimationFrame(raf), duration + 200);
  });
};

/** HEAD-check a static asset. Returns true if it responds 200-299. */
const checkAvailable = async (url: string) => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

export const AmbienceProvider = ({ children }: { children: ReactNode }) => {
  const { mood } = useMood();
  const [muted, setMuted] = useState<boolean>(() => readInitialMuted());
  const [available, setAvailable] = useState<boolean>(false);

  const dayRef = useRef<HTMLAudioElement | null>(null);
  const duskRef = useRef<HTMLAudioElement | null>(null);

  // Create audio elements once and probe availability.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const day = new Audio();
    day.src = DAY_SRC;
    day.loop = true;
    day.preload = "none";
    day.volume = 0;
    dayRef.current = day;

    const dusk = new Audio();
    dusk.src = DUSK_SRC;
    dusk.loop = true;
    dusk.preload = "none";
    dusk.volume = 0;
    duskRef.current = dusk;

    Promise.all([checkAvailable(DAY_SRC), checkAvailable(DUSK_SRC)]).then(([d, k]) => {
      if (cancelled) return;
      setAvailable(d && k);
    });

    return () => {
      cancelled = true;
      day.pause();
      dusk.pause();
      dayRef.current = null;
      duskRef.current = null;
    };
  }, []);

  // Persist mute state.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, muted ? "true" : "false");
    } catch {
      // ignore
    }
  }, [muted]);

  // React to mood + mute changes: pick which track plays, crossfade, fade to mute.
  useEffect(() => {
    if (!available) return;
    const day = dayRef.current;
    const dusk = duskRef.current;
    if (!day || !dusk) return;

    const active = mood === "day" ? day : dusk;
    const inactive = mood === "day" ? dusk : day;

    const run = async () => {
      if (muted) {
        // Fade everything down, then pause.
        await Promise.all([fadeVolume(day, 0, FADE_MS), fadeVolume(dusk, 0, FADE_MS)]);
        day.pause();
        dusk.pause();
        return;
      }

      // Unmuted: start active track, fade in. Crossfade out the other if it was playing.
      try {
        if (active.paused) {
          active.currentTime = active.currentTime || 0;
          await active.play();
        }
      } catch {
        // Autoplay blocked or decode error. Bail out silently; the user can re-tap mute.
        return;
      }

      const fades: Promise<void>[] = [fadeVolume(active, TARGET_VOLUME, FADE_MS)];
      if (!inactive.paused) {
        fades.push(fadeVolume(inactive, 0, FADE_MS).then(() => inactive.pause()));
      }
      await Promise.all(fades);
    };

    run();
  }, [mood, muted, available]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  return (
    <AmbienceContext.Provider value={{ muted, available, toggleMute }}>
      {children}
    </AmbienceContext.Provider>
  );
};

export const useAmbience = () => {
  const ctx = useContext(AmbienceContext);
  if (!ctx) throw new Error("useAmbience must be used within AmbienceProvider");
  return ctx;
};
