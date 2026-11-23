import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useMood } from "./MoodProvider";
import { MusicOutput } from "@/lib/musicOutput";
import soundtrack from "@/assets/dusk.mp3.asset.json";

/**
 * AmbienceProvider
 *
 * Plays a soundtrack bound to the day/dusk mood toggle:
 *  - day  → /audio/day.mp3   (smooth Brazilian downtempo register)
 *  - dusk → /audio/dusk.mp3  (instrumental hip hop, Odetta "ATCQ Tribute")
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
  /** True while another sound (Rose reading aloud) holds the record. Not persisted: `muted` is untouched, so the record comes back as it was. */
  suspended: boolean;
  setSuspended: (s: boolean) => void;
  /** Toggle mute. First call also acts as the user-gesture unlock. */
  toggleMute: () => void;
  /** Playback rate, 1 = nominal. Pitch follows speed (no timestretch). */
  pitch: number;
  setPitch: (p: number) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const AmbienceContext = createContext<AmbienceContextValue | undefined>(undefined);

const STORAGE_KEY = "ambience-muted";
const FADE_MS = 800;
const TARGET_VOLUME = 0.55;
export const PITCH_RANGE = 0.08;
// Day mode uses the same track as dusk (single soundtrack).
export const AMBIENCE_SRC = soundtrack.url;
const DAY_SRC = AMBIENCE_SRC;
const DUSK_SRC = AMBIENCE_SRC;

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
  const [suspended, setSuspended] = useState(false);
  const [pitch, setPitchState] = useState(1);
  const [volume, setVolumeState] = useState(TARGET_VOLUME);
  const volumeRef = useRef(TARGET_VOLUME);
  const outputRef = useRef<MusicOutput | null>(null);
  const [unlocked, setUnlocked] = useState(false);

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

    // Connect once; resume and first play are still unlocked synchronously by the reader's tap.
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    try {
      outputRef.current = new MusicOutput(Ctx ? new Ctx() : null, [day, dusk]);
      setUnlocked(true);
    } catch {
      setMuted(true);
    }

    Promise.all([checkAvailable(DAY_SRC), checkAvailable(DUSK_SRC)]).then(([d, k]) => {
      if (cancelled) return;
      setAvailable(d && k);
    });

    return () => {
      cancelled = true;
      day.pause();
      dusk.pause();
      outputRef.current?.close();
      outputRef.current = null;
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
    if (!available || !unlocked) return;
    const day = dayRef.current;
    const dusk = duskRef.current;
    if (!day || !dusk) return;

    const output = outputRef.current;
    if (!output) return;
    let cancelled = false;
    output.level(0, 0);
    day.pause();
    if (muted || suspended) {
      output.level(1, 0, FADE_MS / 1000);
      const timer = window.setTimeout(() => dusk.pause(), FADE_MS);
      return () => window.clearTimeout(timer);
    }
    void output.resume().then(() => dusk.play()).then(() => {
      if (!cancelled) output.level(1, volumeRef.current, FADE_MS / 1000);
    }).catch(() => { if (!cancelled) setMuted(true); });
    return () => { cancelled = true; };
  }, [mood, muted, suspended, available, unlocked]);

  // Live volume while playing.
  useEffect(() => {
    volumeRef.current = volume;
    if (!muted && !suspended) outputRef.current?.level(1, volume, 0.03);
  }, [volume, muted, suspended]);

  // Analog pitch: speed and key move together, like a real platter.
  useEffect(() => {
    [dayRef.current, duskRef.current].forEach((el) => {
      if (!el) return;
      const a = el as HTMLAudioElement & { mozPreservesPitch?: boolean; webkitPreservesPitch?: boolean };
      a.preservesPitch = false;
      a.mozPreservesPitch = false;
      a.webkitPreservesPitch = false;
      el.playbackRate = pitch;
    });
  }, [pitch, available]);

  const toggleMute = useCallback(() => {
    const day = dayRef.current;
    const dusk = duskRef.current;
    if (!day || !dusk) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      outputRef.current ??= new MusicOutput(Ctx ? new Ctx() : null, [day, dusk]);
      // Both calls happen during the tap, before React effects or promises, for iOS gesture policy.
      void outputRef.current.resume().catch(() => setMuted(true));
      if (muted && !suspended) void dusk.play().catch(() => setMuted(true));
      setUnlocked(true);
    } catch {
      setMuted(true);
      return;
    }
    setMuted((m) => !m);
  }, [muted, suspended]);

  const setPitch = useCallback((p: number) => {
    setPitchState(Math.max(1 - PITCH_RANGE, Math.min(1 + PITCH_RANGE, p)));
  }, []);
  const setVolume = useCallback((v: number) => setVolumeState(Math.max(0, Math.min(1, v))), []);

  return (
    <AmbienceContext.Provider value={{ muted, suspended, setSuspended, available, toggleMute, pitch, setPitch, volume, setVolume }}>
      {children}
    </AmbienceContext.Provider>
  );
};

/** The ambience context if there is one (a dock rendered alone has none). */
export const useAmbienceOptional = () => useContext(AmbienceContext);

export const useAmbience = () => {
  const ctx = useContext(AmbienceContext);
  if (!ctx) throw new Error("useAmbience must be used within AmbienceProvider");
  return ctx;
};
