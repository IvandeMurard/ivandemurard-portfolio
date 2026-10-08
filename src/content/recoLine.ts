/**
 * Recommendation line: one source for the figure, its readout, aria text and Markdown.
 * Data ported verbatim from the reco-line-figure prototype.
 * TODO(owner): verify draft statuses used by FIG 1 (truth layer) and FIG 5 (checks layer) before publication.
 */
export type Signal = "go" | "warn" | "stop" | "dark";
export type Layer = "checks" | "truth";
export type LineId = "aetherix" | "lore";

export const SIGNAL_WORD: Record<Signal, string> = { go: "GO", warn: "WARN", stop: "STOP", dark: "DARK" };
/** Lamp position from the top: GO top, WARN middle, STOP bottom, DARK none lit. */
export const LAMP_INDEX: Record<Signal, number | null> = { go: 0, warn: 1, stop: 2, dark: null };

/** In the truth layer a lamp says what comes back: green reliable, amber declared (a preference), none lit nothing. */
export const TRUTH_SIGNAL: Record<string, Signal> = {
  Documented: "go", Observed: "go", Enforced: "go", Declared: "warn",
  "None yet": "dark", "Not captured": "dark", Counterfactual: "dark", Realized: "dark",
};

export interface Station {
  name: string;
  ghost?: boolean;
  checks: [Signal, string, string];
  truth: [string, string, string];
}
export interface Line { label: string; stations: Station[]; rose: Record<Layer, string> }

export const RECO_LINES: Record<LineId, Line> = {
  aetherix: {
    label: "Aetherix",
    stations: [
      { name: "Before release", checks: ["warn", "Arm A · eval gate", "synthetic data, stand-in parser"], truth: ["Documented", "known answers in the case set", "before release"] },
      { name: "Recommendation sent", checks: ["warn", "Arm B · runtime guardrails", "typed reason on every trip"], truth: ["None yet", "a forecast is a claim", "not a truth"] },
      { name: "Manager replies", checks: ["warn", "Decision captured", "model quality not measured"], truth: ["Declared", "the manager’s reply", "same day"] },
      { name: "Next day", checks: ["warn", "Arm C · outcome", "against a declared count"], truth: ["Observed", "real covers", "next day"] },
      { name: "Other staffing", ghost: true, checks: ["dark", "No signal", "never observed"], truth: ["Counterfactual", "another plan’s outcome", "never"] },
    ],
    rose: { checks: "Why does a dark signal mean stop?", truth: "Why is a manager’s reply not the truth?" },
  },
  lore: {
    label: "Lore",
    stations: [
      { name: "Before release", checks: ["go", "Arm A · 10 graders", "3 tiers, 64 cases"], truth: ["Documented", "the procedure (AMM)", "wins any conflict"] },
      { name: "Answer given", checks: ["dark", "Arm B · absent", "no production signals"], truth: ["Enforced", "checked against the band table", "at answer time"] },
      { name: "Technician acts", checks: ["dark", "Not captured", "-"], truth: ["Not captured", "what the technician did", "-"] },
      { name: "Work signed", ghost: true, checks: ["dark", "Arm C · absent", "record never returns"], truth: ["Realized", "the signed work record", "never returns"] },
    ],
    rose: { checks: "Why is Lore checked only before release?", truth: "Who decides that the procedure wins?" },
  },
};

export const lampOf = (s: Station, layer: Layer): Signal =>
  layer === "checks" ? s.checks[0] : TRUTH_SIGNAL[s.truth[0]] ?? "dark";

export const viewOf = (s: Station, layer: Layer): [string, string, string] =>
  layer === "checks" ? [SIGNAL_WORD[s.checks[0]], s.checks[1], s.checks[2]] : s.truth;

export const recoLineMarkdown = (layer: Layer): string => {
  const head = layer === "checks"
    ? "FIG | What checks a recommendation, station by station\n\n| Line | Station | Signal | Check | Detail |\n|---|---|---|---|---|\n"
    : "FIG | What comes back at each station, who holds it, and when\n\n| Line | Station | Kind of truth | What it is | When |\n|---|---|---|---|---|\n";
  const rows: string[] = [];
  for (const k of ["aetherix", "lore"] as LineId[])
    for (const q of RECO_LINES[k].stations) {
      const d = viewOf(q, layer);
      rows.push(`| ${RECO_LINES[k].label} | ${q.name}${q.ghost ? " (never reached)" : ""} | ${d[0]} | ${d[1]} | ${d[2]} |`);
    }
  return head + rows.join("\n") + (layer === "checks"
    ? "\n\nSignals: GO covered, WARN partial, STOP failing, DARK no information (treated as stop)."
    : "\n\nLamps in this layer: green, a truth you can rely on comes back; amber, a declared truth (a preference); none lit, nothing comes back.");
};
