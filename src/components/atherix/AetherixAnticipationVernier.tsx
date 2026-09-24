import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

const MAPE = 15.09;
const GATE = 22;
const MAX = 30;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const AetherixAnticipationVernier = () => {
  const [phase, setPhase] = useState<"idle" | "sweeping" | "aligned" | "passed">("idle");
  const timers = useRef<number[]>([]);
  const active = phase !== "idle";
  const aligned = phase === "aligned" || phase === "passed";
  const passed = phase === "passed";

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const calibrate = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (reducedMotion()) {
      setPhase("passed");
      return;
    }
    setPhase("sweeping");
    timers.current.push(window.setTimeout(() => setPhase("aligned"), 1450));
    timers.current.push(window.setTimeout(() => setPhase("passed"), 2150));
  };

  const xFor = (value: number) => 92 + (value / MAX) * 716;
  const needleX = aligned || passed ? xFor(MAPE) : active ? xFor(GATE + 5) : xFor(0);

  return (
    <figure className="m-0 max-w-5xl">
      <div className="overflow-hidden rounded-sm border border-outline bg-surface-container-lowest">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-3 md:px-5">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
            Fig. 9.1 · Anticipation vernier
          </span>
          <span className="font-mono text-[10px] uppercase text-on-surface-variant">J+1 · synthetic backtest</span>
        </div>

        <div className="p-4 md:p-6">
          <svg
            viewBox="0 0 900 390"
            className="block h-auto w-full"
            role="img"
            aria-label="Anticipation calibration scale. Synthetic MAPE is 15.09 percent against a 22 percent passing gate."
          >
            <g fill="none" stroke="hsl(var(--outline-variant))" strokeWidth="1">
              <path d="M48 48h22M48 48v22M852 48h-22M852 48v22M48 342h22M48 342v-22M852 342h-22M852 342v-22" />
              <line x1="92" y1="176" x2="808" y2="176" />
              <line x1="92" y1="239" x2="808" y2="239" />
            </g>

            <g stroke="hsl(var(--outline-variant))">
              {Array.from({ length: 31 }, (_, i) => {
                const x = xFor(i);
                const major = i % 5 === 0;
                return (
                  <g key={i}>
                    <line x1={x} y1={major ? 148 : 157} x2={x} y2="176" strokeWidth={major ? 1.2 : 0.8} />
                    {major && (
                      <text x={x} y="137" textAnchor="middle" fill="hsl(var(--on-surface-variant))" stroke="none" fontSize="10">
                        {i}%
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            <g fill="hsl(var(--secondary))" fontSize="10" letterSpacing="2">
              <text x="92" y="92">FORECAST ERROR · MAPE</text>
              <text x="808" y="92" textAnchor="end">LOWER IS BETTER</text>
            </g>

            <line
              x1={xFor(GATE)}
              y1="118"
              x2={xFor(GATE)}
              y2="258"
              stroke="hsl(var(--error))"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text x={xFor(GATE)} y="110" textAnchor="middle" fill="hsl(var(--error))" fontSize="10" letterSpacing="1.6">
              GATE · 22%
            </text>

            <g
              style={{ transform: `translateX(${needleX - xFor(0)}px)` }}
              className="transition-transform duration-[1400ms] ease-hospitable"
            >
              <path d={`M${xFor(0) - 9} 120h18l-9 14z`} fill="hsl(var(--secondary))" />
              <line x1={xFor(0)} y1="134" x2={xFor(0)} y2="253" stroke="hsl(var(--secondary))" strokeWidth="1.5" />
              <circle cx={xFor(0)} cy="239" r="6" fill="hsl(var(--surface-container-lowest))" stroke="hsl(var(--secondary))" strokeWidth="1.5" />
            </g>

            <g opacity={aligned || passed ? 1 : 0.25} className="transition-opacity duration-500">
              <line x1={xFor(MAPE) - 40} y1="239" x2={xFor(MAPE) + 40} y2="239" stroke="hsl(var(--secondary))" strokeWidth="3" />
              {Array.from({ length: 11 }, (_, i) => (
                <line
                  key={i}
                  x1={xFor(MAPE) - 40 + i * 8}
                  y1="239"
                  x2={xFor(MAPE) - 40 + i * 8}
                  y2={i === 5 ? 269 : 258}
                  stroke="hsl(var(--secondary))"
                  strokeWidth={i === 5 ? 1.5 : 0.8}
                />
              ))}
              <text x={xFor(MAPE)} y="292" textAnchor="middle" fill="hsl(var(--primary))" fontSize="24" fontStyle="italic">
                15.09%
              </text>
              <text x={xFor(MAPE)} y="309" textAnchor="middle" fill="hsl(var(--on-surface-variant))" fontSize="9" letterSpacing="1.5">
                CALIBRATION BASELINE
              </text>
            </g>

            <g transform="translate(678 275)">
              <rect width="130" height="48" rx="2" fill="hsl(var(--surface-container-low))" stroke={passed ? "hsl(var(--secondary))" : "hsl(var(--outline-variant))"} />
              <path d="M16 19v-5a8 8 0 0 1 16 0v5" fill="none" stroke={passed ? "hsl(var(--secondary))" : "hsl(var(--outline-variant))"} strokeWidth="1.2" />
              <rect x="13" y="19" width="22" height="17" rx="1" fill="none" stroke={passed ? "hsl(var(--secondary))" : "hsl(var(--outline-variant))"} />
              <text x="48" y="29" fill={passed ? "hsl(var(--secondary))" : "hsl(var(--on-surface-variant))"} fontSize="11" letterSpacing="2">
                {passed ? "PASS" : "UNREAD"}
              </text>
            </g>
          </svg>

          <div className="grid gap-px border border-outline-variant bg-outline-variant sm:grid-cols-3">
            <div className="bg-surface-container-low px-4 py-3">
              <span className="block font-label text-[9px] uppercase tracking-[0.16em] text-secondary">Evidence</span>
              <span className="mt-1 block font-body text-xs text-on-surface">Synthetic backtest</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3">
              <span className="block font-label text-[9px] uppercase tracking-[0.16em] text-secondary">Security</span>
              <span className="mt-1 block font-body text-xs text-on-surface">14/14 gates passing</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3">
              <span className="block font-label text-[9px] uppercase tracking-[0.16em] text-secondary">Reality check</span>
              <span className="mt-1 block font-body text-xs text-on-surface">0 real users</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={calibrate} disabled={phase === "sweeping"}>
              <Icon name={phase === "sweeping" ? "pending" : passed ? "restart_alt" : "play_arrow"} />
              {phase === "sweeping" ? "Calibrating" : passed ? "Calibrate again" : "Calibrate"}
            </Button>
            <span aria-live="polite" className="font-mono text-[10px] uppercase text-on-surface-variant">
              {passed ? "15.09 < 22 · gate pass" : aligned ? "Vernier aligned · checking gate" : active ? "Reading scale" : "Instrument at rest"}
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 max-w-3xl font-body text-sm leading-relaxed text-on-surface-variant">
        Synthetic calibration baseline, not a live accuracy claim. Real-world measurement begins with the pilot.
      </figcaption>
    </figure>
  );
};

export default AetherixAnticipationVernier;