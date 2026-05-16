import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icon } from "@/components/ui/Icon";
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
 * Desktop: hover or focus opens a short brief. Touch: tap opens the same brief.
 * Inside the popover, "En savoir plus" reveals a longer detail paragraph.
 * Renders children as the displayed label; falls back to entry.term.
 */
export const Term = ({ id, children, className }: TermProps) => {
  const entry = getEntry(id);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setExpanded(false);
    }, 120);
  }, [isTouch]);

  // Fallback: if the term is not in the glossary, render the label plainly.
  if (!entry) {
    return <span className={className}>{children}</span>;
  }

  const label = children ?? entry.term;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setExpanded(false);
      }}
    >
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
            "inline align-baseline border-b border-dotted border-secondary/60 hover:border-secondary focus-visible:border-secondary cursor-help text-inherit font-inherit decoration-none p-0 m-0 bg-transparent transition-colors",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-secondary/40 focus-visible:rounded-sm",
            className,
          )}
        >
          {label}
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
          // Avoid stealing focus on hover open
          if (!isTouch) e.preventDefault();
        }}
        className={cn(
          "z-50 p-0 border border-outline-variant bg-surface-container-high/95 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden",
          "max-w-[calc(100vw-2rem)] transition-[width] duration-200",
          expanded ? "w-80" : "w-72",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full gold-halo opacity-20 pointer-events-none"
        />
        <div className="relative p-4 space-y-3">
          <p
            id={headingId}
            className="font-headline italic text-primary text-base leading-tight"
          >
            {entry.term}
          </p>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            {entry.brief}
          </p>

          {expanded && (
            <div className="pt-3 border-t border-outline-variant/40 space-y-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:duration-200">
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {entry.detail}
              </p>
              {entry.link && (
                <a
                  href={entry.link.href}
                  target={entry.link.external ? "_blank" : undefined}
                  rel={entry.link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 font-label uppercase tracking-widest text-[10px] text-secondary hover:text-primary transition-colors"
                >
                  {entry.link.label}
                  {entry.link.external && <Icon name="open_in_new" className="text-[10px]" />}
                </a>
              )}
            </div>
          )}

          {!expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1 font-label uppercase tracking-widest text-[10px] text-secondary hover:text-primary transition-colors"
            >
              En savoir plus
              <Icon name="expand_more" className="text-[12px]" />
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Term;
