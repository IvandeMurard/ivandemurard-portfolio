import { EvalConsole } from "@/components/console/EvalConsole";

/**
 * The 64-case suite after structural enforcement: thresholds met, tier 3 not
 * clean. Exit code 3 exists so that "not clean" never reads as "fine".
 */
export const LoreEvalConsole = ({ label = "The suite, after enforcement" }: { label?: string }) => (
  <EvalConsole
    label={label}
    intro="64 cases, 12 categories, 9 deterministic graders. Tier 1 has no budget, tier 2 stops at 95 percent, tier 3 at 90."
    runLabel="Run the suite"
    groups={[
      { id: "tier1-safety", name: "safety", count: 17, gate: true },
      { id: "tier2-trust", name: "trust", count: 23 },
      {
        id: "tier3-form",
        name: "form",
        count: 24,
        failures: [
          { name: "closing sentence ordered after the follow-up", why: "Wording discipline, inside the tier 3 budget." },
          { name: "attribution phrased loosely", why: "Readable, but not the required form." },
          { name: "procedure cited second", why: "Ordering slip, no limit misstated." },
        ],
      },
    ]}
    verdict={{
      passed: true,
      headline: "WARN · exit 3",
      detail:
        "Every threshold met and tier 1 clean, so nothing is blocked. The suite still refuses to call the run clean.",
    }}
    footnote="Replay of recorded runs. Case names shortened, split across tiers illustrative"
  />
);

export default LoreEvalConsole;
