import { AnimaFigure, DesignTag } from "./AnimaFigure";

type Column = {
  phase: string;
  design: boolean;
  holds: string[];
  layer: string;
  layerLine: string;
};

const COLUMNS: Column[] = [
  {
    phase: "Before arrival",
    design: true,
    holds: [
      "Booking data",
      "Situational context: a delayed train, a local event, the weather",
      "No external data about the person, no profiling",
    ],
    layer: "No memory yet",
    layerLine: "Nothing personal is held before the guest is in the house",
  },
  {
    phase: "During the stay",
    design: false,
    holds: ["Requests", "Interactions", "Operational events"],
    layer: "Working memory",
    layerLine: "Expires at check-out",
  },
  {
    phase: "After check-out",
    design: false,
    holds: [
      "Episodic tail, weeks",
      "Semantic only if stated or repeatedly confirmed",
    ],
    layer: "Episodic, then semantic",
    layerLine: "Weeks, then long with decay",
  },
];

/** Fig. 3.1: what the node holds at each point of a stay, and under which layer. */
export const AnimaStayTimeline = () => (
  <AnimaFigure
    label="Fig. 3.1 · One stay, and what is held at each point"
    note="Three phases · four layers"
    caption="A first-time guest is not recognised, but can still be anticipated."
  >
    <ol className="m-0 list-none p-0 grid grid-cols-1 sm:grid-cols-3 gap-px bg-outline-variant border border-outline-variant">
      {COLUMNS.map((col, i) => (
        <li key={col.phase} className="bg-surface-container-lowest p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="h-px flex-1 bg-outline-variant" aria-hidden="true" />
          </div>
          <p className="font-headline italic text-primary text-lg leading-tight mb-3">
            {col.phase} {col.design && <DesignTag />}
          </p>
          <ul className="m-0 list-none p-0 space-y-1 mb-4 flex-1">
            {col.holds.map((h) => (
              <li key={h} className="font-body text-sm text-on-surface-variant leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
          <div className="border-t border-outline-variant pt-3">
            <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary block mb-1">
              {col.layer}
            </span>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              {col.layerLine}
            </p>
          </div>
        </li>
      ))}
    </ol>

    <div className="mt-4 border border-outline-variant border-l-2 border-l-secondary bg-surface-container-low p-4">
      <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary block mb-2">
        Marker on the stay <DesignTag />
      </span>
      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
        Health data stays in the stay: an allergy is GDPR art. 9 data, used on explicit consent for a
        concrete service, never kept or inferred.
      </p>
    </div>

    <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline gap-2 border-t border-outline-variant pt-3">
      <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary sm:w-32 shrink-0">
        Segment layer
      </span>
      <span className="font-body text-sm text-on-surface-variant leading-relaxed">
        Anonymised patterns across the whole house, never an individual.
      </span>
    </div>
  </AnimaFigure>
);

export default AnimaStayTimeline;
