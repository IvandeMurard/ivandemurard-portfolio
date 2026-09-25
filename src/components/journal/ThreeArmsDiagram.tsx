import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Arm = {
  key: string;
  name: string;
  when: string;
  span: [number, number]; // 0..100 along the release timeline
  proves: string;
  products: string;
  example: string;
};

const ARMS: Arm[] = [
  {
    key: "A",
    name: "Offline",
    when: "Before the merge",
    span: [0, 34],
    proves: "No regression on the case set: stratified accuracy, category coverage.",
    products: "Aetherix and Lore",
    example: "Lore: 64 frozen cases, 10 graders, merge blocked when tier 1 drops below 100%.",
  },
  {
    key: "B",
    name: "Runtime",
    when: "In production, continuously",
    span: [38, 100],
    proves: "Guardrails and anomaly detection on real traffic: error rates, output bounds, abstention, drift, latency.",
    products: "Aetherix only",
    example: "Aetherix: every tool call emitted as a structured event, auditable and billable.",
  },
  {
    key: "C",
    name: "Outcome",
    when: "After the fact, long loop",
    span: [62, 100],
    proves: "Was the output acted on, and did it produce value.",
    products: "Aetherix, half of it",
    example: "Forecast error computes itself against realised covers. The truth is still declared by the manager.",
  },
];

const MARKERS = ["Commit", "Merge", "Release", "Weeks later"];

/**
 * When each evaluation arm fires along a release timeline. Hover or focus
 * previews an arm, click pins it. The accompanying table carries the same
 * information as accessible text.
 */
export const ThreeArmsDiagram = ({ label = "When each arm fires" }: { label?: string }) => {
  const [active, setActive] = useState<number | null>(null);
  const current = active !== null ? ARMS[active] : null;

  return (
    <figure className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6 not-italic m-0">
      <figcaption className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-5">
        {label}
      </figcaption>
      <div className="space-y-3">
        {ARMS.map((arm, i) => {
          const isActive = active === i;
          return (
            <div key={arm.key} className="grid grid-cols-[3.5rem_1fr] items-center gap-3">
              <div className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                {arm.key}
              </div>
              <button
                type="button"
                aria-controls="three-arms-detail"
                aria-expanded={isActive}
                aria-label={`Arm ${arm.key}, ${arm.name}, ${arm.when}`}
                onClick={() => setActive(isActive ? null : i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="relative block h-9 w-full rounded-sm bg-surface-container-low border border-outline-variant hover:border-secondary transition-colors duration-300"
              >
                <span
                  style={{ left: `${arm.span[0]}%`, width: `${arm.span[1] - arm.span[0]}%` }}
                  className={`absolute inset-y-0 rounded-sm border flex items-center px-3 transition-colors duration-300 ${
                    isActive
                      ? "bg-secondary/25 border-secondary"
                      : "bg-surface-container-high border-secondary"
                  }`}
                >
                  <span className="font-headline italic text-sm text-primary truncate">{arm.name}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-[3.5rem_1fr] gap-3">
        <div />
        <div className="flex justify-between font-label uppercase tracking-[0.14em] text-[10px] text-on-surface-variant">
          {MARKERS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      <div
        id="three-arms-detail"
        aria-live="polite"
        className="mt-5 rounded-sm border border-outline-variant bg-surface-container-low p-4 min-h-[6rem]"
      >
        {current ? (
          <>
            <div className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary mb-2">
              Arm {current.key} · {current.name} · {current.when}
            </div>
            <p className="font-body font-normal text-sm text-on-surface-variant">{current.proves}</p>
            <p className="font-body font-normal text-sm text-on-surface-variant mt-2">
              <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mr-2">
                {current.products}
              </span>
              {current.example}
            </p>
          </>
        ) : (
          <p className="flex items-center gap-2 font-body font-normal text-sm text-on-surface-variant">
            <Icon name="touch_app" className="text-secondary text-[18px] leading-none" />
            Select an arm to see what it proves and where it runs.
          </p>
        )}
      </div>
    </figure>
  );
};

export default ThreeArmsDiagram;
