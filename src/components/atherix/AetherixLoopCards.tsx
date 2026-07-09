import { Icon } from "@/components/ui/Icon";

const LOOP = [
  {
    icon: "psychology",
    title: "Memory",
    body: "Recall what worked here, on similar days, in similar contexts. Local history first, anonymized peer patterns as cold-start.",
    day7: "Cold-start. Confidence is honest about what is not yet known.",
    day90: "Drivers are property-specific, calibrated by enough Tuesdays.",
  },
  {
    icon: "insights",
    title: "Prediction",
    body: "A calibrated forecast for tomorrow: covers, staffing, waste risk, with the drivers behind it.",
    day7: "Baseline lean on peer aggregates and first-week local signals.",
    day90: "Confidence intervals tighten. Fewer surprises, fewer overrides.",
  },
  {
    icon: "send",
    title: "Action",
    body: "One message on WhatsApp. Accept, modify, or reject in one tap. No new dashboard to learn.",
    day7: "The receipt is verbose, spells out every assumption.",
    day90: "Compact. The manager reads a paragraph, taps once.",
  },
  {
    icon: "autorenew",
    title: "Learning",
    body: "Every reply is a signal. The day-90 receipt is sharper than the day-7 one.",
    day7: "Every accept, modify, reject deposits one grain of memory.",
    day90: "The system knows how this property behaves, not just how hotels behave.",
  },
];

export const AetherixLoopCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {LOOP.map((step, i) => (
      <div
        key={step.title}
        data-reveal-child
        style={{ ["--reveal-delay" as string]: `${200 + i * 100}ms` }}
        className="bg-surface-container-low border border-outline-variant/25 rounded-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary tabular-nums">
            0{i + 1}
          </span>
          <Icon name={step.icon} className="text-secondary text-xl" />
        </div>
        <h3 className="font-headline italic text-xl text-primary leading-tight">{step.title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{step.body}</p>
        <div className="mt-2 pt-4 border-t border-outline-variant/25 flex flex-col gap-2 text-xs">
          <p className="text-on-surface-variant">
            <span className="font-label uppercase tracking-[0.18em] text-[9px] text-on-surface-variant/80 mr-2">
              Day 7
            </span>
            {step.day7}
          </p>
          <p className="text-on-surface">
            <span className="font-label uppercase tracking-[0.18em] text-[9px] text-secondary mr-2">
              Day 90
            </span>
            {step.day90}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default AetherixLoopCards;
