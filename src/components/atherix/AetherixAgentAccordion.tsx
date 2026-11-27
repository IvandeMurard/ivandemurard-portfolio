import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { INSIDE } from "@/content/aetherixInside";
import { cn } from "@/lib/utils";

// Where the warm light sits on each card, so the five do not look like one.
const GLOW: Array<[string, string]> = [["30%", "25%"], ["60%", "30%"], ["40%", "40%"], ["70%", "20%"], ["35%", "30%"]];

/**
 * "Inside the agent": five steps, one open at a time. From md up the cards sit side by side and the open one is
 * wider; below md they stack and the open card grows to its content (the reference clips it). Each header is a
 * real button: Enter or Space opens a card, Left and Right move the focus from header to header. With reduced
 * motion the width does not animate.
 */
export const AetherixAgentAccordion = () => {
  const [open, setOpen] = useState(INSIDE.openByDefault);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const last = INSIDE.steps.length - 1;

  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const to = e.key === "ArrowRight" ? Math.min(i + 1, last) : e.key === "ArrowLeft" ? Math.max(i - 1, 0) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (to < 0) return;
    e.preventDefault();
    buttons.current[to]?.focus();
  };

  return (
    <figure aria-label={INSIDE.figureLabel} className="mt-5 max-w-[56rem]">
      <div className="flex flex-col gap-3 md:min-h-[27rem] md:flex-row">
        {INSIDE.steps.map((s, i) => {
          const isOpen = i === open;
          const [gx, gy] = GLOW[i % GLOW.length];
          return (
            <div
              key={s.n}
              data-open={isOpen}
              style={{ "--g": isOpen ? 4 : 1, "--gx": gx, "--gy": gy } as CSSProperties}
              className="aetherix-dark aetherix-acc-card flex min-w-0 flex-col rounded-2xl p-4 md:p-5"
            >
              <div aria-hidden="true" className="aetherix-dark-glow" />
              <h4 className="flex min-h-0 flex-1 flex-col font-normal data-[open=true]:flex-none" data-open={isOpen}>
                <button
                  type="button"
                  id={`inside-h-${s.n}`}
                  ref={(el) => { buttons.current[i] = el; }}
                  aria-expanded={isOpen}
                  aria-controls={`inside-p-${s.n}`}
                  aria-label={`${s.n} ${s.title}`}
                  onClick={() => setOpen(i)}
                  onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(i); }}
                  onKeyDown={onKey(i)}
                  className={cn(
                    "flex w-full text-left outline-none after:absolute after:-inset-4 after:rounded-2xl after:content-[''] md:after:-inset-5 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-secondary",
                    isOpen ? "items-baseline gap-3" : "min-h-[3.5rem] flex-1 items-start justify-between md:min-h-0 md:flex-col md:justify-between",
                  )}
                >
                  <span aria-hidden="true" className={cn("font-label text-xs text-on-surface-variant", !isOpen && "md:hidden")}>{s.n}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-headline leading-tight text-heading",
                      isOpen ? "text-2xl" : "text-base md:whitespace-nowrap md:text-lg md:[writing-mode:vertical-rl] md:rotate-180",
                    )}
                  >
                    {isOpen ? s.title : <><span className="hidden md:inline">{s.n} · </span>{s.title}</>}
                  </span>
                </button>
              </h4>
              <div id={`inside-p-${s.n}`} role="region" aria-labelledby={`inside-h-${s.n}`} hidden={!isOpen} className={cn("relative mt-5 min-w-0 flex-1 flex-col", isOpen ? "flex" : "hidden")}>
                {s.from && (
                  <>
                    <p className="text-right text-xs text-on-surface-variant">{s.from.who}</p>
                    <p className="ml-auto mt-1 max-w-[82%] rounded-xl border border-outline-variant bg-[hsl(var(--primary)/0.08)] px-3.5 py-2.5 text-sm leading-snug text-primary">{s.from.text}</p>
                  </>
                )}
                <p className={cn("text-xs text-on-surface-variant", s.from && "mt-3.5")}>Aetherix</p>
                <p className="mt-1 max-w-[88%] rounded-xl bg-primary px-3.5 py-2.5 text-sm leading-snug text-[hsl(var(--dark-ink))]">{s.says}</p>
                <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-signal-go bg-[hsl(var(--signal-go)/0.12)] px-3 py-1 text-meta text-signal-go"><span aria-hidden="true">✓</span>{s.badge}</p>
                <p className="mt-auto max-w-[22.5rem] pt-6 text-sm leading-relaxed text-on-surface-variant">{s.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 rounded-lg border border-outline-variant px-3.5 py-2 font-body text-[13.5px] text-on-surface-variant"><strong className="font-semibold text-primary">{INSIDE.around}</strong> {INSIDE.aroundText}</p>
      <figcaption className="mt-2 font-label text-xs text-on-surface-variant">{INSIDE.caption}</figcaption>
    </figure>
  );
};
