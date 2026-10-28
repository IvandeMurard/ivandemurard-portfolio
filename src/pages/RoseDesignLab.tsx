import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoseHistoryTransition } from "@/components/rose/RoseHistoryTransition";
import { RoseLaterChapters, ChapterQualityAssurance } from "@/components/rose/RoseLaterChapters";
import { EvidenceKey, EvidenceStatus } from "@/components/EvidenceStatus";
import { ContextualLab, DockScene, KineticBridge, RoseAside, RoseMark, useScrollProgress } from "@/components/rose/RoseKinetic";

/**
 * Temporary, unlinked design lab for the Rose case study. Not in nav, sitemap
 * or pre-render. Every milestone below is sourced from the repository history
 * (commit dates, archived plans, original prompt). "Design reading" lines are
 * Ivan's interpretation, not user research.
 */

type Milestone = {
  date: string;
  title: string;
  intention: string;
  tension: string;
  decision: string;
  result: string;
  heading: number;
  question: string;
  evidence: string;
};

const MILESTONES: Milestone[] = [
  {
    date: "21 Jul 2026",
    title: "Qualify",
    intention: "Help the visitor decide, in two or three exchanges, whether to book 30 minutes with Ivan.",
    tension: "Design reading: four intent chips asked visitors who they were before showing them anything.",
    decision: "Ship a small dock with four intents and a booking card.",
    result: "A qualification funnel with one destination.",
    heading: 0,
    question: "Why was Rose originally designed around booking?",
    evidence: "Original prompt and config, commit 51245fc",
  },
  {
    date: "7 Aug 2026",
    title: "Listen to the page",
    intention: "Keep booking reachable.",
    tension: "Design reading: the same four intents appeared on every page, whatever the visitor was reading.",
    decision: "Replace fixed intents with three questions written for each page. Keep Book a call as a constant exit.",
    result: "Questions start from the work, not from the visitor's profile.",
    heading: 80,
    question: "What changed when Rose became page-aware?",
    evidence: "Archived plan, contextual starters, 7 Aug",
  },
  {
    date: "10 Aug 2026",
    title: "Know where you are",
    intention: "Answer generally about Ivan.",
    tension: "A page-specific question deserves a page-specific answer.",
    decision: "Pass the current page and intent into Rose's context.",
    result: "Answers refer to the case study being read.",
    heading: 150,
    question: "How does Rose know which page I'm on?",
    evidence: "Commit b236ff3, page context and intent",
  },
  {
    date: "7 Aug 2026",
    title: "One quiet dock",
    intention: "Several entry points to Rose.",
    tension: "Design reading: a dock competing with the page reads as a sales widget.",
    decision: "Unify the dock: discreet at rest, full contrast in use, chips by page.",
    result: "Rose stays out of the way until asked.",
    heading: 215,
    question: "Why is the dock so discreet at rest?",
    evidence: "Commit 4efe2b8, quiet dock",
  },
  {
    date: "24 Oct 2026",
    title: "Earn trust",
    intention: "Send the conversation with each booking request.",
    tension: "A transcript is more than a visitor agreed to share.",
    decision: "Booking opens the calendar and nothing else. Conversation kept in the tab for 60 minutes. Answers checked against 15 synthetic scenarios.",
    result: "Contact is an optional outcome, not the goal of every answer.",
    heading: 300,
    question: "Why doesn't Rose send conversation transcripts with bookings?",
    evidence: "Privacy, memory and evaluation work, 24 Oct",
  },
];

const ORIGINAL_CHIPS = ["Product expertise", "Technical profile", "Culture fit", "Just exploring"];
const PAGE_CHIPS = ["What has actually been built?", "What happens when it's wrong?", "Book a call"];

const UX_ITERATIONS = [
  {
    date: "21 Jul", title: "A dock that qualified", source: "51245fc",
    problem: "The opening asked visitors to declare a recruitment intent before they had seen the work.",
    decision: "Four intent starters led towards a booking within two or three exchanges.",
    result: "Useful as an early hypothesis; too much like a conversion gate.",
  },
  {
    date: "7 Aug", title: "A quieter surface", source: "4efe2b8",
    problem: "A persistent widget could compete with the case study it was meant to help explore.",
    decision: "A glass dock rests quietly, then becomes legible on hover, focus or use.",
    result: "Availability without a permanent demand for attention.",
  },
  {
    date: "13 Oct", title: "A navigation CTA", source: "53e7d0d",
    problem: "The dock was easy to miss while reading long pages.",
    decision: "“Ask Rose” moved into the right-hand navigation.",
    result: "Reachable, but now a second navigation-level call to action.",
  },
  {
    date: "14 Oct", title: "One place to return to", source: "33866a5 · 7752dbb",
    problem: "Two entry points divided attention and made Rose feel promotional.",
    decision: "Remove the navigation CTA; refine one dock as the interaction’s home.",
    result: "The page stays primary. Rose is present when invited.",
  },
];

const askRose = (text: string) => window.dispatchEvent(new CustomEvent("rose:ask", { detail: { text } }));

const useReducedMotion = () => {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
};

const useActiveIndex = (count: number) => {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.idx))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.slice(0, count).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [count]);
  return { refs, active, setActive };
};

/* The existing Rose dock mark, enlarged. Same geometry, not a new symbol. */
const CompassRose = ({ heading = 0, className, reduced }: { heading?: number; className?: string; reduced?: boolean }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="17" strokeWidth="0.35" />
    <circle cx="20" cy="20" r="5.5" strokeWidth="0.25" />
    <g
      style={{ transform: `rotate(${heading}deg)`, transformOrigin: "20px 20px", transition: reduced ? "none" : "transform 900ms cubic-bezier(.2,.7,.1,1)" }}
    >
      <path d="M20 3l4 13 13 4-13 4-4 13-4-13-13-4 13-4z" strokeWidth="0.4" />
      <path d="M20 3l4 13-4 4z" fill="currentColor" strokeWidth="0" opacity="0.85" />
      <path d="M8 8l6 6M32 8l-6 6M8 32l6-6M32 32l-6-6" strokeWidth="0.2" />
    </g>
  </svg>
);

/* Inline question that hands off to the real Rose dock. */
const RoseQuestion = ({ text, className }: { text: string; className?: string }) => (
  <Button
    variant="link"
    type="button"
    data-rose-q
    onClick={() => askRose(text)}
    className={cn(
      "group h-auto items-baseline justify-start gap-2 whitespace-normal p-0 text-left font-headline font-normal italic text-secondary underline decoration-secondary/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary",
      className,
    )}
  >
    <span aria-hidden="true" className="shrink-0 whitespace-nowrap not-italic font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Ask Rose</span>
    <span>{text}</span>
  </Button>
);

/* Rose is present only when she has something specific to point out. Her note
 * stays closed until the reader asks for it. The mark traces to the decision;
 * it never follows the visitor's cursor. */
const RoseIntervention = ({ children, heading = 0, className }: { children: string; heading?: number; className?: string }) => (
  <details className={cn("group/rose max-w-xl", className)}>
    <summary className="flex cursor-pointer list-none items-center gap-3 text-secondary marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary [&::-webkit-details-marker]:hidden">
      <span className="relative shrink-0">
        <CompassRose heading={heading} className="h-7 w-7 transition-transform duration-700 group-open/rose:rotate-12 group-hover/rose:rotate-6" />
        <span aria-hidden="true" className="absolute left-6 top-1/2 h-px w-5 origin-left bg-secondary/70 transition-transform duration-500 group-open/rose:scale-x-125 group-hover/rose:scale-x-125" />
      </span>
      <span className="font-label text-[10px] uppercase tracking-[0.18em]">Rose, on this decision <span aria-hidden="true" className="ml-1 normal-case group-open/rose:hidden">+</span><span aria-hidden="true" className="ml-1 normal-case hidden group-open/rose:inline">−</span></span>
    </summary>
    <p className="mt-3 border-l border-secondary/50 pl-4 font-headline text-lg italic leading-snug text-primary">{children}</p>
  </details>
);

const SectionBridge = ({ from, to, heading }: { from: string; to: string; heading: number }) => (
  <div aria-hidden="true" className="mx-auto flex max-w-5xl items-center gap-4 py-12 text-on-surface-variant md:py-16">
    <span className="h-px flex-1 bg-outline-variant" />
    <div className="flex items-center gap-3">
      <span className="font-label text-[10px] uppercase tracking-[0.16em]">{from}</span>
      <CompassRose heading={heading} className="h-8 w-8 text-secondary motion-safe:animate-pulse" />
      <span className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">{to}</span>
    </div>
    <span className="h-px flex-1 bg-outline-variant" />
  </div>
);

/* The real transformation: four intents become page questions. */
const ChipMorph = ({ reduced }: { reduced: boolean }) => {
  const [after, setAfter] = useState(false);
  const chips = after ? PAGE_CHIPS : ORIGINAL_CHIPS;
  return (
    <figure className="rounded-sm border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <figcaption className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          Dock starters {after ? "on /aetherix, after 7 Aug" : "on every page, 21 Jul"}
        </figcaption>
        <div role="group" aria-label="Choose a version" className="inline-flex rounded-full border border-outline-variant p-0.5 font-label text-xs">
          {["July", "August"].map((l, i) => (
            <button key={l} type="button" aria-pressed={after === (i === 1)} onClick={() => setAfter(i === 1)}
              className={cn("rounded-full px-3 py-1 transition-colors", after === (i === 1) ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary")}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="relative min-h-[96px]">
        {after && (
          <ul aria-hidden="true" className="absolute inset-0 flex flex-wrap content-start gap-2 opacity-20 blur-[0.5px]">
            {ORIGINAL_CHIPS.map((c) => <li key={c} className="rounded-full border border-dashed border-outline-variant px-3 py-1.5 font-label text-xs line-through">{c}</li>)}
          </ul>
        )}
        <ul className="relative flex flex-wrap gap-2" aria-live="polite">
          {chips.map((c, i) => (
            <li key={c} style={{ transitionDelay: reduced ? "0ms" : `${i * 70}ms` }}
              className={cn("rounded-full border px-3 py-1.5 font-label text-xs", after ? "border-secondary bg-surface text-primary motion-safe:animate-fade-in" : "border-outline-variant bg-surface text-on-surface-variant")}>
              {c}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 font-body text-sm text-on-surface-variant">
        {after ? "Questions about the work on the page. Booking stays, as one option among three." : "Who are you? The visitor is qualified before reading anything."}
      </p>
    </figure>
  );
};

/* ---------------- Concept A: Narrative split ---------------- */
const ConceptA = ({ reduced }: { reduced: boolean }) => {
  const { refs, active } = useActiveIndex(MILESTONES.length);
  return (
    <>
      <section className="relative overflow-hidden border-b border-outline-variant">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-16 md:grid-cols-12 md:pt-24">
          <p className="font-label text-[10px] uppercase tracking-[0.25em] text-secondary md:col-span-12">Case study · AI service design · Rose</p>
          <h1 className="font-headline text-[clamp(3rem,9vw,8.5rem)] font-light leading-[0.9] tracking-tight text-primary md:col-span-7">
            A portfolio
            <span className="block pl-[0.6em] italic text-secondary">you can</span>
            <span className="block">question.</span>
          </h1>
          <div className="flex flex-col justify-end gap-6 md:col-span-5">
            <div className="grid grid-cols-2 gap-px bg-outline-variant font-label text-xs">
              <div className="bg-surface p-4"><span className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">July</span><span className="mt-1 block font-headline text-xl text-primary">Qualify, then book</span></div>
              <div className="bg-surface p-4"><span className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">October</span><span className="mt-1 block font-headline text-xl italic text-secondary">Explore, then decide</span></div>
            </div>
            <p className="font-body text-base text-on-surface md:text-lg">
              Rose started as a lead qualifier. She became a way to question the work itself. This page is told by the same Rose it describes.
            </p>
            <RoseQuestion text="Why was Rose originally designed around booking?" className="text-lg" />
          </div>
        </div>
      </section>

      <section aria-label="Timeline, narrative split" className="mx-auto max-w-7xl px-6 py-20">
        <div className="sticky top-16 z-10 mb-10 hidden grid-cols-[1fr_auto_1fr] items-end gap-6 bg-surface/90 py-3 backdrop-blur-sm md:grid">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">What Rose was asked to do</span>
          <CompassRose heading={MILESTONES[active].heading} reduced={reduced} className="h-10 w-10 text-secondary" />
          <span className="text-right font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">What the page revealed</span>
        </div>
        <ol className="relative">
          {MILESTONES.map((m, i) => {
            const on = i === active;
            return (
              <li key={m.date} ref={(el) => (refs.current[i] = el)} data-idx={i} className="grid gap-4 py-10 md:grid-cols-[1fr_auto_1fr] md:gap-10 md:py-16">
                <div className={cn("transition-all duration-700 md:text-right", on ? "opacity-100" : "opacity-40", !reduced && !on && "md:-translate-x-6")}>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{m.date} · Intention</p>
                  <p className="mt-2 font-body text-base text-on-surface">{m.intention}</p>
                </div>
                <div className="relative flex flex-col items-center md:w-64">
                  <span className={cn("hidden h-px w-full origin-center bg-secondary transition-transform duration-700 md:block", on ? "scale-x-100" : "scale-x-0")} />
                  <h3 className={cn("mt-2 text-center font-headline leading-none transition-all duration-700", on ? "text-4xl text-primary md:text-5xl" : "text-2xl text-on-surface-variant md:text-3xl")}>{m.title}</h3>
                  <p className={cn("mt-3 max-w-xs text-center font-body text-sm transition-opacity duration-700", on ? "opacity-100" : "md:opacity-0")}>
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">Decision </span>{m.decision}
                  </p>
                </div>
                <div className={cn("transition-all duration-700", on ? "opacity-100" : "opacity-40", !reduced && !on && "md:translate-x-6")}>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Tension</p>
                  <p className="mt-2 font-body text-base text-on-surface">{m.tension}</p>
                  <p className="mt-4 font-headline text-lg italic text-secondary">{m.result}</p>
                  <p className="mt-3 font-label text-[10px] text-on-surface-variant">Source: {m.evidence}</p>
                  {(i === 1 || i === 4) && <RoseQuestion text={m.question} className="mt-5 text-base" />}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mx-auto mt-6 max-w-2xl"><ChipMorph reduced={reduced} /></div>
      </section>
    </>
  );
};

/* ---------------- Concept B: Evolving orientation ---------------- */
const ConceptB = ({ reduced }: { reduced: boolean }) => {
  const { refs, active, setActive } = useActiveIndex(MILESTONES.length);
  const m = MILESTONES[active];
  return (
    <>
      <section className="relative overflow-hidden border-b border-outline-variant bg-primary text-on-primary">
        <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-8 px-6 py-16 md:grid-cols-2">
          <div className="relative order-2 md:order-1">
            <p className="font-label text-[10px] uppercase tracking-[0.25em] opacity-70">Rose · A product that changed direction</p>
            <h1 className="mt-6 font-headline text-[clamp(2.75rem,7vw,6.5rem)] font-light leading-[0.95]">
              North was <span className="italic">the booking.</span>
              <span className="mt-2 block opacity-60">Then the needle moved.</span>
            </h1>
            <p className="mt-8 max-w-md font-body text-base opacity-85 md:text-lg">
              From July to October 2026, Rose turned from qualifying visitors to helping them explore the work. Five turns of the compass.
            </p>
          </div>
          <div className="relative order-1 mx-auto aspect-square w-[min(70vw,520px)] md:order-2">
            <CompassRose heading={reduced ? 0 : 300} reduced={reduced} className="h-full w-full [&_*]:[vector-effect:non-scaling-stroke]" />
            {[["N", "Book", "top-0 left-1/2 -translate-x-1/2"], ["E", "Page", "right-0 top-1/2 -translate-y-1/2"], ["S", "Context", "bottom-0 left-1/2 -translate-x-1/2"], ["W", "Trust", "left-0 top-1/2 -translate-y-1/2"]].map(([k, l, pos]) => (
              <span key={k} className={cn("absolute font-label text-[10px] uppercase tracking-[0.2em] opacity-70", pos)}>{l}</span>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Timeline, evolving orientation" className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="sticky top-14 z-10 -mx-6 self-start bg-surface/95 px-6 py-3 backdrop-blur-sm md:top-24 md:mx-0 md:bg-transparent md:p-0">
          <div className="flex items-center gap-4 md:block">
            <div className="relative h-20 w-20 shrink-0 md:h-auto md:w-full md:max-w-[420px] md:aspect-square">
              {MILESTONES.slice(0, active).map((g) => (
                <CompassRose key={g.date} heading={g.heading} reduced className="absolute inset-0 h-full w-full text-outline-variant opacity-30 md:[&_*]:[vector-effect:non-scaling-stroke]" />
              ))}
              <CompassRose heading={m.heading} reduced={reduced} className="absolute inset-0 h-full w-full text-secondary md:[&_*]:[vector-effect:non-scaling-stroke]" />
            </div>
            <div className="md:mt-6">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{m.date} · heading {m.heading}°</p>
              <p className="font-headline text-2xl text-primary md:text-4xl">{m.title}</p>
            </div>
          </div>
          <nav aria-label="Milestones" className="mt-4 hidden gap-2 md:flex">
            {MILESTONES.map((x, i) => (
              <button key={x.date} type="button" aria-current={i === active ? "step" : undefined}
                onClick={() => { refs.current[i]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }); setActive(i); }}
                className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= active ? "bg-secondary" : "bg-outline-variant")}>
                <span className="sr-only">{x.date}, {x.title}</span>
              </button>
            ))}
          </nav>
        </div>
        <ol>
          {MILESTONES.map((x, i) => (
            <li key={x.date} ref={(el) => (refs.current[i] = el)} data-idx={i}
              className={cn("border-l py-12 pl-6 transition-colors duration-500 md:min-h-[70vh] md:pl-10", i === active ? "border-secondary" : "border-outline-variant")}>
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{x.date}</p>
              <h3 className="mt-2 font-headline text-4xl text-primary md:text-6xl">{x.title}</h3>
              <dl className="mt-6 space-y-4 font-body text-base">
                <div><dt className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Original intention</dt><dd className="text-on-surface-variant line-through decoration-outline-variant">{x.intention}</dd></div>
                <div><dt className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Tension</dt><dd>{x.tension}</dd></div>
                <div><dt className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">Decision</dt><dd className="font-headline text-xl italic text-primary">{x.decision}</dd></div>
                <div><dt className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Experience</dt><dd>{x.result}</dd></div>
              </dl>
              <p className="mt-4 font-label text-[10px] text-on-surface-variant">Source: {x.evidence}</p>
              {i === 1 && <div className="mt-8"><ChipMorph reduced={reduced} /></div>}
              {(i === 0 || i === 4) && <RoseQuestion text={x.question} className="mt-6 text-lg" />}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

/* ---------------- Concept C: narrative prototype before Stage C ---------------- */
const ConceptC = ({ reduced }: { reduced: boolean }) => (
  <>
    <section aria-labelledby="scene-a" className="border-b border-outline-variant">
      <div className="mx-auto flex max-w-5xl flex-col justify-center px-6 py-16 md:py-20">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Rose · The story of a conversational portfolio</p>
        <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-center">
          <h1 id="scene-a" className="min-w-0 font-headline text-5xl font-normal leading-[1.02] text-primary sm:text-6xl lg:text-7xl">A portfolio <span className="italic text-secondary">you can question.</span></h1>
          <CompassRose heading={0} reduced={reduced} className="h-32 w-32 shrink-0 text-secondary md:h-48 md:w-48" />
        </div>
        <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-on-surface">The story behind Rose: why I built her, how the experience evolved, the decisions and trade-offs that shaped it, and what comes next.</p>
      </div>
    </section>
    <section aria-labelledby="rose-idea" className="mx-auto max-w-5xl px-6 py-20 md:py-24">
      <p className="font-label text-xs text-on-surface-variant">July–October 2026 · From qualification to exploration</p>
      <p className="mt-8 font-label text-xs uppercase tracking-[0.2em] text-secondary">01 · The idea</p>
      <h2 id="rose-idea" className="mt-4 max-w-2xl font-headline text-3xl leading-tight text-primary md:text-4xl">What if the portfolio could answer back?</h2>
      <div className="mt-6 max-w-2xl space-y-4 font-body text-base leading-relaxed text-on-surface md:text-lg">
        <p>A case study shows the work. It cannot anticipate every question someone brings to it. I built Rose to explore another way in: a conversation alongside the evidence.</p>
        <p>The first version shipped on 21 July 2026. Its brief was narrower than that possibility: help a visitor decide whether to book a conversation with me.</p>
      </div>
    </section>
    <section aria-labelledby="scene-b" className="border-b border-outline-variant bg-surface-container-low">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16 md:py-32">
        <div className="max-w-2xl">
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">02 · The first direction</p>
          <h2 id="scene-b" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">First, an invitation to book.</h2>
          <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">The July prompt aimed to help visitors decide, in two or three exchanges, whether to book 30 minutes. Four starters framed the opening around recruitment intentions.</p>
          <p className="mt-4 font-body text-base leading-relaxed text-on-surface md:text-lg">That objective shaped the experience: establish the visitor’s intention, then move toward a call. But someone could want to understand a product decision without being ready to meet.</p>
          <p className="mt-6 font-headline text-2xl italic text-secondary">A conversation is not necessarily a lead.</p>
        </div>
        <figure className="self-start rounded-sm border border-outline-variant bg-surface p-5 md:p-7">
          <figcaption className="mb-5 font-label text-xs text-on-surface-variant">July 2026 · Illustrative reconstruction</figcaption>
          <ul className="flex flex-wrap gap-2">{ORIGINAL_CHIPS.map((chip) => <li key={chip} className="rounded-full border border-outline-variant px-3 py-1.5 font-label text-xs text-on-surface-variant">{chip}</li>)}</ul>
        </figure>
      </div>
    </section>
    <section aria-labelledby="scene-c">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">03 · The change in direction</p>
          <h2 id="scene-c" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">Start with the work.</h2>
          <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">Instead of beginning by classifying the visitor, Rose increasingly began with the work they were exploring. A question about a product could lead into its decisions, limits and evidence, with contact still available.</p>
        </div>
        <RoseHistoryTransition reduced={reduced} renderCompass={(heading) => <CompassRose heading={heading} reduced={reduced} className="aspect-square w-full text-secondary" />} />
      </div>
    </section>
    <RoseLaterChapters reduced={reduced} ask={(text) => <RoseQuestion text={text} className="text-lg" />} compass={(heading, className) => <CompassRose heading={heading} reduced={reduced} className={cn("aspect-square w-full", className)} />} />
  </>
);

/* ---------------- Concept D: Stage C evidence-led narrative ---------------- */
const ConceptD = ({ reduced }: { reduced: boolean }) => {
  const { refs, active } = useActiveIndex(5);
  const readingSteps = [
    { title: "Product direction", heading: 0, target: "#rose-idea" },
    { title: "Experience design", heading: 120, target: "#ux-evolution" },
    { title: "Trust and answer quality", heading: 215, target: "#ch-trust" },
    { title: "Contextual assistant", heading: 270, target: "#ch-next" },
    { title: "Open questions", heading: 300, target: "#ch-learn" },
  ];
  const current = readingSteps[active];
  const story = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(story);
  const compass = (h: number) => <CompassRose heading={h} reduced={reduced} className="h-full w-full" />;
  return (
    <>
      <section aria-labelledby="scene-a" className="border-b border-outline-variant">
        <div className="mx-auto flex max-w-5xl flex-col justify-center px-6 py-16 md:py-20">
          <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Rose · The story of a conversational portfolio</p>
          <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-center">
            <h1 id="scene-a" className="min-w-0 font-headline text-5xl font-normal leading-[1.02] text-primary sm:text-6xl lg:text-7xl">
              A portfolio <span className="italic text-secondary">you can question.</span>
            </h1>
            <CompassRose heading={0} reduced={reduced} className="h-32 w-32 shrink-0 text-secondary md:h-48 md:w-48" />
          </div>
          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-on-surface">
            I built Rose to make a portfolio easier to question. This is the decision record: why her direction changed, the evidence behind each turn, and what remains open.
          </p>
          <p className="mt-8 max-w-3xl border-l border-outline-variant pl-4 font-body text-sm leading-relaxed text-on-surface-variant">
            Method note. This reconstruction is grounded in commits, product records and bounded tests from July to October 2026. It distinguishes implemented behaviour, validation and future design. It does not claim measured visitor outcomes.
          </p>
          <EvidenceKey className="mt-8 max-w-4xl" />
          <nav aria-labelledby="rose-contents" className="mt-10 max-w-md border-t border-outline-variant pt-5">
            <p id="rose-contents" className="flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] leading-none">list</span>
              Contents<span className="text-on-surface-variant"> · {readingSteps.length} chapters</span>
            </p>
            <ol className="mt-4 list-none space-y-1 p-0">
              {readingSteps.map((step, index) => (
                <li key={step.title}>
                  <a href={step.target} className="block border-l-2 border-outline-variant py-1.5 pl-3 font-body text-sm text-on-surface-variant transition-colors hover:border-outline hover:bg-surface-container-low hover:text-primary focus-visible:border-secondary focus-visible:outline-none">
                    <span className="mr-2 font-label text-[10px] tracking-[0.14em] text-secondary">{String(index + 1).padStart(2, "0")}</span>{step.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <div ref={story} className="mx-auto grid max-w-7xl gap-12 px-6 py-20 xl:grid-cols-[12rem_minmax(0,1fr)] xl:py-28">
        <nav className="hidden self-start xl:sticky xl:top-28 xl:block" aria-label="Contents, current chapter">
          <CompassRose heading={reduced ? current.heading : progress * 300} reduced className="h-28 w-28 text-secondary" />
          <div aria-hidden="true" className="mt-4 h-px w-28 bg-outline-variant"><div className="h-px origin-left bg-secondary" style={{ transform: `scaleX(${progress})` }} /></div>
          <p className="mt-4 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Contents</p>
          <ol className="mt-3 list-none space-y-1 p-0">
            {readingSteps.map((step, index) => (
              <li key={step.title}>
                <a href={step.target} aria-current={index === active ? "location" : undefined}
                  className={cn("block border-l-2 py-1.5 pl-3 font-label text-[10px] uppercase leading-snug tracking-[0.14em] transition-colors",
                    index === active ? "border-secondary bg-secondary/10 text-primary" : "border-outline-variant text-on-surface-variant hover:border-outline hover:text-primary")}>
                  {String(index + 1).padStart(2, "0")} · {step.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div>
          <section ref={(el) => { refs.current[0] = el; }} data-idx={0} aria-labelledby="rose-idea" className="max-w-3xl">
            <p className="font-label text-xs text-on-surface-variant">July–October 2026 · From qualification to exploration</p>
            <div className="mt-8 flex flex-wrap items-center gap-3"><EvidenceStatus state="design" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Product direction</span></div>
            <h2 id="rose-idea" className="mt-4 font-headline text-3xl leading-tight text-primary md:text-5xl">What if the portfolio could answer back?</h2>
            <div className="mt-6 max-w-2xl space-y-4 font-body text-base leading-relaxed text-on-surface md:text-lg">
              <p>A case study shows the work. It cannot anticipate <RoseMark reduced={reduced}>every question someone brings to it</RoseMark>. I built Rose to create another way in: a conversation alongside the evidence.</p>
              <p>The first version shipped on 21 July 2026. Its brief was narrower: help a visitor decide whether to book a conversation with me.</p>
            </div>
            <RoseIntervention heading={0} className="mt-8 max-w-xl">“A portfolio is a lot of reading. I was the footnote that could answer back.”</RoseIntervention>
          </section>

          <section aria-labelledby="scene-b" className="mt-24 border-y border-outline-variant bg-surface-container-low px-6 py-16 md:mt-32 md:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3"><EvidenceStatus state="built" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">21 July 2026 · 4 starters · 2–3 exchanges · 30 min call</span></div>
                <h2 id="scene-b" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">First, an invitation to book.</h2>
                <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">The July prompt framed four starters around recruitment intent and aimed to reach a booking decision within two or three exchanges.</p>
                <p className="mt-4 font-body text-base leading-relaxed text-on-surface md:text-lg">That was a deliberate starting point. I changed it because a visitor can need useful evidence before deciding whether a conversation with me would add anything.</p>
                <p className="mt-6 font-headline text-2xl italic text-secondary"><RoseMark kind="circle" reduced={reduced} delay={300}>Offer proof</RoseMark> before asking for commitment.</p>
                <RoseAside reduced={reduced} className="mt-6">I would have booked the call myself. Apparently that is not the point.</RoseAside>
                <RoseIntervention heading={0} className="mt-8">“My first job was to sort you into four boxes. Nobody likes boxes.”</RoseIntervention>
                <p className="mt-8 font-body text-xs leading-relaxed text-on-surface-variant">Source · original prompt and configuration, commit 51245fc.</p>
              </div>
              <figure className="self-start rounded-sm border border-outline-variant bg-surface p-5 md:p-7">
                <figcaption className="mb-5 font-label text-xs text-on-surface-variant">July 2026 · Interface reconstruction</figcaption>
                <ul className="flex flex-wrap gap-2">
                  {ORIGINAL_CHIPS.map((chip) => <li key={chip} className="rounded-full border border-outline-variant px-3 py-1.5 font-label text-xs text-on-surface-variant">{chip}</li>)}
                </ul>
                <div className="mt-6 space-y-3 font-body text-sm">
                  <p className="ml-auto w-fit max-w-[85%] rounded-sm bg-surface-container-low px-3 py-2 text-on-surface">What has Ivan actually built?</p>
                  <p className="max-w-[85%] text-on-surface">Ivan builds agentic products end to end. Are you hiring for a product role?</p>
                  <div className="max-w-[85%] rounded-sm border border-secondary px-3 py-2"><p className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">Book 30 minutes with Ivan</p><p className="mt-1 text-on-surface-variant">The intended destination of the exchange.</p></div>
                </div>
              </figure>
            </div>
          </section>

          <KineticBridge from="Product direction" to="Experience design" heading={75} compass={compass} reduced={reduced} />

          <section ref={(el) => { refs.current[1] = el; }} data-idx={1} aria-labelledby="ux-evolution" className="border-y border-outline-variant bg-surface-container-low px-6 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">UX/UI · Interface evolution</p>
              <h2 id="ux-evolution" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">The interface had to carry the new direction.</h2>
              <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">This was interface work, not a cosmetic sequence. Each version tested where help could live without asking the reader to stop reading, choose a funnel, or mistake Rose for the point of the page.</p>
            </div>
            <DockScene iterations={UX_ITERATIONS} reduced={reduced} />
          </section>

          <section aria-labelledby="scene-c" className="max-w-5xl py-24 md:py-32">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3"><EvidenceStatus state="built" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">7 August 2026 · route-specific starters</span></div>
              <h2 id="scene-c" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">Make the page the starting point.</h2>
              <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">I replaced fixed intents with questions tied to the page being read, then passed the page address and selected starter into Rose’s context. These are two mechanisms of one decision: <RoseMark reduced={reduced}>start from the work, not from a guessed visitor profile</RoseMark>.</p>
            </div>
            <RoseHistoryTransition reduced={reduced} renderCompass={(heading) => <CompassRose heading={heading} reduced={reduced} className="aspect-square w-full text-secondary" />} />
            <div className="mt-10 max-w-2xl">
              <RoseIntervention heading={80}>“He stopped asking who you are. I started asking what you were reading.”</RoseIntervention>
              <p className="mt-8 font-body text-xs text-on-surface-variant">Source · contextual starters plan and implementation, 7 August.</p>
            </div>
          </section>

          <section aria-labelledby="scene-d" className="border-y border-outline-variant bg-surface-container-low px-6 py-16 md:py-20">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3"><EvidenceStatus state="built" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">10 August 2026 · page address + selected starter</span></div>
              <h2 id="scene-d" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">Know where you are.</h2>
              <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">Rose receives the page address and the intent behind a selected starter. That is enough to ground an answer in the work in front of the visitor, without pretending to see their screen, cursor or private browser state.</p>
              <RoseAside reduced={reduced} className="mt-6">Everything I know about you fits in one address bar. I find that restful.</RoseAside>
            </div>
            <figure aria-label="Context Rose receives with a question" className="mt-10 grid max-w-4xl gap-px border border-outline-variant bg-outline-variant md:grid-cols-3">
              {[['Page', 'Address of the page being read'], ['Optional choice', 'Intent behind a selected starter'], ['Not available', 'Screen, cursor and private browser state']].map(([title, detail], index) => (
                <div key={title} className={cn('bg-surface p-5', index === 2 && 'bg-surface-container-low')}>
                  <p className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">{title}</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-on-surface">{detail}</p>
                </div>
              ))}
            </figure>
            <div className="mt-8 max-w-2xl"><RoseIntervention heading={150}>“I can read the page. I can’t read your mind. Conveniently, neither should I.”</RoseIntervention></div>
            <p className="mt-8 font-body text-xs text-on-surface-variant">Source · page-context integration, commit b236ff3, 10 August.</p>
          </section>

          <section aria-labelledby="scene-e" className="max-w-5xl py-24 md:py-32">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3"><EvidenceStatus state="built" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">7 August 2026 · quiet at rest, present on request</span></div>
                <h2 id="scene-e" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">One quiet dock.</h2>
                <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">The dock became a translucent veil at rest and returned to full contrast on hover, focus or use. Its job is to remain available without competing with the case study.</p>
                <div className="mt-8"><RoseIntervention heading={215}>“I learned to wait until I was invited. It’s better for both of us.”</RoseIntervention></div>
                <p className="mt-8 font-body text-xs text-on-surface-variant">Source · quiet-dock plan and implementation, commit 4efe2b8, 7 August.</p>
              </div>
              <div className="rounded-sm border border-outline-variant bg-surface-container-low p-5">
                <CompassRose heading={215} reduced={reduced} className="mx-auto h-20 w-20 text-secondary" />
                <p className="mt-5 text-center font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Available, not insistent</p>
              </div>
            </div>
          </section>
          <KineticBridge from="Experience design" to="Trust and answer quality" heading={210} compass={compass} reduced={reduced} />
          <div className="-mx-6">
            <RoseLaterChapters reduced={reduced} nextLab={<ContextualLab reduced={reduced} />}
              ask={(text) => <RoseQuestion text={text} className="text-lg" />}
              compass={(heading, className) => <CompassRose heading={heading} reduced={reduced} className={cn("aspect-square w-full", className)} />}
              trustRef={(el) => { refs.current[2] = el; }} trustIndex={2}
              nextRef={(el) => { refs.current[3] = el; }} nextIndex={3}
              learningRef={(el) => { refs.current[4] = el; }} learningIndex={4} />
          </div>
        </div>
      </div>
    </>
  );
};

const RoseDesignLab = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get("concept");
  const concept = raw === "a" || raw === "b" || raw === "narrative" ? raw : "d";
  const reduced = useReducedMotion();
  return (
    <SiteLayout showFooter={false}>
      <Seo title="Rose design lab" description="An unlinked prototype for Rose's evidence-led case study." noIndex path="/rose-design-lab" />
      <div className="mt-20 border-b border-outline-variant bg-surface-container-low">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 font-label text-xs">
          <span className="uppercase tracking-[0.2em] text-on-surface-variant">Design lab · unlinked prototype</span>
          <div role="tablist" aria-label="Concept" className="inline-flex flex-wrap rounded-full border border-outline-variant p-0.5">
            {[["a", "A · Narrative split"], ["b", "B · Evolving orientation"], ["narrative", "C · Narrative prototype"], ["d", "D · Stage C evidence-led"]].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={concept === k} type="button" onClick={() => { setParams({ concept: k }); window.scrollTo(0, 0); }}
                className={cn("rounded-full px-3 py-1", concept === k ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary")}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      {concept === "a" ? <><ConceptA reduced={reduced} /><ChapterQualityAssurance /></> : concept === "b" ? <><ConceptB reduced={reduced} /><ChapterQualityAssurance /></> : concept === "narrative" ? <ConceptC reduced={reduced} /> : <ConceptD reduced={reduced} />}
      <aside className="mx-auto max-w-3xl px-6 pb-24 font-body text-sm text-on-surface-variant">
        Ask Rose links open the portfolio dock. Sources and evidence states above distinguish what is built, bounded by validation, or still in design. <Link to="/" className="underline">Back to the site</Link>
      </aside>
    </SiteLayout>
  );
};

export default RoseDesignLab;
