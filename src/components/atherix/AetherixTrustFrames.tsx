const FRAMES = [
  {
    caption: "Eval pipeline, hard CI gate",
    hint: "Screenshot coming",
  },
  {
    caption: "MCP tool-call observability event",
    hint: "Screenshot coming",
  },
  {
    caption: "Multi-tenant hotel_id scoping",
    hint: "Screenshot coming",
  },
];

export const AetherixTrustFrames = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {FRAMES.map((f, i) => (
      <figure
        key={f.caption}
        data-reveal-child
        style={{ ["--reveal-delay" as string]: `${200 + i * 120}ms` }}
        className="flex flex-col gap-3"
      >
        <div className="aspect-video rounded-2xl bg-surface-container-low border border-outline-variant flex items-center justify-center">
          <span className="font-label uppercase tracking-[0.25em] text-[10px] text-on-surface-variant">
            {f.hint}
          </span>
        </div>
        <figcaption className="text-sm text-on-surface-variant leading-relaxed">{f.caption}</figcaption>
      </figure>
    ))}
  </div>
);

export default AetherixTrustFrames;
