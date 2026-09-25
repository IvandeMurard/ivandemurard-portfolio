import { useRef, useState, type KeyboardEvent } from "react";
import type { StepperStep } from "@/content/journal";

type Guess = "PASS" | "FAIL";

const TONE: Record<StepperStep["tone"], { badge: string; text: string }> = {
  "false-pass": { badge: "border-error text-error", text: "text-error" },
  fail: { badge: "border-secondary text-primary", text: "text-primary" },
  held: { badge: "border-secondary text-primary", text: "text-primary" },
};

/**
 * One recorded answer, graded by three successive versions of the harness.
 * The answer does not change until the last step; only the machinery around
 * it does. Content, not decoration: every string is verbatim from Lore.
 */
export const GraderStepper = ({
  label,
  question,
  rule,
  answer,
  steps,
  reveal,
  note,
}: {
  label?: string;
  question: string;
  rule: string;
  answer: string;
  steps: StepperStep[];
  /** What the reader is told after grading the answer themselves. */
  reveal: { pass: string; fail: string };
  note?: string;
}) => {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = steps[index];
  const tone = TONE[step.tone];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + steps.length) % steps.length;
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <figure
      className="not-italic m-0 rounded-sm border border-outline bg-surface-container-lowest p-5 md:p-6"
      aria-label={label}
    >
      {label && (
        <figcaption className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
          {label}
        </figcaption>
      )}

      <div className="rounded-sm border border-outline-variant bg-surface-container-low p-4">
        <p className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">Technician</p>
        <p className="font-body text-primary mt-1">{question}</p>
        <p className="font-body font-normal text-sm text-on-surface-variant mt-2">{rule}</p>
      </div>

      <div className="mt-4">
        <p className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">Model answer, verbatim</p>
        <blockquote className="border-l border-secondary pl-4 mt-2 font-body font-normal text-sm text-on-surface-variant">
          {answer}
        </blockquote>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="font-body font-normal text-sm text-on-surface-variant mr-1">
          Grade it yourself first:
        </span>
        {(["PASS", "FAIL"] as Guess[]).map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={guess === g}
            onClick={() => setGuess(g)}
            className={`font-label uppercase tracking-[0.16em] text-[10px] px-3 py-1.5 rounded-sm border transition-colors ${
              guess === g ? "border-secondary text-primary bg-surface-container-low" : "border-outline-variant text-on-surface-variant hover:border-outline"
            }`}
          >
            {g}
          </button>
        ))}
        {guess && (
          <span className="font-body font-normal text-sm text-on-surface-variant" aria-live="polite">
            {guess === "FAIL" ? reveal.fail : reveal.pass}
          </span>
        )}
      </div>

      <div role="tablist" aria-label="Version of the harness" className="grid gap-2 sm:grid-cols-3 mt-5">
        {steps.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.tab}
              ref={(el) => (tabs.current[i] = el)}
              id={`grader-step-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="grader-step-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setIndex(i)}
              onKeyDown={onKey}
              className={`text-left rounded-sm border px-3 py-2 transition-colors ${
                active ? "border-secondary bg-surface-container-low" : "border-outline-variant hover:border-outline"
              }`}
            >
              <span className="block font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                Step {i + 1}
              </span>
              <span className="block font-body font-normal text-sm text-primary mt-1">{s.tab}</span>
            </button>
          );
        })}
      </div>

      <div
        id="grader-step-panel"
        role="tabpanel"
        aria-labelledby={`grader-step-tab-${index}`}
        aria-live="polite"
        className="mt-4 pt-4 border-t border-outline-variant"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">Harness verdict</span>
          <span
            className={`font-label uppercase tracking-[0.16em] text-[10px] px-2 py-1 rounded-sm border ${tone.badge}`}
          >
            {step.verdict}
          </span>
        </div>
        <ul className="list-none p-0 mt-3 space-y-2">
          {step.checks.map((c) => (
            <li key={c.grader} className="font-body font-normal text-sm text-on-surface-variant">
              <code className="text-primary">{c.grader}</code> · {c.result}
            </li>
          ))}
        </ul>
        {step.answer && (
          <div className="mt-3">
            <p className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">What ships instead</p>
            <blockquote className="border-l border-secondary pl-4 mt-2 font-body text-sm text-primary">
              {step.answer}
            </blockquote>
          </div>
        )}
        <p className={`font-headline italic text-lg mt-3 ${tone.text}`}>{step.reading}</p>
      </div>

      {note && <p className="font-body font-normal text-xs text-on-surface-variant mt-4">{note}</p>}
    </figure>
  );
};

export default GraderStepper;
