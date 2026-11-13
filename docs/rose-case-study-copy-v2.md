<!-- Exported from the Claude Doc "Rose case study: copy deck v2" on 4 Nov 2026 (rev 92), validated by Ivan. This file is the copy source for the Rose case study. -->

# Rose case study: copy deck v2

·

## How to read this deck

This deck rewrites every word of the Rose case study under docs/style.md, validated on 2 November. Validate it section by section; the prototype in the Design canvas comes after, and code after that.

What changed from v1:

- No transition sentence closes a chapter. Each heading follows from the one before.
- Italic appears once, in the hero headline. Rose's notes are set in roman and recognised by their bubble (dock surface and border), the compass and the name Rose. Their text is ink, not copper.
- Fragments, maxims, self-aware asides and colon reveals are gone.
- The page stays on design and product. Technical detail lives on the evaluation page and in the repository, one link away.
- Three business points are added: the trade-off in chapter 01, the cost of an answer in chapter 08, and where the pattern transfers in chapter 09.
- co-existence.ai is credited in chapter 00, and its influence is named where it shows: the notes in chapters 01 to 05 and the passage questions in chapter 06.
Kept, as short as possible: the Built, Validation and Design markers, the status badge, the source lines and the data notice.

## Hero and TL;DR

The hero says one thing and shows Rose answering. The kicker chain, the meta line and the second label are cut.

| Element | v2 copy |
|---|---|
| Label | Case study · Rose |
| Status badge | Live, text only |
| Headline | A portfolio you can question. (the page's only italic) |
| Lead | Rose answers visitors' questions from the site's own pages. This is how I designed her, the five decisions that changed her, and what I still need to learn. |
| Demo, exchange 1 | Reformulation. Visitor: Say it more simply. Rose: When you ask me something, I also receive the page you are on, so I answer about what you are reading. Source: chapter 03. |
| Demo, exchange 2 | Sourced answer. Visitor: Is Aetherix in production? Rose: No. It was built and evaluated on historical data, staged against a sandbox, and is ready for a 30-day pilot. Link: /aetherix. |
| Demo, exchange 3 | Follow-up questions. Visitor: What has Ivan built? Rose: Six projects, each with its status. Aetherix is ready for a 30-day pilot, Tacet is built and in maintenance, and Anima is a synthetic proof of concept. Suggested: What happens when it's wrong? Which ones are live? Every exchange in the hero shows a built behaviour; the formats in design are shown in chapter 06 with their marker. |
| Demo behaviour | The three exchanges play in a loop. The input opens the real dock. |

TL;DR, four short rows under the hero:

| Row | v2 copy |
|---|---|
| The problem | A case study shows the work, but it cannot answer a visitor's own question. |
| Five decisions | Between July and October 2026, I made Rose qualify visitors, then listen to the page, know the section in view, live in one dock and earn trust. |
| Today | Rose is live and text only. She knows the page and section in view, answers from the site's own text and sends nothing when you book. |
| Still open | Whether an answer that stays faithful to the sources helps each reader understand the work from their own angle. |

Chapter 04 changes title from "One quiet dock" to "One dock", because "quiet" is on the banned mood-word list.

## Chapter 00: The idea

The rhetorical question in the heading becomes a statement, and the third paragraph loses its colon reveal and its fragments.

| Element | v2 copy |
|---|---|
| Kicker | 00 · The idea |
| Heading | A portfolio that can answer questions |
| P1 | A case study shows the work but cannot anticipate every question a reader brings. I built Rose to test another way in, a conversation next to the evidence. |
| P2 (Built) | The first version shipped on 21 July 2026. Its brief was narrower: help a visitor decide whether to book a conversation with me. |
| P3 | The dock is modelled on userose.ai's website agent, and the idea of an agent that comments on the page it lives on comes from co-existence.ai. I changed her goal. Rose explains, rephrases and puts the work in context; she does not sell. |
| Rose note | He gave me a name before he gave me a job. (validated, unchanged) |

Links: userose.ai and co-existence.ai stay quiet external links, as built.

## Chapters 01 to 05: the five decisions

Each chapter keeps its date, its Built marker, its vignette and its source line. Results become full sentences, chapter 01 gains the business trade-off, and one line credits co-existence.ai for the notes.

Intro line above chapter 01 (new): Rose's notes come from co-existence.ai's AI cursor, an agent that comments on the page it lives on. Form: each note is a bubble under its passage, always visible; the copper compass tip moves to the passage when it enters the reading zone, one at a time, on desktop only; on mobile and with reduced motion there is no tip and no movement. The first note of a page carries a footer ("Written by Ivan in my voice. My answers in the bar are live.") with a "Hide notes" button; the dock has a "Page notes: on/off" button.

Rose's marks, one meaning each, one at a time, drawn by the copper tip and absent with reduced motion: underline = the decision she comments on (chapters 01 to 05); circle = a figure and what it is compared with (chapter 08, cost); strike and replace = the first brief, crossed out, with the decision that replaced it. In her answers (design), Locate draws the mark on the page instead of only giving a link.

Answer sources and booking line (design, decided 3 Nov). Each claim in Rose's answer ends with a source link (↗ + the section name). A click scrolls to the exact passage, sentence or diagram and highlights it for a moment: highlight = the passage Rose cited (a fourth mark, one meaning). On a question about Ivan's profile, no booking card unless the visitor asks; instead one line under the answer, set apart by a thin copper rule and the compass: "If this fits a role you are hiring for, book a call with Ivan." Follow-up questions are polite questions with Ivan in the third person, e.g. "Would you tell me more about his AI-native projects?"

Source links, journey (decided 3 Nov). Two signs: § + section name for a passage on this site (same tab); ↗ only for links that leave the site (new tab). A § click on another page navigates in the same tab, the dock and the conversation follow, the page scrolls so the section heading and the passage are both in view, and the passage is highlighted. Only after such a jump, the dock shows one fixed context line built from the page and section titles (e.g. "Aetherix · How the forecast is checked"), not written by the model, and a return link "← Back to Rose's case study, chapter 08" (pattern: Back to {page title}, {section}) that restores the exact place and its highlight; the browser Back button does the same. A reader who arrives by normal reading never sees the context line or the return link. The return position is kept in the tab only and never sent. On mobile the dock minimises on the jump so it does not cover the passage. A § link to the same page only scrolls and highlights, with no return link.

Demos, decided 4 Nov. Hero exchanges show the page read and the source: 1 reads /rose-design-lab · 03, source chapter 03; 2 reads /aetherix, source /aetherix status, link to the case study; 3 reads /journeys, source the case studies. Chapter 06 demo caption: "These formats are in design. Live Rose answers in text only." Both demos have a Pause / Play button (WCAG 2.2.2); with reduced motion they show the first exchange, still. Chapter 08 test loop, seven steps: 1 Write cases before the run; 2 Run 5 or 20 samples; 3 Automatic checks: tests, unsourced figures; 4 Grade every answer against the sources; 5 Pass? If not, back to 2; 6 Deploy with my approval; 7 Live check on the site. Caption: "A failed grade goes back to step 2 with one bounded change. A new failure in the live check becomes a new case."

| Ch. | Field | v2 copy |
|---|---|---|
| 01 Qualify, 21 Jul | Brief | Help the visitor decide, in two or three exchanges, whether to book 30 minutes with me. |
|  | Tension | Four intent chips asked visitors who they were before showing them anything. |
|  | Decision | Ship a small dock with four intents and a booking card. |
|  | Result | Rose worked as a qualification funnel with one destination. |
|  | Trade-off (new) | A funnel makes bookings easy to count, but it treats every visitor as a lead. On a portfolio, that costs more trust than the bookings are worth. |
|  | Note | My first job was to sort you into four boxes: his idea, and he admits it. |
| 02 Listen to the page, 7 Aug | Brief | Keep booking reachable. |
|  | Tension | The same four intents appeared on every page, whatever the visitor was reading. |
|  | Decision | Replace the fixed intents with three questions written for each page, and keep Book a call as a constant exit. |
|  | Result | Questions now start from the work the visitor is reading. |
|  | Note | He stopped me asking who you are and had me ask what you were reading. |
| 03 Know where you are, 10 Aug | Brief | Answer generally about Ivan. |
|  | Tension | A question about one page deserves an answer about that page. |
|  | Decision | Pass the current page and intent into Rose's context. |
|  | Result | Answers refer to the case study being read. |
|  | Note | I know which page you're on, not who you are: he drew that line. |
| 04 One dock, 14 Oct | Brief | Several entry points to Rose. |
|  | Tension | A dock competing with the page reads as a sales widget. |
|  | Decision | Keep one dock, discreet at rest and full contrast in use, with questions written for each page. |
|  | Result | Rose stays out of the way until asked. |
|  | Note | I used to sit in the nav bar, where nobody found me, so he moved me. |
| 05 Earn trust, 24 Oct | Brief | Send the conversation with each booking request. |
|  | Tension | A transcript is more than a visitor agreed to share. |
|  | Decision | Booking opens the calendar and nothing else. |
|  | Result | Contact is an optional outcome, not the goal of every answer. (the page's one "not X" contrast) |
|  | Note | When you book, I send nothing, not even this conversation: his call. |

Vignettes keep their v1 contents. The five notes are the validated provisional versions, unchanged.

## Chapter 06: Answer formats

The chapter stays at a product manager's level: the architecture loses its file and tool names, and the map of relations becomes the single source shared by the site, Rose and the MCP.

| Element | v2 copy |
|---|---|
| Kicker | 06 · Answer formats (Design). TOC: 06 Answer formats |
| Heading | Answers that point into the page |
| Intro | Rose knows the page, the section in view and the passages I marked. She answers in the dock, in the format the question needs: a passage to jump to, plainer words, a link to other work or a diagram. |
| Influence | The passage questions extend co-existence.ai's idea of an agent that comments on the page it lives on. |
| Diagram caption | How Rose works. Solid lines are built; dashed lines are design. |
| Diagram, the loop (variant B, canvas board F, 13 Nov; component `HowRoseWorks`, after the demo) | Two rules, the centre, five steps clockwise. Rule 1, Tested before every release: Each change runs on fixed questions. A critical failure blocks it. Rule 2, Questions kept 90 days: Contact details are masked before they are stored. Centre, The site's text (in the list layout: At the centre: The site's text): Case studies, Field Notes, CV. The same text AI agents read through the MCP server. 01 You read a page: The section in view and the passages Ivan marked travel with your question. 02 You ask in the dock: In your words, or with a starter question written for that page. 03 Rose reads the site: A language model, under rules Ivan wrote: answer from the pages, cite them. 04 She answers with sources: With follow-up questions, and the booking line on a profile question. Two dashed tags, Next: relations and Next: diagrams (step 04 only). 05 A source opens the passage: Highlighted, with a way back to where you were. Step 05 is filled with the highlight colour of the "passage cited" mark. Under 1000px of room the figure becomes a list in reading order (rules, centre, steps 01 to 05; the tags align left). The board's intro sentence and its note under the ring are not page copy. |
| Marked passage | Pass the current page and intent into Rose's context, so answers refer to the case study being read. Decision of 10 Aug 2026. |
| Questions | Locate: Where did he decide this? Reformulate: Say it more simply. Connect: How does this relate to his other work? Sketch: Draw how it works. |
| Under the questions | None. The four questions are non-clickable examples (decided 4 Nov): three of the four formats are in design, so live Rose could not answer them in that format. |
| Answer formats (new component) | Each of the four questions shows its answer format with a marker: Reformulate (Built), Locate, Connect and Sketch (Design). |
| Answer, Locate | Ivan made this call on 10 August, in chapter 03, Know where you are. Button: Locate, show me. |
| Answer, Reformulate | When you ask me something, I also receive the page you are on, so I answer about what you are reading rather than about Ivan in general. |
| Answer, Connect | Two links, each with the reason Ivan wrote for it: the evaluation page, which shows how every change to me is tested, and the Field Note whose method that evaluation applies. |
| Answer, Sketch | Page, then section in view, then marked passage, then answer. |
| Map caption | What Rose can relate. I write this map by hand, and each link carries a one-line reason. |
| Under the map | Rose links the site's content, not the projects' code. A dashed line marks an indirect link. |
| Map, the component (13 Nov; `RelationsMap`, after the loop) | Read from `src/content/portfolio-graph.json`, the nine rows of "Relations, decided 3 Nov" below, with Compass as a standalone node. Over 720px of room: a drawing (nodes, solid lines, dashed lines for the indirect links) above the list. Under it: the list alone. The list is the reading order: from, link, to, then the reason. Edges that share a link, a target and a reason are one row (Aetherix, Tacet, Anima, part of, built, Orchestrator). Peritia's link reads "part of, design" and is drawn solid, as the table marks only three dashed lines. |
| In use | Hidden below 33 conversations, as in v1. |

### Relations, decided 3 Nov

One source, portfolio-graph.json, read by the case studies index (projects only), chapter 06 (Rose and her sources) and the MCP tool get_relations. Every reason is already stated on a published page. Rose → /agents is dropped: it is infrastructure, already shown in the How Rose works diagram.

| From | Link | To | Reason | Source |
|---|---|---|---|---|
| Rose | answers from | Every page | Rose answers from the page you are on first, then from the rest of the site. | Chapter 06 |
| Rose | how she is tested | Evaluation | The evaluation page shows how every change to Rose is tested before it reaches visitors. | Validated |
| Evaluation | uses the method of | Field Notes (evaluation harness) | The campaign applies the harness and grading method this Field Note describes. | Validated |
| Aetherix, Tacet, Anima | part of, built | Orchestrator | One of the agents of the Hospitality Multi-Agent Architecture. Every exchange goes through the orchestrator, over MCP. | architecture.md |
| Peritia | part of, design | Orchestrator | The trade agent, named in the contract, with no code yet. Links to /architecture. | architecture.md |
| Tacet | direct, until the orchestrator exists (dashed) | Aetherix | Until the orchestrator is built, Tacet's output reaches Aetherix directly: non-personal, read-only, logged. | architecture.md, tacet.md |
| Sonor | inspired (dashed) | Tacet | Tacet carries Sonor's acoustic thesis forward, as an environmental twin for boutique hotels. | sonor.md |
| Lore | same thesis (dashed) | Aetherix | The same thesis, one industry over: a manager who leaves and a technician who retires take the same knowledge with them. Lore stays a standalone project. | lore.md |
| Compass | none |  | Standalone project. | MCP instructions |

## Chapter 07: Trust

The two contracts keep their validated wording. The intro's chiasmus and the maxim heading of the answer rule are rewritten.

| Element | v2 copy |
|---|---|
| Kicker | 07 · Trust (Built) |
| Heading | Trust has two separate contracts. |
| Intro | One contract covers data: what is kept and what is sent. The other covers knowledge: what Rose may assert or infer. I keep them apart so that a privacy promise is never read as proof of accuracy. |
| Data, title | What is kept and sent |
| Data, items | Unchanged and validated: the conversation sentence, the storage and masking sentences, and "Booking opens the calendar and nothing else. No transcript travels with it." |
| Data, sources | Retention and masking: mask-pii.ts and the purge migration (links as built) |
| Knowledge, title | What Rose may assert or infer |
| Knowledge, item 1 (Built) | Rose answers from the same Markdown pages the MCP server reads, with one or two links to them. |
| Knowledge, item 2 (Built) | Rose keeps each project's delivery status: she never turns planned into done, or sandbox into production. |
| Knowledge, item 3 (Validation) | Released on 24 Oct after 15 synthetic cases. Since 29 Oct, each change is tested with 5 samples per case and 20 per high-risk case. ("tested" links to the evaluation page once it exists) |
| Answer rule, heading | A true answer can still be useless |
| Answer rule, intro | She answers the decision first, states the limit of the evidence, and gives implementation detail only when asked. |
| Example question | Is Aetherix in production? |
| Source-correct answer | "Aetherix is staged on Fly.io and connected to the Apaleo sandbox." Note: It is true and cited, but the reader still has to work out what it means. |
| Useful answer | "No. It was built and evaluated on historical data, staged against a sandbox, and is ready for a 30-day pilot." Note: It uses the same sources and answers the decision behind the question. |
| Caption | From Rose's answer contract: "A verifiable fact unrelated to the question is still a poor answer." (validated) |

## Chapter 08: What she got wrong

The three cases and the validated changes stay. One fragment goes, and the cost of an answer is added after case 2, because it follows from the same decision.

| Element | v2 copy |
|---|---|
| Kicker | 08 · What she got wrong (Validation) |
| Heading | Caught in testing |
| Intro | Many of Rose's rules started as a mistake caught in testing, before any visitor saw it. Here are three, from synthetic test runs in October. |
| Cases 1 to 3 | One table, one sentence per cell (validated 3 Nov, below). Dates and result links as on the live page. The Cost block follows the table. How a case is judged becomes the highlighted part, with the test loop diagram from the evaluation document. |
| Rose note, case 2 | Asked about myself on my own page, I talked about Aetherix, so he gave me less to read. (validated) |
| Cost (new, after case 2) | Loading only what the question needs also made answers cheaper: a typical answer costs about 0.015 Lovable credits, less than half the cost of one that loads a full Field Note. Nearly all of the cost comes from what Rose reads. |
| Cost source | Lovable AI gateway logs, the 20 most recent calls, 2 Nov 2026; costs stated in credits, because the Lite plan's price per credit is not published. |
| How a case is judged | Unchanged and validated: the intro, the grading sentence, the campaign line, Verdict, Critical and Limit. |
| Link | Read the full evaluation (to the evaluation page once it exists, the GitHub record until then) |
| Sources | Unchanged. |

Chapter 08 cases, validated 3 Nov:

| She said | What I changed | Result |
|---|---|---|
| Named a Sonor team member who does not exist. | She may name only Ivan and names written in the sources. | No invented names in the final run. |
| Asked about herself, she answered with Aetherix figures. | She loads only what the question needs. | The 29 Oct rerun passed 9 of 10. |
| Invented precise error rates for Aetherix. | Two checked answers for high-precision questions; every other figure carries its model, metric and scope. | On 29 Oct, 15 open-ended answers kept every figure with its model and scope. |

## Chapter 09: Next steps

The heading loses its "not just", the map item loses its maxim, and one sentence says where the pattern transfers.

| Element | v2 copy |
|---|---|
| Kicker | 09 · Next steps (Design) |
| Heading | Next: help readers move across the whole site |
| Intro | The direction is a contextual assistant for the whole site. Rose would locate passages, rephrase them and show how pages relate, while keeping the original sources and their limits. Today she answers in text only. |
| Item 1 | An automatic map of the whole site. Today I write the map by hand, and it grows only when I can state the reason for each link. |
| Item 2 | Diagrams for the complex parts. A visual rewording of a dense passage, drawn from a fixed set of diagrams I checked. |
| Item 3 | Answers read aloud. A spoken version of a written answer, for readers who prefer to listen; the written answer stays the reference. |
| Item 4 | Context for any passage. Relating what you read to the rest of the page and the site, beyond the passages I marked. |
| Where it transfers (new) | The same pattern fits any site where readers bring their own questions to dense pages, such as product documentation, onboarding guides and B2B offer pages. |

## Chapter 10: Open questions

Your four questions and their reasoning stay. Only the heading and two fragments change, and a reply link is added, shown below; every other line is your validated text.

| Element | v1 | v2 |
|---|---|---|
| Heading | Questions I am leaving open, rather than calling them features. | Four questions that have yet to be answered. Have an answer to one of them? Tell me. |
| 02 Measure, cost of being wrong | Flattering numbers that hide how narrow the real use is. | The numbers would flatter Rose and hide how narrow her real use is. |
| 04 Modality, cost of being wrong | A demonstrative feature, without use, to maintain. | I would maintain a feature that nobody uses. |
| Reply link, under each question | None | Reply by email: a mailto link with the subject prefilled as "Open question 01" to "Open question 04". No form, nothing stored on the site. The Contact section follows unchanged. |

Kept as written: "An invented critique costs more credibility than no critique at all." It reads like a maxim, but it is the actual argument of question 03.

## Close and contact

The contact block is one shared component, written once in site.ts and used on the homepage and here. Its copy follows the homepage hero chosen on 3 Nov: "Product manager and co-founder, at home on the hospitality floor. Now I build AI services for operations." The Ask Rose block above it stays specific to this page.

| Element | v2 copy |
|---|---|
| Ask block | Label: Ask Rose. Link: What has Ivan actually built? Line: Start with the evidence. A human conversation is available when it adds context Rose cannot. |
| Contact kicker | Contact |
| Heading | I design, build and evaluate AI services for operations. |
| Subline | Open to AI Product Manager and Product Builder roles. |
| Buttons | Book a call · Email Ivan · Ask your AI |
