import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const JULY = ["Product expertise", "Technical profile", "Culture fit", "Just exploring"];
const AUGUST = ["What has actually been built?", "What happens when it's wrong?", "Book a call"];

/** One period owns the compass, reconstructed starters and narrative panel. */
export const RoseHistoryTransition = ({ reduced, renderCompass }: {
  reduced: boolean;
  renderCompass: (heading: number) => ReactNode;
}) => {
  const [august, setAugust] = useState(false);
  const controls = useRef<Array<HTMLButtonElement | null>>([]);
  const select = (index: number) => {
    setAugust(index === 1);
    controls.current[index]?.focus();
  };
  return (
    <figure aria-label="Rose's change in direction" className="mt-12 border-y border-outline-variant py-8 md:py-10">
      <div role="tablist" aria-label="Historical period" className="grid grid-cols-2 border-b border-outline-variant">
        {["July 2026", "August 2026"].map((period, index) => (
          <Button key={period} ref={(element) => { controls.current[index] = element; }} type="button" variant="ghost"
            role="tab" id={`rose-period-${index}`} aria-selected={august === (index === 1)}
            aria-controls="rose-history-panel" tabIndex={august === (index === 1) ? 0 : -1}
            onClick={() => setAugust(index === 1)}
            onKeyDown={(event) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                select(event.key === "Home" ? 0 : event.key === "End" ? 1 : august ? 0 : 1);
              }
            }}
            className={cn("h-auto min-h-14 flex-col whitespace-normal rounded-none border-b-2 px-2 py-3 hover:bg-surface-container-low hover:text-primary",
              august === (index === 1) ? "border-secondary text-primary" : "border-transparent text-on-surface-variant")}>
            <span className="font-label text-sm">{period}</span>
            <span className="font-body text-xs font-normal">{index === 0 ? "Predefined intentions" : "Questions from the page"}</span>
          </Button>
        ))}
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div className="mx-auto w-32 lg:w-44" data-history-heading={august ? 80 : 0}>
          {renderCompass(august ? 80 : 0)}
          <p className="mt-3 text-center font-label text-xs text-on-surface-variant">{august ? "Begin with the work" : "Begin with the visitor"}</p>
        </div>
        <div id="rose-history-panel" role="tabpanel" aria-labelledby={`rose-period-${august ? 1 : 0}`}>
          <div className="relative grid min-h-56 sm:min-h-36" aria-label="Reconstructed dock starters">
            {[JULY, AUGUST].map((starters, index) => {
              const selected = august === (index === 1);
              return <ul key={index} aria-hidden={!selected}
                className={cn("col-start-1 row-start-1 flex flex-wrap content-start gap-2 self-start",
                  !reduced && "transition-[opacity,transform] duration-700 ease-out",
                  selected ? "translate-y-0 opacity-100" : index === 0 ? "translate-y-32 opacity-40 sm:translate-y-20" : "translate-y-3 opacity-0")}>
                {starters.map((starter) => <li key={starter}
                  className={cn("max-w-full rounded-full border bg-surface px-3 py-2 font-body text-sm",
                    selected && index === 1 ? "border-secondary text-primary" : "border-outline-variant text-on-surface-variant",
                    !selected && index === 0 && "line-through decoration-outline-variant")}>
                  {starter}
                </li>)}
              </ul>;
            })}
          </div>
          <div className="grid min-h-44 sm:min-h-32" aria-live="polite">
            <div className={cn("col-start-1 row-start-1", !august ? "visible" : "invisible")} aria-hidden={august}>
              <p className="font-headline text-2xl text-primary">Who are you here as?</p>
              <p className="mt-3 max-w-prose font-body text-base text-on-surface">Four recruitment intentions shaped the opening. The prompt aimed to help visitors decide, in two or three exchanges, whether to book a call.</p>
            </div>
            <div className={cn("col-start-1 row-start-1", august ? "visible" : "invisible")} aria-hidden={!august}>
              <p className="font-headline text-2xl text-primary">What are you exploring?</p>
              <p className="mt-3 max-w-prose font-body text-base text-on-surface">On 7 August, content pages gained route-specific starters. On 10 August, page context and intent were added to Rose's inputs. Booking remained an option, not the subject of every question.</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-6 max-w-prose font-body text-xs leading-relaxed text-on-surface-variant">Illustrative interface comparison, not visitor data. August questions represent the page-specific approach, not a verbatim historical transcript.</figcaption>
    </figure>
  );
};