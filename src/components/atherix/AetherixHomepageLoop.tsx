import { useEffect, useState } from "react";
import { SignalLamp } from "@/components/journal/SignalLamp";
import LOOP from "@/content/homepage-loop.json";
import { cn } from "@/lib/utils";

type Day = (typeof LOOP.days)[number];

export const LOOP_TABS = ["Day 1 · Who's right?", "Day 10 · It refuses", "Day 17 · It sees it coming"] as const;
export const LOOP_SOURCE_URL = `https://github.com/${LOOP.provenance.repo}/tree/${LOOP.provenance.commit}/demo/closed-loop`;

export const eveningText = (d: Day) =>
  `Covers expected: ${d.evening.predicted} (range ${d.evening.range[0]}–${d.evening.range[1]}, confidence ${d.evening.confidence})\nStaffing: ${d.evening.staffing}` +
  (d.evening.context ? `\n${d.evening.context}` : "");

const STEP_MS = 1100;
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Bubble = ({ who, time, children, mine = false, visible }: { who: string; time: string; children: React.ReactNode; mine?: boolean; visible: boolean }) => (
  <div
    className={cn(
      "border border-outline-variant p-4 transition-all duration-500 motion-reduce:transition-none",
      mine ? "ml-10 bg-surface-container rounded-[18px_18px_4px_18px]" : "mr-6 bg-surface shadow-sm rounded-[18px_18px_18px_4px]",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
    )}
    aria-hidden={!visible}
  >
    <div className="flex justify-between font-mono text-[11px] text-on-surface-variant mb-2"><span>{who}</span><span>{time}</span></div>
    {children}
  </div>
);

export const AetherixHomepageLoop = ({ initialTab = 0 }: { initialTab?: number }) => {
  const [tab, setTab] = useState(initialTab);
  const [step, setStep] = useState(() => (reducedMotion() ? 3 : 0));
  const [run, setRun] = useState(0);
  const d = LOOP.days[tab];

  useEffect(() => {
    if (reducedMotion()) { setStep(3); return; }
    setStep(0);
    const timers = [1, 2, 3].map((s) => window.setTimeout(() => setStep(s), s * STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [tab, run]);

  return (
    <div className="w-full">
      <div role="tablist" aria-label="Three days of the closed loop" className="flex flex-wrap gap-2 mb-5">
        {LOOP_TABS.map((label, i) => (
          <button key={label} role="tab" type="button" aria-selected={tab === i} onClick={() => setTab(i)}
            className={cn("font-mono text-[11.5px] px-3 py-1.5 rounded-full border transition-colors",
              tab === i ? "border-on-surface text-on-surface bg-surface" : "border-outline-variant text-on-surface-variant hover:text-on-surface")}>
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={LOOP_TABS[tab]} aria-live="polite" className="flex flex-col gap-3 min-h-[380px]">
        <Bubble who="Aetherix" time={`${d.date} · evening before`} visible={step >= 1}>
          <p className="font-mono text-[13px] leading-[1.7] whitespace-pre-wrap text-on-surface">{eveningText(d)}</p>
        </Bubble>
        <Bubble who="Manager" time="reply" mine visible={step >= 2}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-[13px] leading-[1.7] text-on-surface">{d.reply.text}</p>
            <SignalLamp state={d.reply.signal as "go" | "warn" | "stop"} label={d.reply.kind} />
          </div>
        </Bubble>
        <Bubble who="Aetherix" time="next morning" visible={step >= 3}>
          <p className="font-mono text-[13px] leading-[1.7] text-on-surface">{d.morning.text}</p>
          {d.morning.kind === "quarantine" ? (
            <div className="mt-2 flex items-center gap-3">
              <SignalLamp state="stop" hideWord />
              <span className="font-mono text-[11px] text-signal-stop">reason: implausible_feedback</span>
            </div>
          ) : (
            <div className="mt-2"><SignalLamp state={d.morning.signal as "go" | "warn" | "stop"} label={d.morning.kind} /></div>
          )}
        </Bubble>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <a href={LOOP_SOURCE_URL} target="_blank" rel="noopener noreferrer"
          className="font-mono text-[11px] text-on-surface-variant underline underline-offset-2 hover:text-on-surface">
          Sandbox run · synthetic data · real services · seed {LOOP.provenance.seed} · translated from the original run
        </a>
        <button type="button" onClick={() => setRun((r) => r + 1)}
          className="font-mono text-[11px] text-on-surface-variant border-b border-outline-variant hover:text-on-surface shrink-0">
          Replay
        </button>
      </div>
    </div>
  );
};

export default AetherixHomepageLoop;
