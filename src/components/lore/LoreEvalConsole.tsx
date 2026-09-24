import { EvalConsole } from "@/components/console/EvalConsole";

/**
 * The 64-case suite after structural enforcement: thresholds met, tier 3 not
 * clean. Exit code 3 exists so that "not clean" never reads as "fine".
 * Source: run 1 of the enforced-pipeline canary, recorded in Lore commit c6ba89a.
 */
export const LoreEvalConsole = ({ label = "The suite, after enforcement" }: { label?: string }) => (
  <EvalConsole
    label={label}
    intro="64 cases, 12 categories, 10 deterministic graders. Tier 1 has no budget, tier 2 stops at 95 percent, tier 3 at 90."
    runLabel="Run the suite"
    groups={[
      {
        id: "lore-64-enforced",
        name: "Lore harness",
        count: 64,
        failures: [
          {
            name: "tier 3 · form · source-conflict-01",
            why: "The divergence between two experts was conveyed, but not in the words the check required. Tier 3 at 99.4 percent, inside its budget.",
          },
        ],
      },
    ]}
    verdict={{
      passed: true,
      headline: "WARN · exit 3",
      detail:
        "Every threshold met and tier 1 at 100 percent, so nothing is blocked. The suite still refuses to call the run clean.",
    }}
    footnote="Replay of a recorded run (Lore commit c6ba89a, canary run 1 of 3)"
  />
);

export default LoreEvalConsole;
