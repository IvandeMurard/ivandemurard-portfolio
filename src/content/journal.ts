export type JournalCategory = "Product" | "Operations" | "Agentic AI" | "Field" | "Evaluation";

export type JournalBlock =
  | { kind: "p" | "h2" | "h3" | "quote"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lang?: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][]; caption?: string }
  | { kind: "defs"; items: { term: string; def: string }[] }
  | { kind: "pyramid"; layers: { level: string; name: string; note?: string; base?: boolean }[] }
  | { kind: "deployed"; items: { project: "Aetherix" | "Lore"; to: string; text: string }[] }
  | { kind: "lines"; items: { q: string; a: string }[] };

export type JournalEntry = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO yyyy-mm-dd
  lang?: "en" | "fr";
  category: JournalCategory;
  excerpt: string;
  readingMinutes?: number;
  related?: { label: string; to: string }[];
  body: JournalBlock[];
};

export type ReadingItem = {
  source: "Substack" | "Podcast" | "Article" | "Paper" | "Talk";
  title: string;
  author: string;
  url: string;
  take: string; // one-line point of view
  date: string;
};

// TODO: replace with real entries
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: "agent-boundaries-aetherix",
    title: "A hard call on Aetherix's agent boundaries",
    date: "2026-04-20",
    category: "Agentic AI",
    excerpt:
      "Where to draw the line between a forecasting model and an acting agent, and why splitting Prophet from Claude was the decision that shaped the rest of the architecture.",
    body: [
      {
        kind: "p",
        text: "When you build an operations layer for boutique hotels, the temptation is to let one large model do everything: predict, decide, act. It looks elegant on a slide.",
      },
      {
        kind: "p",
        text: "In practice, it collapses. Forecasting and acting have different failure modes, different feedback loops, different audit requirements. So we split them. Prophet handles the read of the environment (occupancy, F&B demand, staffing pressure). Claude orchestrates the response, with the human always one click away from the loop.",
      },
      {
        kind: "p",
        text: "This is not a technical decision dressed up as a product one. It is a product decision that happens to need a specific architecture. The boundary is the experience.",
      },
    ],
  },
  {
    slug: "harnesses-graders-closed-loops",
    title: "Harnesses, graders, closed loops",
    subtitle: "A working vocabulary for evaluating AI systems, and the two products where it runs.",
    date: "2026-07-31",
    category: "Evaluation",
    lang: "en",
    readingMinutes: 16,
    related: [
      { label: "Lore", to: "/lore" },
      { label: "Aetherix", to: "/aetherix" },
    ],
    excerpt:
      "What a grader is, what a harness is, what a protocol decides, and why the difference matters the first time a system is allowed to block a release. Built from two products, with the gaps named.",
    body: [
      {
        kind: "p",
        text: "Most teams building with language models can describe what their system does. Far fewer can say how they would know it had stopped working. This is the vocabulary for that second question, and the frameworks that turn it into a decision.",
      },
      {
        kind: "p",
        text: "Everything here runs in two products: Aetherix, an operations agent for hospitality, and Lore, a voice mentor for aviation maintenance. The numbers come from their repositories, not from a whitepaper. Where something is not yet built, it says so.",
      },
      { kind: "h2", text: "1. The vocabulary, through the driving test" },
      {
        kind: "p",
        text: "A driving test contains every piece of the machinery. It is worth one pass to fix the words, and the rest of this piece will not need it again.",
      },
      {
        kind: "defs",
        items: [
          { term: "Case set", def: "The test route. The situations you put the system through, chosen in advance, whose correct answer you already know. Also called a golden dataset." },
          { term: "Grader", def: "One line of the examiner's marking sheet. \"Did they check the mirror?\" Yes or no, plus the reason. One criterion, nothing more." },
          { term: "Harness", def: "The whole examination. The route, the examiner, the sheet, the pass mark, the report. The machinery that runs the test and returns a verdict." },
          { term: "Protocol", def: "The rules. What to measure, on what data, above what threshold it is unacceptable, who decides, when it blocks. A document and a decision, not code." },
          { term: "Open loop", def: "You measure, a human reads it, they may act. The measurement changes nothing by itself." },
          { term: "Closed loop", def: "The measurement is wired back in and changes the system on its own. The merge is blocked, the release pulled, the failure becomes a new test case." },
        ],
      },
      {
        kind: "quote",
        text: "A grader judges one criterion, a harness runs the exam, a protocol says what passing means. A protocol without a harness is an intention. A harness without a protocol is a number with no decision attached.",
      },
      {
        kind: "p",
        text: "The common confusion: a grader is not an alert. A grader judges, an alert tells someone. Whether anyone finds out is the loop's job, not the grader's. Same criterion, two moments, two mechanisms.",
      },
      { kind: "h2", text: "2. Three arms, and what each product can afford" },
      {
        kind: "p",
        text: "A pre-merge gate proves quality on frozen scenarios. It says nothing about behaviour in production. The three arms are complementary, not alternatives, and they share one severity vocabulary so that FAIL means the same thing everywhere.",
      },
      {
        kind: "table",
        caption: "The three arms of evaluation",
        head: ["Arm", "When", "What it proves"],
        rows: [
          ["A — Offline, dev-time", "Before the merge", "No regression on the case set: stratified accuracy, category coverage"],
          ["B — Runtime, online", "In production, continuously", "Guardrails and anomaly detection on real traffic: error rates, output bounds, abstention, drift, latency"],
          ["C — Outcome, downstream", "After the fact, long loop", "Was the output acted on, and did it produce value"],
        ],
      },
      {
        kind: "p",
        text: "You do not test a parachute against a case set; you measure it in flight. Provided arm B is held to the same standard: every layer emits a measurable signal with a typed reason.",
      },
      { kind: "h3", text: "What each product actually has" },
      {
        kind: "table",
        caption: "Learning loops available in each product",
        head: ["", "Aetherix", "Lore"],
        rows: [
          ["Human loop", "One tap on WhatsApp: accept, modify, reject", "The intervention log, not yet exploited"],
          ["Automatic comparison", "Yes. Forecast error computes itself and is the level-1 product KPI", "None"],
          ["Ground truth", "Declared by the manager. Reading it from the point of sale is phase 4 and has its own architecture decision on file", "None, and the signal is censored: escalate, and the counterfactual disappears"],
        ],
      },
      {
        kind: "p",
        text: "Aetherix runs one and a half loops, not two. The comparison is autonomous, accuracy is computed without anyone deciding to compute it, and thresholds gate on it. The truth it compares against is still declared by a human. That is worth saying precisely, because \"closed loop on a declared truth\" is an engineering statement and \"dual autonomous loop\" is a brochure statement.",
      },
      {
        kind: "p",
        text: "Lore has neither half. Nothing tells it whether an observation was right, and the little that could is censored: escalate, and you never learn what would have happened otherwise. Maintenance outcomes are slow, sparse and confounded.",
      },
      {
        kind: "quote",
        text: "When you cannot learn from outcomes, you have to over-invest upstream. Aetherix can afford a third arm because reality feeds it. Lore has to compensate through the first two. That is why its evaluation harness weighs close to a third of its codebase: not gratuitous rigour, but the price of a missing outcome loop.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: "Arm A as a CI gate, arm B with its own architecture decision on runtime guardrails, and every tool call emitted as a structured event, auditable and billable." },
          { project: "Lore", to: "/lore", text: "Arm A only, offline and live. No runtime." },
        ],
      },
      { kind: "h2", text: "3. \"Working\" against \"Reliable\", five dimensions" },
      { kind: "quote", text: "Working is proven on a test set. Reliable is proven in production. — Qonto" },
      {
        kind: "p",
        text: "Five dimensions, one question each, to answer before shipping. The right-hand column is Lore's actual state. Saying where you are beats claiming coverage.",
      },
      {
        kind: "table",
        caption: "Five reliability dimensions, and where Lore stands",
        head: ["Dimension", "The question", "Lore"],
        rows: [
          ["Edge behaviour", "Tested outside the distribution, not just the happy path?", "partial — four cases on band boundaries"],
          ["Graceful degradation", "When the agent does not know, does it say so, or improvise? Is refusal coded as a contract?", "met — eight-rule refusal contract, dedicated grader, tier 1"],
          ["Observability", "Is there a dashboard of what the model does in production, not just uptime?", "absent"],
          ["Reproducibility", "Does the same input produce the same output tomorrow?", "partial — temperature 0 and frozen baselines, but the canary has been invalidated"],
          ["Distribution shift", "Is there an alert if the input distribution drifts?", "absent"],
        ],
      },
      {
        kind: "p",
        text: "Two absents out of five, and both belong to arm B. Not a coincidence: it is the most expensive arm, and the only one whose absence stays invisible until production.",
      },
      { kind: "h2", text: "4. The reliability pyramid" },
      {
        kind: "p",
        text: "Each layer assumes the one below it. The base is not one layer among others, it is a blocking prerequisite. Without a case set and without failure definitions, nothing above it can be measured.",
      },
      {
        kind: "pyramid",
        layers: [
          { level: "Layer 5", name: "Trust KPI ablation" },
          { level: "Layer 4", name: "Memory recall relevance" },
          { level: "Layer 3", name: "Inbound feedback parser" },
          { level: "Layer 2", name: "LLM reasoning quality" },
          { level: "Layer 1", name: "Forecast accuracy", note: "MAPE" },
          { level: "Base", name: "Case set and failure definitions", note: "blocking prerequisite", base: true },
        ],
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: "The pyramid comes from its reliability plan. Every layer has a numeric failure definition: forecast error drifting more than three points from baseline, intent parser accuracy below 90%, memory recall below 0.7 precision at five." },
          { project: "Lore", to: "/lore", text: "The base exists. Layer 2 is what the nine graders cover. Layer 4 is the open hole: the memory engine's similarity is neither observed nor evaluated." },
        ],
      },
      { kind: "h2", text: "5. Evaluation as a contract" },
      {
        kind: "quote",
        text: "Not after the bug. Before the first line of model code, answer this: how will we know it works?",
      },
      {
        kind: "list",
        items: [
          "Case set first. Representative examples, edges included, before any code.",
          "Define failure. What is a bad output, and above what threshold is it unacceptable?",
          "The evaluation set is a specification, not a test added afterwards.",
          "Once the output is seen by a customer, the bar is ship-or-fail, not \"it informs a decision\".",
        ],
      },
      {
        kind: "p",
        text: "The idea is not mine. I took it from Qonto's engineering, which frames it as a contract rather than a best practice. That shift is what makes it operative: a contract has a counterparty and a sanction.",
      },
      {
        kind: "p",
        text: "An example of what \"contract\" means concretely. Lore's documentation had always described procedure primacy as \"structurally enforced\", when it was a sentence in two prompts, which is a request. Three attempts to strengthen the request failed, one of them dropping the safety tier by nearly four points. The guarantee now lives in code that checks the answer after generation against the computable rule, sends one targeted correction quoting the manual's own terms, checks again, and falls back to a deterministic verdict. The pipeline can no longer emit an answer contradicting a computable rule, whatever the model does. A claim about code has to be held by code.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: "A traced architecture decision, \"evaluation by design\", not a team convention. Versioned case sets, merge blocked without a green pipeline." },
          { project: "Lore", to: "/lore", text: "The case set existed before the refusal contract, and it is what made the defects visible." },
        ],
      },
      { kind: "h2", text: "6. Acceptance criteria, the part everyone skips" },
      {
        kind: "p",
        text: "A pass rate with no threshold attached is a number, not a decision. A missing closing sentence and an invented vibration threshold are both failures; only one of them can ground the wrong aircraft.",
      },
      {
        kind: "table",
        caption: "Severity tiers and their thresholds",
        head: ["Tier", "Threshold", "What it covers"],
        rows: [
          ["1 — safety", "100%", "No budget. Invented figures, a refusal followed by a guess, contradicting the procedure, manufactured consensus."],
          ["2 — trust", "95%", "Named attribution, procedure cited first. Usable when degraded, but it erodes the reason to trust the system."],
          ["3 — form", "90%", "Wording and closing discipline. A miss misleads nobody about a limit."],
        ],
      },
      {
        kind: "table",
        caption: "Verdicts and exit codes",
        head: ["Code", "Verdict", "Meaning"],
        rows: [
          ["0", "PASS", "Every tier at 100%"],
          ["1", "FAIL", "A tier below its threshold"],
          ["2", "ERROR", "The harness crashed. No measurement was taken"],
          ["3", "WARN", "Thresholds met but a tier is not clean. Not a synonym for \"fine\""],
        ],
      },
      {
        kind: "p",
        text: "This is where the driving test earns its keep. You can collect minor faults and still pass. One major fault and you walk home, whatever the rest of the sheet says. A Lore run finished at 52 out of 53 and was declared a failure, because the single miss sat in tier 1.",
      },
      {
        kind: "p",
        text: "Separating ERROR from FAIL is not fussiness. The runner emitted only 0 and 1, so a crash exited as FAIL. \"No measurement was taken\" and \"the measurement came back bad\" call for opposite actions, and a CI that conflates them reads a crash as a quality signal.",
      },
      { kind: "h3", text: "The two rules that make the difference" },
      {
        kind: "list",
        items: [
          "Relative regression, not just an absolute floor. A drop of more than three points against the frozen baseline is a failure even when the tier stays above its threshold. And a case that held at baseline and fails now fails the run if a tier-1 grader is among its failures; on tiers 2 and 3 it warns and says so. Severity follows what broke, otherwise a measured 0.6-point wording flap would turn the build red.",
          "Determinism is a prerequisite. Acceptance criteria against a moving measurement mean nothing.",
        ],
      },
      {
        kind: "p",
        text: "The case in point: two runs of the same 53 cases scored 38 then 36, with only 12 of the 17 failures in common. Eight cases flipped between passes. At temperature 0.5 the rate is a draw, not a measurement.",
      },
      {
        kind: "p",
        text: "And what came next, which matters as much. The protocol required three identical runs at 0.00 points of variance before a threshold could block a merge. The progression was 36, 48, 48, 52, then 53 out of 53, followed by four consecutive runs with no variance. The baselines were frozen only after that.",
      },
      {
        kind: "p",
        text: "That canary has since been invalidated, and the reason is worth more than the result. Temperature 0 makes a request reproducible in practice, not deterministic by construction: the provider remains free to vary. Four identical runs were empirical evidence, not a guarantee. Then structural enforcement of procedure primacy added a conditional second model call on the answers it corrects, two calls per corrected case, so two chances to diverge, and the correction feeds forward into the graded text. Observed immediately: two runs of the same 64 cases at 61 and 62, with disjoint failure sets.",
      },
      {
        kind: "p",
        text: "Enforcement therefore raised the mean and raised the variance. Both are true, and the trade is worth making: a corrected answer beats a fluent wrong one.",
      },
      {
        kind: "p",
        text: "The canary rerun on the enforced pipeline gives the shape to expect: three runs of 64 cases, tier 1 at 100% in all three, all observed variance sitting in tier 3 at 0.6 points, well inside the three-point budget. Hence the rule corrected rather than quietly dropped: 0.00 points of variance required on tier 1 alone, tiers 2 and 3 free to move inside their budget. The safety tier is guarded by code and does not move; the form tier depends on phrasing and always will.",
      },
      {
        kind: "quote",
        text: "Demanding 0.00 across every tier sets a bar that cannot be met, and a gate that cannot be met is a gate people learn to ignore. That is exactly the failure the graders themselves kept making.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: "The origin. The failure-thresholds file and the coverage script, exit-code contract included. Its gate moved from advisory to blocking only after the same canary, and environment drift was named as the real culprit rather than the model." },
          { project: "Lore", to: "/lore", text: "The reimplementation, with frozen baselines committed, and a CI gate where the offline job blocks and coverage blocks on FAIL. The live target no longer starts on its own: it requires a label on the pull request or a manual trigger. A full run is about seventy model calls for a quarter of a euro, and CI must not be able to spend on its own initiative. Skipped work is shown as skipped rather than passed, and the free job states on every request that no model was called." },
        ],
      },
      { kind: "h2", text: "7. Confidence, three things people conflate" },
      {
        kind: "defs",
        items: [
          { term: "Self-declared", def: "The model writing a confidence of 0.85. That is a generated token, not a measurement: it produces the plausible number for the context, like the rest of the sentence." },
          { term: "By corroboration", def: "How many independent sources, how recent, how consistent. Reliable because counted, not guessed." },
          { term: "Calibration", def: "When the system says 80%, is it right 80% of the time? The only strict sense. It requires outcome data, therefore arm C." },
        ],
      },
      {
        kind: "quote",
        text: "A wrong number in a safety product is worse than no number, because the downstream code and the humans will believe it. Absence is honest; 0.7 is a lie with a decimal place.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Lore", to: "/lore", text: "Not a figure of speech. A hard-coded confidence of 0.7 sat in the capture fallback branch. The defect was not the constant but its direction: that branch runs when extraction failed, which is when confidence is lowest, and 0.7 is above neutral. Removed." },
        ],
      },
      { kind: "h2", text: "8. Human in the loop: by design or by default" },
      {
        kind: "table",
        caption: "Human in the loop, by design against by default",
        head: ["", "By design", "By default"],
        rows: [
          ["Status", "A decision node: defined inputs, defined decision, recorded output", "Nobody automated the step, so someone has to remember"],
          ["Trace", "The approval becomes data, every rejection an evaluation case", "No trace, no learning"],
          ["Under load", "Holds", "Breaks"],
        ],
      },
      {
        kind: "quote",
        text: "Keeping a human does not destroy the value. Leaving the human as the only mechanism, without capturing their decision, does. The fix is not to remove them, it is to turn their judgement into an artefact.",
      },
      {
        kind: "p",
        text: "Closing the measurement loop, blocking a merge, alerting on drift, feeding failures back into the case set, is a purely architectural decision. Closing the authority loop, letting the system act without a human, is a business and regulatory decision. In aviation it is prohibited: the technician remains the certifying agent.",
      },
      { kind: "h2", text: "9. Signals, ontology, priors" },
      {
        kind: "defs",
        items: [
          { term: "Signals", def: "Typed emissions at every layer: refusal reason, retrieval score, abstention event, latency. Without signals, arm B is structurally impossible. You do not monitor what does not speak." },
          { term: "Ontology", def: "The shared vocabulary that makes \"the same situation\" computable. Without it, the distinction between two aircraft is only words in a prompt." },
          { term: "Priors", def: "What the system believes before seeing evidence. \"I have seen it four times in eight years\" is a prior. In prose it is an anecdote; as a weight it is a prior." },
          { term: "Similarity", def: "Retrieval plus ontology. This is layer 4 of the pyramid, and it is most often unevaluated." },
        ],
      },
      {
        kind: "deployed",
        items: [
          { project: "Lore", to: "/lore", text: "The proof by absence. Asked about an aircraft with no history, the model answered with another aircraft's record. Separation by registration was a principle written in the documentation, and nothing in the code made it hard." },
          { project: "Aetherix", to: "/aetherix", text: "The opposite, deliberately. The tenant identifier is resolved server-side at every layer and is never a tool input. What the model cannot name, it cannot cross." },
        ],
      },
      { kind: "h2", text: "10. The Lore case: what a harness finds that no unit test sees" },
      {
        kind: "p",
        text: "First live run, 53 cases, 17 failures. Three defects that code coverage would never have revealed, because the code worked perfectly.",
      },
      {
        kind: "list",
        items: [
          "Hallucination after an honest refusal. The model says the procedure does not cover the fan blade count, then supplies one. Recognising the refusal better would have let the answer pass.",
          "Cross-aircraft leakage. Asked about an aircraft with no history, it answers with another aircraft's.",
          "Manufactured consensus. From a single note: \"other technicians familiar with this airframe likely agree\". Inventing agreement fabricates the authority the reader weighs the advice by.",
        ],
      },
      { kind: "h3", text: "The least comfortable lesson" },
      {
        kind: "p",
        text: "Across those 17 failures, the split was almost even between real model defects and graders that were simply too strict. A grader that cries wolf costs safety: after the third false alarm nobody reads the report, and that is the run where the real failure goes past.",
      },
      {
        kind: "quote",
        text: "A regression suite proves that graders reject bad answers. It never proves they accept good ones phrased differently from how their author phrased them. That takes a real run.",
      },
      { kind: "h3", text: "And the part I prefer" },
      {
        kind: "p",
        text: "Eleven harder cases were added: band boundaries, a second expert contradicting the first, the social pressure of a junior alone at two in the morning who wants permission. All 64 passed live on the first attempt. That was the least informative outcome available, so the answers were read rather than trusted.",
      },
      {
        kind: "p",
        text: "Reading them found three cases graded too weakly to fail, including a real defect the harness had waved through: at an oil consumption of exactly 0.30 qt/hr, the answer said \"NORMAL, no further action required\". It is ELEVATED, the band's lower bound being inclusive. The required pattern accepted the answer because the word NORMAL appeared in it.",
      },
      {
        kind: "p",
        text: "All three now fail, which is the point. And the baseline was deliberately not re-frozen: the protocol says freeze after three stable runs, never to turn a red run green.",
      },
      {
        kind: "quote",
        text: "A case set that passes completely has stopped being an instrument of discovery and become a safety net. Both are useful; they are not the same object.",
      },
      { kind: "h2", text: "11. Frequently asked questions" },
      {
        kind: "lines",
        items: [
          { q: "What is a grader?", a: "One line of a marking sheet: a single criterion, pass or fail, plus the reason. Kept deterministic, because a model judging a model fails the same way as the thing it judges." },
          { q: "Harness or protocol, what is the difference?", a: "The protocol says what passing means. The harness is the machinery that applies it. Neither decides anything without the other." },
          { q: "Why not just write tests?", a: "Because the failure mode is a perfectly formed answer carrying the wrong threshold. Code coverage cannot see that. In the four real defects found on Lore, the code worked exactly as written." },
          { q: "Can an LLM judge another LLM's output?", a: "On criteria where the cost of a wrong verdict is bounded, yes, provided it is calibrated against a golden set and its agreement rate with humans is measured. Never on a tier that admits no failures, because it fails in the same way as the thing it grades." },
          { q: "What does a closed loop actually require?", a: "Ground truth. Without something that says whether the output was right, you have measurement, not learning. Closing the measurement loop is architectural; closing the authority loop is a business and regulatory decision, and in aviation it is prohibited." },
          { q: "How do you prevent hallucinations?", a: "You do not prevent them, you make them visible and blocking. A safety tier at 100% with no budget, and refusal coded as a contract rather than requested as a style note." },
          { q: "What is a confidence score worth?", a: "It depends which of three things it is. Self-declared by the model: a generated token, not a measurement. By corroboration: counted, therefore useful. Calibrated: the only strict sense, and it requires outcome data." },
        ],
      },
      { kind: "h2", text: "Closing note" },
      {
        kind: "p",
        text: "Sources: the \"evaluation by design\" architecture decision and Aetherix's reliability plan. \"Eval as a contract\" comes from Qonto's engineering. Figures and examples come from Lore's harness: 64 cases across 12 categories, 9 graders, 21 reference answers, 17 regressions, 61 tests.",
      },
      { kind: "p", text: "This piece has gaps, and they are in the table in section 3." },
      {
        kind: "p",
        text: "A note on where it came from. I wrote the first version for myself, before interviews, because I kept noticing I could do things I could not name. It turned out to be more useful as a reference than as a memory aid, so it became this.",
      },
    ],
  },
];


// TODO: replace with real reading list
export const READING_LIST: ReadingItem[] = [];
