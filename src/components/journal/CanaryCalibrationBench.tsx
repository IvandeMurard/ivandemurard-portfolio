import { useCallback, useEffect, useRef, useState } from "react";

type Mode = {
  key: string;
  label: string;
  hint: string;
  runs: number[];
  total: number;
  verdict: string;
  reading: string;
  armed: boolean;
};

const MODES: Mode[] = [
  {
    key: "temp0",
    label: "Temperature 0",
    hint: "Same input, replayed three times",
    runs: [53, 53, 53],
    total: 53,
    verdict: "Gate armed · blocking",
    reading:
      "Three runs, one score, 0.00 points of spread. The instrument holds still, so a threshold on it is a measurement and may block a merge.",
    armed: true,
  },
  {
    key: "temp05",
    label: "Temperature 0.5",
    hint: "The same suite, before the setting was fixed",
    runs: [38, 36, 42],
    total: 53,
    verdict: "Gate refused · unarmed",
    reading:
      "Six points of spread on an unchanged input. A threshold set here would block or pass on the draw, not on the work.",
    armed: false,
  },
];

const W = 480;
const H = 150;
const BASE = 118;
const TOP = 26;
const LANES = [96, 240, 384];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Instrument stability bench. Three replays of one input, drawn as a fine
 * engraved gauge: the gate only arms once the three crests sit on one line.
 * Content, not decoration: it states the rule the section argues for.
 */
export const CanaryCalibrationBench = ({
  label = "Fig. 7.1 · Instrument stability test",
}: {
  label?: string;
}) => {
  const [modeIndex, setModeIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 3, fractional while drawing
  const frame = useRef<number>();
  const mode = MODES[modeIndex];

  const run = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (prefersReducedMotion()) {
      setProgress(3);
      return;
    }
    const start = performance.now();
    const duration = 1650;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * 3);
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    setProgress(0);
    frame.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    run();
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [modeIndex, run]);

  const settled = progress >= 3;
  const height = (score: number) => ((BASE - TOP) * score) / mode.total;
  const crest = (score: number) => BASE - height(score);
  const spread = Math.max(...mode.runs) - Math.min(...mode.runs);

  return (
    <figure
      className="not-italic m-0 rounded-sm border border-outline bg-surface-container-lowest p-5 md:p-6"
      aria-label={label}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
        <figcaption className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
          {label}
        </figcaption>
        <span
          className={`font-label uppercase tracking-[0.16em] text-[10px] px-2 py-1 rounded-sm border ${
            settled && mode.armed
              ? "border-secondary text-primary"
              : "border-outline-variant text-on-surface-variant"
          }`}
          aria-live="polite"
        >
          {settled ? mode.verdict : "Measuring…"}
        </span>
      </div>

      <div role="tablist" aria-label="Sampling setting" className="grid gap-2 sm:grid-cols-2 mb-5">
        {MODES.map((m, i) => {
          const active = i === modeIndex;
          return (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => (active ? run() : setModeIndex(i))}
              className={`text-left rounded-sm border px-3 py-2 transition-colors ${
                active
                  ? "border-secondary bg-surface-container-low"
                  : "border-outline-variant hover:border-outline"
              }`}
            >
              <span className="block font-label uppercase tracking-[0.16em] text-[10px] text-primary">
                {m.label}
              </span>
              <span className="block font-body font-normal text-sm text-on-surface-variant mt-1">
                {m.hint}
              </span>
            </button>
          );
        })}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Three replays of the same input at ${mode.label}: ${mode.runs.join(", ")} out of ${mode.total}. ${mode.reading}`}
      >
        {/* graduated scale */}
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={40}
            x2={W - 20}
            y1={BASE - (BASE - TOP) * f}
            y2={BASE - (BASE - TOP) * f}
            className="stroke-outline-variant"
            strokeWidth={0.5}
            strokeDasharray="2 4"
          />
        ))}
        <text x={20} y={BASE + 4} className="fill-on-surface-variant" fontSize={11}>
          0
        </text>
        <text x={14} y={TOP + 4} className="fill-on-surface-variant" fontSize={11}>
          {mode.total}
        </text>

        {mode.runs.map((score, i) => {
          const local = Math.max(0, Math.min(1, progress - i));
          const y = BASE - height(score) * local;
          const x = LANES[i];
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={TOP} y2={BASE} className="stroke-outline-variant" strokeWidth={0.5} />
              <line x1={x} x2={x} y1={BASE} y2={y} className="stroke-secondary" strokeWidth={1.5} />
              <line
                x1={x - 12}
                x2={x + 12}
                y1={y}
                y2={y}
                className="stroke-secondary"
                strokeWidth={1}
                opacity={local}
              />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                className="fill-primary"
                fontSize={15}
                opacity={local}
              >
                {Math.round(score * local)}/{mode.total}
              </text>
              <text x={x} y={BASE + 16} textAnchor="middle" className="fill-on-surface-variant" fontSize={11}>
                RUN {i + 1}
              </text>
            </g>
          );
        })}

        {/* flatline across the crests, drawn once the three runs have landed */}
        <polyline
          points={mode.runs.map((s, i) => `${LANES[i]},${crest(s)}`).join(" ")}
          fill="none"
          className={mode.armed ? "stroke-primary" : "stroke-error"}
          strokeWidth={1}
          strokeDasharray={mode.armed ? undefined : "4 3"}
          opacity={settled ? 1 : 0}
          style={{ transition: "opacity 400ms ease-out" }}
        />
      </svg>

      <div className="flex flex-wrap items-baseline justify-between gap-2 mt-4 pt-3 border-t border-outline-variant">
        <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
          Spread across three replays
        </span>
        <span
          className={`font-headline italic text-lg ${mode.armed ? "text-primary" : "text-error"}`}
          aria-live="polite"
        >
          {settled ? `${spread === 0 ? "0.00" : spread.toFixed(2)} pt` : "measuring"}
        </span>
      </div>
      <p className="font-body font-normal text-sm text-on-surface-variant mt-3">{mode.reading}</p>
    </figure>
  );
};

export default CanaryCalibrationBench;
