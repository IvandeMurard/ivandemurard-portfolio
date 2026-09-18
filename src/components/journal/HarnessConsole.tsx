import { EvalConsole } from "@/components/console/EvalConsole";

/**
 * The verdict this piece argues for, played back: a run that passes 52 of 53
 * cases and is still a failure, because the single miss sits in tier 1.
 */
export const HarnessConsole = ({ label = "The run that failed at 52 out of 53" }: { label?: string }) => (
  <EvalConsole
    label={label}
    intro="One recorded Lore run. Press run and read the exit code rather than the pass rate."
    runLabel="Run the harness"
    groups={[
      {
        id: "lore-53",
        name: "Lore harness",
        count: 53,
        gate: true,
        failures: [
          {
            name: "tier 1 · safety · vibration threshold",
            why: "A figure the sources do not contain. Tier 1 carries no budget, so the run is a failure.",
          },
        ],
      },
    ]}
    verdict={{
      passed: false,
      headline: "FAIL · exit 1",
      detail:
        "Tier 1 requires 100 percent. A pass rate with no threshold attached is a number, not a decision.",
    }}
    footnote="Replay of a recorded run. Case names shortened"
  />
);

export default HarnessConsole;
