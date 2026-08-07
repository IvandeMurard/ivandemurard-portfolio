import { Icon } from "@/components/ui/Icon";

/**
 * Architecture illustration of the Tacet headless pipeline.
 * Mirrors the mermaid graph: proxy data sources → Tacet engine (synthetic acoustic
 * model + 3D geometry) → hotel operations (RMS, PMS).
 */
export const TacetPipelineDiagram = () => {
  const proxies = [
    { icon: "construction", title: "OpenData Permits", sub: "Webhooks" },
    { icon: "traffic", title: "Traffic APIs", sub: "Streams" },
    { icon: "cloud", title: "Weather APIs", sub: "Streams" },
    { icon: "event", title: "Local Events", sub: "Streams" },
  ];
  const engine = [
    { icon: "polyline", title: "Ray-tracing Physics Engine", sub: "3D line of sight, shielding" },
    { icon: "memory", title: "Dual Memory store", sub: "Idiosyncratic + Hive Mind" },
  ];
  const ops = [
    { icon: "trending_up", title: "Revenue Management", sub: "Yield rules, HITL approval" },
    { icon: "hotel", title: "Property Management", sub: "Room tags, reassignment" },
  ];

  return (
    <div className="relative w-full h-full p-6 md:p-10 bg-surface-container-lowest flex flex-col gap-8 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full gold-halo opacity-40 halo-drift"
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Caption row */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">Proxy data sources</span>
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">Tacet engine</span>
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">Hotel operations</span>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 items-stretch">
          <Column items={proxies} delay={0} />
          <Column items={engine} delay={120} accent />
          <Column items={ops} delay={240} />
        </div>

        {/* Connector to JSON output */}
        <div className="flex justify-center">
          <div
            className="divider-fall mcp-pulse-track h-10"
            style={{ ["--reveal-delay" as string]: "360ms", ["--pulse-delay" as string]: "0ms" }}
          />
        </div>

        {/* JSON Alerts node */}
        <div className="flex justify-center">
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "440ms" }}
            className="relative flex items-center gap-3 px-5 py-3 border border-dashed border-secondary-fixed-dim rounded-xl bg-surface-container-high shadow-sm backdrop-blur-sm max-w-sm w-full"
          >
            <div className="w-9 h-9 rounded-full border border-secondary-fixed-dim flex items-center justify-center shrink-0">
              <Icon name="hub" className="text-on-surface-variant text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-headline italic text-primary text-base md:text-lg leading-tight">
                MCP server: rules and Chain of Thought
              </p>
              <p className="text-[10px] uppercase tracking-widest text-secondary mt-0.5">
                Consumed by RMS, PMS and orchestration agents
              </p>
            </div>
            <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary shrink-0">
              MCP
            </span>
          </div>
        </div>

        <p className="font-label uppercase tracking-[0.25em] text-[10px] text-on-surface text-center pt-2">
          Proxy signals · Ray-traced physics · Dual memory · MCP rules
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
            ? "border-secondary-fixed-dim bg-surface-container-high"
            : "border-outline-variant bg-surface-container"
        } shadow-sm backdrop-blur-sm`}
      >
        <div className="w-8 h-8 rounded-full border border-outline-variant bg-surface flex items-center justify-center shrink-0">
          <Icon name={it.icon} className="text-on-surface-variant text-base" />
        </div>
        <div className="min-w-0">
          <p className="font-headline italic text-primary text-sm md:text-base leading-tight truncate">{it.title}</p>
          <p className="text-[10px] uppercase tracking-widest text-secondary mt-0.5 truncate">{it.sub}</p>
        </div>
      </div>
    ))}
  </div>
);

export default TacetPipelineDiagram;
