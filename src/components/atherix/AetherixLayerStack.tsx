import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Three-layer product hierarchy: Interface, Brain, Foundation.
 * Replaces the horizontal pipeline with a more product-led narrative.
 * Hover or focus to lift a layer and reveal its concrete surfaces.
 */

type Layer = {
  numeral: string;
  name: string;
  component: string;
  function: string;
  surfaces: { icon: string; label: string }[];
  tone: "interface" | "brain" | "foundation";
};

const LAYERS: Layer[] = [
  {
    numeral: "III",
    name: "The Interface",
    component: "Headless and Native",
    function: "Lives inside WhatsApp, Slack, and the native PMS task lists. No new tab, no new app to learn.",
    surfaces: [
      { icon: "chat", label: "WhatsApp" },
      { icon: "forum", label: "Slack" },
      { icon: "hotel", label: "Apaleo, Mews, Cloudbeds" },
    ],
    tone: "interface",
  },
  {
    numeral: "II",
    name: "The Brain",
    component: "Aetherix Agentic Layer",
    function: "Contextual processing, unexpressed wish detection, cross-departmental orchestration. Recommends, never decides alone.",
    surfaces: [
      { icon: "psychology", label: "Reasoning" },
      { icon: "auto_awesome", label: "Claude Sonnet" },
      { icon: "hub", label: "MCP orchestration" },
    ],
    tone: "brain",
  },
  {
    numeral: "I",
    name: "The Foundation",
    component: "The Hive and Legacy Data",
    function: "Anonymous peer metadata plus your existing property history. The Memory Floor that turns isolated context into shared anticipation.",
    surfaces: [
      { icon: "scatter_plot", label: "Anonymous peer signals" },
      { icon: "memory", label: "Per-property memory" },
      { icon: "dns", label: "Legacy systems" },
    ],
    tone: "foundation",
  },
];

const toneClasses: Record<Layer["tone"], string> = {
  interface: "bg-surface-container-lowest border-outline-variant/30",
  brain: "bg-surface-container-low border-secondary-fixed-dim/40",
  foundation: "bg-surface-container border-outline-variant/40",
};

export const AetherixLayerStack = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical light beam connecting layers */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-secondary-fixed-dim/40 to-transparent pointer-events-none"
      />

      <ol className="relative flex flex-col gap-4 md:gap-5">
        {LAYERS.map((layer, i) => {
          const isActive = active === i;
          return (
            <li key={layer.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                data-reveal-child
                style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
                aria-expanded={isActive}
                className={`group relative w-full text-left border rounded-2xl px-6 md:px-10 py-6 md:py-8 backdrop-blur-md shadow-sm transition-all duration-500 ease-out ${toneClasses[layer.tone]} ${
                  isActive ? "-translate-y-1 shadow-lg" : "hover:-translate-y-0.5"
                }`}
              >
                {/* Gold hairline that grows on hover */}
                <span
                  aria-hidden="true"
                  className={`absolute left-6 md:left-10 top-0 h-px bg-gradient-to-r from-secondary-fixed-dim to-transparent transition-all duration-700 ease-out ${
                    isActive ? "w-1/2 opacity-100" : "w-8 opacity-40"
                  }`}
                />

                <div className="flex items-start gap-6 md:gap-10">
                  <span className="font-label uppercase tracking-[0.25em] text-[11px] text-secondary shrink-0 pt-1">
                    {layer.numeral}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
                      <h3 className="font-headline italic text-2xl md:text-3xl text-primary leading-tight">
                        {layer.name}
                      </h3>
                      <p className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant mt-1 md:mt-0">
                        {layer.component}
                      </p>
                    </div>

                    <p className="text-on-surface-variant leading-relaxed mt-3 md:mt-4 text-sm md:text-base max-w-2xl">
                      {layer.function}
                    </p>

                    {/* Surfaces, revealed on hover */}
                    <div
                      className={`grid grid-flow-col auto-cols-max gap-3 md:gap-5 mt-5 transition-all duration-500 ease-out ${
                        isActive
                          ? "opacity-100 translate-y-0 max-h-24"
                          : "opacity-0 translate-y-2 max-h-0 overflow-hidden md:max-h-0"
                      }`}
                    >
                      {layer.surfaces.map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/40 bg-surface/70"
                        >
                          <Icon name={s.icon} className="text-outline text-sm" />
                          <span className="text-[11px] uppercase tracking-widest text-secondary">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="font-label uppercase tracking-[0.25em] text-[10px] text-on-surface-variant text-center pt-8 md:pt-10">
        Zero-UI Action Layer · Native Workflow Injection
      </p>
    </div>
  );
};

export default AetherixLayerStack;
