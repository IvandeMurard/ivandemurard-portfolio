import { useCallback, useEffect, useRef, useState } from "react";
import { estimateListenSeconds } from "@/content/listenSummaries";
import { flatPeaks, sentenceIndexOfWord, sentencesOf, splitWords, waveformPeaks, activeWordIndex, type ListenWord } from "./listenAlign";
import { ListenUnavailable, type ListenData } from "./listenClient";

export const PEAK_COUNT = 56;

export type ListenPlayer = {
  phase: "loading" | "ready";
  /** "audio": the generated voice, highlighted word by word. "speech": the browser's voice, highlighted by sentence. */
  engine: "audio" | "speech";
  words: string[];
  peaks: number[];
  positionMs: number;
  durationMs: number;
  playing: boolean;
  /** First and last word of the part being spoken; [-1, -1] before the start. */
  active: [number, number];
  toggle: () => void;
  pause: () => void;
  seek: (ms: number) => void;
  restart: () => void;
};

type Options = {
  load: () => Promise<ListenData>;
  /** Spoken by the browser when `load` fails. */
  fallbackText: string;
  onStart?: () => void;
  onComplete?: () => void;
  /** With reduced motion the position is refreshed a few times a second instead of every frame. */
  reducedMotion?: boolean;
};

const decodePeaks = async (url: string): Promise<number[]> => {
  const Ctx = typeof window !== "undefined" ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) : undefined;
  if (!Ctx) return flatPeaks(PEAK_COUNT);
  const ctx = new Ctx();
  try {
    const buf = await (await fetch(url)).arrayBuffer();
    const audio = await ctx.decodeAudioData(buf);
    return waveformPeaks(audio.getChannelData(0), PEAK_COUNT);
  } catch {
    return flatPeaks(PEAK_COUNT);
  } finally {
    void ctx.close?.();
  }
};

export const useListenPlayer = ({ load, fallbackText, onStart, onComplete, reducedMotion = false }: Options): ListenPlayer => {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [engine, setEngine] = useState<"audio" | "speech">("audio");
  const [words, setWords] = useState<string[]>([]);
  const [timings, setTimings] = useState<ListenWord[]>([]);
  const [peaks, setPeaks] = useState<number[]>(() => flatPeaks(PEAK_COUNT));
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speechSentence, setSpeechSentence] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const cb = useRef({ onStart, onComplete });
  cb.current = { onStart, onComplete };
  const speechText = useRef(fallbackText);
  const sentences = useRef(sentencesOf(fallbackText));
  const sentenceRef = useRef(0);
  const speechToken = useRef(0);

  const started = () => { if (!startedRef.current) { startedRef.current = true; cb.current.onStart?.(); } };
  const completed = () => { setPlaying(false); cb.current.onComplete?.(); };

  // ---- the browser's voice (fallback): one utterance per sentence, highlighted by sentence ----
  const speakFrom = useCallback((index: number) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) return;
    const token = ++speechToken.current;
    synth.cancel();
    const list = sentences.current;
    const speakAt = (i: number) => {
      if (token !== speechToken.current) return;
      if (i >= list.length) { sentenceRef.current = 0; setSpeechSentence(0); setPositionMs(0); completed(); return; }
      sentenceRef.current = i;
      setSpeechSentence(i);
      setPositionMs(Math.round((list[i].firstWord / Math.max(1, splitWords(speechText.current).length)) * speechDuration()));
      const u = new SpeechSynthesisUtterance(list[i].text);
      u.lang = "en-US";
      u.onend = () => speakAt(i + 1);
      u.onerror = () => { if (token === speechToken.current) setPlaying(false); };
      synth.speak(u);
    };
    started();
    setPlaying(true);
    speakAt(index);
     
  }, []);
  const speechDuration = () => estimateListenSeconds(speechText.current) * 1000;

  const startSpeech = useCallback((text: string) => {
    speechText.current = text;
    sentences.current = sentencesOf(text);
    setEngine("speech");
    setWords(splitWords(text));
    setTimings([]);
    setPeaks(flatPeaks(PEAK_COUNT));
    setDurationMs(estimateListenSeconds(text) * 1000);
    setPositionMs(0);
    setPhase("ready");
    if (typeof window !== "undefined" && window.speechSynthesis) speakFrom(0);
  }, [speakFrom]);

  // ---- load: the generated voice, or the browser's when it is not available ----
  useEffect(() => {
    let dead = false;
    startedRef.current = false;
    (async () => {
      try {
        const data = await load();
        if (dead) return;
        setEngine("audio");
        setWords(data.words.map((w) => w.w));
        setTimings(data.words);
        setDurationMs(data.durationMs);
        const a = new Audio(data.audioUrl);
        a.preload = "auto";
        audioRef.current = a;
        a.onended = () => { setPositionMs(0); a.currentTime = 0; completed(); };
        a.onpause = () => setPlaying(false);
        a.onplay = () => setPlaying(true);
        a.ontimeupdate = () => setPositionMs(Math.round(a.currentTime * 1000));
        setPhase("ready");
        void decodePeaks(data.audioUrl).then((p) => { if (!dead) setPeaks(p); });
        // The click that opened the player may be too old for autoplay: then the reader presses play.
        a.play().then(started).catch(() => {});
      } catch (e) {
        if (dead) return;
        if (!(e instanceof ListenUnavailable)) console.warn("[listen] audio failed, reading with the browser voice");
        startSpeech(fallbackText);
      }
    })();
    return () => {
      dead = true;
      audioRef.current?.pause();
      audioRef.current = null;
      speechToken.current++;
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
    // The reading is loaded once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth position while the generated voice plays (a few updates a second under reduced motion: timeupdate only).
  useEffect(() => {
    const a = audioRef.current;
    if (!playing || engine !== "audio" || !a || reducedMotion) return;
    let raf = 0;
    const tick = () => { setPositionMs(Math.round(a.currentTime * 1000)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, engine, reducedMotion]);

  const pause = useCallback(() => {
    if (engine === "audio") audioRef.current?.pause();
    else { speechToken.current++; window.speechSynthesis?.cancel(); setPlaying(false); }
  }, [engine]);

  const toggle = useCallback(() => {
    if (phase !== "ready") return;
    if (engine === "audio") {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) { started(); void a.play().catch(() => {}); } else a.pause();
    } else if (playing) pause();
    else speakFrom(sentenceRef.current);
     
  }, [phase, engine, playing, pause, speakFrom]);

  const seek = useCallback((ms: number) => {
    const clamped = Math.min(Math.max(0, ms), durationMs);
    if (engine === "audio") {
      const a = audioRef.current;
      if (a) { a.currentTime = clamped / 1000; setPositionMs(clamped); }
    } else {
      const list = sentences.current;
      const total = Math.max(1, splitWords(speechText.current).length);
      const word = Math.min(total - 1, Math.floor((clamped / Math.max(1, durationMs)) * total));
      const i = sentenceIndexOfWord(list, word);
      sentenceRef.current = i;
      setSpeechSentence(i);
      setPositionMs(Math.round((list[i].firstWord / total) * durationMs));
      if (playing) speakFrom(i);
    }
  }, [engine, durationMs, playing, speakFrom]);

  const restart = useCallback(() => {
    seek(0);
    if (engine === "audio") { const a = audioRef.current; if (a?.paused) { started(); void a.play().catch(() => {}); } }
    else if (!playing) speakFrom(0);
     
  }, [seek, engine, playing, speakFrom]);

  let active: [number, number] = [-1, -1];
  if (phase === "ready") {
    if (engine === "audio") {
      const i = positionMs > 0 || playing ? activeWordIndex(timings, positionMs) : -1;
      active = [i, i];
    } else if (playing || positionMs > 0) {
      const s = sentences.current[speechSentence];
      if (s) active = [s.firstWord, s.firstWord + s.wordCount - 1];
    }
  }

  return { phase, engine, words, peaks, positionMs, durationMs, playing, active, toggle, pause, seek, restart };
};
