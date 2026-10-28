import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Kinetic storytelling primitives for the Rose case study (design lab only).
 * Rules: living micro-environments instead of static captures, sticky
 * scroll-driven scenes that never hold the scroll, morphing rather than
 * popping, and one ambient Rose who reads along and marks the page herself.
 * Monochrome tokens only: no glow, no neon, no blinking. Everything degrades
 * to a static, readable state with reduced motion.
 */

const EASE = "cubic-bezier(.2,.7,.1,1)";

/* ---------------- Rose's gesture: one active intervention at a time ----------------
 * A gesture appears when its passage enters the reading zone, marks it, says one
 * dry sentence, then vanishes entirely once the reader moves on. No residue, no
 * chip, no second interface: the dock stays the only place to talk to Rose.
 * Notes are relief and wit only; anything needed to understand the page is Ivan's text. */
let currentCue: string | null = null;
const cueSubs = new Set<() => void>();
const subscribeCue = (f: () => void) => { cueSubs.add(f); return () => { cueSubs.delete(f); }; };
const setCue = (id: string | null) => {
  if (currentCue === id) return;
  currentCue = id;
  cueSubs.forEach((f) => f());
};
const releaseCue = (id: string) => { if (currentCue === id) setCue(null); };
export const useCueActive = (id?: string) => useSyncExternalStore(subscribeCue, () => !!id && currentCue === id, () => false);
/** Kept for compatibility: a mark tied to a cue is drawn only while that cue is active. */
export const useCueReached = useCueActive;

const READING_ZONE = "-30% 0px -40% 0px";

/** The copper compass tip Rose points with. Desktop only; mobile gets an inline mark. */
const RoseTip = ({ on, reduced }: { on: boolean; reduced: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 12 12" className="hidden h-3 w-3 shrink-0 text-secondary md:block"
    style={{ opacity: on ? 1 : 0, transform: on ? "translateX(0) rotate(45deg)" : "translateX(-28px) rotate(0deg)", transition: reduced ? "none" : `opacity 400ms ease, transform 900ms ${EASE}` }}>
    <path d="M6 0 L8 6 L6 12 L4 6 Z" fill="currentColor" />
  </svg>
);

const useGesture = (id: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useCueActive(id);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCue(id); else releaseCue(id); }, { rootMargin: READING_ZONE });
    io.observe(el);
    return () => { io.disconnect(); releaseCue(id); };
  }, [id]);
  return { ref, active };
};

const useReducedMotion = () => useSyncExternalStore(
  (f) => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); m.addEventListener("change", f); return () => m.removeEventListener("change", f); },
  () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  () => false,
);

const GestureNote = ({ on, reduced, children }: { on: boolean; reduced: boolean; children: ReactNode }) => (
  <div className="flex items-center gap-3" aria-hidden={!on}>
    <RoseTip on={on} reduced={reduced} />
    <span aria-hidden="true" className="hidden h-px w-10 shrink-0 origin-left bg-secondary md:block"
      style={{ transform: `scaleX(${on ? 1 : 0})`, transition: reduced ? "none" : `transform 700ms ${EASE} ${on ? 250 : 0}ms` }} />
    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-secondary md:hidden" style={{ opacity: on ? 1 : 0, transition: reduced ? "none" : "opacity 300ms ease" }} />
    <p className="font-headline text-lg italic leading-snug text-primary"
      style={{ opacity: on ? 1 : 0, transform: on || reduced ? "none" : "translateY(4px)", transition: reduced ? "none" : `opacity ${on ? 600 : 350}ms ease ${on ? 550 : 0}ms, transform 800ms ${EASE} ${on ? 550 : 0}ms` }}>
      {children}
    </p>
  </div>
);

/** An anchor in the reading flow where Rose briefly points, then lets go. */
export const RoseCue = ({ id, note, className }: { id: string; note: string; className?: string }) => {
  const { ref, active } = useGesture(id);
  const reduced = useReducedMotion();
  return (
    <div ref={ref} data-rose-cue={id} role="note" aria-label="Rose" aria-live="polite" className={cn("min-h-[1.75rem]", className)}
      style={{ visibility: active || !reduced ? "visible" : "hidden" }}>
      <GestureNote on={active} reduced={reduced}>{active ? note : <span className="invisible">{note}</span>}</GestureNote>
    </div>
  );
};

export const useScrollProgress = (ref: RefObject<HTMLElement>) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const v = span <= 0 ? (r.top < 0 ? 1 : 0) : -r.top / span;
      setP(Math.min(1, Math.max(0, v)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [ref]);
  return p;
};

export const useInView = <T extends HTMLElement>(margin = "-20% 0px -20% 0px") => {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin, seen]);
  return { ref, seen };
};

const scrollToFraction = (el: HTMLElement | null, f: number) => {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const span = el.offsetHeight - window.innerHeight;
  window.scrollTo({ top: top + Math.max(0, span) * f + 2, behavior: "smooth" });
};

/* ---------------- Rose marks: pencil gestures on the page ---------------- */
type MarkKind = "underline" | "circle" | "bracket";
const MARK_PATH: Record<MarkKind, string> = {
  underline: "M2 7 C 30 4, 60 9, 98 5",
  circle: "M50 3 C 82 2, 98 10, 97 20 C 96 31, 70 37, 46 36 C 18 35, 2 28, 3 18 C 4 8, 26 3, 56 5",
  bracket: "M6 2 C 2 2, 2 2, 2 8 L 2 32 C 2 38, 2 38, 6 38",
};

/** A mark is never drawn in advance: it appears when Rose reaches its cue (or when a scene drives it). */
export const RoseMark = ({ children, kind = "underline", active, reduced, delay = 600, cue }: { children: ReactNode; kind?: MarkKind; active?: boolean; reduced?: boolean; delay?: number; cue?: string }) => {
  const { ref } = useInView<HTMLSpanElement>();
  const reached = useCueReached(cue);
  const on = (active ?? reached) || !!reduced;
  if (kind === "underline") {
    // A pencil underline that wraps with the text across lines.
    return (
      <span ref={ref} className="box-decoration-clone bg-no-repeat pb-0.5"
        style={{ backgroundImage: "linear-gradient(hsl(var(--secondary) / 0.75), hsl(var(--secondary) / 0.75))", backgroundPosition: "0 100%", backgroundSize: on ? "100% 1.5px" : "0% 1.5px", transition: reduced ? "none" : `background-size 1100ms ${EASE} ${delay}ms` }}>
        {children}
      </span>
    );
  }
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      <svg aria-hidden="true" viewBox={kind === "bracket" ? "0 0 8 40" : "0 0 100 40"} preserveAspectRatio="none"
        className={cn("pointer-events-none absolute overflow-visible text-secondary", kind === "circle" ? "-inset-x-2.5 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1.25rem)]" : "-left-3 top-0 h-full w-2")}>
        <path d={MARK_PATH[kind]} pathLength={1} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" strokeLinecap="round"
          style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: reduced ? "none" : `stroke-dashoffset 1100ms ${EASE} ${delay}ms` }} />
      </svg>
    </span>
  );
};

/* A margin note from Rose: a hairline draws towards it, then the words settle. */
export const RoseAside = ({ children, reduced, className }: { children: ReactNode; reduced?: boolean; className?: string }) => {
  const { ref, seen } = useInView<HTMLDivElement>("-25% 0px -25% 0px");
  const on = seen || reduced;
  return (
    <div ref={ref} role="note" aria-label="Rose's annotation" className={cn("flex max-w-md items-start gap-3", className)}>
      <span aria-hidden="true" className="mt-3 h-px w-10 shrink-0 origin-left bg-secondary" style={{ transform: `scaleX(${on ? 1 : 0})`, transition: reduced ? "none" : `transform 700ms ${EASE}` }} />
      <p className="font-headline text-lg italic leading-snug text-primary" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(6px)", transition: reduced ? "none" : `opacity 600ms ease 450ms, transform 800ms ${EASE} 450ms` }}>
        <span className="mr-2 not-italic font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Rose</span>{children}
      </p>
    </div>
  );
};

/* Bridges trace their line when reached; the compass turns to the next heading. */
export const KineticBridge = ({ from, to, heading, compass, reduced }: { from: string; to: string; heading: number; compass: (h: number) => ReactNode; reduced: boolean }) => {
  const { ref, seen } = useInView<HTMLDivElement>("-30% 0px -30% 0px");
  const on = seen || reduced;
  const line = (origin: string) => <span className={cn("h-px flex-1 bg-outline-variant", origin)} style={{ transform: `scaleX(${on ? 1 : 0})`, transition: reduced ? "none" : `transform 1200ms ${EASE}` }} />;
  return (
    <div ref={ref} aria-hidden="true" className="mx-auto flex max-w-5xl items-center gap-4 py-14 text-on-surface-variant md:py-20">
      {line("origin-right")}
      <div className="flex items-center gap-3">
        <span className="font-label text-[10px] uppercase tracking-[0.16em]">{from}</span>
        <span className="h-8 w-8 text-secondary">{compass(on ? heading : heading - 90)}</span>
        <span className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary" style={{ opacity: on ? 1 : 0.2, transition: "opacity 900ms ease 500ms" }}>{to}</span>
      </div>
      {line("origin-left")}
    </div>
  );
};

/* ---------------- Sticky scene: the dock morphs through four versions ---------------- */
type Iteration = { date: string; title: string; source: string; problem: string; decision: string; result: string };

export const DockScene = ({ iterations, reduced }: { iterations: Iteration[]; reduced: boolean }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(wrap);
  const step = Math.min(iterations.length - 1, Math.floor(p * iterations.length));
  const it = iterations[step];
  const t = reduced ? "none" : `all 900ms ${EASE}`;
  const chips = step === 0 ? ["Product expertise", "Technical profile", "Culture fit", "Just exploring"] : ["What has actually been built?", "What happens when it's wrong?"];
  return (
    <figure ref={wrap} aria-labelledby="ux-evolution-caption" className="relative mt-10" style={{ height: `${iterations.length * 50 + 40}vh` }}>
      <div className="sticky top-24 grid min-h-[calc(100vh-8rem)] content-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
        <div>
          <figcaption id="ux-evolution-caption" className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Code-led interface reconstruction · scroll to replay four versions</figcaption>
          <ol className="mt-5 flex gap-2" aria-label="Versions">
            {iterations.map((x, i) => (
              <li key={x.source} className="flex-1">
                <button type="button" onClick={() => scrollToFraction(wrap.current, (i + 0.5) / iterations.length)} aria-current={i === step ? "step" : undefined}
                  className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
                  <span className="block h-px w-full bg-outline-variant"><span className="block h-px origin-left bg-secondary" style={{ transform: `scaleX(${i < step ? 1 : i === step ? Math.min(1, p * iterations.length - i) : 0})`, transition: reduced ? "none" : "transform 200ms linear" }} /></span>
                  <span className={cn("mt-2 block font-label text-[10px] uppercase tracking-[0.16em] transition-colors", i === step ? "text-secondary" : "text-on-surface-variant group-hover:text-primary")}>{x.date}</span>
                </button>
              </li>
            ))}
          </ol>
          <div key={step} aria-live="polite" className={cn(!reduced && "animate-in fade-in slide-in-from-bottom-2 duration-700")}>
            <h3 className="mt-8 font-headline text-3xl leading-tight text-primary md:text-4xl">{it.title}</h3>
            <dl className="mt-6 space-y-4 font-body text-sm leading-relaxed text-on-surface md:text-base">
              <div><dt className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Problem</dt><dd className="mt-1">{it.problem}</dd></div>
              <div><dt className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">What changed</dt><dd className="mt-1">{it.decision}</dd></div>
              <div><dt className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Decision</dt><dd className="mt-1 font-headline text-lg italic text-primary">{it.result}</dd></div>
            </dl>
            <p className="mt-5 font-label text-[10px] text-on-surface-variant">Commit {it.source}</p>
          </div>
        </div>

        {/* A miniature page: the reading surface stays still while the dock changes shape. */}
        <div aria-hidden="true" className="relative aspect-[4/3] overflow-hidden rounded-xl border border-outline-variant bg-surface" style={{ transition: t }}>
          <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
            <span className="font-headline text-sm italic text-primary">Ivan de Murard</span>
            <div className="flex items-center gap-4 font-label text-[9px] uppercase tracking-[0.14em] text-on-surface-variant">
              <span>Work</span><span>Field Notes</span>
              <span className="rounded-full border border-secondary px-2.5 py-1 text-secondary"
                style={{ opacity: step === 2 ? 1 : 0, transform: step === 2 ? "none" : "translateY(-6px) scale(.9)", transition: t }}>Ask Rose</span>
            </div>
          </div>
          <div className="px-8 pt-7">
            <p className="font-label text-[9px] uppercase tracking-[0.18em] text-secondary">Case study · Aetherix</p>
            <p className="mt-2 font-headline text-2xl leading-tight text-primary">Forecasting tomorrow's workload.</p>
            <p className="mt-3 font-body text-[11px] leading-relaxed text-on-surface">
              Aetherix estimates demand so a manager can staff ahead. It is evaluated against{" "}
              <span className="bg-no-repeat" style={{ backgroundImage: "linear-gradient(hsl(var(--secondary) / .7), hsl(var(--secondary) / .7))", backgroundPosition: "0 100%", backgroundSize: step >= 1 ? "100% 1px" : "0% 1px", transition: reduced ? "none" : `background-size 900ms ${EASE} 300ms` }}>a simple baseline</span>
              {" "}on public data and in a controlled sandbox, and the page states where that comparison stops.
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-5 flex justify-center px-6">
            <div className={cn("flex max-w-full flex-col items-center gap-2 border px-3 py-2.5",
              step === 1 ? "rounded-2xl border-secondary/40 bg-surface/60 backdrop-blur-sm" : step === 3 ? "rounded-2xl border-outline-variant bg-surface-container-lowest" : "rounded-xl border-outline-variant bg-surface")}
              style={{ opacity: step === 2 ? 0.25 : 1, transform: step === 2 ? "translateY(10px) scale(.92)" : step === 1 ? "scale(.96)" : "none", width: step === 0 ? "88%" : "62%", transition: t }}>
              <div className="flex flex-wrap justify-center gap-1.5">
                {chips.map((c) => <span key={c} className={cn("rounded-full border px-2 py-0.5 font-label text-[9px]", step === 0 ? "border-outline-variant text-on-surface-variant" : "border-secondary/60 text-primary")}>{c}</span>)}
              </div>
              <div className="flex w-full items-center gap-2"><span className="flex-1 font-body text-[10px] text-on-surface-variant">{step === 0 ? "Tell me who you are…" : "Ask about this page…"}</span><span className="font-label text-[9px] uppercase tracking-[0.14em] text-secondary">Rose</span></div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
};

/* ---------------- Sticky scene + sandbox: one passage, four contextual gestures ---------------- */
const PHASES = [
  { key: "Locate", line: "I find where this claim lives, and what else on the site depends on it." },
  { key: "Reformulate", line: "Same evidence, two readers. Pick yours; the numbers do not change." },
  { key: "Visualise", line: "The paragraph, redrawn as the path the evidence actually takes." },
  { key: "Voice", line: "Read aloud only when your eyes are busy with the diagram." },
] as const;

const PLAIN = "Ivan tests whether Aetherix predicts demand better than assuming tomorrow looks like the same weekday last week. On 30 restaurants it beats that guess on average, but not at next-day horizon.";
const TECH = "Prophet mean MAPE 49.71% versus 55.86% for the naive baseline on a public 30-restaurant benchmark; at J+1, 28.5% versus 27.9%. Apaleo sandbox, 25% demand shift: weekly recalibration moved error from 15.9% to 12.3%.";
const VOICE_TEXT = "Read the diagram from left to right: a public benchmark, a forecast compared with a simple baseline, a sandbox shock, then the boundary of what was measured.";
const VOICE_WORDS = VOICE_TEXT.split(" ");
const WORD_STARTS = VOICE_WORDS.reduce<number[]>((acc, w, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + VOICE_WORDS[i - 1].length + 1); return acc; }, []);

const DiagramNode = ({ label, detail, on, delay, reduced, emphasis }: { label: string; detail: string; on: boolean; delay: number; reduced: boolean; emphasis?: boolean }) => (
  <div className={cn("border bg-surface p-3", emphasis ? "border-secondary" : "border-outline-variant")}
    style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(10px)", transition: reduced ? "none" : `opacity 600ms ease ${delay}ms, transform 800ms ${EASE} ${delay}ms` }}>
    <p className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">{label}</p>
    <p className="mt-1 font-body text-xs leading-snug text-on-surface">{detail}</p>
  </div>
);

export const ContextualLab = ({ reduced }: { reduced: boolean }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(wrap);
  const phase = Math.min(PHASES.length - 1, Math.floor(p * PHASES.length));
  const local = Math.min(1, Math.max(0, p * PHASES.length - phase));
  const [technical, setTechnical] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [word, setWord] = useState(-1);
  const timer = useRef<number>();
  const stopVoice = () => {
    window.clearInterval(timer.current);
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  };
  const playVoice = () => {
    stopVoice();
    setWord(0);
    setSpeaking(true);
    const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
    let boundaries = false;
    const fallback = () => {
      timer.current = window.setInterval(() => setWord((w) => { if (w >= VOICE_WORDS.length - 1) { window.clearInterval(timer.current); setSpeaking(false); return w; } return w + 1; }), 300);
    };
    if (!synth) { fallback(); return; }
    const u = new SpeechSynthesisUtterance(VOICE_TEXT);
    const voice = synth.getVoices().find((v) => v.lang.startsWith("en-GB")) ?? synth.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-GB";
    u.rate = 0.95;
    u.onboundary = (e) => {
      boundaries = true;
      let idx = 0;
      while (idx + 1 < WORD_STARTS.length && WORD_STARTS[idx + 1] <= e.charIndex) idx++;
      setWord(idx);
    };
    u.onstart = () => { window.setTimeout(() => { if (!boundaries) fallback(); }, 700); };
    u.onend = () => { window.clearInterval(timer.current); setWord(VOICE_WORDS.length - 1); setSpeaking(false); };
    u.onerror = () => { window.clearInterval(timer.current); setSpeaking(false); };
    synth.speak(u);
  };
  useEffect(() => () => stopVoice(), []);
  useEffect(() => { if (phase !== 3 && speaking) stopVoice(); }, [phase, speaking]);
  const tones = ["bg-surface", "bg-surface-container-low", "bg-surface-container", "bg-surface-container-high"];
  const visual = phase >= 2;
  return (
    <figure ref={wrap} aria-label="Contextual assistant, interactive scene" className="relative mt-16" style={{ height: `${PHASES.length * 50 + 40}vh` }}>
      <RoseCue id="lab" note="Scroll, or pick a gesture. I will not hold the page hostage." className="mb-6" />
      <div className={cn("sticky top-20 flex min-h-[calc(100vh-6rem)] flex-col justify-center rounded-sm border border-outline-variant px-5 py-8 md:px-10", tones[phase])} style={{ transition: reduced ? "none" : "background-color 900ms ease" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">Design exercise · scroll or choose a gesture · not a working feature</p>
          <div role="tablist" aria-label="Contextual gesture" className="inline-flex flex-wrap rounded-full border border-outline-variant bg-surface p-0.5 font-label text-xs">
            {PHASES.map((ph, i) => (
              <button key={ph.key} role="tab" type="button" aria-selected={phase === i} onClick={() => scrollToFraction(wrap.current, (i + 0.5) / PHASES.length)}
                className={cn("rounded-full px-3 py-1 transition-colors", phase === i ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary")}>
                {String(i + 1).padStart(2, "0")} {ph.key}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          {/* The page passage. Rose works on it, never replaces it. */}
          <article className="relative">
            <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Reading now · /aetherix · Where it stands</p>
            <div className="relative mt-5 min-h-[11rem]">
              <p className="font-body text-base leading-relaxed text-on-surface md:text-lg" style={{ opacity: phase === 1 ? 0 : 1, transition: reduced ? "none" : "opacity 500ms ease", position: phase === 1 ? "absolute" : "relative" }}>
                Aetherix is tested on{" "}
                <RoseMark kind="underline" active={phase === 0} reduced={reduced}>public restaurant data</RoseMark>{" "}
                and in a{" "}
                <RoseMark kind="circle" active={phase === 0 && local > 0.25} reduced={reduced} delay={200}>controlled sandbox</RoseMark>. The forecast is compared with a simple baseline, and the page states where that comparison stops.
              </p>
              {phase === 1 && (
                <div key={String(technical)} className={cn(!reduced && "animate-in fade-in duration-500")}>
                  <p className={cn("leading-relaxed text-on-surface", technical ? "font-label text-sm" : "font-body text-base md:text-lg")}>{technical ? TECH : PLAIN}</p>
                </div>
              )}
            </div>
            {phase === 1 && (
              <div role="group" aria-label="Choose a reader" className="mt-5 inline-flex rounded-full border border-outline-variant bg-surface p-0.5 font-label text-xs">
                {["Visitor", "Technical reader"].map((l, i) => (
                  <button key={l} type="button" aria-pressed={technical === (i === 1)} onClick={() => setTechnical(i === 1)}
                    className={cn("rounded-full px-3 py-1 transition-colors", technical === (i === 1) ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary")}>{l}</button>
                ))}
              </div>
            )}
            <div key={phase} className={cn("mt-8 border-l-2 border-secondary pl-4", !reduced && "animate-in fade-in slide-in-from-left-2 duration-700")}>
              <p className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Rose · {PHASES[phase].key}</p>
              <p className="mt-2 font-headline text-xl italic leading-snug text-primary">{PHASES[phase].line}</p>
            </div>
          </article>

          {/* The stage: one surface that changes shape between gestures. */}
          <div className="relative min-h-[18rem]">
            {phase === 0 && (
              <div className={cn("relative h-full min-h-[18rem]", !reduced && "animate-in fade-in duration-700")} aria-label="Where this claim is connected">
                <svg aria-hidden="true" viewBox="0 0 100 70" className="absolute inset-0 h-full w-full text-outline" preserveAspectRatio="none">
                  {[[50, 35, 15, 14], [50, 35, 85, 14], [50, 35, 20, 60], [50, 35, 82, 58]].map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={0.3} pathLength={1} vectorEffect="non-scaling-stroke"
                      style={{ strokeDasharray: 1, strokeDashoffset: reduced ? 0 : Math.max(0, 1 - local * 2 + i * 0.15), transition: reduced ? "none" : "stroke-dashoffset 300ms linear" }} />
                  ))}
                </svg>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-secondary bg-surface px-3 py-2 font-label text-xs text-primary">Aetherix · evaluation</span>
                {[
                  ["left-0 top-0", "/aetherix#where-it-stands", "Case study", "Status and limits"],
                  ["right-0 top-0 text-right", "/journal/harnesses-graders-closed-loops", "Field Note", "How grading works"],
                  ["left-0 bottom-0", "/compass", "Compass", "Another bounded claim"],
                  ["right-0 bottom-0 text-right", "/rose-design-lab?concept=d#ch-trust", "Rose", "Chapter 03, trust"],
                ].map(([pos, to, label, detail]) => (
                  <Link key={to} to={to} className={cn("absolute max-w-[9rem] border border-outline-variant bg-surface px-3 py-2 transition-colors hover:border-secondary", pos)}>
                    <span className="block font-label text-[10px] uppercase tracking-[0.16em] text-secondary">{label}</span>
                    <span className="block font-body text-xs text-on-surface">{detail}</span>
                  </Link>
                ))}
              </div>
            )}
            {phase === 1 && (
              <div className={cn("flex h-full min-h-[18rem] flex-col justify-center gap-4", !reduced && "animate-in fade-in duration-700")}>
                {[["Forecast vs baseline", "49.71% · 55.86%"], ["Next day, J+1", "28.5% · 27.9%"], ["Sandbox, +25% shift", "15.9% → 12.3%"]].map(([k, v], i) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-outline-variant pb-3" style={{ opacity: reduced ? 1 : Math.min(1, local * 3 - i * 0.5 + 0.5), transition: "opacity 300ms ease" }}>
                    <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">{k}</span>
                    <span className="font-headline text-2xl text-primary">{v}</span>
                  </div>
                ))}
                <p className="font-body text-xs text-on-surface-variant">Values quoted from the published Aetherix page. The reformulation changes the sentence, never the figure.</p>
              </div>
            )}
            {visual && (
              <div className={cn("flex h-full min-h-[18rem] flex-col justify-center", !reduced && "animate-in fade-in duration-700")} aria-label="Evaluation path, redrawn from the passage">
                <div className="grid gap-3 sm:grid-cols-2">
                  <DiagramNode on label="1 · Public benchmark" detail="30 restaurants, open data" delay={0} reduced={reduced} emphasis={phase === 3 && word >= 7 && word < 10} />
                  <DiagramNode on label="2 · Compared forecast" detail="Prophet against a same-weekday baseline" delay={150} reduced={reduced} emphasis={phase === 3 && word >= 10 && word < 17} />
                  <DiagramNode on label="3 · Sandbox shock" detail="Apaleo simulation, 25% demand shift" delay={300} reduced={reduced} emphasis={phase === 3 && word >= 17 && word < 20} />
                  <DiagramNode on label="4 · Boundary" detail="Forecast accuracy, not whether a staffing decision was optimal" delay={450} reduced={reduced} emphasis={phase === 3 && word >= 20} />
                </div>
                {phase === 3 && (
                  <div className="mt-6 border-t border-outline-variant pt-5">
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={speaking ? stopVoice : playVoice}
                        className="rounded-full border border-secondary px-4 py-1.5 font-label text-xs text-primary transition-colors hover:bg-surface">
                        {speaking ? "Stop" : "Play narration"}
                      </button>
                      <div aria-hidden="true" className="flex h-6 flex-1 items-center gap-[3px] text-secondary">
                        {Array.from({ length: 28 }, (_, i) => (
                          <span key={i} className="w-[2px] rounded-full bg-current" style={{ height: `${speaking ? 25 + Math.abs(Math.sin((word + i) * 0.9)) * 75 : 15}%`, transition: reduced ? "none" : "height 240ms ease" }} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 font-body text-sm leading-relaxed">
                      {VOICE_WORDS.map((w, i) => <span key={i} className={cn("transition-colors duration-300", i <= word ? "text-primary" : "text-on-surface-variant/60")}>{w} </span>)}
                    </p>
                    <p className="mt-2 font-body text-xs text-on-surface-variant">Spoken by your browser's own voice, only after you press play. The transcript stays on screen; voice is a modality, never the only channel.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
};

/* ---------------- Hero: a live Rose working on a real passage ---------------- */
const HERO_Q = "What was actually tested?";
const HERO_A = "Two things, kept apart. The forecast was compared with a simple baseline on public data from 30 restaurants, then stressed in a controlled sandbox. The page also says what that does not prove.".split(" ");
const HERO_CHIPS = ["Show me the figures", "Where does the comparison stop?"];

export const HeroAgent = ({ reduced, compass }: { reduced: boolean; compass: (heading: number) => ReactNode }) => {
  const { ref, seen } = useInView<HTMLDivElement>("0px");
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);
  const total = HERO_Q.length + 14 + HERO_A.length * 3 + 10;
  useEffect(() => {
    if (!seen) return;
    if (reduced) { setT(total); return; }
    setT(0);
    const id = window.setInterval(() => setT((v) => { if (v >= total) { window.clearInterval(id); return v; } return v + 1; }), 45);
    return () => window.clearInterval(id);
  }, [seen, reduced, run, total]);
  const typed = HERO_Q.slice(0, Math.min(t, HERO_Q.length));
  const words = Math.max(0, Math.floor((t - HERO_Q.length - 14) / 3));
  const thinking = t > HERO_Q.length && words === 0;
  const markA = words >= 9;
  const markB = words >= 22;
  const done = t >= total;
  return (
    <div ref={ref} aria-label="Illustration: Rose answering on the Aetherix page" className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
        <span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Reading now · /aetherix</span>
        <button type="button" onClick={() => setRun((r) => r + 1)} disabled={!done} className="font-label text-[10px] uppercase tracking-[0.14em] text-secondary disabled:opacity-0" style={{ transition: "opacity 500ms ease" }}>Replay</button>
      </div>
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="border-b border-outline-variant p-6 md:border-b-0 md:border-r">
          <p className="font-headline text-2xl leading-tight text-primary">Where it stands</p>
          <p className="mt-4 font-body text-sm leading-relaxed text-on-surface">
            Aetherix is evaluated against{" "}
            <RoseMark active={markA} reduced={reduced} delay={0}>a simple baseline</RoseMark>{" "}
            on public restaurant data and in a{" "}
            <RoseMark kind="circle" active={markB} reduced={reduced} delay={0}>controlled sandbox</RoseMark>. The page states where that comparison stops.
          </p>
          <p className="mt-4 font-body text-xs leading-relaxed text-on-surface-variant">Rose marks the passage she is quoting. The page stays the source.</p>
        </div>
        <div className="flex min-h-[17rem] flex-col gap-4 p-6">
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-surface-container px-4 py-2 font-body text-sm text-on-surface" style={{ opacity: t > 0 ? 1 : 0, transition: "opacity 400ms ease" }}>
            {typed}<span aria-hidden="true" className="text-on-surface-variant" style={{ opacity: t < HERO_Q.length ? 1 : 0 }}>|</span>
          </p>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-6 w-6 shrink-0 text-secondary">{compass(thinking ? 90 : words * 6)}</span>
            <p className="font-body text-sm leading-relaxed text-on-surface">
              {thinking && <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Reading the page…</span>}
              {HERO_A.slice(0, words).map((w, i) => <span key={i} className={cn(!reduced && "animate-in fade-in duration-500")}>{w} </span>)}
            </p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            {HERO_CHIPS.map((c, i) => (
              <span key={c} className="rounded-full border border-outline-variant px-3 py-1 font-label text-[11px] text-primary"
                style={{ opacity: done ? 1 : 0, transform: done ? "none" : "translateY(6px)", transition: reduced ? "none" : `opacity 500ms ease ${i * 120}ms, transform 700ms ${EASE} ${i * 120}ms` }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Background field that shifts tone per chapter, behind the whole story. */
export const ToneField = ({ index, reduced, children }: { index: number; reduced: boolean; children: ReactNode }) => {
  const tones = ["--surface", "--surface-container-low", "--surface-container", "--surface-container-lowest", "--surface-container-high"];
  return (
    <div style={{ backgroundColor: `hsl(var(${tones[index % tones.length]}))`, transition: reduced ? "none" : "background-color 1200ms ease" }}>
      {children}
    </div>
  );
};
