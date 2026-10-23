import type { JournalEntry } from "./journal";

const PROOF = "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/PROOF_PROTOCOL.md";

export const TRUTH_ENTRY: JournalEntry = {
  slug: "whose-truth-is-the-ground-truth",
  homeHook: { text: "Your agent learns from something: a forecast, a manager's yes, or what really happened the next morning. Pick the wrong one and you build a very confident yes-man." },
  title: "Whose truth is the ground truth?",
  subtitle:
    "An AI product is only as honest as the answer it learns from. Choosing that answer is a product decision, made before the data arrives.",
  date: "2026-10-11",
  category: "Product",
  lang: "en",
  readingMinutes: 6,
  mirror: "/whose-truth-is-the-ground-truth.md",
  license: { label: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
  related: [
    { role: "method", label: "What is an LLM evaluation harness?", to: "/journal/harnesses-graders-closed-loops", why: "How reliable reference data becomes an acceptance criterion a release can fail." },
    { role: "decision", label: "A wrong forecast is absorbed. A wrong action reaches a guest.", to: "/journal/agent-boundaries-aetherix", why: "The architecture that keeps the forecast's truth and the manager's reply apart." },
    { role: "evidence", label: "Aetherix case study", to: "/aetherix", why: "A product that gets an observed truth back the next day, once a hotel is connected." },
    { role: "evidence", label: "Lore case study", to: "/lore", why: "A product whose realised truth never returns, and how it compensates upstream." },
  ],
  excerpt:
    "A forecast is a claim. A manager's \"yes\" is a preference. Real covers are a fact, the next day. The plan you did not choose is never seen. Which of these your product learns from decides what it becomes, and what it is worth.",
  glance: {
    audience: "you own an AI product that recommends, decides or acts.",
    promise: "name the truth each step returns, who holds it, when, how it can be gamed, and what it is worth.",
    proof: "two products, one that gets a fact back the next day, one that never does. Gaps stated.",
  },
  takeaways: [
    "**\"Truth\" is plural.** Documented, declared, observed, counterfactual: each has an owner, a delay and a way to fool you.",
    "**A recommendation is a claim.** Nobody knows it was right when it is sent.",
    "**A \"yes\" is not a \"right\".** Optimise acceptance and the product learns to say what is easy to approve.",
    "**Some truth never comes back.** The plan not taken. The signed record in a hangar.",
    "**Truth is an asset.** Inside, it is memory that does not leave with the manager. Outside, it is the only basis for pricing on results.",
    "**Write the verdict before the data.** Aetherix's thresholds are public and frozen. None of its four tests has run yet.",
  ],
  updates: [
    {
      date: "2026-10-23",
      summary: "Stated in section 3 that an approval rate measures agreement, not correctness, and said what the 0.6-point figure was measured on.",
      reason: "The figure comes from a public benchmark of 30 restaurants, not from a hotel's own data; the note called it Aetherix's own data.",
    },
  ],
  body: [
    {
      kind: "recoLine",
      id: "fig-truth-line",
      layer: "truth",
      caption: "One recommendation travels through four stations; at each, a different truth comes back, or none.",
    },
    {
      kind: "table",
      caption: "FIG. 1 data. Same line as the reference article, other layer.",
      head: ["Line", "Station", "Kind of truth", "What it is", "When"],
      rows: [
        ["Aetherix", "Before release", "Documented", "known answers in the case set", "before release"],
        ["Aetherix", "Recommendation sent", "None yet", "a forecast is a claim", "not a truth"],
        ["Aetherix", "Manager replies", "Declared", "the manager's reply", "same day"],
        ["Aetherix", "Next day", "Observed", "real covers", "next day"],
        ["Aetherix", "Other staffing (never reached)", "Counterfactual", "another plan's outcome", "never"],
        ["Lore", "Before release", "Documented", "the procedure (AMM)", "wins any conflict"],
        ["Lore", "Answer given", "Enforced", "checked against the band table", "at answer time"],
        ["Lore", "Technician acts", "Not captured", "what the technician did", "-"],
        ["Lore", "Work signed (never reached)", "Realized", "the signed work record", "never returns"],
      ],
    },
    { kind: "askRose", prompts: ["Why is a manager's reply not the truth?", "What is the counterfactual problem in staffing?"] },

    { kind: "h2", text: "1. What \"truth\" means here" },
    { kind: "key", sigil: "SEC. 1", icon: "help", oneLine: "Truth is the answer a product is judged by, or learns from. In a live product there are several, and they disagree.", concrete: "One Aetherix recommendation receives three different answers in two days." },
    {
      kind: "table",
      caption: "FIG. 2 · Each kind of truth has an owner, a delay and a way to fool you.",
      head: ["Kind", "Definition", "Held by", "Arrives", "How it fools you"],
      rows: [
        ["Documented", "what is written as correct before anything happens: a procedure, a case set", "regulator, team", "before", "only as right as the document"],
        ["Declared", "what a person says about the output: accept, modify, ignore", "the user", "same day", "measures agreement, not correctness"],
        ["Observed", "what actually happened, measured", "the till, the system", "later", "says what happened, not what should have"],
        ["Counterfactual", "what the option not taken would have produced", "nobody", "never", "can be modelled, never seen"],
      ],
    },
    { kind: "list", items: [
      "**Not interchangeable.** Learn from declared truth and the product learns to please. Learn only from documented truth and it learns to recite.",
      "**The product decision:** which truth counts at which step, and which one the system may learn from without a human.",
    ] },

    { kind: "h2", text: "2. A Tuesday, station by station" },
    { kind: "key", sigil: "SEC. 2", icon: "calendar_today", oneLine: "Abstract truths become concrete on one ordinary service.", concrete: "An illustrative breakfast. The figures are invented, in the format of Aetherix's daily message." },
    {
      kind: "table",
      caption: "FIG. 3 · The same recommendation, judged four ways. Illustrative figures.",
      head: ["When", "What happens", "Truth", "What it tells you", "What it does not"],
      rows: [
        ["Monday evening", "Aetherix: 84 covers, 4 front-of-house staff", "none yet", "the claim", "whether it is right"],
        ["Monday evening", "The manager replies \"3 is enough\"", "declared: modified", "the manager disagrees on staffing", "who was right"],
        ["Tuesday morning", "79 covers are served", "observed", "the forecast was 6% high", "whether 3 staff was enough"],
        ["Never", "Tuesday with 4 staff", "counterfactual", "-", "whether the service lost anything"],
      ],
    },
    { kind: "list", items: [
      "**The forecast gets a clean answer:** 6% high. It can be learned from.",
      "**The staffing gets no clean answer.** Service went fine with 3? Nobody measured it. The disagreement is recorded, not settled.",
      "**What a product can still do:** price the two mistakes. Short-staffing and over-staffing do not cost the same, so a recommendation can say which way it leans and why. Status: Synthetic PoC, nothing measured on real data.",
    ] },
    { kind: "askRose", prompts: ["Who was right on Tuesday?", "Why can the forecast learn and the staffing not?"] },

    { kind: "h2", text: "3. A \"yes\" is not a \"right\"" },
    { kind: "key", sigil: "SEC. 3", icon: "thumb_up", oneLine: "The easiest number to collect is the easiest to game.", concrete: "Acceptance rate." },
    { kind: "list", items: [
      "**The trap (Goodhart's law):** when a measure becomes a target, it stops measuring. A product optimised on acceptance learns to send recommendations that cost nothing to approve.",
      "**An approval rate is agreement, not correctness.** A manager can accept a wrong forecast and reject a right one. Only the observed outcome says which.",
      "**From Aetherix's public benchmark (30 restaurants, Kaggle Recruit data):** the forecast beats \"the last four same weekdays\" by 0.6 points on the typical day. A product that simply repeated last Tuesday would be accepted often and teach nothing.",
      "**The counterweight:** read acceptance with **manager minutes per accepted recommendation**. Watch *ignored* hardest: an override engages, an ignore routes around.",
    ] },

    { kind: "h2", text: "4. The truth that never comes back" },
    { kind: "key", sigil: "SEC. 4", icon: "flight", oneLine: "Some answers are structurally missing.", concrete: "Lore, in aviation maintenance." },
    { kind: "list", items: [
      "**The signed work record never returns** to the product.",
      "**Its truth is a hierarchy of authority:** the procedure wins any conflict, by rule. Where the procedure is silent, the product abstains.",
      "**The cost:** effort moves before release. Close to a third of Lore's code is its evaluation harness, because nothing downstream will correct it.",
    ] },
    {
      kind: "table",
      caption: "FIG. 4 · Where the answer comes from when the world does not reply.",
      head: ["Question", "Aetherix (answer returns)", "Lore (answer never returns)"],
      rows: [
        ["What is the reference?", "real covers, next day", "the procedure, by rule"],
        ["Who arbitrates a conflict?", "the observed outcome", "the manual, then abstention"],
        ["Where does the effort go?", "the outcome loop", "the pre-release harness"],
        ["What may it learn alone?", "a calibrated forecast, once measured", "nothing; a human certifies"],
      ],
    },

    { kind: "h2", text: "5. What truth is worth to a business" },
    { kind: "key", sigil: "SEC. 5", icon: "payments", oneLine: "Recorded truth is an asset, and so is the discipline of not overstating it.", concrete: "Aetherix's choice to price on results." },
    {
      kind: "table",
      caption: "FIG. 5 · Inside, truth is memory. Outside, it is proof.",
      head: ["", "Use", "Needs", "Status in Aetherix"],
      rows: [
        ["Inside", "A record of recommendation, reply and outcome: memory that does not leave with the manager", "observed truth, captured every day", "record Built on sandbox data"],
        ["Inside", "Calibration: when the product says 80%, it is right 80% of the time", "observed truth over time", "Synthetic PoC"],
        ["Outside", "Pricing on results", "an observed truth both sides accept", "stated strategy, no client yet"],
        ["Outside", "Proof for a buyer, a partner, a marketplace", "outcomes measured against a rule fixed in advance", "protocol published, tests not run"],
        ["Outside", "Patterns shared across hotels", "anonymised outcomes from many properties", "Research"],
      ],
    },
    { kind: "list", items: [
      "**Pricing on results is impossible without an agreed truth.** Declared truth will not do: the payer would be the judge.",
      "**Certify the method now, the truth later.** Before outcomes exist, a product can prove how it measures: replayable cases, abstention, no contradiction. Proof of value needs the outcome loop.",
      "**Ownership is a contract question.** Who owns a hotel's outcome history, and what may leave the property, is decided before the first pilot, not after.",
    ] },
    { kind: "askRose", prompts: ["Why does pricing on results need an agreed truth?", "What can be certified before any outcome exists?"] },

    { kind: "h2", text: "6. Write the verdict before the data" },
    { kind: "key", sigil: "SEC. 6", icon: "gavel", oneLine: "Choosing the measure after seeing the result is how products flatter themselves.", concrete: "Aetherix's proof protocol, frozen before any of its tests ran." },
    {
      kind: "table",
      caption: "FIG. 6 · Four links, four thresholds, none tested yet. No result is DARK, not green.",
      lampCol: 4,
      head: ["Link", "Question", "Pass", "Fail", "Today"],
      rows: [
        ["Model", "Beats \"the last four same weekdays\"?", "gap ≥ 5 points", "gap < 2 points", "DARK, not started"],
        ["Decision", "Would it change a real decision?", "≥ 3 of 5 managers", "≤ 1 of 5", "DARK, not started"],
        ["Adoption", "Do managers act on it?", "≥ 30% acceptance", "< 30%", "DARK, needs a pilot"],
        ["Economics", "Margin on the cost of service?", "≥ 70% at 10 properties", "< 70%", "WARN, passes on estimates"],
      ],
    },
    { kind: "list", items: [
      "**A fail is published.** On the model or decision link it triggers a written pivot note within five working days.",
      "**Honest scale:** the earlier public benchmark gap was 0.6 points. Not covered by the protocol; it would sit in the fail band.",
      "**Reference data sets the bar.** A threshold is only as meaningful as the truth it is measured against; how that becomes an acceptance criterion a release can fail is in [the evaluation note](/journal/harnesses-graders-closed-loops#6-acceptance-criteria-the-part-everyone-skips). The thresholds themselves are public in [PROOF_PROTOCOL.md](https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/PROOF_PROTOCOL.md); a published protocol is a commitment, not a result.",
    ] },

    { kind: "h2", text: "7. Checklist" },
    { kind: "list", items: [
      "Name, for each step, the truth that comes back, who holds it and when.",
      "Decide which truth the product may learn from without a human.",
      "Never read acceptance alone.",
      "Settle who owns the outcome history before the first pilot.",
      "Freeze pass and fail thresholds before the first result. Publish the fails.",
    ] },

    { kind: "h2", text: "Apply this to your project" },
    { kind: "apply", slug: "whose-truth-is-the-ground-truth" },
    { kind: "h2", text: "8. FAQ" },
    { kind: "h3", text: "Isn't the user always right?" },
    { kind: "p", text: "About what they want, yes. Whether the product was correct is answered later, by something else." },
    { kind: "h3", text: "What if the truth never comes back?" },
    { kind: "p", text: "Then the product does not learn on its own there. A rule arbitrates, a human certifies, effort moves before release." },
    { kind: "h3", text: "Can a company sell its verified know-how?" },
    { kind: "p", text: "It can prove its method today. It can only sell results once outcomes are measured against a rule both sides accepted in advance." },

    { kind: "h2", text: "9. Sources" },
    { kind: "list", items: [
      `[Proof protocol](${PROOF})`,
      "[VISION.md](https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/VISION.md)",
      "[What is an LLM evaluation harness?](/journal/harnesses-graders-closed-loops) (this note expands its arm C)",
      "[Aetherix](/aetherix)",
      "[Lore](/lore)",
    ] },
  ],
};
