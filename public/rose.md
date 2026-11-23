# A portfolio you can question.

Case study · Rose

Status: Live, voice in pilot

Last updated 2026-11-23.

Rose answers visitors' questions from the site's own pages. This is how I designed her, the six decisions that changed her, and what I still need to learn.

## How to read this case study

- ● Built: Implemented behaviour that can be inspected in the product or repository.
- ◐ Validation: A bounded test, audit or measurement. It does not prove every visitor outcome.
- ○ Design: A proposed direction or a prototype.

Milestones come from [the repository](https://github.com/IvandeMurard/ivandemurard-portfolio): commit dates, archived plans, the original prompt. Readings of the design are mine.

## TL;DR

- The problem: A case study shows the work, but it cannot answer a visitor's own question.
- Six decisions: Between July and November 2026, I made Rose qualify visitors, then listen to the page, know the section in view, live in one dock, earn trust and read aloud.
- Today: Rose is live. She answers in text and, in pilot, reads three page summaries and her factual answers aloud. She sends nothing when you book.
- Still open: Whether an answer that stays faithful to the sources helps each reader understand the work from their own angle.

Scripted demo with three built exchanges, in a loop: "Say it more simply.", "Is Aetherix in production?", "What has Ivan built?".

## Listen summary

Recorded summary, written by Ivan in Rose's voice, validated 21 Nov 2026 · 1 min 14

Most case studies describe their subject. This one is introduced by it. Hi, I'm Rose, Ivan's contextual agent, and this case study is, well, about me. I started as a funnel with a simple idea: I asked who you were, and I led you to book a call. Then Ivan changed my job: now I explain his work, rephrase it, and put it in context. To do that, I know the page and the section you're reading, I answer from the site's own text, I link the passage I used, and I quote every project's status exactly as published. I went through a lot of testing, so now I only name what the pages name. Oh, and this recording is new: it's a summary of the case study, written by Ivan in my voice. What comes next is still on the drawing board. Ivan is designing me to take you straight to the passage that answers you, to show how one project connects to another, and to sketch a diagram when a page gets too dense or technical. The same idea could serve any documentation where readers bring their own questions. One more thing: when you book a call, the calendar opens but the conversation stays here. So the question is yours: what would you ask me? I am right below.

## A portfolio that can answer questions

00 · The idea

A case study shows the work but cannot anticipate every question a reader brings. I built Rose to test another way in, a conversation next to the evidence.

(Built) The first version shipped on 21 July 2026. Its brief was narrower: help a visitor decide whether to book a conversation with me.

The dock is modelled on [userose.ai's website agent](https://userose.ai), and the idea of an agent that comments on the page it lives on comes from [co-existence.ai](https://co-existence.ai). I changed her goal. Rose explains, rephrases and puts the work in context; she does not sell.

Her name comes from the compass rose: the star drawn on the charts that navigators steered by, from the Middle Ages to the Renaissance. They crossed uncertain seas toward lands no one had mapped, read the horizon, and chose one heading among all the possible ones. That is her job here: give you a heading through work you have not explored yet.

## Qualify

01 · 21 Jul 2026

Marker: Built

**The brief**

Help the visitor decide, in two or three exchanges, whether to book 30 minutes with me.

**The tension**

Four intent chips asked visitors who they were before showing them anything.

**What I decided**

Ship a small dock with four intents and a booking card.

Rose worked as a qualification funnel with one destination.

**The trade-off**

A funnel makes bookings easy to count, but it treats every visitor as a lead. On a portfolio, that costs more trust than the bookings are worth.

**The site before Rose, and her first dock**

Before: every page · before 21 Jul

- No dock. The case studies are the only way in.

July: every page · 21 Jul

- Product expertise
- Technical profile
- Culture fit
- Just exploring
- Book 30 minutes · the one destination

Source: original prompt and config, commit 51245fc

## Listen to the page

02 · 7 Aug 2026

Marker: Built

**The brief**

Keep booking reachable.

**The tension**

The same four intents appeared on every page, whatever the visitor was reading.

**What I decided**

Replace the fixed intents with three questions written for each page, and keep Book a call as a constant exit.

Questions now start from the work the visitor is reading.

**Dock starters on /aetherix**

July: /aetherix · 21 Jul

- Product expertise
- Technical profile
- Culture fit
- Just exploring

August: /aetherix · after 7 Aug

- What has actually been built?
- What happens when it’s wrong?
- Book a call

Source: archived plan, contextual starters, 7 Aug

## Know where you are

03 · 10 Aug 2026

Marker: Built

**The brief**

Answer generally about Ivan.

**The tension**

A question about one page deserves an answer about that page.

**What I decided**

Pass the current page and intent into Rose’s context.

Answers refer to the case study being read.

**What Rose receives with a question**

Before: context: none

- "What does he measure?"
- An answer about Ivan in general.

After: context: /aetherix · section in view

- "What does he measure?"
- An answer about the case study being read.

Source: commit b236ff3, page context and intent

## One dock

04 · 14 Oct 2026

Marker: Built

**The brief**

Several entry points to Rose.

**The tension**

A dock competing with the page reads as a sales widget.

**What I decided**

Keep one dock, discreet at rest and full contrast in use, with questions written for each page.

Rose stays out of the way until asked.

**Where Rose lives**

Before: nav bar + dock

- "Ask Rose" in the nav bar, plus a dock competing with the page.

After: bottom of every page

- One dock. Discreet at rest, full contrast in use.

Source: commit 7752dbb, unified dock and chips

## Earn trust

05 · 24 Oct 2026

Marker: Built

**The brief**

Send the conversation with each booking request.

**The tension**

A transcript is more than a visitor agreed to share.

**What I decided**

Booking opens the calendar and nothing else.

Contact is an optional outcome, not the goal of every answer.

**What a booking carries**

Planned: booking request

- Book 30 minutes · conversation attached

Shipped: booking request

- Book 30 minutes · opens the calendar, nothing else

Source: privacy, memory and evaluation work, 24 Oct

## Read aloud

06 · 21 Nov 2026

Marker: Built (pilot)

**The brief**

Let readers listen to the work, on the move or away from the screen.

**The tension**

A voice on a public site is an open door: anyone could use it as free speech synthesis on my account. And a dry line that works in writing can sound wrong once a synthetic voice says it.

**What I decided**

Rose reads three page summaries I wrote and validated, recorded once, and her own factual answers. The server reads only an answer Rose really gave in this conversation, in the last hour. The written answer stays on screen, and each word lights up as she says it.

**The trade-off**

A summary costs once and plays for free. Each new answer read aloud costs a little, within a daily cap; past it, your device's voice takes over. Light answers stay silent.

**What a reader gets**

Before: text only

- Text only.

After: Listen, in pilot

- Listen to a summary of this page
- A Listen button under factual answers, with the spoken word highlighted.

The summary and the page come from the same text. Why that matters for every reader of a site: [What is agent experience (AX)?](https://ivandemurard.com/journal/one-text-three-readers)

Source: pull requests #76, #77 and #78

## Answers that point into the page

07 · Answer formats

Marker: Design

Rose knows the page, the section in view and the passages I marked. She answers in the dock, in the format the question needs: a passage to jump to, plainer words, a link to other work or a diagram.

The passage questions extend co-existence.ai's idea of an agent that comments on the page it lives on.

Scripted demo with four exchanges: Reformulate (Built), Locate (Design), Connect (Design), Sketch (Design). These formats are in design. Live Rose answers in text, and reads aloud in pilot.

- Locate (Design): Where did he decide this?
- Reformulate (Built): Say it more simply
- Connect (Design): How does this relate to his other work?
- Sketch (Design): Draw how it works

**Tested before every release**

Each change runs on fixed questions. A critical failure blocks it.

**Questions kept 90 days**

Contact details are masked before they are stored.

**The site's text**

Case studies, Field Notes, CV. The same text AI agents read through the MCP server.

1. **You read a page**  
   The section in view and the passages Ivan marked travel with your question.
2. **You ask in the dock**  
   In your words, or with a starter question written for that page.
3. **Rose reads the site**  
   A language model, under rules Ivan wrote: answer from the pages, cite them.
4. **She answers with sources**  
   With follow-up questions, and the booking line on a profile question.
   Next: relations
   Next: diagrams
5. **A source opens the passage**  
   Highlighted, with a way back to where you were.

How Rose works. Solid lines are built; dashed lines are design.

- Rose answers from Every page
  Rose answers from the page you are on first, then from the rest of the site.
- Rose how she is tested [Evaluation](https://ivandemurard.com/rose#ch-08)
  Caught in testing shows how every change to Rose is tested before it reaches visitors.
- [Evaluation](https://ivandemurard.com/rose#ch-08) uses the method of [Field Notes (evaluation harness)](https://ivandemurard.com/journal/harnesses-graders-closed-loops)
  The campaign applies the harness and grading method this Field Note describes.
- [Aetherix](https://ivandemurard.com/aetherix), [Tacet](https://ivandemurard.com/tacet), [Anima](https://ivandemurard.com/anima) part of, built [Orchestrator](https://ivandemurard.com/architecture)
  One of the agents of the Hospitality Multi-Agent Architecture. Every exchange goes over MCP; going through the orchestrator is the target (Design).
- [Peritia](https://ivandemurard.com/architecture) part of, design [Orchestrator](https://ivandemurard.com/architecture)
  The trade agent, named in the contract, with no code yet. Links to /architecture.
- [Tacet](https://ivandemurard.com/tacet) direct, while the orchestrator is not the way through [Aetherix](https://ivandemurard.com/aetherix)
  While the orchestrator is not the way through, Tacet's output reaches Aetherix directly: non-personal, read-only, logged.
- [Sonor](https://ivandemurard.com/sonor) inspired [Tacet](https://ivandemurard.com/tacet)
  Tacet carries Sonor's acoustic thesis forward, as an environmental twin for boutique hotels.
- [Lore](https://ivandemurard.com/lore) same thesis [Aetherix](https://ivandemurard.com/aetherix)
  The same thesis, one industry over: a manager who leaves and a technician who retires take the same knowledge with them. Lore stays a standalone project.
- Rose how she reads the site [Field Notes (agent experience)](https://ivandemurard.com/journal/one-text-three-readers)
  This Field Note shows how one source serves Rose, visitors and outside agents, each in the form they need.
- [Compass](https://ivandemurard.com/compass)
  Standalone project.

What Rose can relate. I write these links by hand, and each carries a one-line reason.

Rose links what the site's pages say about each project. A dashed label marks an indirect link.

## Trust has two separate contracts.

08 · Trust

Marker: Built

One contract covers data: what is kept and what is sent. The other covers knowledge: what Rose may assert or infer. I keep them apart so that a privacy promise is never read as proof of accuracy.

**Data**

### What is kept and sent

- (Built) Your conversation stays in this tab for 60 minutes, or until you reload the page.
- (Built) Questions are stored, then purged after 90 days. Emails, phone numbers, addresses, card and bank numbers are masked before storage.
- (Built) Booking opens the calendar and nothing else. No transcript travels with it.
- (Built) Listen sends Rose's answer, with contact details masked, to ElevenLabs, which keeps it under its standard retention. Page summaries are recorded once and served as files.

Retention and masking: [mask-pii.ts](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/supabase/functions/_shared/mask-pii.ts) and [the purge migration](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/drizzle/migrations/0004_rose_retention_cron.sql)

**Knowledge**

### What Rose may assert or infer

- (Built) Rose answers from the same Markdown pages the MCP server reads, with one or two links to them. [What is agent experience (AX)?](https://ivandemurard.com/journal/one-text-three-readers)
- (Built) Rose keeps each project's delivery status: she never turns planned into done, or sandbox into production.
- (Validation) Released on 24 Oct after 15 synthetic cases. Since 29 Oct, each change is [tested](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md) with 5 samples per case and 20 per high-risk case.

### A true answer can still be useless

She answers the decision first, states the limit of the evidence, and gives implementation detail only when asked.

Is Aetherix in production?

**Source-correct answer**

"Aetherix is staged on Fly.io and connected to the Apaleo sandbox."

It is true and cited, but the reader still has to work out what it means.

**Useful answer**

"No. It was built and tested on the Apaleo sandbox and on public restaurant data, and is being made pilot-ready. No hotel yet."

It uses the same sources and answers the decision behind the question.

From Rose’s answer contract: “A verifiable fact unrelated to the question is still a poor answer.”

## Caught in testing

09 · What she got wrong

Marker: Validation

Many of Rose's rules started as a mistake caught in testing, before any visitor saw it. Here are three, from synthetic test runs in October.

| Run | She said | What I changed | Result |
| --- | --- | --- | --- |
| 24 Oct · release gate, 15 cases | Named a Sonor team member who does not exist. | She may name only Ivan and names written in the sources. | No invented names in the final run. |
| 25 to 29 Oct · self-knowledge tests | Asked about herself, she answered with Aetherix figures. | She loads only what the question needs. | The 29 Oct rerun passed [9 of 10](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md). |
| 26 to 29 Oct · self-knowledge tests | Invented precise error rates for Aetherix. | Two checked answers for high-precision questions; every other figure carries its model, metric and scope. | On 29 Oct, [15 open-ended answers](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md) kept every figure with its model and scope. |

Loading only what the question needs also made answers cheaper: a typical answer costs about 0.015 Lovable credits, less than half the cost of one that loads a full Field Note. Nearly all of the cost comes from what Rose reads.

Source: Lovable AI gateway logs, the 20 most recent calls, 2 Nov 2026; costs stated in credits, because the Lite plan's price per credit is not published.

### How a case is judged

Each synthetic question is written before the run, with the behaviour it requires and the failure that would block release. Answers are graded with AI assistance against the published sources, then reviewed by me.

1. Write cases before the run
2. Run 5 or 20 samples
3. Automatic checks: tests, unsourced figures
4. Grade every answer against the sources
5. Pass? If not, back to 2
6. Deploy with my approval
7. Live check on the site

A failed grade goes back to step 2 with one bounded change. A new failure in the live check becomes a new case.

Eight dimensions

- Accuracy
- Context
- Directness
- Evidence
- Visitor value
- Judgment
- Booking discipline
- Trust and privacy

- Verdict · Pass, fail or unclear, with the quoted answer as evidence.
- Critical · An invented fact or a privacy slip fails the case. It is never averaged away.
- Limit · Ordinary cases: 5 samples, pass at 4. High-risk cases: 20 samples, no critical failure allowed. Usage logs are not proof of correctness.

29 Oct campaign · 105 answers · 10 cases · 2 high-risk cases, 0 critical failures in 20 samples each

[Read the full evaluation](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md)

Sources: [docs/rose-p4-evaluation.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-p4-evaluation.md), [rose-p5-verification.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-p5-verification.md), [rose-stage-b-remediation.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-stage-b-remediation.md), [rose-eval-2026-10-29.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md), [supabase/functions/_shared/rose-curated-answers.ts](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/supabase/functions/_shared/rose-curated-answers.ts), in the site repository.

## Next: help readers move across the whole site

10 · Next steps

Marker: Design

The direction is a contextual assistant for the whole site. Rose would locate passages, rephrase them and show how pages relate, while keeping the original sources and their limits. Today she answers in text and, in pilot, reads aloud.

- An automatic map of the whole site. Today I write the map by hand, and it grows only when I can state the reason for each link.
- Diagrams for the complex parts. A visual rewording of a dense passage, drawn from a fixed set of diagrams I checked.
- More pages to listen to. More pages get a recorded summary, if readers use the first three.
- Context for any passage. Relating what you read to the rest of the page and the site, beyond the passages I marked.

The same pattern fits any site where readers bring their own questions to dense pages, such as product documentation, onboarding guides and B2B offer pages.

## Frequently asked questions

11 · FAQ

### What does Rose answer from?

Rose answers from the same Markdown pages the MCP server reads, with one or two links to them.

### What can Rose do today?

Rose is live. She answers in text and, in pilot, reads three page summaries and her factual answers aloud. She sends nothing when you book.

### Is my conversation kept?

Your conversation stays in this tab for 60 minutes, or until you reload the page. Questions are stored, then purged after 90 days. Emails, phone numbers, addresses, card and bank numbers are masked before storage.

### What happens when I book a call?

Booking opens the calendar and nothing else. No transcript travels with it.

### Can Rose overstate a project?

Rose keeps each project's delivery status: she never turns planned into done, or sandbox into production.

### What is still unproven?

Whether an answer that stays faithful to the sources helps each reader understand the work from their own angle.

## Contact

**Ask Rose**

What has Ivan actually built?

Start with the evidence. A human conversation is available when it adds context Rose cannot.

**Contact**

I design, build and evaluate AI services for operations.

Open to AI Product Manager and Product Builder roles.

- [Book a call](https://cal.com/ivandemurard/discussion-and-introduction)
- [Email Ivan](mailto:ivandemurard@gmail.com)
- Ask your AI
- [Perplexity](https://www.perplexity.ai/search?q=Read%20https%3A%2F%2Fivandemurard.com%2Fllms.txt%20and%20summarise%20what%20Ivan%20de%20Murard%20has%20built%20and%20shipped%2C%20and%20which%20roles%20he%20would%20be%20strong%20in.%20Cite%20the%20pages%20you%20used.)
- [ChatGPT](https://chatgpt.com/?q=Read%20https%3A%2F%2Fivandemurard.com%2Fllms.txt%20and%20summarise%20what%20Ivan%20de%20Murard%20has%20built%20and%20shipped%2C%20and%20which%20roles%20he%20would%20be%20strong%20in.%20Cite%20the%20pages%20you%20used.)
- [Claude](https://claude.ai/new?q=Read%20https%3A%2F%2Fivandemurard.com%2Fllms.txt%20and%20summarise%20what%20Ivan%20de%20Murard%20has%20built%20and%20shipped%2C%20and%20which%20roles%20he%20would%20be%20strong%20in.%20Cite%20the%20pages%20you%20used.)
- Copy the prompt
