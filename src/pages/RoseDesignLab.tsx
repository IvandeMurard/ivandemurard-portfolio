import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoseHistoryTransition } from "@/components/rose/RoseHistoryTransition";
import { RoseLaterChapters, ChapterQualityAssurance } from "@/components/rose/RoseLaterChapters";
import { EvidenceKey, EvidenceStatus } from "@/components/EvidenceStatus";

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
    date: "14 Oct 2026",
    title: "One quiet dock",
    intention: "Several entry points to Rose.",
    tension: "Design reading: a dock competing with the page reads as a sales widget.",
    decision: "Unify the dock: discreet at rest, full contrast in use, chips by page.",
    result: "Rose stays out of the way until asked.",
    heading: 215,
    question: "Why is the dock so discreet at rest?",
    evidence: "Commit 7752dbb, unified dock and chips",
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

const RoseAside = ({ children, heading = 0, className }: { children: string; heading?: number; className?: string }) => (
  <aside aria-label="Rose's note" className={cn("border-l-2 border-secondary pl-4", className)}>
    <div className="flex items-center gap-2">
      <CompassRose heading={heading} className="h-5 w-5 text-secondary" />
      <span className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Rose, in the margin</span>
    </div>
    <p className="mt-2 font-headline text-lg italic leading-snug text-primary">{children}</p>
  </aside>
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

/* ---------------- Concept C: Narrative prototype (Scenes A, B, C) ---------------- */
const ConceptC = ({ reduced }: { reduced: boolean }) => {
  const { refs, active } = useActiveIndex(3);
  const readingSteps = MILESTONES.map((milestone) => ({
    title: milestone.title,
    heading: milestone.heading,
    target: milestone.title === "Qualify" ? "#scene-b" : milestone.title === "Earn trust" ? "#ch-trust" : "#scene-c",
  }));
  const current = MILESTONES[active];
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
          <nav aria-label="Case study chapters" className="mt-10 flex flex-wrap gap-x-4 gap-y-3 border-t border-outline-variant pt-5">
            {readingSteps.map((step, index) => (
              <a key={step.title} href={step.target} className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant underline decoration-outline-variant underline-offset-4 hover:text-secondary hover:decoration-secondary">
                {String(index + 1).padStart(2, "0")} · {step.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 xl:grid-cols-[12rem_minmax(0,1fr)] xl:py-28">
        <aside className="hidden self-start xl:sticky xl:top-28 xl:block" aria-label="Current point in the Rose story">
          <CompassRose heading={current.heading} reduced={reduced} className="h-28 w-28 text-secondary" />
          <p className="mt-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Now · {current.title}</p>
          <ol className="mt-5 space-y-2">
            {MILESTONES.slice(0, 3).map((milestone, index) => (
              <li key={milestone.title} className={cn("font-label text-[10px] uppercase tracking-[0.14em]", index === active ? "text-secondary" : "text-on-surface-variant")}>{String(index + 1).padStart(2, "0")} · {milestone.title}</li>
            ))}
          </ol>
        </aside>
        <div>
          <section ref={(el) => { refs.current[0] = el; }} data-idx={0} aria-labelledby="rose-idea" className="max-w-3xl">
            <p className="font-label text-xs text-on-surface-variant">July–October 2026 · From qualification to exploration</p>
            <div className="mt-8 flex flex-wrap items-center gap-3"><EvidenceStatus state="design" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Decision frame</span></div>
            <h2 id="rose-idea" className="mt-4 font-headline text-3xl leading-tight text-primary md:text-5xl">What if the portfolio could answer back?</h2>
            <div className="mt-6 max-w-2xl space-y-4 font-body text-base leading-relaxed text-on-surface md:text-lg">
              <p>A case study shows the work. It cannot anticipate every question someone brings to it. I built Rose to create another way in: a conversation alongside the evidence.</p>
              <p>The first version shipped on 21 July 2026. Its brief was narrower: help a visitor decide whether to book a conversation with me.</p>
            </div>
            <RoseAside heading={0} className="mt-8 max-w-xl">“A portfolio is a lot of reading. I was the footnote that could answer back.”</RoseAside>
          </section>

          <section ref={(el) => { refs.current[1] = el; }} data-idx={1} aria-labelledby="scene-b" className="mt-24 border-y border-outline-variant bg-surface-container-low px-6 py-16 md:mt-32 md:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3"><EvidenceStatus state="built" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">21 July 2026 · 4 starters · 2–3 exchanges · 30 min call</span></div>
                <h2 id="scene-b" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">First, an invitation to book.</h2>
                <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">The July prompt framed four starters around recruitment intent and aimed to reach a booking decision within two or three exchanges.</p>
                <p className="mt-4 font-body text-base leading-relaxed text-on-surface md:text-lg">That was a deliberate starting point. I changed it because someone can want to inspect a product decision without being ready to meet.</p>
                <p className="mt-6 font-headline text-2xl italic text-secondary">A conversation is not necessarily a lead.</p>
                <RoseAside heading={0} className="mt-8">“My first job was to sort you into four boxes. Nobody likes boxes.”</RoseAside>
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

          <section ref={(el) => { refs.current[2] = el; }} data-idx={2} aria-labelledby="scene-c" className="max-w-5xl py-24 md:py-32">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3"><EvidenceStatus state="built" /><span className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">7–10 August 2026 · page-specific starters · page context</span></div>
              <h2 id="scene-c" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">Start with the work.</h2>
              <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">I replaced fixed intents with questions tied to the page being read, then passed the current page and selected intent into Rose’s context. Booking stayed available, but stopped being the default subject of the exchange.</p>
            </div>
            <RoseHistoryTransition reduced={reduced} renderCompass={(heading) => <CompassRose heading={heading} reduced={reduced} className="aspect-square w-full text-secondary" />} />
            <div className="mt-10 max-w-2xl">
              <RoseAside heading={150}>“He stopped asking who you are. I started asking what you were reading.”</RoseAside>
              <p className="mt-8 font-body text-base leading-relaxed text-on-surface">The dock followed the same rule: quieter at rest, full contrast when used. Context should be available without competing with the case study.</p>
              <p className="mt-4 font-body text-xs text-on-surface-variant">Sources · contextual starters plan, 7 August; page-context integration, commit b236ff3, 10 August; quiet dock, commit 4efe2b8.</p>
              <div className="mt-8"><RoseQuestion text="What has Ivan actually built?" className="text-lg" /></div>
            </div>
          </section>
        </div>
      </div>
      <RoseLaterChapters reduced={reduced}
        ask={(text) => <RoseQuestion text={text} className="text-lg" />}
        compass={(heading) => <CompassRose heading={heading} reduced={reduced} className="aspect-square w-full" />} />
    </>
  );
};

const RoseDesignLab = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get("concept");
  const concept = raw === "a" || raw === "b" ? raw : "narrative";
  const reduced = useReducedMotion();
  return (
    <SiteLayout>
      <Seo title="Rose design lab" description="An unlinked prototype for Rose's evidence-led case study." noIndex path="/rose-design-lab" />
      <div className="mt-20 border-b border-outline-variant bg-surface-container-low">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 font-label text-xs">
          <span className="uppercase tracking-[0.2em] text-on-surface-variant">Design lab · unlinked prototype</span>
          <div role="tablist" aria-label="Concept" className="inline-flex flex-wrap rounded-full border border-outline-variant p-0.5">
            {[["a", "A · Narrative split"], ["b", "B · Evolving orientation"], ["narrative", "C · Narrative prototype"]].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={concept === k} type="button" onClick={() => { setParams({ concept: k }); window.scrollTo(0, 0); }}
                className={cn("rounded-full px-3 py-1", concept === k ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary")}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      {concept === "a" ? <><ConceptA reduced={reduced} /><ChapterQualityAssurance /></> : concept === "b" ? <><ConceptB reduced={reduced} /><ChapterQualityAssurance /></> : <ConceptC reduced={reduced} />}
      <aside className="mx-auto max-w-3xl px-6 pb-24 font-body text-sm text-on-surface-variant">
        Ask Rose links open the portfolio dock. Sources and evidence states above distinguish what is built, bounded by validation, or still in design. <Link to="/" className="underline">Back to the site</Link>
      </aside>
    </SiteLayout>
  );
};

export default RoseDesignLab;
