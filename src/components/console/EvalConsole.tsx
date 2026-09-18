import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type EvalGroup = {
  id: string;
  /** Tier or category name, as the suite names it. */
  name: string;
  count: number;
  /** Cases that fail, with the reason the grader gives. */
  failures?: { name: string; why: string }[];
  /** True when a single failure here stops the release. */
  gate?: boolean;
};

export type EvalVerdict = {
  passed: boolean;
  headline: string;
  detail: string;
};

type Line = { text: string; tone: "muted" | "pass" | "fail" | "gate" };

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const buildLines = (groups: EvalGroup[]): Line[] => {
  const lines: Line[] = [];
  for (const group of groups) {
    const fails = group.failures?.length ?? 0;
    lines.push({
      text: `run ${group.id} · ${group.count} cases${group.gate ? " · hard gate" : ""}`,
      tone: "muted",
    });
    lines.push({
      text: `  ${group.count - fails}/${group.count} pass`,
      tone: fails ? "fail" : "pass",
    });
    for (const failure of group.failures ?? []) {
      lines.push({ text: `  FAIL ${failure.name}`, tone: "fail" });
      lines.push({ text: `       ${failure.why}`, tone: group.gate ? "gate" : "muted" });
    }
  }
  return lines;
};

const TONE: Record<Line["tone"], string> = {
  muted: "text-on-surface-variant",
  pass: "text-primary",
  fail: "text-error",
  gate: "text-error",
};

/**
 * A harness run, played back rather than tabulated. The reader presses run and
 * watches the suite reach its verdict: the number of passes is not the answer,
 * the tier the miss lands in is.
 */
export const EvalConsole = ({
  label,
  intro,
  runLabel = "Run the suite",
  groups,
  verdict,
  footnote,
}: {
  label: string;
  intro?: string;
  runLabel?: string;
  groups: EvalGroup[];
  verdict: EvalVerdict;
  footnote?: string;
}) => {

  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const lines = buildLines(groups);
  const total = groups.reduce((sum, g) => sum + g.count, 0);
  const failed = groups.reduce((sum, g) => sum + (g.failures?.length ?? 0), 0);
  const done = shown >= lines.length;

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const run = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setRunning(true);
    if (reduced()) {
      setShown(lines.length);
      setRunning(false);
      return;
    }
    setShown(0);
    lines.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setShown(i + 1);
          if (i === lines.length - 1) setRunning(false);
        }, 140 * (i + 1)),
      );
    });
  };

  return (
    <section
      aria-label={label}
      className="not-italic rounded-sm border border-outline bg-surface-container-low p-5 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{label}</span>
        <span className="font-mono text-[11px] text-on-surface-variant">{total} cases</span>
      </div>

      {intro && (
        <p className="font-body text-sm leading-relaxed text-on-surface-variant mb-4">{intro}</p>
      )}

      <button
        type="button"
        onClick={run}
        disabled={running}
        className="inline-flex items-center gap-2 rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant transition-colors duration-300 hover:border-secondary hover:text-primary disabled:opacity-60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
      >
        <Icon name={running ? "pending" : done ? "restart_alt" : "play_arrow"} className="text-[14px]" />
        {running ? "Running" : done ? "Run again" : runLabel}
      </button>

      <div
        aria-live="polite"
        className="mt-4 rounded-sm border border-outline-variant bg-surface-container-lowest p-4 font-mono text-xs leading-relaxed min-h-[9rem]"
      >
        {shown === 0 ? (
          <p className="text-on-surface-variant">$ eval run --suite {groups.map((g) => g.id).join(",")}</p>
        ) : (
          <>
            <p className="text-on-surface-variant">
              $ eval run --suite {groups.map((g) => g.id).join(",")}
            </p>
            {lines.slice(0, shown).map((line, i) => (
              <p key={i} className={`${TONE[line.tone]} whitespace-pre-wrap`}>
                {line.text}
              </p>
            ))}
          </>
        )}
      </div>

      {done && (
        <div
          className={`mt-4 rounded-sm border p-4 ${
            verdict.passed ? "border-secondary bg-secondary/15" : "border-error bg-error/10"
          }`}
        >
          <p className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant mb-1">
            {total - failed}/{total} pass
          </p>
          <p className="font-headline italic text-lg text-primary">{verdict.headline}</p>
          <p className="font-body text-sm leading-relaxed text-on-surface-variant mt-1">{verdict.detail}</p>
        </div>
      )}

      {footnote && (
        <p className="mt-3 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
          {footnote}
        </p>
      )}

    </section>
  );
};

export default EvalConsole;
