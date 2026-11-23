import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CompassRose } from "@/components/rose/CompassRose";
import { CONNECT_LINKS, DESIGN_CAPTION, DESIGN_EXCHANGES, HERO_EXCHANGES, PASSAGE_QUESTIONS, SKETCH_STEPS } from "@/components/rose/roseDemoData";
import { useDemoLoop } from "@/components/rose/useDemoLoop";
import { ExternalMark } from "@/components/ui/ExternalMark";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelationsMap } from "@/components/rose/RelationsMap";
import { MapPin, MessageSquare, Network, Workflow, ArrowUp } from "lucide-react";

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
                {e.link.label}
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

/** Visitor-controlled authored examples. Selecting a tab never calls the live Rose. */
export const AnswerFormats = ({ reduced }: { reduced: boolean }) => {
  const [format, setFormat] = useState("Reformulate");
  const icons = { Locate: MapPin, Reformulate: MessageSquare, Connect: Network, Sketch: Workflow };
  return (
    <Tabs value={format} onValueChange={setFormat} className="mt-8 min-w-0" data-answer-formats>
      <TabsList aria-label="Answer formats" className="grid h-auto w-full grid-cols-4 rounded-none border-b border-outline-variant bg-transparent p-0 text-on-surface-variant">
        {PASSAGE_QUESTIONS.map((p) => {
          const Icon = icons[p.format];
          return <TabsTrigger key={p.format} value={p.format} className="min-h-14 min-w-0 gap-2 rounded-none border-b-2 border-transparent px-1 py-3 font-label text-[13px] font-normal data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-on-surface data-[state=active]:shadow-none sm:px-3 sm:text-sm">
            <Icon aria-hidden="true" className="hidden h-4 w-4 sm:block" />{p.format}
          </TabsTrigger>;
        })}
      </TabsList>
      {DESIGN_EXCHANGES.map((e) => <TabsContent key={e.format} value={e.format} className="mt-0 min-h-[22rem] py-7 sm:py-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-10">
          <div>
            <p className="font-label text-xs text-on-surface-variant">{e.mark === "Built" ? "●" : "○"} {e.mark} · {e.format}</p>
            <h3 className="mt-3 font-headline text-3xl leading-tight text-on-surface">{e.q}</h3>
          </div>
          <div className="border-l-2 border-secondary pl-5 sm:pl-6">
            <span className="flex items-center gap-2 font-headline text-lg text-on-surface"><CompassRose reduced heading={0} className="h-5 w-5" />Rose</span>
            <p className="mt-3 font-body text-base text-on-surface">{e.a}</p>
            {e.format === "Locate" && <Button type="button" variant="outline" onClick={() => locateChapter03(reduced)} className="mt-5 border-outline-variant bg-transparent text-on-surface">Locate, show me <ArrowUp aria-hidden="true" /></Button>}
            {e.format === "Connect" && <ul className="mt-4 flex list-none flex-col gap-2 p-0 font-body text-sm text-on-surface">
              {CONNECT_LINKS.map((l) => <li key={l.href}>{l.external
                ? <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-secondary underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><ExternalMark>{l.text}</ExternalMark></a>
                : <Link to={l.href} className="underline decoration-secondary underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">{l.text}</Link>}</li>)}
            </ul>}
          </div>
        </div>
        {e.format === "Sketch" && <ol aria-label="From page to answer" className="mt-8 grid list-none grid-cols-2 gap-4 p-0 font-body text-sm text-on-surface sm:grid-cols-4">
          {SKETCH_STEPS.map((s, i) => <li key={s} className="border-t border-outline-variant pt-4"><span className="mb-2 block font-mono text-xs text-on-surface-variant">0{i + 1}</span><span className="flex items-center justify-between gap-2">{s}{i < SKETCH_STEPS.length - 1 && <span aria-hidden="true">→</span>}</span></li>)}
        </ol>}
        {e.format === "Connect" && <RelationsMap />}
      </TabsContent>)}
      <p className="sr-only">{DESIGN_CAPTION}</p>
    </Tabs>
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
