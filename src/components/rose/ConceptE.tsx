import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EvidenceStatus } from "@/components/EvidenceStatus";
import { RoseCue, ToneField, useScrollProgress } from "@/components/rose/RoseKinetic";

/**
 * Prototype E: "Rose makes the portfolio's evidence and relationships legible
 * in the moment." One reading canvas, one gesture grammar (point, link, sketch),
 * reused from the hero to the open questions. Design demonstration only: nothing
 * here is a claimed current capability, and no model reasoning is simulated.
 * Facts come from public/aetherix.md (Sec. 06 · Where it stands).
 */

const EASE = "cubic-bezier(.2,.7,.1,1)";
const STATES = ["Locate", "Reformulate", "Visualise", "Boundary"] as const;

/** Rose's pointer: a copper compass tip that travels to a target inside the canvas. */
const Tip = ({ x, y, reduced, on = true }: { x: number; y: number; reduced: boolean; on?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 12 12" className="pointer-events-none absolute h-4 w-4 text-secondary"
    style={{ left: `${x}%`, top: `${y}%`, opacity: on ? 1 : 0, transform: "translate(-50%,-50%) rotate(45deg)",
      transition: reduced ? "none" : `left 900ms ${EASE}, top 900ms ${EASE}, opacity 400ms ease` }}>
    <path d="M6 0 L8 6 L6 12 L4 6 Z" fill="currentColor" />
  </svg>
);

const Row = ({ k, v, marked, reduced }: { k: string; v: ReactNode; marked?: boolean; reduced: boolean }) => (
  <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-outline-variant py-2 last:border-0">
    <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">{k}</span>
    <span className="relative font-body text-sm text-on-surface">
      {v}
      <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-secondary"
        style={{ transform: `scaleX(${marked ? 1 : 0})`, transition: reduced ? "none" : `transform 700ms ${EASE} 300ms` }} />
    </span>
  </div>
);

const NODES = [
  { id: "page", label: "/aetherix", sub: "Where it stands", x: 12, y: 30 },
  { id: "evidence", label: "aetherix.md", sub: "Sec. 06 · The numbers", x: 50, y: 18 },
  { id: "note", label: "Field Note", sub: "Harnesses, graders, closed loops", x: 50, y: 72 },
  { id: "source", label: "Source link", sub: "/journal/harnesses-graders-closed-loops", x: 86, y: 45 },
];
const EDGES: [number, number][] = [[0, 1], [1, 3], [0, 2], [2, 3]];

const Graph = ({ drawn, reduced }: { drawn: boolean; reduced: boolean }) => (
  <div className="relative h-64">
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {EDGES.map(([a, b], i) => (
        <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} pathLength={1}
          stroke="hsl(var(--secondary))" strokeWidth={0.4} vectorEffect="non-scaling-stroke"
          strokeDasharray={1} strokeDashoffset={drawn || reduced ? 0 : 1}
          style={{ transition: reduced ? "none" : `stroke-dashoffset 900ms ${EASE} ${i * 220}ms` }} />
      ))}
    </svg>
    <ol aria-label="Relationship map">
      {NODES.map((n, i) => (
        <li key={n.id} className="absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-outline-variant bg-surface px-2.5 py-1.5"
          style={{ left: `${n.x}%`, top: `${n.y}%`, opacity: drawn || reduced ? 1 : 0.35, transition: reduced ? "none" : `opacity 500ms ease ${i * 200}ms` }}>
          <p className="font-label text-[10px] uppercase tracking-[0.14em] text-secondary">{n.label}</p>
          <p className="mt-0.5 truncate font-body text-xs text-on-surface">{n.sub}</p>
        </li>
      ))}
    </ol>
  </div>
);

const CanvasState = ({ s, reduced }: { s: number; reduced: boolean }) => {
  if (s === 0) return (
    <div>
      <Row k="Route" v="/aetherix" marked reduced={reduced} />
      <Row k="Section" v="Sec. 06 · Where it stands" marked reduced={reduced} />
      <Row k="Starter" v="How is Aetherix measured?" reduced={reduced} />
      <Row k="Sources" v={<>aetherix.md · <span className="text-secondary">harnesses-graders-closed-loops</span></>} marked reduced={reduced} />
    </div>
  );
  if (s === 1) return (
    <div className="grid gap-4 md:grid-cols-[1fr_11rem]">
      <div>
        <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Published, technical</p>
        <p className="mt-1 font-body text-xs leading-relaxed text-on-surface-variant line-through decoration-secondary/60">Prophet against a naive same-weekday baseline: mean MAPE 49.71% vs 55.86%. At J+1, 28.5% vs 27.9%.</p>
        <p className="mt-4 font-label text-[10px] uppercase tracking-[0.16em] text-secondary">For the reader</p>
        <p className="mt-1 font-headline text-lg leading-snug text-primary">On 30 restaurants, the forecast beats "same weekday last week" on average (49.71% vs 55.86% error), but is slightly behind it for next-day forecasts (28.5% vs 27.9%).</p>
      </div>
      <aside className="border-l-2 border-secondary pl-3">
        <p className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">Scope kept beside it</p>
        <p className="mt-2 font-body text-xs leading-relaxed text-on-surface">Public restaurant data and sandbox. No real hotel connected. Measures forecast error, not staffing decisions.</p>
      </aside>
    </div>
  );
  if (s === 2) return <Graph drawn reduced={reduced} />;
  return (
    <div className="grid gap-px bg-outline-variant md:grid-cols-2">
      <div className="bg-surface p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">Rose can use</p>
        <ul className="mt-2 space-y-1 font-body text-sm text-on-surface">{["Route", "Heading", "Optional selected starter", "Published sources"].map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <div className="bg-surface-container-low p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Rose cannot use</p>
        <ul className="mt-2 space-y-1 font-body text-sm text-on-surface-variant">{["Cursor position", "Private browser state", "Unverified inference"].map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </div>
  );
};

const TIP_AT: [number, number][] = [[92, 30], [96, 62], [88, 55], [50, 50]];

const ReadingCanvas = ({ reduced }: { reduced: boolean }) => {
  const ref = useRef<HTMLElement>(null);
  const p = useScrollProgress(ref);
  const [manual, setManual] = useState<number | null>(null);
  const scrollState = Math.min(3, Math.floor(p * 4));
  useEffect(() => { setManual(null); }, [scrollState]);
  const s = manual ?? scrollState;
  return (
    <section ref={ref} aria-labelledby="e-hero" className="relative lg:h-[300vh]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-16 lg:sticky lg:top-20 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3"><EvidenceStatus state="design" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Design direction · not a shipped capability</span></div>
          <h1 id="e-hero" className="mt-5 font-headline text-5xl leading-[1.05] text-primary md:text-6xl">Rose makes the evidence legible, in the moment.</h1>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-on-surface md:text-lg">She points to where a claim lives, says it plainly, shows what it connects to, and stops where the evidence stops.</p>
          <div role="tablist" aria-label="Canvas state" className="mt-8 flex flex-wrap gap-2">
            {STATES.map((l, i) => (
              <button key={l} role="tab" type="button" aria-selected={s === i} aria-controls="e-canvas" onClick={() => setManual(i)}
                className={cn("rounded-full border px-3 py-1 font-label text-xs", s === i ? "border-secondary bg-secondary text-on-secondary" : "border-outline-variant text-on-surface-variant hover:text-primary")}>
                {String(i + 1).padStart(2, "0")} · {l}
              </button>
            ))}
          </div>
          <p className="mt-4 font-body text-xs text-on-surface-variant">Scroll to advance, or choose a state.</p>
        </div>
        <figure id="e-canvas" role="tabpanel" aria-label={`Rose reading canvas · ${STATES[s]}`} className="relative overflow-hidden rounded-sm border border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center justify-between border-b border-outline-variant px-4 py-2">
            <span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">ivandemurard.com/aetherix</span>
            <span className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">{STATES[s]}</span>
          </div>
          <div className="px-5 py-3"><p className="font-headline text-xl text-primary">The loop is built and testable. The forecast is not yet proven on hotels.</p></div>
          <div key={s} className="min-h-[17rem] px-5 pb-6 pt-2 motion-safe:animate-fade-in"><CanvasState s={s} reduced={reduced} /></div>
          <div className="hidden md:block"><Tip x={TIP_AT[s][0]} y={TIP_AT[s][1]} reduced={reduced} /></div>
          <div className="flex gap-1 px-5 pb-4" aria-hidden="true">{STATES.map((_, i) => <span key={i} className={cn("h-0.5 flex-1", i <= s ? "bg-secondary" : "bg-outline-variant")} />)}</div>
        </figure>
      </div>
    </section>
  );
};

const Chapter = ({ id, n, kicker, title, children }: { id: string; n: string; kicker: string; title: string; children: ReactNode }) => (
  <section id={id} aria-labelledby={`${id}-h`} className="mx-auto max-w-5xl scroll-mt-28 px-6 py-24 md:py-32">
    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">{n} · {kicker}</p>
    <h2 id={`${id}-h`} className="mt-4 max-w-3xl font-headline text-4xl leading-tight text-primary md:text-5xl">{title}</h2>
    <div className="mt-10">{children}</div>
  </section>
);

export const ConceptE = ({ reduced }: { reduced: boolean }) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [tone, setTone] = useState(0);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setTone(Number((e.target as HTMLElement).dataset.tone)); }), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const mark = (i: number) => (el: HTMLDivElement | null) => { refs.current[i] = el; };
  return (
    <ToneField index={tone} reduced={reduced}>
      <div ref={mark(0)} data-tone={0}><ReadingCanvas reduced={reduced} /></div>

      <div ref={mark(1)} data-tone={1}>
        <Chapter id="e-direction" n="01" kicker="Product direction" title="A generic intent became a question about the page.">
          <div className="grid gap-px bg-outline-variant md:grid-cols-2">
            <div className="bg-surface-container-low p-6"><p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Before</p><p className="mt-3 font-headline text-2xl text-on-surface-variant">"Hiring? Partnership? Just curious?"</p></div>
            <div className="bg-surface p-6"><p className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">After</p><p className="mt-3 font-headline text-2xl text-primary">"How is Aetherix measured?"</p></div>
          </div>
          <RoseCue id="e-dir" className="mt-8" note="I used to ask who you were. Now I ask what you are reading." />
        </Chapter>
      </div>

      <div ref={mark(2)} data-tone={2}>
        <Chapter id="e-experience" n="02" kicker="Experience design" title="The dock moved until it stopped competing.">
          <ol className="grid gap-px bg-outline-variant md:grid-cols-4">
            {[["21 Jul", "Dock with four fixed chips"], ["7 Aug", "Translucent veil at rest"], ["13 Oct", "Ask Rose CTA moved out"], ["14 Oct", "CTA removed, dock alone"]].map(([d, t], i) => (
              <li key={d} className={cn("p-5", i === 3 ? "bg-surface" : "bg-surface-container-low")}>
                <p className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">{d}</p>
                <div aria-hidden="true" className="mt-4 flex h-16 items-end justify-center rounded-sm border border-outline-variant">
                  <span className={cn("mb-2 h-3 rounded-full bg-primary", ["w-24", "w-20 opacity-40", "w-20 opacity-60", "w-16"][i])} />
                </div>
                <p className="mt-3 font-body text-sm text-on-surface">{t}</p>
              </li>
            ))}
          </ol>
          <RoseCue id="e-dock" className="mt-8" note="Four moves to learn to sit still. Respectable." />
        </Chapter>
      </div>

      <div ref={mark(3)} data-tone={3}>
        <Chapter id="e-trust" n="03" kicker="Trust and answer quality" title="What leaves, what stays, what Rose cannot infer.">
          <div className="grid gap-px bg-outline-variant md:grid-cols-3">
            {[["Leaves the browser", "The question, route, heading and selected starter, sent to answer it."], ["Stays in the browser", "The conversation, in session storage, cleared after 60 idle minutes. No server transcript."], ["Never inferred", "Who you are, where your cursor is, what you did not ask."]].map(([h, t], i) => (
              <div key={h} className={cn("p-5", i === 2 ? "bg-surface-container-low" : "bg-surface")}>
                <p className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">{h}</p>
                <p className="mt-3 font-body text-sm leading-relaxed text-on-surface">{t}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl font-body text-sm leading-relaxed text-on-surface-variant">Evidence-critical Aetherix questions are answered from reviewed source text and checked offline for unsupported figures before release.</p>
          <RoseCue id="e-trust" className="mt-8" note="I forget you in an hour. It is the polite thing to do." />
        </Chapter>
      </div>

      <div ref={mark(4)} data-tone={4}>
        <Chapter id="e-assistant" n="04" kicker="Contextual assistant" title="The canvas widens to the whole site.">
          <div className="rounded-sm border border-outline-variant bg-surface p-4"><Graph drawn reduced={reduced} /></div>
          <p className="mt-6 max-w-2xl font-body text-sm text-on-surface-variant">Design exercise: relating pages, evidence and limits across case studies and Field Notes. Not a working feature.</p>
          <RoseCue id="e-link" className="mt-8" note="Everything here points somewhere. I just draw the line." />
        </Chapter>
      </div>

      <div ref={mark(5)} data-tone={0}>
        <Chapter id="e-open" n="05" kicker="Open questions" title="The gesture stops where the evidence stops.">
          <ul className="max-w-2xl space-y-4 font-body text-base leading-relaxed text-on-surface">
            <li>Does a visitor understand the work better with Rose than without her? Not yet measured.</li>
            <li>Would voice remove work, or only add a performance? Undecided.</li>
          </ul>
        </Chapter>
      </div>
    </ToneField>
  );
};
