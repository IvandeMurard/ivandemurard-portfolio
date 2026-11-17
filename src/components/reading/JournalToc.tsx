import { useEffect, useState } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";

export type TocItem = { id: string; text: string };

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The heading being read: the last one whose top is above 30% of the viewport, or the first before any is. */
export const activeHeadingId = (tops: { id: string; top: number }[], viewportHeight: number): string | null => {
  let current: string | null = tops[0]?.id ?? null;
  for (const t of tops) if (t.top <= viewportHeight * 0.3) current = t.id;
  return current;
};

interface JournalTocProps {
  items: TocItem[];
  label?: string;
  variant?: "mobile" | "desktop";
  meta?: string;
  /** A link above the list, e.g. back to the index: "All Field Notes · 3". */
  topLink?: { to: string; label: string };
}

export const JournalToc = ({ items, label = "Contents", variant = "desktop", meta, topLink }: JournalTocProps) => {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [open, setOpen] = useState(false);
  // The sidebar list stays out of the way until the reader has actually
  // started reading: it accompanies the article, it does not open it.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    // The section being read is the last heading whose top is above 30% of the viewport. It is computed from the
    // headings' positions on every scroll (one frame at most), not from which heading crossed a band: a jump, a
    // restored scroll position or a find-in-page skips the band, and the highlight stayed on an earlier section.
    let frame = 0;
    const update = () => {
      frame = 0;
      setActiveId(activeHeadingId(elements.map((el) => ({ id: el.id, top: el.getBoundingClientRect().top })), window.innerHeight));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    // Images and figures above can still move the headings after the first paint.
    const settle = window.setTimeout(schedule, 800);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      window.clearTimeout(settle);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  useEffect(() => {
    if (variant !== "desktop") return;
    const onScroll = () => setRevealed(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  if (!items.length) return null;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    el.focus?.({ preventScroll: true });
    setActiveId(id);
    setOpen(false);
  };

  const top = topLink && (
    <Link to={topLink.to} className="mb-3 inline-block border-b border-secondary/60 pb-0.5 text-sm text-primary hover:border-secondary">
      {topLink.label}
    </Link>
  );

  const list = (
    <ol className="space-y-1 list-none p-0 m-0">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(item.id);
              }}
              className={`block py-1.5 pl-3 pr-2 text-sm leading-snug rounded-r-sm transition-colors duration-300 border-l-2 ${
                active
                  ? "border-secondary bg-secondary/10 text-primary font-medium"
                  : "border-outline-variant text-on-surface-variant hover:text-primary hover:border-outline hover:bg-surface-container-low"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "mobile") {
    return (
      <nav
        aria-label={label}
        className="lg:hidden mb-10 rounded-sm border border-outline bg-surface-container-low"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="journal-toc-mobile"
          className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 min-w-0">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-secondary text-[18px] leading-none"
            >
              list
            </span>
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary truncate">
              {label}
              <span className="text-on-surface-variant"> · {items.length} sections</span>
              {meta && <span className="text-on-surface-variant"> · {meta}</span>}
            </span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <span className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
              {open ? "Hide" : "Show"}
            </span>
            <span
              aria-hidden="true"
              className={`material-symbols-outlined text-on-surface-variant text-[18px] leading-none transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </span>
        </button>
        <div id="journal-toc-mobile" hidden={!open} className="px-3 pb-4 pt-1">
          {top}
          {list}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label={label}
      aria-hidden={!revealed}
      className={`hidden lg:block sticky top-32 max-h-[70vh] overflow-y-auto pr-2 transition-opacity duration-500 motion-reduce:transition-none ${
        revealed ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
        {label}
        {meta && <span className="text-on-surface-variant"> · {meta}</span>}
      </div>
      {top}
      {list}
    </nav>
  );
};

export default JournalToc;
