import { cn } from "@/lib/utils";

export type EvidenceState = "built" | "validation" | "design";

const STATES: Record<EvidenceState, { mark: string; label: string; description: string; tone: string }> = {
  built: {
    mark: "●",
    label: "Built",
    description: "Implemented behaviour that can be inspected in the product or repository.",
    tone: "text-secondary",
  },
  validation: {
    mark: "◐",
    label: "Validation",
    description: "A bounded test, audit or measurement. It does not prove every visitor outcome.",
    tone: "text-primary",
  },
  design: {
    mark: "○",
    label: "Design",
    description: "A proposed direction or prototype, not a deployed behaviour.",
    tone: "text-on-surface-variant",
  },
};

export const EvidenceStatus = ({ state, className }: { state: EvidenceState; className?: string }) => {
  const item = STATES[state];
  return (
    <span title={item.description} className={cn("inline-flex items-center gap-1.5 font-label text-[10px] uppercase tracking-[0.18em]", item.tone, className)}>
      <span aria-hidden="true">{item.mark}</span>
      {item.label}
    </span>
  );
};

export const EvidenceKey = ({ className }: { className?: string }) => (
  <aside aria-label="How to read evidence status" className={cn("border-l border-outline-variant pl-4", className)}>
    <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">How to read this case study</p>
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
      {(Object.keys(STATES) as EvidenceState[]).map((state) => {
        const item = STATES[state];
        return (
          <span key={state} className="inline-flex items-center gap-1.5 font-body text-xs text-on-surface-variant">
            <EvidenceStatus state={state} />
            <span>{item.description}</span>
          </span>
        );
      })}
    </div>
  </aside>
);
