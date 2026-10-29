# Rose case study: copy deck

Status: v1, 2026-10-29. Exact text for every section of the page, extracted from the reference prototype (Design canvas, artboards D1 and D2). Use this text verbatim; `docs/rose-case-study.md` gives structure and rules, this file gives the words. No em-dashes.

## Page-wide

- Honesty legend title: "How to read this case study"
  - Built: "Implemented behaviour that can be inspected in the product or repository."
  - Validation: "A bounded test, audit or measurement. It does not prove every visitor outcome."
  - Design: "A proposed direction or prototype, not a deployed behaviour."
  - Line under the legend: "Milestones come from the repository: commit dates, archived plans, the original prompt. Readings of the design are mine."
- Table of contents label: "On this page". Entries: 00 The idea · 01 Qualify · 02 Listen to the page · 03 Know where you are · 04 One quiet dock · 05 Earn trust · 06 What Rose can do now · 07 Trust · 08 What she got wrong · 09 Next steps · 10 Open questions.
- Dock placeholder: "Ask Rose anything" · shortcut hint "⌘K" (Ctrl+K on Windows).

## 6.1 Hero

- Kicker: "Case study · AI service design · Rose" · badge "Live · text only"
- Headline: "A portfolio you can question." ("you can question." in italic, gold)
- Lead: "The story behind Rose: why I built her, the five decisions that reshaped her, and the questions I am leaving open."
- Meta line: "July to October 2026 · five decisions · sources from the repository"
- Hero dock exchange: visitor "Why was Rose first built around booking?" · status "Rose is reading the page…" · answer "Ivan's first brief was narrow: help you decide, in two or three exchanges, whether to book 30 minutes with him. He changed it in August." · button "Locate · where he changed it ↓" · source "Source: original prompt, commit 51245fc"
- TL;DR (titled "TL;DR"):
  - The problem: "A case study shows the work. It cannot answer the question a visitor brings."
  - Five decisions: "July to October 2026: qualify, listen to the page, know where you are, one quiet dock, earn trust."
  - Today: "Live, text only. Rose knows the page and section in view, answers from the site’s own text, and sends nothing when you book."
  - Still open: "Whether a source-faithful answer helps each reader understand the work from their own angle."

## 6.2 Chapter 00 · The idea

- Heading: "What if the portfolio could answer back?"
- P1: "A case study shows the work. It cannot anticipate every question someone brings to it. I built Rose to explore another way in: a conversation alongside the evidence."
- P2 (marker ● Built): "The first version shipped on 21 July 2026. Its brief was narrower than that possibility: help a visitor decide whether to book a conversation with me."
- P3: "I named Rose after, and shaped her dock on, userose.ai's website agent. The idea of an agent commenting the page it lives on came from co-existence.ai. What I changed: her goal. Not selling. Explaining, reformulating, contextualising." (gesture anchor on "userose.ai's website agent")
- Rose note: "Yes, there's another Rose. He credits her. So do I."
- Transition: "So the first version did one thing: qualify."

## 6.3 Chapters 01 to 05 (marker ● Built)

Labels: "The brief" · "The tension" · "What I decided" · "Source:". The decision sentence carries the gesture anchor.

### 01 · 21 Jul 2026 · Qualify
- The brief: "Help the visitor decide, in two or three exchanges, whether to book 30 minutes with me."
- The tension: "Four intent chips asked visitors who they were before showing them anything."
- What I decided: "Ship a small dock with four intents and a booking card."
- Result: "A qualification funnel with one destination."
- Source: "original prompt and config, commit 51245fc"
- Rose note: "My first job was to sort you into four boxes. His idea. He admits it."
- Vignette: caption "The site before Rose, and her first dock", toggle "Before" / "July" (contents below)
- Transition: "One destination, and the same four boxes whatever page you were on. That was the next problem."

### 02 · 7 Aug 2026 · Listen to the page
- The brief: "Keep booking reachable."
- The tension: "The same four intents appeared on every page, whatever the visitor was reading."
- What I decided: "Replace fixed intents with three questions written for each page, and keep Book a call as a constant exit."
- Result: "Questions start from the work, not from the visitor’s profile."
- Source: "archived plan, contextual starters, 7 Aug"
- Rose note: "He stopped me asking who you are. I started asking what you were reading."
- Vignette: caption "Dock starters on /aetherix", toggle "July" / "August" (contents below)
- Transition: "The questions now started from the page. The answers did not, yet."

### 03 · 10 Aug 2026 · Know where you are
- The brief: "Answer generally about Ivan."
- The tension: "A page-specific question deserves a page-specific answer."
- What I decided: "Pass the current page and intent into Rose’s context."
- Result: "Answers refer to the case study being read."
- Source: "commit b236ff3, page context and intent"
- Rose note: "I know which page you’re on. Not who you are. He drew that line."
- Vignette: caption "What Rose receives with a question", toggle "Before" / "After" (contents below)
- Transition: "Rose knew where you were. Where she should live was the next question."

### 04 · 14 Oct 2026 · One quiet dock
- The brief: "Several entry points to Rose."
- The tension: "A dock competing with the page reads as a sales widget."
- What I decided: "Unify the dock: discreet at rest, full contrast in use, questions by page."
- Result: "Rose stays out of the way until asked."
- Source: "commit 7752dbb, unified dock and chips"
- Rose note: "I used to sit in the nav bar. Nobody found me there. He moved me."
- Vignette: caption "Where Rose lives", toggle "Before" / "After" (contents below)
- Transition: "Quiet until asked. Then: what happens to what you tell her?"

### 05 · 24 Oct 2026 · Earn trust
- The brief: "Send the conversation with each booking request."
- The tension: "A transcript is more than a visitor agreed to share."
- What I decided: "Booking opens the calendar and nothing else."
- Result: "Contact is an optional outcome, not the goal of every answer."
- Source: "privacy, memory and evaluation work, 24 Oct"
- Rose note: "When you book, I send nothing. Not even this conversation. His call."
- Vignette: caption "What a booking carries", toggle "Planned" / "Shipped" (contents below)
- Transition: "Five decisions later, here is what she does today."

Vignette contents (dock mock-ups, as data):
```js
var V5 = {
      ch1: { caption: 'The site before Rose, and her first dock', b: 'Before', a: 'July', mb: 'every page · before 21 Jul', ma: 'every page · 21 Jul',
        before: [{ t: 'note', text: 'No dock. The case studies are the only way in.' }],
        after: [{ t: 'chips', chips: ['Product expertise', 'Technical profile', 'Culture fit', 'Just exploring'] }, { t: 'card', text: 'the one destination' }] },
      ch2: { caption: 'Dock starters on /aetherix', b: 'July', a: 'August', mb: '/aetherix · 21 Jul', ma: '/aetherix · after 7 Aug',
        before: [{ t: 'chips', chips: ['Product expertise', 'Technical profile', 'Culture fit', 'Just exploring'] }],
        after: [{ t: 'chips', chips: ['What has actually been built?', 'What happens when it’s wrong?', 'Book a call'] }] },
      ch3: { caption: 'What Rose receives with a question', b: 'Before', a: 'After', mb: 'context: none', ma: 'context: /aetherix · section in view',
        before: [{ t: 'q', text: 'What does he measure?' }, { t: 'a', text: 'An answer about Ivan in general.' }],
        after: [{ t: 'q', text: 'What does he measure?' }, { t: 'a', text: 'An answer about the case study being read.' }] },
      ch4: { caption: 'Where Rose lives', b: 'Before', a: 'After', mb: 'nav bar + dock', ma: 'bottom of every page',
        before: [{ t: 'note', text: '"Ask Rose" in the nav bar, plus a dock competing with the page.' }],
        after: [{ t: 'note', text: 'One dock. Discreet at rest, full contrast in use.' }] },
      ch5: { caption: 'What a booking carries', b: 'Planned', a: 'Shipped', mb: 'booking request', ma: 'booking request',
        before: [{ t: 'card', text: 'conversation attached' }],
        after: [{ t: 'card', text: 'opens the calendar, nothing else' }] }
    };
```

## 6.4 Chapter 06 · What Rose can do now (marker ○ Design)

- Heading: "Ask about what you're reading."
- Intro: "Rose knows the page, the section in view and the passages I marked. She answers in the dock, in the format the question needs: a passage to jump to, plain words, a link to other work, or a diagram."
- Architecture diagram, caption "How Rose works · solid = built · dashed = design". Nodes:
  - Page route (built): which page is open
  - Section in view (built): id and heading
  - Marked passage (design): data-rose-anchor, set by me
  - Dock (built): the only place to ask
  - rose-chat (built): edge function, model via gateway
  - Site text (built): same source as Markdown and MCP
  - propose_booking (built): card, on a real signal
  - suggest_followups (built): one or two next questions
  - show_passage (design): link + gesture
  - show_relations (design): reads the map below
  - show_diagram (design): fixed, checked library
  - Edge labels: "context", "question ⇄ answer", copper dashed return "gesture on the passage". Column label "READER".
- Marked passage (quote): "Pass the current page and intent into Rose's context, so answers refer to the case study being read." · caption "Decision of 10 Aug 2026 · commit b236ff3"
- Label "Ask Rose about this passage", questions:
  - Locate: Where did he decide this?
  - Reformulate: Say it more simply
  - Connect: How does this relate to his other work?
  - Sketch: Draw how it works
- Under the questions: "The question goes to the dock below. That's where Rose answers, always."
- Dock answers (demo):
  - Locate: "Ivan made this call on 10 August, in chapter 03, \"Know where you are\"." + button "Locate · show me ↑"
  - Reformulate: "In plain words: when you ask me something, I also receive which page you're on. So I answer about what you're reading, not about Ivan in general."
  - Connect: "SAME SOURCE · /agents: pages, Markdown mirrors, MCP and Rose read the same content." / "READS · The case studies and Field Notes: I answer from the page you are on first."
  - Sketch: Page → Section in view → Marked passage → Answer
  - Source line under answers: "Source: commit b236ff3"
- Relations graph, caption "What Rose can relate · a map I write by hand". Nodes: Rose, Field Notes, Path · CV, /agents · MCP, Aetherix, Tacet, Anima, Peritia, Sonor, Lore, Compass. Edge labels: reads, reads, same source, reads the case studies, same architecture, adapted into, inspired. Group labels "Hospitality multi-agent architecture" and "Standalone".
  - Under the graph: "Rose links the site’s content, not the projects’ code. Projects link only where I wrote the link; dashed means indirect. Each link carries a one-line reason."
- "In use" block: hidden below 33 conversations. From 33: label "In use", "[N] questions answered since [date]", "Asked by visitors, chosen by me, personal details removed", three real questions.
- Transition: "What she does is narrow on purpose. What she may keep, and say, is narrower still."

## 6.5 Chapter 07 · Trust (marker ● Built)

- Heading: "Trust has two separate contracts."
- Intro: "One concerns data: what is retained and transmitted. The other concerns knowledge: what Rose may assert or infer. Mixing them would make privacy sound like proof, or proof sound like privacy."
- Contract 1 · Data · "What is retained and transmitted."
  - Built: Your conversation stays in this tab for 60 minutes, or until a hard refresh.
  - Built: Questions are stored with personal details masked by pattern, then purged after 90 days.
  - Built: Booking opens the calendar and nothing else. No transcript travels with it.
- Contract 2 · Knowledge · "What Rose may assert or infer."
  - Built: Rose answers from the same Markdown pages the MCP server reads, with one or two links to them.
  - Built: A delivery status is preserved: planned is never turned into done, sandbox never into production.
  - Validation: Released after 15 synthetic cases, one sample each, read by a person.
- The answer rule (marker ● Built), heading "A correct answer can still be the wrong answer."
  - Intro: "So Rose answers the decision behind the question first, keeps the evidence limit, and leaves implementation detail for when it is asked."
  - Example question: "Is Aetherix in production?"
  - Source-correct: "\"Aetherix is staged on Fly.io and connected to the Apaleo sandbox.\"" · note "True, cited. The reader still has to work out what it means."
  - Useful: "\"No. It was built and evaluated on historical data, staged against a sandbox, and is ready for a 30-day pilot.\"" · note "Same sources. It answers the decision behind the question."
  - Caption: "Source: Rose's answer contract, \"a verifiable fact unrelated to the question is still a poor answer\" (rose-context.ts)."
- Transition: "Contracts are only as good as the checks behind them."

## 6.6 Chapter 08 · What she got wrong (marker ◐ Validation)

- Heading: "What she got wrong, and how I check her."
- Intro: "Many of Rose's rules started as a mistake caught in testing, before any visitor saw it. Three of them, from synthetic test runs in October."
- Labels per case: "She said" · "What I changed" · "Result".
  - 24 Oct · release gate, 15 cases · She said: "A follow-up suggestion about Sonor named a team member who does not exist." · What I changed: "Rose may name only Ivan, plus names written word for word in the references." · Result: "No invented names in the final run."
  - 25 to 26 Oct · self-knowledge tests · She said: "On her own page, asked how Ivan measures her (“What does Ivan measure?”), she answered with Aetherix figures." · What I changed: "Repeating “stay on topic” did not work. I removed the competing material from her prompt and load only what the question needs." · Result: "Passed on the next focused run. Self-knowledge turned out to be a reading problem: she had her facts, other material outweighed them."
  - 26 Oct · self-knowledge tests · She said: "On Aetherix, she invented precise error rates and attached a real figure to the wrong model." · What I changed: "For the two high-precision questions on /aetherix, she returns an answer I wrote and checked. Elsewhere, every figure carries its model, metric and scope." · Result: "Open-ended answers still under evaluation. That version is on hold."
- Rose note on case 2 (gesture on "She said"): "Asked about myself, on my own page, I talked about Aetherix. He gave me less to read."
- "How a case is judged": "Each synthetic question is written before the run, with the behaviour it requires and the failure that would block release. Answers are read by a person, not graded by the model." Dimensions: Accuracy, Context, Directness, Evidence, Visitor value, Judgment, Booking discipline, Trust and privacy.
  - Verdict: "Pass, fail or unclear, with the quoted answer as evidence."
  - Critical: "An invented fact or a privacy slip fails the case. It is never averaged away."
  - Limit: "One sample per case is not a reliability estimate, and usage logs are not proof of correctness." (update once the 5/20 protocol results are published, e.g. "0 critical failures in 20 runs")
- Sources line: "Sources: docs/rose-p4-evaluation.md, rose-p5-verification.md, rose-stage-b-remediation.md, in the site repository."
- Transition: "The checks cover what she does today. Here is what comes next, and why it waits."

## 6.7 Chapter 09 · Next steps (marker ○ Design)

- Heading: "Make the whole site easier to navigate, not just one reply."
- Intro: "Contextual assistant is the direction; adaptive reading is one possible behaviour inside it. Rose could locate, reformulate and visualise the relationships between pages while preserving the original sources and their limits. Rose remains text-based today."
  - "A complete, automatic semantic graph of the site": "The map is written by hand. It stays small and true before it grows."
  - "Diagrams that explain the complex parts": "A visual rewording of a dense passage, to teach rather than decorate. Drawn from a fixed set of diagrams I checked."
  - "Answers read aloud": "For readers who prefer to listen: a spoken version of a written answer, which stays the reference."
  - "Placing any passage in context": "Relating what you are reading to the rest of the page and the site, not only the passages I marked."
- Transition: "Some things I have not settled. I would rather say so."

## 6.8 Chapter 10 · Open questions

- Kicker "10 · Open questions", heading "Questions I am leaving open, rather than calling them features." (second half italic). Questions and reasoning: see `docs/rose-case-study.md` §6.8 (verbatim).

## 6.9 Close

- Transition block: label "Ask Rose" + link "What has Ivan actually built?" · line "Start with the evidence. A human conversation is available when it adds context Rose cannot."
- Contact kicker "Contact" · heading "Hiring for AI product? I design the whole loop: the people on the ground, the software, and the outcome it's judged on." (from "I design" in italic copper) · subline "Operations, product, business and tech, in one service. I ship, I evaluate, and I say what isn't proven yet. I am looking for an AI Product Manager or Product Builder role." · buttons "Book 30 minutes", "Email", "CV".