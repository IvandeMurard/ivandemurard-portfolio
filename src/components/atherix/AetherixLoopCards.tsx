import { Icon } from "@/components/ui/Icon";

const LOOP = [
  {
    icon: "schedule",
    title: "Evening",
    body: "Aetherix sends tomorrow's covers and staffing, with the reasons.",
  },
  {
    icon: "reply",
    title: "Reply",
    body: "The manager accepts, rejects, or gives the right figure.",
  },
  {
    icon: "wb_sunny",
    title: "Next morning",
    body: "The real outcome is stored next to the recommendation.",
  },
  {
    icon: "autorenew",
    title: "Adjust",
    body: "The agent recalibrates on the gap.",
  },
];

export const AetherixLoopCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
    {LOOP.map((step, i) => (
      <div
        key={step.title}
        data-reveal-child
        style={{ ["--reveal-delay" as string]: `${200 + i * 100}ms` }}
        className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary tabular-nums">
            0{i + 1}
          </span>
          <Icon name={step.icon} className="text-secondary text-xl" />
        </div>
        <h3 className="font-headline italic text-xl text-primary leading-tight">{step.title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{step.body}</p>
      </div>
    ))}
  </div>
);

export default AetherixLoopCards;
