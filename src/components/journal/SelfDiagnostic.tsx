import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { DiagnosticQuestion } from "@/content/journal";

type Answer = "yes" | "partly" | "no";
type ArmState = "covered" | "partial" | "absent" | "unanswered";

const ANSWERS: { value: Answer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "partly", label: "Partly" },
  { value: "no", label: "No" },
];

const ARMS: { arm: DiagnosticQuestion["arm"]; name: string }[] = [
  { arm: "A", name: "A — Offline, before the merge" },
  { arm: "B", name: "B — Runtime, in production" },
  { arm: "C", name: "C — Outcome, after the fact" },
];

const STATE: Record<ArmState, { label: string; dot: string }> = {
  covered: { label: "Covered", dot: "bg-secondary" },
  partial: { label: "Partial", dot: "bg-secondary/40" },
  absent: { label: "Absent", dot: "bg-transparent border border-outline" },
  unanswered: {
    label: "Not answered",
    dot: "bg-transparent border border-dashed border-outline-variant",
  },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const armState = (answers: (Answer | undefined)[]): ArmState => {
  const given = answers.filter((a): a is Answer => a !== undefined);
  if (given.length === 0) return "unanswered";
  if (given.length === answers.length && given.every((a) => a === "yes"))
    return "covered";
  if (given.every((a) => a === "no")) return "absent";
  return "partial";
};

/**
 * Self-diagnostic: the reader answers six questions about the system they
 * ship, in the order the evaluation layers depend on each other, and gets
 * their own three-arm reading plus the one place to start. Deterministic,
 * nothing leaves the page. Self-declared, and it says so.
 */
export const SelfDiagnostic = ({
  label,
  intro,
  caveat,
  allYes: allYesText,
  questions,
}: {
  label: string;
  intro: string;
  caveat: string;
  /** Shown once every answer is yes: the next question to ask. */
  allYes: string;
  questions: DiagnosticQuestion[];
}) => {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const answered = Object.keys(answers).length;

  // Dependency order: the first "no" wins, then the first "partly".
  const start =
    questions.find((q) => answers[q.key] === "no") ??
    questions.find((q) => answers[q.key] === "partly");
  const allYes = answered === questions.length && !start;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    el.focus?.({ preventScroll: true });
  };

  return (
    <section
      aria-label={label}
      className="mb-12 md:mb-16 not-italic rounded-sm border border-outline bg-surface-container-low p-5 md:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
          {label}
        </div>
        {open && (
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
            {answered}/{questions.length} answered
          </span>
        )}
      </div>
      <p className="font-body text-sm text-on-surface-variant mt-2">{intro}</p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="self-diagnostic-body"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 font-headline italic text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
      >
        {open
          ? "Hide the questions"
          : `Answer ${questions.length} questions, about a minute`}
        <Icon name={open ? "expand_less" : "expand_more"} className="text-sm" />
      </button>

      {open && (
        <div id="self-diagnostic-body">
          <ol className="list-none p-0 mt-5 space-y-3">
            {questions.map((q, i) => (
              <li key={q.key}>
                <fieldset className="rounded-sm border border-outline-variant bg-surface-container-lowest p-4">
                  <legend className="sr-only">{`${i + 1}. ${q.ask}`}</legend>
                  <p
                    aria-hidden="true"
                    className="font-body text-sm text-primary"
                  >
                    <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mr-2">
                      Arm {q.arm}
                    </span>
                    {q.ask}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ANSWERS.map((a) => {
                      const checked = answers[q.key] === a.value;
                      return (
                        <label
                          key={a.value}
                          className={`cursor-pointer font-label uppercase tracking-[0.16em] text-[10px] px-3 py-1.5 rounded-sm border transition-colors focus-within:ring-2 focus-within:ring-secondary ${
                            checked
                              ? "border-secondary text-primary bg-secondary/15"
                              : "border-outline-variant text-on-surface-variant hover:border-outline"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`diag-${q.key}`}
                            value={a.value}
                            checked={checked}
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.key]: a.value,
                              }))
                            }
                            className="sr-only"
                          />
                          {a.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>

          <div
            aria-live="polite"
            className="mt-5 rounded-sm border border-outline-variant bg-surface-container-lowest p-4 md:p-5"
          >
            <p className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
              Your system, by arm
            </p>
            <ul className="list-none p-0 mt-3 space-y-2">
              {ARMS.map(({ arm, name }) => {
                const state = armState(
                  questions
                    .filter((q) => q.arm === arm)
                    .map((q) => answers[q.key]),
                );
                return (
                  <li
                    key={arm}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="font-body text-sm text-on-surface">
                      {name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full shrink-0 ${STATE[state].dot}`}
                      />
                      <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                        {STATE[state].label}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            {start && (
              <div className="mt-4 pt-4 border-t border-outline-variant">
                <p className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                  Start here
                </p>
                <p className="font-body text-sm text-on-surface-variant mt-2">
                  {start.gap}
                </p>
                <button
                  type="button"
                  onClick={() => go(start.to)}
                  className="mt-3 inline-flex items-center gap-2 font-headline italic text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
                >
                  {start.toLabel}
                  <Icon name="arrow_downward" className="text-sm" />
                </button>
              </div>
            )}
            {allYes && (
              <p className="font-body text-sm text-on-surface-variant mt-4 pt-4 border-t border-outline-variant">
                {allYesText}
              </p>
            )}
            <p className="font-body font-normal text-xs text-on-surface-variant mt-4">
              {caveat}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SelfDiagnostic;
