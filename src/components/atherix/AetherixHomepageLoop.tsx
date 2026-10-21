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
        ? "self-end bg-signal-go/15 rounded-[10px_0_10px_10px]"
        : "self-start bg-surface rounded-[0_10px_10px_10px]",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
    )}
    aria-hidden={!visible}
  >
    <span aria-hidden className={cn("absolute top-0 h-0 w-0 border-t-[8px] border-t-current",
      mine ? "-right-2 border-r-[8px] border-r-transparent text-signal-go/15" : "-left-2 border-l-[8px] border-l-transparent text-surface")} />
    {!mine && <div className="text-[11.5px] font-medium text-signal-go mb-0.5">{who}</div>}
    {mine && <span className="sr-only">{who}</span>}
    {children}
    <div className="flex justify-end items-center gap-1 font-mono text-[10px] text-on-surface-variant mt-0.5">
      <span>{time}</span>
      {mine && <span aria-label="read" className="text-[11px] tracking-[-3px] pr-1 text-sky-500">✓✓</span>}
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

      <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container shadow-sm">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border-b border-outline-variant">
        <span aria-hidden className="grid place-items-center h-9 w-9 rounded-full bg-on-surface text-surface font-display text-[15px]">A</span>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-on-surface leading-tight">Aetherix</div>
          <div className="flex items-center gap-1.5 text-[11.5px] text-on-surface-variant">Aetherix · WhatsApp · mock-up</div>
        </div>
        <span aria-hidden className="text-on-surface-variant text-lg leading-none">⋮</span>
      </div>
      <div role="tabpanel" aria-label={LOOP_TABS[tab]} aria-live="polite" className="flex flex-col gap-2 min-h-[380px] px-4 py-4 bg-[radial-gradient(hsl(var(--outline-variant)/0.35)_1px,transparent_1px)] [background-size:14px_14px]">
        <Bubble who="Aetherix" time={`${d.date} · evening before`} visible={step >= 1}>
          <p className="text-[13.5px] leading-[1.55] whitespace-pre-wrap text-on-surface">{eveningText(d)}</p>
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
            <p className="text-[13.5px] leading-[1.55] text-on-surface">{d.reply.text}</p>
            <SignalLamp state={d.reply.signal as "go" | "warn" | "stop"} label={d.reply.kind} />
          </div>
          {"basis" in d.reply && d.reply.basis && (
            <p className="mt-1 text-[11.5px] leading-relaxed text-on-surface-variant">{d.reply.basis}</p>
          )}
        </Bubble>
        <Bubble who="Aetherix" time="next morning" visible={step >= 3}>
          <p className="text-[13.5px] leading-[1.55] text-on-surface">{d.morning.text}</p>
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
      <div aria-hidden className="flex items-center gap-2 px-3 py-2 bg-surface border-t border-outline-variant">
        <div className="flex-1 rounded-full bg-surface-container px-4 py-1.5 text-[12.5px] text-on-surface-variant">Message</div>
        <span className="grid place-items-center h-8 w-8 rounded-full bg-signal-go text-surface text-[13px]">➤</span>
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
