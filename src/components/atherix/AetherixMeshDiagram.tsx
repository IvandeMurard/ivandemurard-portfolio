import { Icon } from "@/components/ui/Icon";

const NODES = [
  {
    emoji: "🍽️",
    name: "Aetherix",
    role: "F&B execution: forecast, staffing, memory, receipts",
    status: "Live (staging)",
    statusTone: "live" as const,
  },
  {
    emoji: "🌦️",
    name: "Tacet",
    role: "Sensory: weather, noise, open data → risk",
    status: "Phase 3",
    statusTone: "phase" as const,
  },
  {
    emoji: "🎛️",
    name: "Orchestrator",
    role: "Supervisory: MCP routing, business rules. Stub in Phase 3, dedicated repo in Phase 4.",
    status: "Phase 3, stub",
    statusTone: "phase" as const,
  },
  {
    emoji: "🧡",
    name: "Anima",
    role: "Guest Cognition Layer",
    status: "Synthetic PoC, hackathon prototype; production DPIA-gated",
    statusTone: "shipped" as const,
  },
];

const NodeCard = ({
  title,
  sub,
  emphasized = false,
  dashed = false,
}: {
  title: string;
  sub?: string;
  emphasized?: boolean;
  dashed?: boolean;
}) => (
  <div
    className={`relative rounded-2xl px-5 py-4 text-center min-w-[140px] ${
      emphasized
        ? "border-2 border-secondary/60 bg-surface-container-high"
        : dashed
        ? "border border-dashed border-outline-variant bg-surface-container-low"
        : "border border-outline-variant bg-surface-container-low"
    }`}
  >
    <p className="font-headline italic text-primary text-base md:text-lg leading-tight">{title}</p>
    {sub && (
      <p className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary mt-1">{sub}</p>
    )}
    {emphasized && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label uppercase tracking-[0.18em] text-[10px] whitespace-nowrap">
        this node
      </span>
    )}
  </div>
);

const Arrow = () => (
  <Icon name="arrow_forward" className="text-outline text-xl shrink-0" />
);

export const AetherixMeshDiagram = () => (
  <div className="flex flex-col gap-10">
    {/* Diagram */}
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-10">
      {/* Desktop: horizontal */}
      <div className="hidden lg:flex items-center justify-center gap-6">
        <div className="flex flex-col gap-3">
          <NodeCard title="Tacet" sub="Sensory" />
          <NodeCard title="Orchestrator" sub="Supervisory" />
          <div className="flex flex-col items-center gap-1">
            <NodeCard title="Anima" sub="Guest Cognition" />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label uppercase tracking-[0.18em] text-[10px]">
              Synthetic PoC
            </span>
          </div>
        </div>
        <Arrow />
        <div className="flex flex-col items-center gap-4">
          <NodeCard title="Aetherix" sub="F&B execution" emphasized />
          <div className="flex flex-col items-center gap-1">
            <Icon name="more_vert" className="text-outline text-sm" />
            <NodeCard title="HiveMemory" sub="Anonymized peers" dashed />
          </div>
        </div>
        <Arrow />
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-outline-variant bg-surface-container-low">
          <Icon name="chat" className="text-secondary text-lg" />
          <div>
            <p className="font-headline italic text-primary text-base leading-tight">Manager</p>
            <p className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary mt-1">
              WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="lg:hidden flex flex-col items-center gap-4">
        <div className="grid grid-cols-2 gap-3 w-full">
          <NodeCard title="Tacet" sub="Sensory" />
          <NodeCard title="Orchestrator" sub="Supervisory" />
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <NodeCard title="Anima" sub="Guest Cognition" />
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label uppercase tracking-[0.18em] text-[10px]">
            Synthetic PoC
          </span>
        </div>
        <Icon name="arrow_downward" className="text-outline text-xl" />
        <NodeCard title="Aetherix" sub="F&B execution" emphasized />
        <NodeCard title="HiveMemory" sub="Anonymized peers, side input" dashed />
        <Icon name="arrow_downward" className="text-outline text-xl" />
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-outline-variant bg-surface-container-low">
          <Icon name="chat" className="text-secondary text-lg" />
          <div>
            <p className="font-headline italic text-primary text-base leading-tight">Manager</p>
            <p className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary mt-1">
              WhatsApp
            </p>
          </div>
        </div>
      </div>

      <p className="font-label uppercase tracking-[0.25em] text-[10px] text-on-surface-variant text-center mt-8">
        Aetherix executes. It does not orchestrate.
      </p>
    </div>

    {/* Bounded contexts table */}
    <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-surface-container-lowest">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-left">
            <th className="px-5 py-3 font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
              Node
            </th>
            <th className="px-5 py-3 font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
              Role
            </th>
            <th className="px-5 py-3 font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {NODES.map((n) => (
            <tr
              key={n.name}
              className="border-b border-outline-variant last:border-b-0 align-top"
            >
              <td className="px-5 py-4 whitespace-nowrap">
                <span className="font-headline italic text-primary text-base">
                  <span aria-hidden="true" className="mr-2">{n.emoji}</span>
                  {n.name}
                </span>
              </td>
              <td className="px-5 py-4 text-on-surface leading-relaxed">{n.role}</td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-label uppercase tracking-[0.18em] bg-secondary text-on-secondary">

                  {n.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AetherixMeshDiagram;
