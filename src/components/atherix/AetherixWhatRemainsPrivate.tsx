import { Icon } from "@/components/ui/Icon";

const EVIDENCE = [
  "Evaluation gates",
  "Traceability",
  "Safety guardrails",
  "Privacy boundaries",
  "Outcome measurement",
];

export const AetherixWhatRemainsPrivate = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8">
    <div className="flex items-center gap-3">
      <Icon name="shield_lock" className="text-secondary text-xl" />
      <h3 className="font-headline italic text-2xl text-primary leading-tight">What remains private</h3>
    </div>
    <p className="mt-4 text-on-surface-variant text-sm leading-relaxed max-w-3xl">
      The project includes proprietary research on cross-domain operational context and cold-start learning. Public
      materials focus on the engineering evidence: evaluation gates, traceability, safety guardrails, privacy
      boundaries, and outcome measurement.
    </p>
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Public engineering evidence">
      {EVIDENCE.map((e) => (
        <li
          key={e}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant font-label uppercase tracking-[0.18em] text-[10px] text-secondary"
        >
          {e}
        </li>
      ))}
    </ul>
  </div>
);

export default AetherixWhatRemainsPrivate;
