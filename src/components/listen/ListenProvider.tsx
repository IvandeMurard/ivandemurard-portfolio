import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { estimateListenSeconds } from "@/content/listenSummaries";
import { useAmbienceOptional } from "@/components/AmbienceProvider";
import { logRoseEvent, type ListenEntry } from "@/components/rose/roseEvents";
import { getSessionId } from "@/components/rose/roseSession";
import { activeWordIndex, sentenceIndexOfWord, sentencesOf, splitWords, type ListenWord } from "@/components/rose/listen/listenAlign";
import { ListenUnavailable, type ListenData } from "@/components/rose/listen/listenClient";
import { ROSE_STATUS } from "@/content/roseStatus";

/**
 * One reader for the whole site. The reading state lives here, above the router, so changing page never cuts the sound:
 * the dock, the ListenRow, the contents line and the index badges only show and drive it. Nothing starts by itself:
 * `start` is called from a click, never from a page load or a route change.
 */

export const SEEK_STEP_MS = 10_000;
export const LISTEN_RATES = [1, 1.25, 1.5] as const;
export type ListenRate = (typeof LISTEN_RATES)[number];

export type ListenRequest = {
  /** "summary:<slug>" or "answer:<message id>": what is being read. */
  id: string;
  kind: "summary" | "answer";
  /** The page title, or "Rose · answer": shown in the mini-player and on the lock screen. */
  title: string;
  /** Where the reading was started from (measurement: a closed list, never content). */
  entry: ListenEntry;
  load: () => Promise<ListenData>;
  /** What the browser's voice reads when there is no generated audio, and what is shown while loading. */
  fallbackText: string;
  /** Open the player panel at once (from the dock) instead of the mini-player (from a page). */
  openPlayer?: boolean;
};

export type ListenControls = {
  current: ListenRequest | null;
  phase: "idle" | "loading" | "ready";
  /** "audio": the generated voice, highlighted word by word. "speech": the browser's voice, highlighted by sentence. */
  engine: "audio" | "speech";
  words: string[];
  /** 72 bars of the real take, or null: the player then draws a progress line. */
  bars: number[] | null;
  durationMs: number;
  playing: boolean;
  ended: boolean;
  rate: ListenRate;
  volume: number;
  muted: boolean;
  /** False on iOS, where the volume cannot be set from the page: the slider is hidden, the mute button stays. */
  volumeSettable: boolean;
  playerOpen: boolean;
  setPlayerOpen: (open: boolean) => void;
  start: (req: ListenRequest) => void;
  toggle: () => void;
  pause: () => void;
  seek: (ms: number) => void;
  skip: (deltaMs: number) => void;
  replay: () => void;
  setRate: (r: ListenRate) => void;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  close: () => void;
  /** First and last word of the part being spoken, from a position; [-1, -1] before the start. */
  activeAt: (positionMs: number) => [number, number];
};

const ControlsContext = createContext<ListenControls | null>(null);
const ClockContext = createContext<number>(0);

/** The provider if there is one: a page rendered alone has none, and shows its transcript only. */
export const useListenOptional = () => useContext(ControlsContext);
export const useListen = (): ListenControls => {
  const c = useContext(ControlsContext);
  if (!c) throw new Error("useListen must be used within ListenProvider");
  return c;
};
/** The playback position in ms. Separate from the controls so a tick does not re-render the whole dock. */
export const useListenPosition = () => useContext(ClockContext);

const isIos = () => {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

type MediaSessionLike = {
  metadata: unknown;
  playbackState: string;
  setActionHandler: (action: string, handler: ((d: { seekTime?: number }) => void) | null) => void;
  setPositionState?: (s?: { duration: number; position: number; playbackRate: number }) => void;
};
const mediaSession = (): MediaSessionLike | null =>
  typeof navigator !== "undefined" && "mediaSession" in navigator ? (navigator as unknown as { mediaSession: MediaSessionLike }).mediaSession : null;

/** The square compass the lock screen and the media keys show. A static file, 512 px. */
export const MEDIA_ARTWORK = "/rose-compass-512.png";

export const ListenProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const ambience = useAmbienceOptional();
  const [current, setCurrent] = useState<ListenRequest | null>(null);
  const [phase, setPhase] = useState<ListenControls["phase"]>("idle");
  const [engine, setEngine] = useState<"audio" | "speech">("audio");
  const [words, setWords] = useState<string[]>([]);
  const [timings, setTimings] = useState<ListenWord[]>([]);
  const [bars, setBars] = useState<number[] | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [rate, setRateState] = useState<ListenRate>(1);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMutedState] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [speechSentence, setSpeechSentence] = useState(0);
  const volumeSettable = useMemo(() => !isIos(), []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reqRef = useRef<ListenRequest | null>(null);
  const token = useRef(0);
  const startedRef = useRef(false);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const speechText = useRef("");
  const sentences = useRef<ReturnType<typeof sentencesOf>>([]);
  const sentenceRef = useRef(0);
  const speechToken = useRef(0);
  const prefs = useRef({ rate: 1 as ListenRate, volume: 1, muted: false });
  prefs.current = { rate, volume, muted };
  const stateRef = useRef({ engine, playing, ended, phase, durationMs, positionMs });
  stateRef.current = { engine, playing, ended, phase, durationMs, positionMs };

  const log = (kind: "listen" | "listen_complete") => {
    const req = reqRef.current;
    if (!req || ROSE_STATUS === "paused") return;
    logRoseEvent({
      session_id: getSessionId(), path: pathRef.current, kind,
      listen_source: req.kind, listen_entry: req.entry,
    });
  };
  const markStarted = () => { if (!startedRef.current) { startedRef.current = true; log("listen"); } };
  const markCompleted = () => { setPlaying(false); setEnded(true); log("listen_complete"); };

  const speechDuration = () => estimateListenSeconds(speechText.current) * 1000;

  // ---- the browser's voice (fallback): one utterance per sentence, highlighted by sentence ----
  const speakFrom = useCallback((index: number, tk = token.current) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) return;
    const st = ++speechToken.current;
    synth.cancel();
    const list = sentences.current;
    const total = Math.max(1, splitWords(speechText.current).length);
    const speakAt = (i: number) => {
      if (st !== speechToken.current || tk !== token.current) return;
      if (i >= list.length) { setPositionMs(speechDuration()); markCompleted(); return; }
      sentenceRef.current = i;
      setSpeechSentence(i);
      setPositionMs(Math.round((list[i].firstWord / total) * speechDuration()));
      const u = new SpeechSynthesisUtterance(list[i].text);
      u.lang = "en-US";
      u.rate = prefs.current.rate;
      u.volume = prefs.current.muted ? 0 : prefs.current.volume;
      u.onend = () => speakAt(i + 1);
      u.onerror = () => { if (st === speechToken.current) setPlaying(false); };
      synth.speak(u);
    };
    markStarted();
    setEnded(false);
    setPlaying(true);
    speakAt(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSpeech = useCallback((text: string, tk: number) => {
    speechText.current = text;
    sentences.current = sentencesOf(text);
    setEngine("speech");
    setWords(splitWords(text));
    setTimings([]);
    setBars(null);
    setDurationMs(estimateListenSeconds(text) * 1000);
    setPositionMs(0);
    setPhase("ready");
    if (typeof window !== "undefined" && window.speechSynthesis) speakFrom(0, tk);
  }, [speakFrom]);

  const teardown = useCallback(() => {
    const a = audioRef.current;
    if (a) { a.onended = null; a.onpause = null; a.onplay = null; a.ontimeupdate = null; a.pause(); }
    audioRef.current = null;
    speechToken.current++;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const begin = useCallback(async (req: ListenRequest, tk: number) => {
    try {
      const data = await req.load();
      if (tk !== token.current) return;
      setEngine("audio");
      setWords(data.words.map((w) => w.w));
      setTimings(data.words);
      setBars(data.bars ?? null);
      setDurationMs(data.durationMs);
      const a = new Audio(data.audioUrl);
      a.preload = "auto";
      a.playbackRate = prefs.current.rate;
      a.volume = prefs.current.volume;
      a.muted = prefs.current.muted;
      audioRef.current = a;
      a.onended = () => { setPositionMs(Math.round(data.durationMs)); markCompleted(); };
      a.onpause = () => setPlaying(false);
      a.onplay = () => { setPlaying(true); setEnded(false); };
      a.ontimeupdate = () => setPositionMs(Math.round(a.currentTime * 1000));
      setPhase("ready");
      // The click that started this may be too old for autoplay: then the reader presses play.
      a.play().then(markStarted).catch(() => {});
    } catch (e) {
      if (tk !== token.current) return;
      if (!(e instanceof ListenUnavailable)) console.warn("[listen] audio failed, reading with the browser voice");
      startSpeech(req.fallbackText, tk);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSpeech]);

  const replay = useCallback(() => {
    const st = stateRef.current;
    if (st.phase !== "ready") return;
    if (st.engine === "audio") {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = 0;
      setPositionMs(0);
      setEnded(false);
      markStarted();
      void a.play().catch(() => {});
    } else {
      setPositionMs(0);
      sentenceRef.current = 0;
      setSpeechSentence(0);
      speakFrom(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakFrom]);

  const pause = useCallback(() => {
    if (stateRef.current.engine === "audio") audioRef.current?.pause();
    else { speechToken.current++; window.speechSynthesis?.cancel(); setPlaying(false); }
  }, []);

  const toggle = useCallback(() => {
    const st = stateRef.current;
    if (st.phase !== "ready") return;
    if (st.ended) return replay();
    if (st.engine === "audio") {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) { markStarted(); void a.play().catch(() => {}); } else a.pause();
    } else if (st.playing) pause();
    else speakFrom(sentenceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause, replay, speakFrom]);

  const seek = useCallback((ms: number) => {
    const st = stateRef.current;
    const clamped = Math.min(Math.max(0, ms), st.durationMs);
    if (st.engine === "audio") {
      const a = audioRef.current;
      if (a) { a.currentTime = clamped / 1000; setPositionMs(clamped); if (clamped < st.durationMs) setEnded(false); }
    } else {
      const list = sentences.current;
      if (!list.length) return;
      const total = Math.max(1, splitWords(speechText.current).length);
      const word = Math.min(total - 1, Math.floor((clamped / Math.max(1, st.durationMs)) * total));
      const i = sentenceIndexOfWord(list, word);
      sentenceRef.current = i;
      setSpeechSentence(i);
      setPositionMs(Math.round((list[i].firstWord / total) * st.durationMs));
      if (st.playing) speakFrom(i);
    }
  }, [speakFrom]);

  const skip = useCallback((delta: number) => seek(stateRef.current.positionMs + delta), [seek]);

  const start = useCallback((req: ListenRequest) => {
    // The same reading again: resume it, never load it twice.
    if (reqRef.current?.id === req.id && stateRef.current.phase !== "idle") {
      if (req.openPlayer) setPlayerOpen(true);
      if (!stateRef.current.playing) toggle();
      return;
    }
    teardown();
    const tk = ++token.current;
    reqRef.current = req;
    startedRef.current = false;
    setCurrent(req);
    setPhase("loading");
    setEngine("audio");
    setWords(splitWords(req.fallbackText));
    setTimings([]);
    setBars(null);
    setPositionMs(0);
    setDurationMs(estimateListenSeconds(req.fallbackText) * 1000);
    setPlaying(false);
    setEnded(false);
    setSpeechSentence(0);
    sentenceRef.current = 0;
    setPlayerOpen(!!req.openPlayer);
    void begin(req, tk);
  }, [begin, teardown, toggle]);

  const close = useCallback(() => {
    token.current++;
    teardown();
    reqRef.current = null;
    setCurrent(null);
    setPhase("idle");
    setPlaying(false);
    setEnded(false);
    setPositionMs(0);
    setPlayerOpen(false);
  }, [teardown]);

  const setRate = useCallback((r: ListenRate) => {
    setRateState(r);
    if (audioRef.current) audioRef.current.playbackRate = r;
  }, []);
  const setVolume = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setVolumeState(next);
    if (audioRef.current) audioRef.current.volume = next;
    if (next > 0) { setMutedState(false); if (audioRef.current) audioRef.current.muted = false; }
  }, []);
  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    if (audioRef.current) audioRef.current.muted = m;
  }, []);

  // Position while the generated voice plays: ten times a second is enough for a word and a bar.
  useEffect(() => {
    if (!playing || engine !== "audio") return;
    const id = window.setInterval(() => {
      const a = audioRef.current;
      if (a) setPositionMs(Math.round(a.currentTime * 1000));
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, engine]);

  // One sound at a time: while Rose has a reading in hand, the record in the header is held; it comes back at the end
  // (or when the reading is closed), if it was playing before. A pause does not bring it back.
  const hold = !!current && !ended && phase !== "idle";
  const setSuspended = ambience?.setSuspended;
  useEffect(() => {
    setSuspended?.(hold);
    return () => setSuspended?.(false);
  }, [hold, setSuspended]);

  // Media Session: the lock screen and the media keys.
  const actions = useRef({ toggle, pause, seek, skip });
  actions.current = { toggle, pause, seek, skip };
  const title = current?.title ?? "";
  useEffect(() => {
    const ms = mediaSession();
    if (!ms || !current) return;
    try {
      const Meta = (globalThis as unknown as { MediaMetadata?: new (init: unknown) => unknown }).MediaMetadata;
      if (Meta) ms.metadata = new Meta({ title, artist: "Rose", album: "ivandemurard.com", artwork: [{ src: MEDIA_ARTWORK, sizes: "512x512", type: "image/png" }] });
      const set = (a: string, h: ((d: { seekTime?: number }) => void) | null) => { try { ms.setActionHandler(a, h); } catch { /* an action this browser lacks */ } };
      set("play", () => { if (!stateRef.current.playing) actions.current.toggle(); });
      set("pause", () => actions.current.pause());
      set("seekbackward", () => actions.current.skip(-SEEK_STEP_MS));
      set("seekforward", () => actions.current.skip(SEEK_STEP_MS));
      set("seekto", (d) => { if (typeof d.seekTime === "number") actions.current.seek(d.seekTime * 1000); });
    } catch { /* never block a reading on the lock screen */ }
    return () => {
      try {
        for (const a of ["play", "pause", "seekbackward", "seekforward", "seekto"]) ms.setActionHandler(a, null);
        ms.metadata = null;
      } catch { /* ignore */ }
    };
  }, [current, title]);
  useEffect(() => {
    const ms = mediaSession();
    if (!ms || !current) return;
    try {
      ms.playbackState = playing ? "playing" : "paused";
      if (phase === "ready" && durationMs > 0) ms.setPositionState?.({ duration: durationMs / 1000, position: Math.min(positionMs, durationMs) / 1000, playbackRate: rate });
    } catch { /* ignore */ }
    // The position is pushed on play, pause and seek, not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, phase, current, durationMs, rate]);

  // The sound is the site's, not the page's: it stops only when the reader closes it or leaves the site.
  useEffect(() => () => { token.current++; teardown(); }, [teardown]);

  const activeAt = useCallback((ms: number): [number, number] => {
    if (phase !== "ready") return [-1, -1];
    if (engine === "audio") {
      const i = ms > 0 || playing ? activeWordIndex(timings, ms) : -1;
      return [i, i];
    }
    if (playing || ms > 0) {
      const s = sentences.current[speechSentence];
      if (s) return [s.firstWord, s.firstWord + s.wordCount - 1];
    }
    return [-1, -1];
  }, [phase, engine, playing, timings, speechSentence]);

  const value = useMemo<ListenControls>(() => ({
    current, phase, engine, words, bars, durationMs, playing, ended, rate, volume, muted, volumeSettable, playerOpen, setPlayerOpen,
    start, toggle, pause, seek, skip, replay, setRate, setVolume, setMuted, close, activeAt,
  }), [current, phase, engine, words, bars, durationMs, playing, ended, rate, volume, muted, volumeSettable, playerOpen, start, toggle, pause, seek, skip, replay, setRate, setVolume, setMuted, close, activeAt]);

  return (
    <ControlsContext.Provider value={value}>
      <ClockContext.Provider value={positionMs}>{children}</ClockContext.Provider>
    </ControlsContext.Provider>
  );
};

export default ListenProvider;
