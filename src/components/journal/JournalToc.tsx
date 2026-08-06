import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string };

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface JournalTocProps {
  items: TocItem[];
  label?: string;
  variant?: "mobile" | "desktop";
  meta?: string;
}

export const JournalToc = ({ items, label = "Contents", variant = "desktop", meta }: JournalTocProps) => {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    el.focus?.({ preventScroll: true });
    setActiveId(id);
    setOpen(false);
  };

  const list = (
    <ol className="space-y-2 list-none p-0 m-0">
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
              className={`block py-1 text-sm leading-snug transition-colors duration-300 border-l pl-3 ${
                active
                  ? "border-secondary text-primary"
                  : "border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-outline"
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
      <nav aria-label={label} className="lg:hidden mb-10 rounded-sm border border-outline-variant/25">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="journal-toc-mobile"
          className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
        >
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{label}</span>
          <span aria-hidden="true" className="text-on-surface-variant text-xs">
            {open ? "−" : "+"}
          </span>
        </button>
        <div id="journal-toc-mobile" hidden={!open} className="px-4 pb-4">
          {list}
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label={label} className="hidden lg:block sticky top-32 max-h-[70vh] overflow-y-auto pr-2">
      <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">{label}</div>
      {list}
    </nav>
  );
};

export default JournalToc;
