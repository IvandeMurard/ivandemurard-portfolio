/**
 * Aetherix service blueprint: one illustrative breakfast scenario, read across
 * four stages and four layers. Single source for the figure and its Markdown
 * mirror. Status words follow the public repository: "built" means it exists
 * in code on sandbox or public data, "planned" means not yet built, and
 * "illustrative" means the scene is a scenario, not an observed deployment.
 */
export type BlueprintStatus = "built" | "planned" | "illustrative";

export type BlueprintCell = { text: string; status?: BlueprintStatus };

export type BlueprintStage = {
  id: string;
  name: string;
  when: string;
  floor: BlueprintCell;
  touchpoint: BlueprintCell;
  behind: BlueprintCell;
  boundary: BlueprintCell;
  /** Marks the moment authority changes hands or an action reaches people. */
  handoff?: string;
};

export const BLUEPRINT_LAYERS = [
  { key: "floor", label: "On the floor", side: "human" },
  { key: "touchpoint", label: "What the manager sees", side: "human" },
  { key: "behind", label: "Behind the scenes", side: "system" },
  { key: "boundary", label: "Authority and evidence", side: "boundary" },
] as const;

export const BLUEPRINT_STATUS_LABEL: Record<BlueprintStatus, string> = {
  built: "Built, sandbox data",
  planned: "Planned",
  illustrative: "Illustrative",
};

export const BLUEPRINT = {
  title: "Tomorrow's breakfast, from forecast to feedback",
  scenario:
    "Illustrative scenario: a hotel F&B manager preparing tomorrow's breakfast service. No hotel is connected yet; no manager, guest outcome or metric here is observed.",
  stages: [
    {
      id: "anticipate",
      name: "Anticipate",
      when: "The day before",
      floor: { text: "The manager is drafting tomorrow's breakfast rota between two other tasks.", status: "illustrative" },
      touchpoint: { text: "Nothing yet. The system works before it speaks.", status: "built" },
      behind: { text: "Prophet forecasts covers from occupancy and history, with a range. Code refuses an implausible or low-confidence input.", status: "built" },
      boundary: { text: "The forecast is a claim with an error bar. No authority: it decides nothing." },
    },
    {
      id: "decide",
      name: "Decide",
      when: "Evening",
      floor: { text: "The manager reads one message, weighs what the system cannot see (a sick waiter, a group check-in), and replies.", status: "illustrative" },
      touchpoint: { text: "One WhatsApp message: expected covers, confidence, suggested staff. Reply accept, reject or the right figure.", status: "built" },
      behind: { text: "Claude composes the message and never predicts. The reply is parsed and stored next to the recommendation.", status: "built" },
      boundary: { text: "Authority passes to the manager. Their reply is declared feedback: a preference, not a fact." },
      handoff: "Authority changes hands",
    },
    {
      id: "operate",
      name: "Operate",
      when: "Breakfast service",
      floor: { text: "The team serves breakfast on the plan the manager chose. Guests feel the staffing, right or wrong.", status: "illustrative" },
      touchpoint: { text: "No screen. The decision now lives in the rota and on the floor.", status: "illustrative" },
      behind: { text: "Nothing acts. The system does not change the rota or contact staff.", status: "built" },
      boundary: { text: "The action reaches people here. It cannot be replayed: the plan not chosen is never seen." },
      handoff: "The action reaches people",
    },
    {
      id: "learn",
      name: "Learn",
      when: "After service",
      floor: { text: "The manager glances at a short receipt: forecast against actual, and the gap.", status: "illustrative" },
      touchpoint: { text: "Daily receipt: actual covers, forecast, delta, confidence.", status: "built" },
      behind: { text: "Actual covers ingested from the till; forecast error computed; decision logged for audit. Live till ingestion needs a connected hotel.", status: "planned" },
      boundary: { text: "Observed: the covers, so the forecast can be scored. Not observed: whether the staffing was right. That stays a judgement." },
    },
  ] as BlueprintStage[],
  insight:
    "A prediction can be evaluated against a later observed number. A recommendation has operational consequences and does not automatically receive an equally definitive verdict.",
  caption:
    "Read down a column for one moment of the service, across a row for one layer. The forecast gets a score the next day; the staffing decision gets the manager's word and a service that already happened.",
  qualifications: [
    "Built on sandbox and public data (Apaleo sandbox, synthetic series, Kaggle Recruit benchmark): forecast, guard in code, WhatsApp message, reply parser, daily receipt.",
    "Planned: live ingestion of till data from a connected hotel, which is what would let forecast error be measured on real covers.",
    "Unproven: that recorded replies improve recommendations, and that any staffing decision improved a real service. No manager has used it yet.",
  ],
};

export function blueprintMarkdown(): string {
  const cell = (c: BlueprintCell) => `${c.text}${c.status ? ` [${BLUEPRINT_STATUS_LABEL[c.status]}]` : ""}`;
  return [
    `**Figure. ${BLUEPRINT.title}.** ${BLUEPRINT.scenario}`,
    ...BLUEPRINT.stages.map((s, i) =>
      [
        `**Stage ${i + 1}, ${s.name}** (${s.when})${s.handoff ? `. ${s.handoff}.` : ""}`,
        `- On the floor: ${cell(s.floor)}`,
        `- What the manager sees: ${cell(s.touchpoint)}`,
        `- Behind the scenes: ${cell(s.behind)}`,
        `- Authority and evidence: ${cell(s.boundary)}`,
      ].join("\n")
    ),
    `**Key distinction.** ${BLUEPRINT.insight}`,
    BLUEPRINT.caption,
    `Evidence status:\n${BLUEPRINT.qualifications.map((q) => `- ${q}`).join("\n")}`,
  ].join("\n\n");
}
