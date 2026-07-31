import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsTouch } from "@/hooks/useIsTouch";
import { CountUp } from "@/components/CountUp";
import { cn } from "@/lib/utils";

/**
 * Inline source note. Same interaction contract as <Term>, but the payload is
 * a provenance statement rather than a glossary definition.
 */
const SourceNote = ({ title, children, note }: { title: string; children: ReactNode; note: string }) => {
  const [open, setOpen] = useState(false);
  const isTouch = useIsTouch();
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const headingId = useId();

  const clearTimers = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleOpen = useCallback(() => {
    if (isTouch) return;
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), 120);
  }, [isTouch]);

  const scheduleClose = useCallback(() => {
    if (isTouch) return;
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }, [isTouch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-describedby={open ? headingId : undefined}
          aria-expanded={open}
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onFocus={scheduleOpen}
          onBlur={scheduleClose}
          className={cn(
            "block text-left w-full cursor-help bg-transparent p-0 m-0 border-0",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-secondary/40 focus-visible:rounded-sm",
          )}
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        collisionPadding={16}
        onMouseEnter={() => {
          if (closeTimer.current) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
          }
        }}
        onMouseLeave={scheduleClose}
        onOpenAutoFocus={(e) => {
          if (!isTouch) e.preventDefault();
        }}
        className="z-50 w-80 max-w-[calc(100vw-2rem)] p-0 border border-outline-variant bg-surface-container-high/95 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full gold-halo opacity-20 pointer-events-none"
        />
        <div className="relative p-4 space-y-2">
          <p id={headingId} className="font-headline italic text-primary text-base leading-tight">
            {title}
          </p>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">{note}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const figureClass =
  "font-headline italic text-primary text-4xl md:text-5xl leading-none tracking-tight tabular-nums";

/**
 * Three figures under the hero. Each carries its own provenance on hover,
 * focus or tap, because two of the three are estimates and one is a target.
 */
export const LoreStatBand = () => (
  <div className="border-t border-b border-outline-variant/30 py-10">
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 list-none p-0 m-0">
      <li data-reveal-child>
        <SourceNote
          title="9,000 to 6,800"
          note="United States, FAA-certificated mechanics. Around 9,000 new certificates in 2024; more than 68,000 mechanics reaching retirement age over ten years, about 6,800 a year. Source: ATEC Pipeline Report."
        >
          <span className={figureClass}>
            <CountUp value={9000} separator />
            <span className="text-secondary not-italic font-body text-xl mx-2 align-middle">to</span>
            <CountUp value={6800} separator />
          </span>
          <span className="mt-3 block text-sm text-on-surface-variant leading-relaxed border-b border-dotted border-secondary/60 pb-1">
            New mechanic certificates issued in 2024, against annual retirements over the decade.
          </span>
        </SourceNote>
      </li>
      <li data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }}>
        <SourceNote
          title="35%"
          note="Germany. Estimate from the German aerospace industries association, reported in trade press; primary report not consulted."
        >
          <span className={figureClass}>
            <CountUp value={35} suffix="%" />
          </span>
          <span className="mt-3 block text-sm text-on-surface-variant leading-relaxed border-b border-dotted border-secondary/60 pb-1">
            Share of the maintenance workforce over 55.
          </span>
        </SourceNote>
      </li>
      <li data-reveal-child style={{ ["--reveal-delay" as string]: "240ms" }}>
        <SourceNote
          title="−30%"
          note="Design target, not measured. No public benchmark exists for this interval in MRO. The lever is not working faster but removing unproductive time: waiting, escalating out of caution, redoing."
        >
          <span className={figureClass}>
            <CountUp value={30} prefix="−" suffix="%" />
          </span>
          <span className="mt-3 block text-sm text-on-surface-variant leading-relaxed border-b border-dotted border-secondary/60 pb-1">
            Target on time-to-autonomy for a junior on an engine type.
          </span>
        </SourceNote>
      </li>
    </ul>
    <p
      data-reveal-child
      style={{ ["--reveal-delay" as string]: "360ms" }}
      className="mt-10 font-headline italic text-primary text-xl md:text-2xl leading-snug max-w-3xl"
    >
      The pipeline replaces the headcount. It does not replace the experience.
    </p>
  </div>
);

export default LoreStatBand;
