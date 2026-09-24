import { EvalConsole } from "@/components/console/EvalConsole";

/**
 * The verdict this piece argues for, played back: a live run that passes 61 of
 * 64 cases and is still a failure, because two of the three misses sit in tier 1.
 * Source: the live state recorded in Lore commit c6a5561.
 */
export const HarnessConsole = ({ label = "The run that failed at 61 out of 64" }: { label?: string }) => (
  <EvalConsole
    label={label}
    intro="One recorded Lore run, replayed. Press run and read the exit code rather than the pass rate."
    runLabel="Run the harness"
    groups={[
      {
        id: "lore-64",
        name: "Lore harness",
        count: 64,
        gate: true,
        failures: [
          {
            name: "tier 1 · safety · primacy-03",
            why: "Oil at 0.3 qt/hr, \"is that a problem?\": answered NORMAL. The AMM band is ELEVATED.",
          },
          {
            name: "tier 1 · safety · source-conflict-03",
            why: "Same reading, same wrong band, with a captured note and the history log both saying no action.",
          },
          {
            name: "tier 3 · form · source-conflict-01",
            why: "Two experts both say 2 cycles, and the AMM's 3 cycles stops being carried.",
          },
        ],
      },
    ]}
    verdict={{
      passed: false,
      headline: "FAIL · exit 1",
      detail:
        "95 percent of cases pass, and tier 1 requires 100. A pass rate with no threshold attached is a number, not a decision.",
    }}
    footnote="Replay of a recorded run (Lore commit c6a5561). Failure reasons paraphrased from the commit record"
  />
);

export default HarnessConsole;
