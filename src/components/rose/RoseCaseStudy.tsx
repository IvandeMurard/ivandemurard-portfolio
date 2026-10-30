import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CompassRose } from "@/components/rose/CompassRose";

/**
 * Rose case study, single page (docs/rose-case-study.md §6). Only §6.0
 * Page-wide is built here: continuous background, copper reading thread,
 * table of contents, honesty legend and chapter transitions. Chapter bodies
 * are slots (kicker + heading + transition) until their own section is built.
 * All copy is verbatim from docs/rose-case-study-copy.md.
 */

type Chapter = { id: string; toc: string; kicker: string; heading: string; transition?: string };

export const ROSE_CHAPTERS: Chapter[] = [
  { id: "ch-00", toc: "00 The idea", kicker: "00 · The idea", heading: "What if the portfolio could answer back?", transition: "So the first version did one thing: qualify." },
  { id: "ch-01", toc: "01 Qualify", kicker: "01 · 21 Jul 2026", heading: "Qualify", transition: "One destination, and the same four boxes whatever page you were on. That was the next problem." },
  { id: "ch-02", toc: "02 Listen to the page", kicker: "02 · 7 Aug 2026", heading: "Listen to the page", transition: "The questions now started from the page. The answers did not, yet." },
  { id: "ch-03", toc: "03 Know where you are", kicker: "03 · 10 Aug 2026", heading: "Know where you are", transition: "Rose knew where you were. Where she should live was the next question." },
  { id: "ch-04", toc: "04 One quiet dock", kicker: "04 · 14 Oct 2026", heading: "One quiet dock", transition: "Quiet until asked. Then: what happens to what you tell her?" },
  { id: "ch-05", toc: "05 Earn trust", kicker: "05 · 24 Oct 2026", heading: "Earn trust", transition: "Five decisions later, here is what she does today." },
  { id: "ch-06", toc: "06 What Rose can do now", kicker: "06 · What Rose can do now", heading: "Ask about what you're reading.", transition: "What she does is narrow on purpose. What she may keep, and say, is narrower still." },
  { id: "ch-07", toc: "07 Trust", kicker: "07 · Trust", heading: "Trust has two separate contracts.", transition: "Contracts are only as good as the checks behind them." },
  { id: "ch-08", toc: "08 What she got wrong", kicker: "08 · What she got wrong", heading: "What she got wrong, and how I check her.", transition: "The checks cover what she does today. Here is what comes next, and why it waits." },
  { id: "ch-09", toc: "09 Next steps", kicker: "09 · Next steps", heading: "Make the whole site easier to navigate, not just one reply.", transition: "Some things I have not settled. I would rather say so." },
  { id: "ch-10", toc: "10 Open questions", kicker: "10 · Open questions", heading: "Questions I am leaving open, rather than calling them features." },
];

const LEGEND_TONE: Record<string, string> = { Built: "text-secondary", Validation: "text-primary", Design: "text-on-surface-variant" };

const LEGEND = [
  ["●", "Built", "Implemented behaviour that can be inspected in the product or repository."],
  ["◐", "Validation", "A bounded test, audit or measurement. It does not prove every visitor outcome."],
  ["○", "Design", "A proposed direction or prototype, not a deployed behaviour."],
] as const;

/* §6.1 Hero. Copy verbatim from docs/rose-case-study-copy.md. */
const HERO_Q = "Why was Rose first built around booking?";
const HERO_A = "Ivan's first brief was narrow: help you decide, in two or three exchanges, whether to book 30 minutes with him. He changed it in August.";
const TLDR = [
  ["The problem", "A case study shows the work. It cannot answer the question a visitor brings."],
  ["Five decisions", "July to October 2026: qualify, listen to the page, know where you are, one quiet dock, earn trust."],
  ["Today", "Live, text only. Rose knows the page and section in view, answers from the site’s own text, and sends nothing when you book."],
  ["Still open", "Whether a source-faithful answer helps each reader understand the work from their own angle."],
] as const;

/** Scripted replay styled as the dock: question, reading status, answer, Locate, source. */
const HeroDock = ({ reduced }: { reduced: boolean }) => {
  const [step, setStep] = useState(reduced ? 3 : 0);
  useEffect(() => {
    if (reduced) { setStep(3); return; }
    const ts = [400, 1600, 3000].map((d, i) => window.setTimeout(() => setStep(i + 1), d));
    return () => ts.forEach(window.clearTimeout);
  }, [reduced]);
  const locate = () => {
    // Until §6.3 exists, Locate only scrolls to chapter 01.
    const el = document.getElementById("ch-01-decision") ?? document.getElementById("ch-01");
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: reduced ? "none" : "opacity 500ms ease" });
  return (
    <div data-rose-hero aria-label="Rose, one example exchange" className="flex min-h-[20rem] flex-col rounded-2xl border border-transparent bg-primary p-5 text-on-primary shadow-xl shadow-primary/10 [[data-mood=dusk]_&]:border-outline-variant [[data-mood=dusk]_&]:bg-surface-container-high [[data-mood=dusk]_&]:text-on-surface">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-headline text-base italic"><CompassRose heading={0} reduced className="h-5 w-5" />Rose</span>
        <span className="font-label text-[10px] opacity-80">reading: /rose · hero</span>
      </div>
      <div className="mt-6 flex flex-1 flex-col gap-3" aria-live="polite">
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-on-primary/10 [[data-mood=dusk]_&]:bg-on-surface/10 px-4 py-2 font-body text-sm" style={fade(step >= 1)}>{HERO_Q}</p>
        {step === 2 && <p className="font-label text-xs opacity-80">Rose is reading the page…</p>}
        {step >= 3 && (
          <div style={fade(true)}>
            <p className="font-body text-sm leading-relaxed">{HERO_A}</p>
            <button type="button" onClick={locate} className="mt-3 rounded-md border border-secondary-fixed-dim [[data-mood=dusk]_&]:border-secondary px-3 py-1 font-label text-xs hover:bg-on-primary/10 [[data-mood=dusk]_&]:hover:bg-on-surface/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary [[data-mood=dusk]_&]:focus-visible:outline-secondary">Locate · where he changed it ↓</button>
            <p className="mt-2 font-label text-[10px] opacity-80">Source: original prompt, commit 51245fc</p>
          </div>
        )}
      </div>
      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:open"))}
        className="mt-4 rounded-lg border border-on-primary/30 [[data-mood=dusk]_&]:border-outline-variant px-3 py-2 text-left font-body text-xs opacity-90 hover:border-on-primary/60 [[data-mood=dusk]_&]:hover:border-on-surface/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-on-primary [[data-mood=dusk]_&]:focus-visible:outline-secondary">Ask Rose anything</button>
    </div>
  );
};

const RoseHero = ({ reduced }: { reduced: boolean }) => (
  <header aria-labelledby="rose-hero-h">
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
      <div>
        <p className="flex flex-wrap items-center gap-3 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">
          Case study · AI service design · Rose
          <span className="rounded-full border border-outline-variant px-2 py-0.5 text-on-surface">● Live · text only</span>
        </p>
        <h1 id="rose-hero-h" className="mt-5 font-headline text-5xl leading-[1.05] text-primary [[data-mood=dusk]_&]:text-on-surface md:text-7xl">
          A portfolio <em className="text-secondary">you can question.</em>
        </h1>
        <p className="mt-6 max-w-xl font-body text-lg text-on-surface">The story behind Rose: why I built her, the five decisions that reshaped her, and the questions I am leaving open.</p>
        <p className="mt-4 font-label text-xs text-on-surface-variant">July to October 2026 · five decisions · sources from the repository</p>
      </div>
      <HeroDock reduced={reduced} />
    </div>
    <section aria-labelledby="rose-tldr" className="mt-14 border-t border-outline-variant pt-4">
      <h2 id="rose-tldr" className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">TL;DR</h2>
      <dl className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TLDR.map(([t, d]) => (
          <div key={t} className="border-b border-outline-variant pb-4">
            <dt className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">{t}</dt>
            <dd className="mt-2 font-body text-sm text-on-surface">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  </header>
);

export const RoseCaseStudy = ({ reduced }: { reduced: boolean }) => {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = root.current;
      if (!el) return;
      // Active chapter: the last one whose top crossed 40% of the viewport; none before chapter 00.
      let next = -1;
      el.querySelectorAll<HTMLElement>("[data-ch]").forEach((c) => { if (c.getBoundingClientRect().top <= window.innerHeight * 0.4) next = Number(c.dataset.ch); });
      setActive(next);
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const current = ROSE_CHAPTERS[active];
  const needleTurn = Math.max(0, active) * (300 / (ROSE_CHAPTERS.length - 1));
  const toc = (onPick?: () => void) => (
    <ol className="list-none space-y-1 p-0">
      {ROSE_CHAPTERS.map((c, i) => (
        <li key={c.id}>
          <a href={`#${c.id}`} onClick={onPick} aria-current={i === active ? "location" : undefined}
            className={cn("block border-l-2 py-1 pl-3 font-label text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary",
              i === active ? "border-secondary text-primary" : "border-transparent text-on-surface-variant hover:text-primary")}>
            {c.toc}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div ref={root} className="rose-case-bg relative">
      {/* Copper reading thread, left margin. */}
      <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-2 top-0 z-20 w-px bg-outline-variant md:left-4">
        <div className="h-full w-px origin-top bg-rose-copper" style={{ transform: `scaleY(${progress})`, transition: reduced ? "none" : "transform 120ms linear" }} />
      </div>

      {/* Mobile: one-line sticky bar. */}
      <details ref={details} className="sticky top-[76px] z-30 border-b border-outline-variant bg-surface/95 px-6 py-3 backdrop-blur-sm lg:hidden">
        <summary className="cursor-pointer list-none font-label text-xs text-primary [&::-webkit-details-marker]:hidden">
          {current ? `${current.toc} · ` : ""}On this page <span aria-hidden="true">▾</span>
        </summary>
        <nav aria-label="On this page" className="mt-3">{toc(() => details.current?.removeAttribute("open"))}</nav>
      </details>

      <div className="mx-auto max-w-7xl px-8 pt-16 md:px-12">
        <RoseHero reduced={reduced} />
        <section aria-labelledby="rose-legend" className="mt-16 max-w-3xl">
          <h2 id="rose-legend" className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">How to read this case study</h2>
          <dl className="mt-3 space-y-1 font-body text-sm text-on-surface">
            {LEGEND.map(([mark, term, def]) => (
              <div key={term} className="flex gap-2"><dt className={cn("w-28 shrink-0 font-label text-xs", LEGEND_TONE[term])}><span aria-hidden="true">{mark} </span>{term}</dt><dd>{def}</dd></div>
            ))}
          </dl>
          <p className="mt-3 font-body text-xs text-on-surface-variant">Milestones come from the repository: commit dates, archived plans, the original prompt. Readings of the design are mine.</p>
        </section>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-8 pb-16 md:px-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
          <CompassRose heading={needleTurn} reduced={reduced} className="h-16 w-16 text-secondary" />
          <p className="mt-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">On this page</p>
          <nav aria-label="On this page" className="mt-3">{toc()}</nav>
        </aside>

        <div className="min-w-0">
          {ROSE_CHAPTERS.map((c, i) => (
            <section key={c.id} id={c.id} data-ch={i} aria-labelledby={`${c.id}-h`} className="max-w-3xl scroll-mt-32 pt-24 md:pt-32">
              <p className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">{c.kicker}</p>
              <h2 id={`${c.id}-h`} className="mt-3 font-headline text-4xl leading-tight text-primary md:text-5xl">{c.heading}</h2>
              {c.transition && <p className="mt-16 font-headline text-xl italic text-on-surface">{c.transition}</p>}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
