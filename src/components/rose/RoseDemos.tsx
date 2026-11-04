import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CompassRose } from "@/components/rose/CompassRose";
import { CONNECT_LINKS, DESIGN_CAPTION, DESIGN_EXCHANGES, HERO_EXCHANGES, PASSAGE_QUESTIONS, SKETCH_STEPS } from "@/components/rose/roseDemoData";
import { useDemoLoop } from "@/components/rose/useDemoLoop";

/**
 * The three demos of copy deck v2 (docs/rose-case-study-copy-v2.md). Layout and loop logic follow
 * docs/rose-prototype/source/Rose.dc.html; every colour is a semantic token. Copy is in roseDemoData.ts,
 * the loop in useDemoLoop.ts. Hero demo: three built exchanges. Chapter 06: four answer formats, one built and three in design.
 * Chapter 08: the test loop.
 */

/* Day: navy. Night: the navy of the inverse sections, so the demo stands apart from the page. */
const DEMO_PANEL = "border border-transparent bg-primary text-on-primary [[data-mood=dusk]_&]:border-outline-variant [[data-mood=dusk]_&]:bg-inverse-primary [[data-mood=dusk]_&]:text-on-surface";
const DEMO_BUBBLE = "bg-on-primary/10 [[data-mood=dusk]_&]:bg-on-surface/10";
const DEMO_OUTLINE = "border-on-primary/40 [[data-mood=dusk]_&]:border-on-surface/40";
const DEMO_GOLD = "border-secondary-fixed-dim [[data-mood=dusk]_&]:border-secondary";
const DEMO_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary [[data-mood=dusk]_&]:focus-visible:outline-secondary";

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

/** WCAG 2.2.2: a real button that stops the loop. Not shown under reduced motion, where nothing moves. */
const PauseButton = ({ paused, onToggle, className }: { paused: boolean; onToggle: () => void; className?: string }) => (
  <button type="button" onClick={onToggle}
    className={cn("rounded-lg border px-3 py-2 font-label text-xs hover:border-on-primary/60 [[data-mood=dusk]_&]:hover:border-on-surface/60", DEMO_OUTLINE, DEMO_RING, className)}>
    {paused ? "Play" : "Pause"}
  </button>
);

/** The three exchanges play in a loop; the input opens the real dock. Each one is a built behaviour. */
export const HeroDock = ({ reduced }: { reduced: boolean }) => {
  const { ex, step, paused, toggle } = useDemoLoop(HERO_EXCHANGES.length, reduced);
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
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:open"))}
          className={cn("flex-1 rounded-lg border px-3 py-2 text-left font-body text-xs opacity-90 hover:border-on-primary/60 [[data-mood=dusk]_&]:hover:border-on-surface/60", DEMO_OUTLINE, DEMO_RING)}>Ask Rose anything</button>
        {!reduced && <PauseButton paused={paused} onToggle={toggle} />}
      </div>
    </div>
  );
};

const locateChapter03 = (reduced: boolean) =>
  document.getElementById("ch-03-decision")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });

type DemoLoop = ReturnType<typeof useDemoLoop>;

/** The same dock as the hero: Reformulate (built), then Locate, Connect and Sketch (design), each marked in its header. */
export const DesignDemo = ({ reduced, loop }: { reduced: boolean; loop: DemoLoop }) => {
  const { ex, step, paused, toggle } = loop;
  const e = DESIGN_EXCHANGES[ex];
  return (
    <figure className={cn("mt-8 max-w-xl rounded-2xl p-5", DEMO_PANEL)}>
      <DemoHeader right={`${e.mark === "Built" ? "●" : "○"} ${e.mark} · ${e.format}`} />
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
                  <li key={l.href}>
                    <span className="font-label text-xs opacity-80">{l.kind} · </span>
                    {l.external
                      ? <a href={l.href} target="_blank" rel="noopener noreferrer" className={cn("underline underline-offset-4 hover:opacity-80", DEMO_RING)}>{l.text}<span className="sr-only"> (opens in a new tab)</span></a>
                      : <Link to={l.href} className={cn("underline underline-offset-4 hover:opacity-80", DEMO_RING)}>{l.text}</Link>}
                  </li>
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
      <div className="mt-4 flex items-center justify-between gap-3">
        <figcaption className="font-label text-xs opacity-80">{DESIGN_CAPTION}</figcaption>
        {!reduced && <PauseButton paused={paused} onToggle={toggle} className="shrink-0" />}
      </div>
    </figure>
  );
};

/**
 * The four passage questions, each with its marker. They control the demo above, never Rose: the one matching the
 * running exchange is highlighted, and choosing one shows that exchange complete and pauses the loop.
 */
export const PassageQuestions = ({ current, onSelect }: { current: string; onSelect: (format: string) => void }) => (
  <ul aria-label="The four passage questions" className="mt-8 max-w-xl list-none space-y-2 p-0 font-body text-base text-on-surface">
    {PASSAGE_QUESTIONS.map((p) => {
      const on = p.format === current;
      return (
        <li key={p.format}>
          <button type="button" aria-current={on ? "true" : undefined} onClick={() => onSelect(p.format)}
            className={cn("flex w-full flex-col gap-1 rounded-md border px-3 py-2.5 text-left transition-colors sm:flex-row sm:items-baseline sm:gap-x-3 hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary",
              on ? "border-secondary bg-surface-container-low" : "border-outline-variant")}>
            <span className={cn("w-28 shrink-0 font-label text-xs", p.mark === "Built" ? "text-secondary" : "text-on-surface-variant")}>
              <span aria-hidden="true">{p.mark === "Built" ? "●" : "○"} </span><span className="sr-only">{p.mark}: </span>{p.format}
            </span>
            <span>{p.q}</span>
          </button>
        </li>
      );
    })}
  </ul>
);

/** Chapter 06: the demo and the four questions share one loop. */
export const AnswerFormats = ({ reduced }: { reduced: boolean }) => {
  const loop = useDemoLoop(DESIGN_EXCHANGES.length, reduced);
  const select = (format: string) => {
    const index = DESIGN_EXCHANGES.findIndex((e) => e.format === format);
    if (index >= 0) loop.select(index);
  };
  return (
    <>
      <DesignDemo reduced={reduced} loop={loop} />
      <PassageQuestions current={DESIGN_EXCHANGES[loop.ex].format} onSelect={select} />
    </>
  );
};

/** The test loop of chapter 08. Step 5 is the loop back to step 2. */
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
