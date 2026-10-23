import { useEffect, useState } from "react";
import { SignalLamp } from "@/components/journal/SignalLamp";
import LOOP from "@/content/homepage-loop.json";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Day = (typeof LOOP.days)[number];

export const LOOP_TABS = ["Day 1 · Who's right?", "Day 10 · It refuses", "Day 17 · It sees it coming"] as const;
export const LOOP_SOURCE_URL = `https://github.com/${LOOP.provenance.repo}/tree/${LOOP.provenance.commit}/demo/closed-loop`;

const signed = (n: number) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`);

/** Display label inside the one-liner: proper nouns keep their case, the rest reads as running text. */
const inlineLabel = (label: string) =>
  label === "Poor weather" ? "weather" : /^(Hotel|Season)\b/.test(label) ? label[0].toLowerCase() + label.slice(1) : label;

/** Minimum |covers| for a driver to be named in the one-liner; the rest is summed. */
export const WHY_THRESHOLD = 5;

/** "Why N" one-liner, generated from the JSON drivers (never written by hand). */
export const whyLine = (d: Day) => {
  const named = d.evening.drivers.filter((x) => Math.abs(x.covers) >= WHY_THRESHOLD);
  const rest = d.evening.drivers.filter((x) => Math.abs(x.covers) < WHY_THRESHOLD).reduce((a, x) => a + x.covers, 0);
  const parts = named.map((x) => `${inlineLabel(x.label)} ${signed(x.covers)}`).join(", ");
  const other = rest === 0 ? "" : `; other factors ${signed(rest)}`;
  return `Why ${d.evening.predicted}: usual level ${d.evening.baseline}; ${parts}${other}.`;
};

/** Sum of the one-liner's terms, so a test can prove it lands on the forecast. */
export const whyTotal = (d: Day) => d.evening.drivers.reduce((a, x) => a + x.covers, d.evening.baseline);

export const eveningText = (d: Day) =>
  `Covers expected: ${d.evening.predicted}\n${whyLine(d)}\n${d.evening.confidence_text}\nStaffing: ${d.evening.staffing.text}`;

const STEP_MS = 1100;
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Bubble = ({ who, time, children, mine = false, visible }: { who: string; time: string; children: React.ReactNode; mine?: boolean; visible: boolean }) => (
  <div
    className={cn(
      "relative max-w-[88%] px-3 pt-1.5 pb-1 shadow-sm transition-all duration-500 motion-reduce:transition-none",
      mine
        ? "self-end wa-out rounded-[8px_0_8px_8px]"
        : "self-start wa-in rounded-[0_8px_8px_8px]",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
    )}
    aria-hidden={!visible}
  >
    <span aria-hidden className={cn("absolute top-0 h-0 w-0 border-t-[8px] border-t-current",
      mine ? "-right-2 border-r-[8px] border-r-transparent wa-tail-out" : "-left-2 border-l-[8px] border-l-transparent wa-tail-in")} />
    {!mine && <div className="text-[12px] font-medium wa-name mb-0.5">{who}</div>}
    {mine && <span className="sr-only">{who}</span>}
    {children}
    <div className="flex justify-end items-center gap-1 text-[10.5px] wa-muted mt-0.5">
      <span>{time}</span>
      {mine && <span aria-label="read" className="text-[11px] tracking-[-3px] pr-1 wa-tick">✓✓</span>}
    </div>
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
      <div role="tablist" aria-label="Three days of the closed loop"
        className="grid grid-cols-3 gap-1 p-1 mb-5 rounded-md bg-surface-container border border-outline-variant">
        {LOOP_TABS.map((label, i) => {
          const [day, title] = label.split(" · ");
          const sig = LOOP.days[i].morning.signal;
          const active = tab === i;
          return (
            <button key={label} role="tab" type="button" aria-selected={active} aria-label={label} onClick={() => setTab(i)}
              className={cn(
                "group text-left px-3 py-2 rounded-[4px] border cursor-pointer transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-on-surface",
                active
                  ? "bg-surface border-on-surface/60 shadow-sm"
                  : "border-transparent hover:bg-surface/60 hover:border-outline-variant",
              )}>
              <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-on-surface-variant">
                <span aria-hidden className={cn("inline-block h-1.5 w-1.5 rounded-full",
                  sig === "stop" ? "bg-signal-stop" : sig === "warn" ? "bg-signal-warn" : "bg-signal-go",
                  !active && "opacity-60")} />
                {day}
              </span>
              <span className={cn("block mt-0.5 text-[12.5px] leading-snug transition-colors",
                active ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface")}>
                {title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="wa rounded-xl overflow-hidden border border-outline-variant shadow-md">
      <div className="wa-head flex items-center gap-3 px-3 py-2.5">
        <span aria-hidden className="text-[18px] leading-none opacity-90">‹</span>
        <span aria-hidden className="grid place-items-center h-9 w-9 rounded-full bg-[hsl(0_0%_100%/0.2)] font-display text-[15px]">A</span>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium leading-tight">Aetherix</div>
          <div className="text-[11.5px] opacity-80">sandbox demo · online</div>
        </div>
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="opacity-90"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>
        <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="opacity-90"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>
        <span aria-hidden className="text-lg leading-none opacity-90">⋮</span>
      </div>
      <div role="tabpanel" aria-label={LOOP_TABS[tab]} aria-live="polite" className="flex flex-col gap-2 min-h-[380px] px-4 py-4 wa-wall">
        <span className="self-center mb-1 px-2.5 py-0.5 rounded-md text-[11px] wa-date shadow-sm">{d.date}</span>
        <Bubble who="Aetherix" time={`${d.date} · evening before`} visible={step >= 1}>
          <p className="text-[13.5px] leading-[1.55] whitespace-pre-wrap">{eveningText(d)}</p>
          <details className="mt-1.5 group/why">
            <summary className="cursor-pointer list-none font-mono text-[11px] text-on-surface-variant underline decoration-dotted underline-offset-2 hover:text-on-surface">
              Why {d.evening.predicted}? <span aria-hidden className="inline-block transition-transform group-open/why:rotate-90">›</span>
            </summary>
            <dl className="mt-2 font-mono text-[11.5px] text-on-surface">
              <div className="flex justify-between gap-4 border-b border-outline-variant pb-1 mb-1"><dt>Usual level</dt><dd>{d.evening.baseline}</dd></div>
              {d.evening.drivers.map((x) => (
                <div key={x.label} className="flex justify-between gap-4"><dt className="text-on-surface-variant">{x.label}</dt><dd>{signed(x.covers)}</dd></div>
              ))}
              <div className="flex justify-between gap-4 border-t border-outline-variant pt-1 mt-1 font-medium"><dt>Forecast</dt><dd>{d.evening.predicted}</dd></div>
            </dl>
            <p className="mt-2 text-[11.5px] leading-relaxed text-on-surface-variant">{d.evening.confidence_detail}</p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-on-surface-variant">{d.evening.staffing.basis}</p>
          </details>
        </Bubble>
        <Bubble who="F&B Manager" time="reply" mine visible={step >= 2}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13.5px] leading-[1.55]">{d.reply.text}</p>
            <SignalLamp state={d.reply.signal as "go" | "warn" | "stop"} label={d.reply.kind} />
          </div>
          {"basis" in d.reply && d.reply.basis && (
            <p className="mt-1 text-[11.5px] leading-relaxed text-on-surface-variant">{d.reply.basis}</p>
          )}
        </Bubble>
        <Bubble who="Aetherix" time="next morning" visible={step >= 3}>
          <p className="text-[13.5px] leading-[1.55]">{d.morning.text}</p>
          {d.morning.kind === "quarantine" ? (
            <div className="mt-2 flex items-center gap-3">
              <SignalLamp state={d.morning.signal as "stop"} hideWord />
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button"
                      className="font-mono text-[11px] text-signal-stop underline decoration-dotted underline-offset-2 cursor-help">
                      Outlier guard <span aria-hidden>ⓘ</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] font-mono text-[11px] leading-relaxed">
                    The figure exceeds what the restaurant can seat. It was set aside before it could reach learning.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="mt-2"><SignalLamp state={d.morning.signal as "go" | "warn" | "stop"} label={d.morning.kind} /></div>
          )}
        </Bubble>
      </div>
      <div aria-hidden className="wa-bar flex items-center gap-2 px-2 py-2">
        <div className="flex-1 flex items-center gap-2 rounded-full wa-field px-4 py-2 text-[13px]"><span className="flex-1">Message</span><span className="text-[16px] leading-none">+</span></div>
        <span className="grid place-items-center h-9 w-9 rounded-full wa-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3m5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V22h2v-3.1A7 7 0 0 0 19 12z"/></svg>
        </span>
      </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <a href={LOOP_SOURCE_URL} target="_blank" rel="noopener noreferrer"
          className="font-mono text-[11px] text-on-surface-variant underline underline-offset-2 hover:text-on-surface">
          Sandbox hotel · synthetic data · real services · seed {LOOP.provenance.seed}
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
