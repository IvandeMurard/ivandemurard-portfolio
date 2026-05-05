import { Icon } from "@/components/ui/Icon";

/**
 * Architecture illustration of the real Aetherix pipeline.
 * Mirrors the mermaid graph from the repo README:
 *   External signals → Fat Backend (FastAPI) → Intelligence layers → Delivery
 */
export const AetherixArchitectureDiagram = () => {
  const externals = [
    { icon: "hotel", title: "Apaleo PMS", sub: "OAuth, MCP read" },
    { icon: "cloud", title: "Weather", sub: "Open Meteo" },
    { icon: "event", title: "Events", sub: "PredictHQ" },
  ];
  const backend = [
    { icon: "sync", title: "PMS Sync", sub: "Capture rate" },
    { icon: "psychology", title: "Semantic Reasoning", sub: "Anomaly detection" },
    { icon: "auto_awesome", title: "Claude Sonnet", sub: "RAG engine" },
    { icon: "verified", title: "Explainability", sub: "Why? service" },
  ];
  const intelligence = [
    { icon: "dns", title: "Supabase", sub: "Operational data" },
    { icon: "scatter_plot", title: "Qdrant", sub: "495+ patterns" },
    { icon: "memory", title: "pgvector", sub: "Per-hotel memory" },
  ];
  const delivery = [
    { icon: "chat", title: "WhatsApp push" },
    { icon: "dashboard", title: "Next.js verification" },
  ];

  return (
    <div className="relative w-full h-full p-6 md:p-10 bg-surface-container-lowest flex flex-col gap-8 overflow-hidden">
      {/* Soft gold halo background */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full gold-halo opacity-40 halo-drift"
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Caption row */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">External signals</span>
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">Fat backend, FastAPI</span>
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">Intelligence layers</span>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 items-stretch">
          <Column items={externals} delay={0} />
          <Column items={backend} delay={120} accent />
          <Column items={intelligence} delay={240} />
        </div>

        {/* Connector divider */}
        <div className="flex items-center gap-3 px-2">
          <div className="divider-fall flex-1 h-px bg-secondary-fixed-dim/50" />
          <Icon name="arrow_downward" className="text-secondary text-base" />
          <div className="divider-fall flex-1 h-px bg-secondary-fixed-dim/50" />
        </div>

        {/* Delivery row */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {delivery.map((d, i) => (
            <div
              key={d.title}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${360 + i * 80}ms` }}
              className="flex items-center gap-3 px-4 py-3 border border-outline-variant/30 rounded-xl bg-surface/80 backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-full border border-secondary-fixed-dim/50 flex items-center justify-center">
                <Icon name={d.icon} className="text-outline text-lg" />
              </div>
              <span className="font-headline italic text-primary text-base md:text-lg">{d.title}</span>
            </div>
          ))}
        </div>

        <p className="font-label uppercase tracking-[0.25em] text-[9px] text-on-surface-variant/70 text-center pt-2">
          Numerical · Semantic · Cognitive · Reasoning
        </p>
      </div>
    </div>
  );
};

const Column = ({
  items,
  delay,
  accent = false,
}: {
  items: { icon: string; title: string; sub: string }[];
  delay: number;
  accent?: boolean;
}) => (
  <div className="flex flex-col gap-3">
    {items.map((it, i) => (
      <div
        key={it.title}
        data-reveal-child
        style={{ ["--reveal-delay" as string]: `${delay + i * 70}ms` }}
        className={`flex items-start gap-3 px-3 py-3 rounded-lg border ${
          accent
            ? "border-secondary-fixed-dim/50 bg-surface-container-low/70"
            : "border-outline-variant/25 bg-surface/60"
        } backdrop-blur-sm`}
      >
        <div className="w-8 h-8 rounded-full border border-outline-variant/40 bg-surface flex items-center justify-center shrink-0">
          <Icon name={it.icon} className="text-outline text-base" />
        </div>
        <div className="min-w-0">
          <p className="font-headline italic text-primary text-sm md:text-base leading-tight truncate">{it.title}</p>
          <p className="text-[10px] uppercase tracking-widest text-secondary mt-0.5 truncate">{it.sub}</p>
        </div>
      </div>
    ))}
  </div>
);

export default AetherixArchitectureDiagram;
