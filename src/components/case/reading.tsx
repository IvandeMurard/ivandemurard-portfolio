import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { CompassRose } from "@/components/rose/CompassRose";

/**
 * Reading furniture shared by the long case studies (Rose, Aetherix): the reading thread in the left
 * margin, the "On this page" rail with its compass, the one-line mobile bar, and the status legend.
 * Extracted from the Rose case study; the Rose page keeps its own copper tone, other pages pass theirs.
 */

export const LABEL = "font-label text-xs";
export const KICKER = "font-label text-kicker uppercase tracking-[0.18em] text-secondary";

/** Runs `work` at most once per frame on scroll and resize. */
export const useFrameScroll = (work: () => void) => {
  useEffect(() => {
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; work(); }); };
    work();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [work]);
};

/** Reading thread, left margin. Owns its scroll state so the page does not re-render with it. */
export const ReadingThread = ({ rootRef, reduced, tone = "bg-rose-copper" }: { rootRef: RefObject<HTMLElement>; reduced: boolean; tone?: string }) => {
  const [progress, setProgress] = useState(0);
  const measure = useCallback(() => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    const total = r.height - window.innerHeight;
    setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1);
  }, [rootRef]);
  useFrameScroll(measure);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-2 top-0 z-20 w-px bg-outline-variant md:left-4">
      <div className={cn("h-full w-px origin-top", tone)} style={{ transform: `scaleY(${progress})`, transition: reduced ? "none" : "transform 120ms linear" }} />
    </div>
  );
};

/** Active chapter: the last one whose top crossed 40% of the viewport; none before the first. */
export const useActiveChapter = (root: RefObject<HTMLElement>) => {
  const [active, setActive] = useState(-1);
  const measure = useCallback(() => {
    let next = -1;
    root.current?.querySelectorAll<HTMLElement>("[data-ch]").forEach((c) => { if (c.getBoundingClientRect().top <= window.innerHeight * 0.4) next = Number(c.dataset.ch); });
    setActive(next);
  }, [root]);
  useFrameScroll(measure);
  return active;
};

export type RailChapter = { id: string; toc: string };

const TocList = ({ chapters, active, onPick }: { chapters: readonly RailChapter[]; active: number; onPick?: () => void }) => (
  <ol className="list-none space-y-1 p-0">
    {chapters.map((c, i) => (
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

/** Desktop rail: the compass turns with the active chapter. */
export const ChapterRail = ({ chapters, active, reduced }: { chapters: readonly RailChapter[]; active: number; reduced: boolean }) => {
  const needleTurn = Math.max(0, active) * (300 / Math.max(1, chapters.length - 1));
  return (
    <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
      <CompassRose heading={needleTurn} reduced={reduced} className="h-16 w-16 text-secondary" />
      <p className={cn("mt-4", LABEL, "text-on-surface-variant")}>On this page</p>
      <nav aria-label="On this page" className="mt-3"><TocList chapters={chapters} active={active} /></nav>
    </aside>
  );
};

/** Mobile: one-line sticky bar that opens the same list. */
export const ChapterBar = ({ chapters, active }: { chapters: readonly RailChapter[]; active: number }) => {
  const details = useRef<HTMLDetailsElement>(null);
  const current = chapters[active];
  return (
    <details ref={details} className="sticky top-[76px] z-30 border-b border-outline-variant bg-surface/95 px-6 py-3 backdrop-blur-sm lg:hidden">
      <summary className="cursor-pointer list-none font-label text-xs text-primary [&::-webkit-details-marker]:hidden">
        {current ? `${current.toc} · ` : ""}On this page <span aria-hidden="true">▾</span>
      </summary>
      <nav aria-label="On this page" className="mt-3"><TocList chapters={chapters} active={active} onPick={() => details.current?.removeAttribute("open")} /></nav>
    </details>
  );
};

export type Mark = "Built" | "Validation" | "Design";
export const MARK_GLYPH: Record<Mark, string> = { Built: "●", Validation: "◐", Design: "○" };
export const LEGEND_TONE: Record<Mark, string> = { Built: "text-secondary", Validation: "text-primary", Design: "text-on-surface-variant" };
