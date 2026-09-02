import { Icon } from "@/components/ui/Icon";

const LAYERS = [
  { name: "Working", body: "Live session context, discarded when the conversation ends." },
  { name: "Episodic", body: "Distinct guest interactions, timestamped, retrievable." },
  { name: "Semantic", body: "Stable facts about a guest, confidence-weighted." },
  { name: "Segment", body: "Anonymized patterns across similar guest profiles." },
];

export const AetherixAnimaSpotlight = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-12">
    <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 mb-10">
      <div className="flex-1">
        <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
          Sister node · Guest Cognition
        </span>
        <h2 className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight">
          Anima. Guest memory, four layers deep.
        </h2>
        <p className="mt-6 text-on-surface-variant leading-relaxed max-w-2xl">
          Where Aetherix remembers the property, Anima remembers the guest. A synthetic proof of concept built at the
          Anthropic hackathon (June 2026): a four-layer temporal memory with confidence-weighted claims, run on
          synthetic data. Production is Phase 4, DPIA-gated.
        </p>
      </div>
      <a
        href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors shrink-0"
      >
        <Icon name="hub" className="text-base" />
        Explore the Mesh
      </a>
    </div>

    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {LAYERS.map((layer, i) => (
        <li
          key={layer.name}
          className="border border-outline-variant rounded-xl bg-surface-container-low p-5 flex flex-col gap-2"
        >
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary tabular-nums">
            Layer 0{i + 1}
          </span>
          <p className="font-headline italic text-primary text-xl leading-tight">{layer.name}</p>
          <p className="text-xs text-on-surface-variant leading-relaxed">{layer.body}</p>
        </li>
      ))}
    </ol>
  </div>
);

export default AetherixAnimaSpotlight;
