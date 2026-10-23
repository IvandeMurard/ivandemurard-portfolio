import {
  BLUEPRINT,
  BLUEPRINT_LAYERS,
  BLUEPRINT_STATUS_LABEL,
  type BlueprintCell,
  type BlueprintStage,
} from "@/content/serviceBlueprint";

const Status = ({ cell }: { cell: BlueprintCell }) =>
  cell.status ? (
    <span
      className={`mt-2 inline-block font-label uppercase tracking-[0.14em] text-[9px] px-1.5 py-0.5 rounded-sm border ${
        cell.status === "built"
          ? "border-secondary/60 text-secondary"
          : "border-dashed border-outline text-on-surface-variant"
      }`}
    >
      {BLUEPRINT_STATUS_LABEL[cell.status]}
    </span>
  ) : null;

const layerTone = (side: string) =>
  side === "boundary" ? "text-primary font-medium" : side === "system" ? "text-on-surface-variant" : "text-on-surface";

const Cell = ({ stage, layer }: { stage: BlueprintStage; layer: (typeof BLUEPRINT_LAYERS)[number] }) => {
  const cell = stage[layer.key];
  return (
    <div className="font-body text-sm leading-relaxed">
      <p className={`font-normal ${layerTone(layer.side)}`}>{cell.text}</p>
      <Status cell={cell} />
    </div>
  );
};

/**
 * Service blueprint for the boundaries note. Desktop: stages across, layers
 * aligned in rows, a line of visibility between human and system layers.
 * Mobile: one stage at a time, the four layers kept together. All reasoning
 * is real text; the Markdown mirror renders the same source.
 */
export const AetherixServiceBlueprint = () => {
  const { stages } = BLUEPRINT;
  return (
    <figure
      aria-labelledby="blueprint-title"
      className="m-0 rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6"
    >
      <p className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">Service blueprint</p>
      <h3 id="blueprint-title" className="mt-2 font-headline italic text-xl md:text-2xl text-primary">
        {BLUEPRINT.title}
      </h3>
      <p className="mt-2 font-body text-sm text-on-surface-variant">{BLUEPRINT.scenario}</p>

      {/* Desktop grid */}
      <div className="hidden lg:block mt-6" role="table" aria-label={BLUEPRINT.title}>
        <div role="rowgroup">
          <div role="row" className="grid grid-cols-[9rem_repeat(4,1fr)] gap-x-5 border-b border-outline pb-3">
            <span role="columnheader" className="sr-only">Layer</span>
            {stages.map((s, i) => (
              <div role="columnheader" key={s.id}>
                <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
                  0{i + 1} · {s.when}
                </span>
                <span className="block font-headline italic text-lg text-primary">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div role="rowgroup">
          {BLUEPRINT_LAYERS.map((layer) => (
            <div
              role="row"
              key={layer.key}
              className={`grid grid-cols-[9rem_repeat(4,1fr)] gap-x-5 py-4 ${
                layer.key === "behind"
                  ? "border-t border-dashed border-outline"
                  : layer.key === "boundary"
                    ? "border-t border-secondary/50 bg-surface-container-low -mx-3 px-3"
                    : "border-t border-outline-variant first:border-t-0"
              }`}
            >
              <div role="rowheader" className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary pt-0.5">
                {layer.label}
                {layer.key === "behind" && (
                  <span className="block mt-1 normal-case tracking-normal text-[11px] text-on-surface-variant font-body">
                    below the line of visibility
                  </span>
                )}
              </div>
              {stages.map((s) => (
                <div role="cell" key={s.id}>
                  <Cell stage={s} layer={layer} />
                  {layer.key === "boundary" && s.handoff && (
                    <p className="mt-2 font-label uppercase tracking-[0.14em] text-[10px] text-secondary">→ {s.handoff}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sequence */}
      <ol className="lg:hidden mt-6 space-y-6">
        {stages.map((s, i) => (
          <li key={s.id} className="border-t border-outline pt-4">
            <p className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
              0{i + 1} · {s.when}
            </p>
            <h4 className="font-headline italic text-lg text-primary">{s.name}</h4>
            {s.handoff && (
              <p className="mt-1 font-label uppercase tracking-[0.14em] text-[10px] text-secondary">→ {s.handoff}</p>
            )}
            <dl className="mt-3 space-y-3">
              {BLUEPRINT_LAYERS.map((layer) => (
                <div
                  key={layer.key}
                  className={`pl-3 border-l ${
                    layer.key === "boundary"
                      ? "border-secondary"
                      : layer.key === "behind"
                        ? "border-dashed border-outline"
                        : "border-outline-variant"
                  }`}
                >
                  <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">{layer.label}</dt>
                  <dd>
                    <Cell stage={s} layer={layer} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-l-2 border-secondary pl-4 font-headline italic text-lg text-primary leading-relaxed">
        {BLUEPRINT.insight}
      </p>
      <figcaption className="mt-4 font-body text-sm text-on-surface-variant">{BLUEPRINT.caption}</figcaption>
      <div className="mt-5 border-t border-outline-variant pt-4">
        <p className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-2">Evidence status</p>
        <ul className="space-y-1.5 font-body text-sm text-on-surface-variant">
          {BLUEPRINT.qualifications.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>
    </figure>
  );
};
