import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mood = "day" | "dusk";

interface MoodContextValue {
  mood: Mood;
  setMood: (m: Mood) => void;
  toggle: () => void;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

const STORAGE_KEY = "mood";

const readInitialMood = (): Mood => {
  if (typeof window === "undefined") return "day";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "day" || stored === "dusk") return stored;
  } catch {
    // ignore
  }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dusk";
  return "day";
};

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [mood, setMoodState] = useState<Mood>(() => readInitialMood());

  useEffect(() => {
    document.documentElement.dataset.mood = mood;
    try {
      window.localStorage.setItem(STORAGE_KEY, mood);
    } catch {
      // ignore
    }
  }, [mood]);

  const setMood = (m: Mood) => setMoodState(m);
  const toggle = () => setMoodState((m) => (m === "day" ? "dusk" : "day"));

  return <MoodContext.Provider value={{ mood, setMood, toggle }}>{children}</MoodContext.Provider>;
};

export const useMood = () => {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within MoodProvider");
  return ctx;
};
