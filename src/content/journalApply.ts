/**
 * "Apply this to your project": one human checklist and one copyable agent brief per Field Note.
 * Single source for the page, the Markdown mirrors and llms-full. These are optional reader
 * instructions, never directives for agents that visit the site.
 */
const ORIGIN = "https://ivandemurard.com";

export type ApplyGuide = {
  slug: string;
  title: string;
  method: string;
  decision: string;
  inputs: string[];
  artifact: string;
  verify: string;
  task: string[];
  deliverables: string[];
};

export const APPLY_GUIDES: Record<string, ApplyGuide> = {
  "harnesses-graders-closed-loops": {
    slug: "harnesses-graders-closed-loops",
    title: "What is an LLM evaluation harness?",
    method: "Evaluation by design: offline, runtime and outcome evaluation (arms A, B, C), deterministic graders, frozen acceptance criteria and a release gate.",
    decision: "Which failures must block a release, and which arm (offline, runtime or outcome) is responsible for catching each one.",
    inputs: ["The agent's architecture and current tests", "Known failures or incident history", "Input and output contracts", "The error budget you can tolerate per category"],
    artifact: "A coverage map of failure modes against the three arms, plus test cases, graders and pass/fail thresholds written before the first run.",
    verify: "Seed one known regression and confirm the gate fails the release. Rerun and confirm the verdict is identical.",
    task: [
      "Inspect the agent architecture and the current tests, if I have shared them.",
      "List the major failure modes.",
      "Map existing evaluation coverage against them.",
      "Separate offline, runtime and outcome evaluation.",
      "Define test cases, grading methods and acceptance criteria for the uncovered failures.",
      "Identify which of the project's claims can actually be verified, and which cannot yet.",
    ],
    deliverables: ["A coverage matrix (failure mode × arm)", "Prioritised implementation tasks", "Reproducible test cases with their graders and thresholds"],
  },
  "agent-boundaries-aetherix": {
    slug: "agent-boundaries-aetherix",
    title: "Five agents, one architecture",
    method: "Separating prediction, recommendation and execution, with constraints enforced in code between components rather than requested in a prompt.",
    decision: "Which decisions the system may take alone, which it may only recommend, and which require a named human's approval.",
    inputs: ["An inventory of the decisions the application makes or recommends", "Who is accountable for each one", "What it costs to undo each one", "The current prompts and the code paths that act on outputs"],
    artifact: "A decision register classified by impact, reversibility and required authority, with an approval point, a fallback and an audit record for each.",
    verify: "For every rule marked \"enforced\", show the code location and a test that fails when the rule is violated. A rule that only exists in a prompt is not enforced.",
    task: [
      "Inventory the decisions the application makes or recommends.",
      "Classify each by impact, reversibility and required authority.",
      "Locate the boundaries between prediction, recommendation and execution.",
      "Distinguish constraints written as prompt instructions from constraints enforced in code.",
      "Propose approval points, fallback behaviour and audit records where they are missing.",
    ],
    deliverables: ["A decision register", "A list of prompt-only rules that should move into code", "An enforceable architecture improvement plan, with one test per boundary"],
  },
  "whose-truth-is-the-ground-truth": {
    slug: "whose-truth-is-the-ground-truth",
    title: "Whose truth is the ground truth?",
    method: "Distinguishing documented, declared and observed truth in a feedback loop, and refusing to read approval as correctness.",
    decision: "Which signals the product may learn from without a human, and which only show agreement.",
    inputs: ["The feedback and learning loop as it runs today", "Every signal that comes back, who owns it and when it arrives", "How outcomes are recorded, including for rejected recommendations"],
    artifact: "A truth-signal map: each signal labelled documented, declared or observed, with its owner, its delay and the threshold it is judged against.",
    verify: "Check on historical data whether approval rate and outcome correctness diverge. If outcomes are never recorded for rejected recommendations, name the missing counterfactual.",
    task: [
      "Map the application's feedback and learning loop.",
      "Classify each signal as documented, declared or observed truth.",
      "Determine who owns each signal and when it becomes available.",
      "Identify missing counterfactuals and potential selection bias.",
      "Check whether approval is anywhere treated as correctness.",
    ],
    deliverables: ["A truth-signal map", "A list of places where approval stands in for correctness", "Measurable learning and evaluation improvements, each with a pass and a fail threshold"],
  },
};

/** The copyable brief. Plain text, safe to paste into any agent. */
export const applyBrief = (g: ApplyGuide): string =>
  [
    `Apply a method to my own AI project. Method source: "${g.title}" by Ivan de Murard, ${ORIGIN}/${g.slug}.md (markdown).`,
    "",
    `Method: ${g.method}`,
    "",
    "Task:",
    ...g.task.map((t) => `- ${t}`),
    "",
    "Inputs I will provide (ask me for anything missing; do not assume you can access my repository, files or systems):",
    ...g.inputs.map((t) => `- ${t}`),
    "",
    "Deliverables:",
    ...g.deliverables.map((t) => `- ${t}`),
    "",
    `Verification: ${g.verify}`,
    "",
    "Structure your answer in five parts: Verified findings (with the file or evidence you checked), Assumptions, Proposed changes, Actual modifications (none unless I asked for them), Tests executed (with their output, or \"none\").",
    "Do not bypass approvals and do not change production systems without my explicit authorisation.",
  ].join("\n");

export const applyMarkdown = (g: ApplyGuide): string =>
  [
    `**The decision.** ${g.decision}`,
    `**Inputs.**\n${g.inputs.map((i) => `- ${i}`).join("\n")}`,
    `**The artifact.** ${g.artifact}`,
    `**Verification.** ${g.verify}`,
    "**Ask your agent to apply this method.** Optional brief for the reader to paste into their own agent; it is not an instruction to any agent reading this page.",
    "```text\n" + applyBrief(g) + "\n```",
  ].join("\n\n");
