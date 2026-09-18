import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getEntry } from "@/content/glossary";
import { useIsTouch } from "@/hooks/useIsTouch";
import { cn } from "@/lib/utils";

type TermProps = {
  id: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Inline term with a contextual definition.
 * Desktop: hover or focus opens the definition. Touch: tap opens it.
 * The popover holds a single, self-sufficient explanation. No expand.
 */
export const Term = ({ id, children, className }: TermProps) => {
  const entry = getEntry(id);
  const [open, setOpen] = useState(false);
  const isTouch = useIsTouch();
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const headingId = useId();
  const panelId = `${headingId}-panel`;

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

  if (!entry) {
    return <span className={className}>{children}</span>;
  }

  const label = children ?? entry.term;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-describedby={open ? headingId : undefined}
          aria-controls={open ? panelId : undefined}
          aria-expanded={open}
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onFocus={scheduleOpen}
          onBlur={scheduleClose}
          className={cn(
            "inline align-baseline cursor-help text-inherit p-0 m-0 rounded-[2px] px-[0.15em] -mx-[0.15em]",
            "border-b-2 border-dotted border-secondary/70 bg-secondary/[0.07]",
            "transition-colors duration-200 hover:border-secondary hover:bg-secondary/[0.14] hover:text-primary",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-secondary focus-visible:rounded-sm",
            className,
          )}
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={panelId}
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
        className={cn(
          "z-50 w-80 max-w-[calc(100vw-2rem)] p-0 border border-outline-variant bg-surface-container-high/95 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full gold-halo opacity-20 pointer-events-none"
        />
        <div className="relative p-4 space-y-2">
          <p
            id={headingId}
            className="font-headline italic text-primary text-base leading-tight"
          >
            {entry.term}
          </p>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            {entry.brief}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Term;
