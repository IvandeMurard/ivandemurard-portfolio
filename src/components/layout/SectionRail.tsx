import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export type RailSection = { id: string; label: string };

interface SectionRailProps {
  sections?: RailSection[];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
};

export const SectionRail = ({ sections = [] }: SectionRailProps) => {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sections.length) return;
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const hasSections = sections.length > 0;

  return (
    <>
      {hasSections && (
        <nav
          aria-label="Section navigation"
          className="hidden lg:flex fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3"
        >
          {sections.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToId(s.id)}
                aria-label={`Jump to ${s.label}`}
                aria-current={active ? "true" : undefined}
                className="group flex items-center gap-3 focus:outline-none"
              >
                <span
                  className={[
                    "font-headline italic text-xs tracking-wide transition-all duration-500",
                    "px-3 py-1 rounded-full bg-surface/70 backdrop-blur-sm border border-outline-variant/30",
                    active
                      ? "opacity-100 text-secondary"
                      : "opacity-0 -translate-x-1 text-on-surface-variant group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100",
                  ].join(" ")}
                >
                  {s.label}
                </span>
                <span
                  className={[
                    "block rounded-full transition-all duration-500",
                    active
                      ? "w-2.5 h-2.5 bg-secondary shadow-[0_0_12px_hsl(var(--secondary)/0.5)]"
                      : "w-1.5 h-1.5 bg-outline-variant/60 group-hover:bg-secondary/70",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </nav>
      )}

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={[
          "fixed bottom-8 right-6 lg:right-10 z-30",
          "w-11 h-11 rounded-full bg-surface-container-high border border-outline",
          "flex items-center justify-center text-on-surface hover:text-secondary hover:border-secondary",
          "shadow-md transition-all duration-500",
          showTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none",
        ].join(" ")}
      >
        <ArrowUp size={18} strokeWidth={1.5} />
      </button>
    </>
  );
};

export default SectionRail;
