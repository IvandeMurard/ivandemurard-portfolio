const relations = [
  { position: "md:col-start-2", title: "PMS (Apaleo) → Aetherix", line: "data, read-only · listing" },
  { position: "md:col-start-3 md:row-start-2", title: "Aetherix → F&B manager", line: "daily message" },
  { position: "md:col-start-2 md:row-start-3", title: "F&B manager → Aetherix", line: "reply" },
  { position: "md:col-start-1 md:row-start-2", title: "Hotel management → Aetherix", line: "contract" },
];

export const AetherixRelationshipFigure = () => (
  <figure className="max-w-4xl">
    <div className="grid gap-3 rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:grid-cols-3 md:grid-rows-3 md:p-8">
      <div className="flex min-h-28 items-center justify-center rounded-sm border border-secondary bg-surface-container-high p-5 text-center md:col-start-2 md:row-start-2">
        <span className="font-headline text-2xl italic text-primary">Aetherix</span>
      </div>
      {relations.map((relation) => (
        <div key={`${relation.title}-${relation.line}`} className={`flex min-h-24 flex-col justify-center rounded-sm border border-outline-variant bg-surface-container-low p-4 ${relation.position}`}>
          <span className="font-headline text-lg italic text-primary">{relation.title}</span>
          <span className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-secondary">
            {relation.line}
          </span>
        </div>
      ))}
    </div>
    <figcaption className="mt-3 text-sm text-on-surface-variant">Who uses, who pays, who distributes.</figcaption>
  </figure>
);

export default AetherixRelationshipFigure;