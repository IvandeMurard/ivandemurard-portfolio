import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

const BANDS = [
  { id: "G-01", tier: "Safety", tone: "gate" },
  { id: "G-02", tier: "Safety", tone: "gate" },
  { id: "G-03", tier: "Safety", tone: "gate" },
  { id: "G-04", tier: "Safety", tone: "gate" },
  { id: "G-05", tier: "Safety", tone: "gate" },
  { id: "G-06", tier: "Trust", tone: "trust" },
  { id: "G-07", tier: "Trust", tone: "trust" },
  { id: "G-08", tier: "Form", tone: "form" },
  { id: "G-09", tier: "Form", tone: "form" },
  { id: "G-10", tier: "Form", tone: "form" },
] as const;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const LoreComplianceSpectrogram = () => {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const done = step >= BANDS.length;

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const scan = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (reducedMotion()) {
      setStep(BANDS.length);
      setRunning(false);
      return;
    }
    setStep(0);
    setRunning(true);
    BANDS.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setStep(index + 1), 180 * (index + 1)));
    });
    timers.current.push(window.setTimeout(() => setRunning(false), 180 * (BANDS.length + 1)));
  };

  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-sm border border-outline bg-surface-container-lowest">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-3 md:px-5">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
            Fig. 7.1 · Compliance spectrogram
          </span>
          <span className="font-mono text-[10px] uppercase text-on-surface-variant">64 cases · 12 categories</span>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 md:grid-cols-[5rem_minmax(0,1fr)_8rem] md:gap-x-5">
            <div className="font-label text-[9px] uppercase tracking-[0.16em] text-on-surface-variant">Grader</div>
            <div className="flex justify-between font-label text-[9px] uppercase tracking-[0.16em] text-on-surface-variant">
              <span>Input</span><span>Deterministic read</span><span>Verdict</span>
            </div>
            <div className="hidden text-right font-label text-[9px] uppercase tracking-[0.16em] text-on-surface-variant md:block">Threshold</div>

            {BANDS.map((band, index) => {
              const read = done || step > index;
              const reading = step === index;
              const formMiss = done && band.id === "G-08";
              const newTier = index === 0 || BANDS[index - 1].tier !== band.tier;
              const threshold = band.tone === "gate" ? "100% · no budget" : band.tone === "trust" ? "95%" : "90%";
              return (
                <div key={band.id} className="contents">
                  <div className={`${newTier ? "mt-4" : "mt-1"} flex items-center gap-2 font-mono text-[10px] text-on-surface-variant`}>
                    <span>{band.id}</span>
                    {newTier && <span className="hidden font-label text-[8px] uppercase tracking-[0.12em] text-secondary sm:inline">{band.tier}</span>}
                  </div>
                  <div className={`${newTier ? "mt-4" : "mt-1"} relative h-7 overflow-hidden border-y border-outline-variant bg-surface-container-low`}>
                    <div className="absolute inset-0 opacity-35" aria-hidden="true">
                      {Array.from({ length: 18 }, (_, mark) => (
                        <span key={mark} className="absolute inset-y-0 w-px bg-outline-variant" style={{ left: `${mark * 6}%` }} />
                      ))}
                    </div>
                    <div
                      className={`absolute inset-y-0 left-0 transition-[width,background-color] duration-500 ${
                        formMiss ? "bg-error/25" : read ? "bg-secondary/25" : reading ? "bg-secondary/15" : "bg-transparent"
                      }`}
                      style={{ width: read ? "100%" : reading ? "58%" : "0%" }}
                    />
                    <svg viewBox="0 0 600 28" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                      <path
                        d={`M0 14 ${Array.from({ length: 24 }, (_, mark) => `L${mark * 26 + 12} ${mark % 4 === index % 4 ? 5 : mark % 3 === 0 ? 21 : 13}`).join(" ")} L600 14`}
                        fill="none"
                        stroke={formMiss ? "hsl(var(--error))" : "hsl(var(--secondary))"}
                        strokeWidth={read || reading ? "1.2" : "0.6"}
                        opacity={read || reading ? "1" : "0.28"}
                      />
                    </svg>
                    {reading && <span className="absolute inset-y-0 w-px bg-secondary" style={{ left: "58%" }} />}
                  </div>
                  <div className={`${newTier ? "mt-4" : "mt-1"} hidden items-center justify-end font-mono text-[9px] uppercase md:flex ${band.tone === "gate" ? "text-error" : "text-on-surface-variant"}`}>
                    {threshold}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-px border border-outline-variant bg-outline-variant sm:grid-cols-3">
            <div className="bg-surface-container-low px-4 py-3">
              <span className="block font-label text-[9px] uppercase tracking-[0.16em] text-secondary">Safety</span>
              <span className="mt-1 block font-body text-xs text-on-surface">100% · no budget</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3">
              <span className="block font-label text-[9px] uppercase tracking-[0.16em] text-secondary">Trust</span>
              <span className="mt-1 block font-body text-xs text-on-surface">95% threshold</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3">
              <span className="block font-label text-[9px] uppercase tracking-[0.16em] text-secondary">Form</span>
              <span className="mt-1 block font-body text-xs text-on-surface">90% threshold · variance visible</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={scan} disabled={running}>
              <Icon name={running ? "pending" : done ? "restart_alt" : "play_arrow"} />
              {running ? "Scanning" : done ? "Scan again" : "Scan suite"}
            </Button>
            <span aria-live="polite" className="font-mono text-[10px] uppercase text-on-surface-variant">
              {done ? "Gate open · form variance retained" : running ? `Reading ${BANDS[Math.min(step, BANDS.length - 1)]?.id ?? "G-01"}` : "10 deterministic graders · instrument at rest"}
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
        The bands show the hierarchy, not ten invented names. A 61/64 run still failed when two of its misses landed in Safety.
      </figcaption>
    </figure>
  );
};

export default LoreComplianceSpectrogram;