import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  { id: "ch-01", toc: "01 Qualify", kicker: "01 · 21 Jul 2026 · Qualify", heading: "Qualify", transition: "One destination, and the same four boxes whatever page you were on. That was the next problem." },
  { id: "ch-02", toc: "02 Listen to the page", kicker: "02 · 7 Aug 2026 · Listen to the page", heading: "Listen to the page", transition: "The questions now started from the page. The answers did not, yet." },
  { id: "ch-03", toc: "03 Know where you are", kicker: "03 · 10 Aug 2026 · Know where you are", heading: "Know where you are", transition: "Rose knew where you were. Where she should live was the next question." },
  { id: "ch-04", toc: "04 One quiet dock", kicker: "04 · 14 Oct 2026 · One quiet dock", heading: "One quiet dock", transition: "Quiet until asked. Then: what happens to what you tell her?" },
  { id: "ch-05", toc: "05 Earn trust", kicker: "05 · 24 Oct 2026 · Earn trust", heading: "Earn trust", transition: "Five decisions later, here is what she does today." },
  { id: "ch-06", toc: "06 What Rose can do now", kicker: "06 · What Rose can do now", heading: "Ask about what you're reading.", transition: "What she does is narrow on purpose. What she may keep, and say, is narrower still." },
  { id: "ch-07", toc: "07 Trust", kicker: "07 · Trust", heading: "Trust has two separate contracts.", transition: "Contracts are only as good as the checks behind them." },
  { id: "ch-08", toc: "08 What she got wrong", kicker: "08 · What she got wrong", heading: "What she got wrong, and how I check her.", transition: "The checks cover what she does today. Here is what comes next, and why it waits." },
  { id: "ch-09", toc: "09 Next steps", kicker: "09 · Next steps", heading: "Make the whole site easier to navigate, not just one reply.", transition: "Some things I have not settled. I would rather say so." },
  { id: "ch-10", toc: "10 Open questions", kicker: "10 · Open questions", heading: "Questions I am leaving open, rather than calling them features." },
];

const LEGEND = [
  ["●", "Built", "Implemented behaviour that can be inspected in the product or repository."],
  ["◐", "Validation", "A bounded test, audit or measurement. It does not prove every visitor outcome."],
  ["○", "Design", "A proposed direction or prototype, not a deployed behaviour."],
] as const;

const Needle = ({ heading, reduced }: { heading: number; reduced: boolean }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="h-16 w-16 text-rose-copper" fill="none" stroke="currentColor" strokeLinecap="round">
    <circle cx="20" cy="20" r="17" strokeWidth="0.5" />
    <g style={{ transform: `rotate(${heading}deg)`, transformOrigin: "20px 20px", transition: reduced ? "none" : "transform 900ms cubic-bezier(.2,.7,.1,1)" }}>
      <path d="M20 3l4 13 13 4-13 4-4 13-4-13-13-4 13-4z" strokeWidth="0.5" />
      <path d="M20 3l4 13-4 4z" fill="currentColor" strokeWidth="0" />
    </g>
  </svg>
);

export const RoseCaseStudy = ({ reduced }: { reduced: boolean }) => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.ch))),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    root.current?.querySelectorAll("[data-ch]").forEach((el) => io.observe(el));
    const onScroll = () => {
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const current = ROSE_CHAPTERS[active];
  const toc = (onPick?: () => void) => (
    <ol className="list-none space-y-1 p-0">
      {ROSE_CHAPTERS.map((c, i) => (
        <li key={c.id}>
          <a href={`#${c.id}`} onClick={onPick} aria-current={i === active ? "location" : undefined}
            className={cn("block border-l-2 py-1 pl-3 font-label text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-copper",
              i === active ? "border-rose-copper text-primary" : "border-transparent text-on-surface-variant hover:text-primary")}>
            {c.toc}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div ref={root} className="rose-case-bg relative">
      {/* Copper reading thread, left margin. */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-2 top-0 w-px bg-outline-variant md:left-4">
        <div className="sticky top-0 h-screen">
          <div className="h-full w-px origin-top bg-rose-copper" style={{ transform: `scaleY(${progress})`, transition: reduced ? "none" : "transform 120ms linear" }} />
        </div>
      </div>

      {/* Mobile: one-line sticky bar. */}
      <details ref={details} className="sticky top-16 z-30 border-b border-outline-variant bg-surface/95 px-6 py-3 backdrop-blur-sm lg:hidden">
        <summary className="cursor-pointer list-none font-label text-xs text-primary [&::-webkit-details-marker]:hidden">
          {current.toc} · On this page <span aria-hidden="true">▾</span>
        </summary>
        <nav aria-label="On this page" className="mt-3">{toc(() => details.current?.removeAttribute("open"))}</nav>
      </details>

      <div className="mx-auto grid max-w-7xl gap-12 px-8 py-16 md:px-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
          <Needle heading={reduced ? 0 : active * (300 / (ROSE_CHAPTERS.length - 1))} reduced={reduced} />
          <p className="mt-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">On this page</p>
          <nav aria-label="On this page" className="mt-3">{toc()}</nav>
        </aside>

        <div className="min-w-0">
          <section aria-labelledby="rose-legend" className="max-w-3xl">
            <h2 id="rose-legend" className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">How to read this case study</h2>
            <dl className="mt-3 space-y-1 font-body text-sm text-on-surface">
              {LEGEND.map(([mark, term, def]) => (
                <div key={term} className="flex gap-2"><dt className="shrink-0 font-label text-xs text-rose-copper"><span aria-hidden="true">{mark} </span>{term}</dt><dd>{def}</dd></div>
              ))}
            </dl>
            <p className="mt-3 font-body text-xs text-on-surface-variant">Milestones come from the repository: commit dates, archived plans, the original prompt. Readings of the design are mine.</p>
          </section>

          {ROSE_CHAPTERS.map((c, i) => (
            <section key={c.id} id={c.id} data-ch={i} aria-labelledby={`${c.id}-h`} className="max-w-3xl scroll-mt-32 pt-24 md:pt-32">
              <p className="font-label text-[10px] uppercase tracking-[0.18em] text-rose-copper">{c.kicker}</p>
              <h2 id={`${c.id}-h`} className="mt-3 font-headline text-4xl leading-tight text-primary md:text-5xl">{c.heading}</h2>
              {c.transition && <p className="mt-16 font-headline text-xl italic text-on-surface">{c.transition}</p>}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
