import { AnimaFigure, DesignTag } from "./AnimaFigure";

type Step = {
  mark: string;
  title: string;
  lines: string[];
  design: boolean;
};

const STEPS: Step[] = [
  {
    mark: "Now",
    title: "Synthetic proof of concept",
    lines: ["Four memory layers", "MCP server", "Evaluated on a synthetic cohort"],
    design: false,
  },
  {
    mark: "Gate",
    title: "Data-protection assessment",
    lines: [
      "Before the first real guest datum",
      "Not before the build",
      "No real guest until it clears",
    ],
    design: true,
  },
  {
    mark: "Phase 4",
    title: "Production",
    lines: ["Real guests, real stays", "Only on the far side of the gate"],
    design: true,
  },
];

/** Fig. 2.1: where the node is on its own road, and what the gate actually gates. */
export const AnimaRoadmapStrip = () => (
  <AnimaFigure label="Fig. 2.1 · The road, and the gate on it" note="Three steps">
    <ol className="m-0 list-none p-0 grid grid-cols-1 sm:grid-cols-3 gap-px bg-outline-variant border border-outline-variant">
      {STEPS.map((step, i) => (
        <li key={step.mark} className="bg-surface-container-lowest p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="h-px flex-1 bg-outline-variant" aria-hidden="true" />
            <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden="true">
              <circle cx="6" cy="6" r="5" className="fill-none stroke-outline" strokeWidth="1" />
              {step.design ? (
                <line x1="2.6" y1="9.4" x2="9.4" y2="2.6" className="stroke-outline" strokeWidth="1" />
              ) : (
                <circle cx="6" cy="6" r="2.6" className="fill-secondary" />
              )}
            </svg>
          </div>
          <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary block mb-1">
            {step.mark}
          </span>
          <p className="font-headline italic text-primary text-lg leading-tight mb-2">
            {step.title} {step.design && <DesignTag />}
          </p>
          <ul className="m-0 list-none p-0 space-y-1">
            {step.lines.map((l) => (
              <li key={l} className="font-body text-sm text-on-surface-variant leading-relaxed">
                {l}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </AnimaFigure>
);

export default AnimaRoadmapStrip;
