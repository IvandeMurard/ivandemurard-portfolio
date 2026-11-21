/** Pure helpers of the Listen audiogram: which word is spoken, the sentences of the speech fallback, the waveform. */
import type { ListenWord } from "../../../../supabase/functions/_shared/listen-core";

export type { ListenWord };

/** Index of the word being spoken at `ms`: the last word that has started. -1 before the first word. */
export const activeWordIndex = (words: ListenWord[], ms: number): number => {
  let lo = 0, hi = words.length - 1, found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].s <= ms) { found = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return found;
};

/** Words of a plain text, for the speech fallback and for texts without timings. Same split as the timings (whitespace). */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);

/** Sentences with the index of their first word, for the speech fallback: highlighting is by sentence there. */
export const sentencesOf = (text: string): { text: string; firstWord: number; wordCount: number }[] => {
  const out: { text: string; firstWord: number; wordCount: number }[] = [];
  let first = 0;
  for (const piece of text.split(/(?<=[.!?])\s+/)) {
    const n = splitWords(piece).length;
    if (!n) continue;
    out.push({ text: piece.trim(), firstWord: first, wordCount: n });
    first += n;
  }
  return out;
};

/** Which sentence holds the word. */
export const sentenceIndexOfWord = (sentences: { firstWord: number; wordCount: number }[], word: number): number =>
  Math.max(0, sentences.findIndex((s) => word >= s.firstWord && word < s.firstWord + s.wordCount));

/** n bars from decoded samples, each the peak of its slice, scaled 0.12 to 1 so a quiet bar stays visible. */
export const waveformPeaks = (samples: Float32Array, n: number): number[] => {
  if (!samples.length) return Array.from({ length: n }, () => 0.12);
  const size = Math.max(1, Math.floor(samples.length / n));
  const peaks: number[] = [];
  for (let i = 0; i < n; i++) {
    let max = 0;
    for (let j = i * size; j < Math.min(samples.length, (i + 1) * size); j++) max = Math.max(max, Math.abs(samples[j]));
    peaks.push(max);
  }
  const top = Math.max(...peaks, 1e-6);
  return peaks.map((p) => Math.max(0.12, p / top));
};

/** Bars used when the audio cannot be decoded (or when the voice is the browser's): flat, so the bar only shows progress. */
export const flatPeaks = (n: number): number[] => Array.from({ length: n }, () => 0.35);

export const formatClock = (ms: number): string => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Position after a key press on the waveform: arrows step 5 s, Home and End jump. null = not a seek key. */
export const seekFromKey = (key: string, ms: number, durationMs: number): number | null => {
  const clamp = (v: number) => Math.min(durationMs, Math.max(0, v));
  if (key === "ArrowRight" || key === "ArrowUp") return clamp(ms + 5000);
  if (key === "ArrowLeft" || key === "ArrowDown") return clamp(ms - 5000);
  if (key === "Home") return 0;
  if (key === "End") return durationMs;
  return null;
};
