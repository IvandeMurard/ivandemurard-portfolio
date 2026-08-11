import { Icon } from "@/components/ui/Icon";

type State = "done" | "current" | "planned";

const PHASES: { n: string; label: string; state: State; sub?: string }[] = [
  { n: "Phase 0", label: "Validation", state: "done" },
  { n: "Phase 1", label: "Observability", state: "done" },
  { n: "Phase 2", label: "Receipts", state: "done" },
  { n: "Phase 3", label: "Pilot preparation", state: "current", sub: "Shadow mode, no design partner signed yet" },
  {
    n: "Phase 4",
    label: "Scale",
    state: "planned",
    sub: "Mews · POS · Federated HiveMemory · Context Graph · Anima",
  },
  { n: "Phase 5", label: "Vision", state: "planned", sub: "Revenue Orchestrator" },
];

const ICON: Record<State, string> = {
  done: "check_circle",
  current: "construction",
  planned: "event",
};

export const AetherixPhaseTimeline = () => (
  <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
    <ol className="flex gap-4 md:gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-6">
      {PHASES.map((p) => {
        const emphasized = p.state === "current";
        return (
          <li
            key={p.n}
            className={`flex-1 min-w-[180px] rounded-2xl border p-5 flex flex-col gap-3 ${
              emphasized
                ? "border-secondary bg-surface-container-high"
                : "border-outline-variant bg-surface-container-low"
            } ${p.state === "planned" ? "opacity-80" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Icon
                name={ICON[p.state]}
                className={emphasized ? "text-secondary text-lg" : "text-on-surface-variant text-lg"}
              />
              <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{p.n}</span>
            </div>
            <p className="font-headline italic text-primary text-lg leading-tight">{p.label}</p>
            {p.sub && <p className="text-xs text-on-surface-variant leading-relaxed">{p.sub}</p>}
            {emphasized && (
              <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary mt-auto">
                Current
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </div>
);

export default AetherixPhaseTimeline;
