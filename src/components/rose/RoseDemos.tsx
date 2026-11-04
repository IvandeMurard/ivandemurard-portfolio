import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CompassRose } from "@/components/rose/CompassRose";

/**
 * The three demos of copy deck v2 (docs/rose-case-study-copy-v2.md). Layout and loop logic follow
 * docs/rose-prototype/source/Rose.dc.html; every colour is a semantic token.
 * Hero demo: three built exchanges. Chapter 06: three formats in design. Chapter 08: the test loop.
 */

/* Day: navy. Night: the navy of the inverse sections, so the demo stands apart from the page. */
const DEMO_PANEL = "border border-transparent bg-primary text-on-primary [[data-mood=dusk]_&]:border-outline-variant [[data-mood=dusk]_&]:bg-inverse-primary [[data-mood=dusk]_&]:text-on-surface";
const DEMO_BUBBLE = "bg-on-primary/10 [[data-mood=dusk]_&]:bg-on-surface/10";
const DEMO_OUTLINE = "border-on-primary/40 [[data-mood=dusk]_&]:border-on-surface/40";
const DEMO_GOLD = "border-secondary-fixed-dim [[data-mood=dusk]_&]:border-secondary";
const DEMO_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary [[data-mood=dusk]_&]:focus-visible:outline-secondary";

/** One exchange every 9 ticks of 900 ms: question, reading, answer held, blank. Reduced motion: the first exchange complete. */
const STEPS = [1, 2, 3, 3, 3, 3, 3, 3, 0];
const TICK_MS = 900;

export const useDemoLoop = (count: number, reduced: boolean) => {
  const [tick, setTick] = useState(reduced ? 2 : 0);
  useEffect(() => {
    if (reduced) { setTick(2); return; }
    setTick(0);
    const id = window.setInterval(() => setTick((t) => (t + 1) % (STEPS.length * count)), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduced, count]);
  return { ex: Math.floor(tick / STEPS.length), step: STEPS[tick % STEPS.length] };
};

const fade = (on: boolean, reduced: boolean) => ({ opacity: on ? 1 : 0, transition: reduced ? "none" : "opacity 500ms ease" });

const DemoHeader = ({ right }: { right: string }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="flex items-center gap-2 font-headline text-base"><CompassRose heading={0} reduced className="h-5 w-5" />Rose</span>
    <span className="font-label text-xs opacity-80">{right}</span>
  </div>
);

const Bubble = ({ text, reduced, on }: { text: string; reduced: boolean; on: boolean }) => (
  <p className={cn("ml-auto max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2 font-body text-sm", DEMO_BUBBLE)} style={fade(on, reduced)}>{text}</p>
);

/* ---------------------------------------------------------------- Hero: three built exchanges */

type HeroExchange = { where: string; q: string; a: string; src: string; link?: { label: string; to: string }; chips?: string[] };

export const HERO_EXCHANGES: HeroExchange[] = [
  { where: "Reading: /rose · 03 · Know where you are", q: "Say it more simply.", a: "When you ask me something, I also receive the page you are on, so I answer about what you are reading.", src: "Source: chapter 03" },
  { where: "Reading: /aetherix", q: "Is Aetherix in production?", a: "No. It was built and evaluated on historical data, staged against a sandbox, and is ready for a 30-day pilot.", src: "Source: /aetherix, status", link: { label: "Aetherix, the case study", to: "/aetherix" } },
  { where: "Reading: /journeys", q: "What has Ivan built?", a: "Six projects, each with its status. Aetherix is ready for a 30-day pilot, Tacet is built and in maintenance, and Anima is a synthetic proof of concept.", src: "Source: case studies, /journeys", chips: ["What happens when it's wrong?", "Which ones are live?"] },
];

/** The three exchanges play in a loop; the input opens the real dock. Each one is a built behaviour. */
export const HeroDock = ({ reduced }: { reduced: boolean }) => {
  const { ex, step } = useDemoLoop(HERO_EXCHANGES.length, reduced);
  const e = HERO_EXCHANGES[ex];
  return (
    <div data-rose-hero aria-label="Rose, example exchanges" className={cn("flex min-h-[22rem] flex-col rounded-2xl p-5 shadow-xl shadow-primary/10", DEMO_PANEL)}>
      <DemoHeader right={e.where} />
      <div className="mt-6 flex flex-1 flex-col gap-3" aria-live="off">
        <Bubble text={e.q} reduced={reduced} on={step >= 1} />
        {step === 2 && <p className="font-label text-xs opacity-80">Rose is reading the page…</p>}
        {step >= 3 && (
          <div style={fade(true, reduced)}>
            <p className="font-body text-sm leading-relaxed">{e.a}</p>
            {e.link && (
              <Link to={e.link.to} className={cn("mt-3 inline-block rounded-md border px-3 py-1 font-label text-xs hover:bg-on-primary/10 [[data-mood=dusk]_&]:hover:bg-on-surface/10", DEMO_GOLD, DEMO_RING)}>
                {e.link.label} <span aria-hidden="true">↗</span>
              </Link>
            )}
            {e.chips && (
              <ul aria-label="Suggested questions" className="mt-3 flex list-none flex-wrap gap-2 p-0">
                {e.chips.map((c) => <li key={c} className={cn("rounded-full border px-3 py-1 font-body text-xs", DEMO_OUTLINE)}>{c}</li>)}
              </ul>
            )}
            <p className="mt-3 font-label text-xs opacity-80">{e.src}</p>
          </div>
        )}
      </div>
      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:open"))}
        className={cn("mt-4 rounded-lg border px-3 py-2 text-left font-body text-xs opacity-90 hover:border-on-primary/60 [[data-mood=dusk]_&]:hover:border-on-surface/60", DEMO_OUTLINE, DEMO_RING)}>Ask Rose anything</button>
    </div>
  );
};

/* ---------------------------------------------------------------- Chapter 06: three formats in design */

export const DESIGN_CAPTION = "Prototype. Live Rose answers in text only.";

type DesignExchange = { format: "Locate" | "Connect" | "Sketch"; q: string; a: string };

export const DESIGN_EXCHANGES: DesignExchange[] = [
  { format: "Locate", q: "Where did he decide this?", a: "Ivan made this call on 10 August, in chapter 03, Know where you are." },
  { format: "Connect", q: "How does this relate to his other work?", a: "Two links, each with the reason Ivan wrote for it:" },
  { format: "Sketch", q: "Draw how it works.", a: "Page, then section in view, then marked passage, then answer." },
];

/** Static for now: the relations decided on 3 Nov. The relations data comes in a later branch. */
export const CONNECT_LINKS = [
  { kind: "same thesis", text: "Lore, one industry over", to: "/lore" },
  { kind: "part of", text: "the multi-agent architecture, through the orchestrator", to: "/architecture" },
] as const;

export const SKETCH_STEPS = ["Page", "Section in view", "Marked passage", "Answer"] as const;

const locateChapter03 = (reduced: boolean) =>
  document.getElementById("ch-03-decision")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });

/** The same dock as the hero, three exchanges marked Design. */
export const DesignDemo = ({ reduced }: { reduced: boolean }) => {
  const { ex, step } = useDemoLoop(DESIGN_EXCHANGES.length, reduced);
  const e = DESIGN_EXCHANGES[ex];
  return (
    <figure className={cn("mt-8 max-w-xl rounded-2xl p-5", DEMO_PANEL)}>
      <DemoHeader right={`○ Design · ${e.format}`} />
      <div className="mt-5 flex min-h-[13rem] flex-col gap-3" aria-live="off">
        <Bubble text={e.q} reduced={reduced} on={step >= 1} />
        {step >= 3 && (
          <div className="flex flex-col gap-3 font-body text-sm leading-relaxed" style={fade(true, reduced)}>
            <p>{e.a}</p>
            {e.format === "Locate" && (
              <button type="button" onClick={() => locateChapter03(reduced)}
                className={cn("self-start rounded-full border px-4 py-2 font-label text-xs hover:bg-on-primary/10 [[data-mood=dusk]_&]:hover:bg-on-surface/10", DEMO_GOLD, DEMO_RING)}>Locate, show me <span aria-hidden="true">↑</span></button>
            )}
            {e.format === "Connect" && (
              <ul className="flex list-none flex-col gap-2 p-0">
                {CONNECT_LINKS.map((l) => (
                  <li key={l.to}><span className="font-label text-xs opacity-80">{l.kind} · </span><Link to={l.to} className={cn("underline underline-offset-4 hover:opacity-80", DEMO_RING)}>{l.text}</Link></li>
                ))}
              </ul>
            )}
            {e.format === "Sketch" && (
              <ol className="flex list-none flex-wrap items-center gap-2 p-0 font-label text-xs">
                {SKETCH_STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true" className="opacity-80">→</span>}
                    <span className={cn("rounded-md px-3 py-2", i === SKETCH_STEPS.length - 1 ? "bg-on-primary text-primary [[data-mood=dusk]_&]:bg-on-surface [[data-mood=dusk]_&]:text-inverse-primary" : cn("border", DEMO_OUTLINE))}>{s}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
      <figcaption className="mt-4 font-label text-xs opacity-80">{DESIGN_CAPTION}</figcaption>
    </figure>
  );
};

/** The four passage questions, each with its marker. */
export const PASSAGE_QUESTIONS = [
  { format: "Locate", q: "Where did he decide this?", mark: "Design" },
  { format: "Reformulate", q: "Say it more simply", mark: "Built" },
  { format: "Connect", q: "How does this relate to his other work?", mark: "Design" },
  { format: "Sketch", q: "Draw how it works", mark: "Design" },
] as const;

export const PassageQuestions = () => (
  <ul aria-label="The four passage questions" className="mt-8 max-w-xl list-none space-y-3 p-0 font-body text-base text-on-surface">
    {PASSAGE_QUESTIONS.map((p) => (
      <li key={p.format} className="flex flex-wrap items-baseline gap-x-3 border-b border-outline-variant pb-3">
        <span className={cn("w-28 shrink-0 font-label text-xs", p.mark === "Built" ? "text-secondary" : "text-on-surface-variant")}>
          <span aria-hidden="true">{p.mark === "Built" ? "●" : "○"} </span><span className="sr-only">{p.mark}: </span>{p.format}
        </span>
        <span>{p.q}</span>
      </li>
    ))}
  </ul>
);

/* ---------------------------------------------------------------- Chapter 08: the test loop */

/** Step 5 is the loop back to step 2. */
export const TestLoop = ({ steps, caption }: { steps: readonly string[]; caption: ReactNode }) => (
  <figure className="mt-6">
    <div role="region" aria-label="The test loop, seven steps" tabIndex={0} className="overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
      <ol className="grid min-w-[48rem] list-none grid-cols-7 gap-2 p-0">
        {steps.map((t, i) => (
          <li key={t} className={cn("rounded-md border bg-surface-container-lowest px-3 py-2.5 font-body text-sm leading-snug text-on-surface", i === 4 ? "border-secondary" : "border-outline-variant")}>
            <span className="block font-label text-xs text-secondary">{i + 1}</span>{t}
          </li>
        ))}
      </ol>
    </div>
    <figcaption className="mt-3 font-label text-xs text-on-surface-variant">{caption}</figcaption>
  </figure>
);
