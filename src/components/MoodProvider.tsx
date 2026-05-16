import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mood = "day" | "dusk";

interface MoodContextValue {
  mood: Mood;
  setMood: (m: Mood) => void;
  toggle: () => void;
  preview: Mood | null;
  setPreview: (m: Mood | null) => void;
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
  const [preview, setPreviewState] = useState<Mood | null>(null);

  // Persist only the real mood.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mood);
    } catch {
      // ignore
    }
  }, [mood]);

  // Apply preview if set, otherwise the real mood.
  useEffect(() => {
    document.documentElement.dataset.mood = preview ?? mood;
  }, [mood, preview]);

  const setMood = (m: Mood) => setMoodState(m);
  const toggle = () => setMoodState((m) => (m === "day" ? "dusk" : "day"));
  const setPreview = (m: Mood | null) => setPreviewState(m);

  return (
    <MoodContext.Provider value={{ mood, setMood, toggle, preview, setPreview }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within MoodProvider");
  return ctx;
};
