import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type FunnelOption = {
  key: string;
  /** Short label on the choice, e.g. "Before release". */
  label: string;
  /** The failure moment in the reader's words. */
  when: string;
  proves: string;
  misses: string;
  /** Heading id to jump to. */
  to: string;
  toLabel: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Entry funnel: the reader names the moment their failure would show up, and
 * the piece answers with the arm that catches it, what it misses, and the
 * section to start from. One question, three doors, no dead end.
 */
export const FailureFunnel = ({
  label = "Where would your failure show up?",
  options,
}: {
  label?: string;
  options: FunnelOption[];
}) => {
  const [active, setActive] = useState(0);
  const current = options[active];
  if (!current) return null;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    el.focus?.({ preventScroll: true });
  };

  return (
    <section
      aria-label={label}
      className="mb-12 md:mb-16 not-italic rounded-sm border border-outline bg-surface-container-low p-5 md:p-6"
    >
      <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
        {label}
      </div>
      <div role="tablist" aria-label={label} className="grid gap-2 sm:grid-cols-3">
        {options.map((option, i) => {
          const isActive = i === active;
          return (
            <button
              key={option.key}
              type="button"
              role="tab"
              id={`funnel-tab-${option.key}`}
              aria-selected={isActive}
              aria-controls="funnel-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`text-left rounded-sm border px-4 py-3 transition-colors duration-300 ${
                isActive
                  ? "border-secondary bg-secondary/15"
                  : "border-outline-variant bg-surface-container-lowest hover:border-secondary"
              }`}
            >
              <span className="block font-headline italic text-base text-primary">{option.label}</span>
              <span className="block font-body text-xs text-on-surface-variant mt-1">{option.when}</span>
            </button>
          );
        })}
      </div>
      <div
        id="funnel-panel"
        role="tabpanel"
        aria-live="polite"
        aria-labelledby={`funnel-tab-${current.key}`}
        className="mt-5 rounded-sm border border-outline-variant bg-surface-container-lowest p-4 md:p-5"
      >
        <p className="font-body text-sm leading-relaxed text-on-surface-variant">
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mr-2">
            Catches
          </span>
          {current.proves}
        </p>
        <p className="font-body text-sm leading-relaxed text-on-surface-variant mt-2">
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mr-2">
            Misses
          </span>
          {current.misses}
        </p>
        <button
          type="button"
          onClick={() => go(current.to)}
          className="mt-4 inline-flex items-center gap-2 font-headline italic text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
        >
          {current.toLabel}
          <Icon name="arrow_downward" className="text-sm" />
        </button>
      </div>
    </section>
  );
};

export default FailureFunnel;
