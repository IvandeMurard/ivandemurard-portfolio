import { ARCH, type ArchNode } from "@/content/aetherixInside";
import { cn } from "@/lib/utils";

// Where each node sits on the ring, as a share of the 900 × 640 drawing the reference is made on.
const AT: Record<ArchNode["id"], { x: number; y: number }> = {
  orchestrator: { x: 450, y: 290 },
  aetherix: { x: 273, y: 113 },
  tacet: { x: 627, y: 113 },
  anima: { x: 273, y: 467 },
  peritia: { x: 627, y: 467 },
};
const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(2)}%`;

const LINE = { solid: "border-solid", dashed: "border-dashed", dotted: "border-dotted" } as const;

/**
 * The architecture, as a circle from xl up and as a list below. One set of HTML in reading order (the orchestrator,
 * the four agents, the ledger, then the two notes), placed over a decorative SVG that only draws the lines. Every
 * word is HTML, so it reads and wraps like the rest of the page. Line style carries the status: solid Built, long
 * dashes Synthetic PoC, dots Design.
 */
export const AetherixArchitectureFigure = () => (
  <figure aria-label={ARCH.figureLabel} className="mt-8 max-w-[56rem] xl:mt-16">
    <div className="relative xl:aspect-[900/640]">
      <svg viewBox="0 0 900 600" aria-hidden="true" className="absolute inset-x-0 top-0 hidden w-full text-primary xl:block">
        <circle cx="450" cy="290" r="288" fill="none" strokeWidth="1.25" strokeDasharray="2 5" className="stroke-secondary" />
        <circle cx="450" cy="290" r="250" fill="none" strokeWidth="1" className="stroke-outline-variant" />
        <g stroke="currentColor" strokeWidth="1.25" fill="none">
          <line x1="450" y1="290" x2="273" y2="113" />
          <line x1="450" y1="290" x2="627" y2="113" />
          <line x1="450" y1="290" x2="273" y2="467" strokeDasharray="8 5" />
          <line x1="450" y1="290" x2="627" y2="467" strokeDasharray="2 4" />
        </g>
        <g className="stroke-secondary" fill="none" strokeWidth="1.25" strokeLinecap="round">
          <path d="M373 67 L527 67" strokeDasharray="6 5" />
          <path d="M381 67 l8 -5 M381 67 l8 5" />
        </g>
      </svg>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {ARCH.nodes.map((n) => {
          const orch = n.id === "orchestrator";
          const here = n.id === "aetherix";
          return (
            <li
              key={n.id}
              style={{ left: pct(AT[n.id].x, 900), top: pct(AT[n.id].y, 640) }}
              className={cn(
                "border-[1.5px] px-4 py-2.5 xl:absolute xl:-translate-x-1/2 xl:-translate-y-1/2",
                LINE[n.line],
                orch ? "rounded-xl border-primary bg-surface-container-lowest xl:w-[22.2%] xl:rounded-full xl:px-3.5 xl:py-[18px] xl:text-center" : "rounded-xl xl:w-[24.4%]",
                here ? "border-secondary bg-surface-container-low" : !orch && "border-primary bg-surface-container-lowest",
              )}
            >
              <p className="flex items-baseline justify-between gap-2 xl:justify-between">
                <span className={cn("font-headline leading-tight text-primary", orch ? "text-[23px] xl:mx-auto" : "text-[21px]")}>{n.name}</span>
                {here && <span className="font-label text-xs text-secondary">{ARCH.thisPage}</span>}
              </p>
              <p className="mt-0.5 text-[13.5px] text-on-surface-variant">{n.role}</p>
              <p className="mt-1 text-[13px] font-semibold text-primary">{n.status}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[13.5px] text-primary xl:absolute xl:left-1/2 xl:top-[91.9%] xl:mt-0 xl:-translate-x-1/2 xl:whitespace-nowrap">
        <span className="font-semibold">{ARCH.ledgerName}</span> <span className="text-on-surface-variant">· {ARCH.ledgerText}</span>
      </p>
      <p className="mt-3 font-label text-xs text-on-surface-variant xl:absolute xl:left-1/2 xl:top-[-5.3%] xl:mt-0 xl:-translate-x-1/2 xl:whitespace-nowrap">{ARCH.link}</p>
      <p className="mt-3 text-[13px] leading-snug text-on-surface-variant xl:absolute xl:left-[83.6%] xl:top-[40.9%] xl:mt-0 xl:w-[16.4%]"><span aria-hidden="true" className="hidden xl:inline">← </span>{ARCH.thirdParty}</p>
    </div>
    <figcaption className="mt-3 font-label text-xs text-on-surface-variant xl:mt-4">{ARCH.caption}</figcaption>
  </figure>
);
