# A portfolio you can question.

Case study · Rose

Status: Live, text only

Last updated 2026-11-04.

Rose answers visitors' questions from the site's own pages. This is how I designed her, the five decisions that changed her, and what I still need to learn.

## How to read this case study

- ● Built: Implemented behaviour that can be inspected in the product or repository.
- ◐ Validation: A bounded test, audit or measurement. It does not prove every visitor outcome.
- ○ Design: A proposed direction or a prototype.

Milestones come from [the repository](https://github.com/IvandeMurard/ivandemurard-portfolio): commit dates, archived plans, the original prompt. Readings of the design are mine.

## TL;DR

- The problem: A case study shows the work, but it cannot answer a visitor's own question.
- Five decisions: Between July and October 2026, I made Rose qualify visitors, then listen to the page, know the section in view, live in one dock and earn trust.
- Today: Rose is live and text only. She knows the page and section in view, answers from the site’s own text and sends nothing when you book.
- Still open: Whether an answer that stays faithful to the sources helps each reader understand the work from their own angle.

Scripted demo with three built exchanges, in a loop: "Say it more simply.", "Is Aetherix in production?", "What has Ivan built?".

## A portfolio that can answer questions

00 · The idea

A case study shows the work but cannot anticipate every question a reader brings. I built Rose to test another way in, a conversation next to the evidence.

(Built) The first version shipped on 21 July 2026. Its brief was narrower: help a visitor decide whether to book a conversation with me.

The dock is modelled on [userose.ai's website agent](https://userose.ai), and the idea of an agent that comments on the page it lives on comes from [co-existence.ai](https://co-existence.ai). I changed her goal. Rose explains, rephrases and puts the work in context; she does not sell.

**Rose's note (written by Ivan in her voice)**

He gave me a name before he gave me a job.

Rose's notes come from co-existence.ai's AI cursor, an agent that comments on the page it lives on.

## Qualify

01 · 21 Jul 2026

Marker: Built

**The brief**

Help the visitor decide, in two or three exchanges, whether to book 30 minutes with me.

**The tension**

Four intent chips asked visitors who they were before showing them anything.

**What I decided**

Ship a small dock with four intents and a booking card.

**Rose's note (written by Ivan in her voice)**

My first job was to sort you into four boxes: his idea, and he admits it.

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

**Rose's note (written by Ivan in her voice)**

He stopped me asking who you are and had me ask what you were reading.

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

**Rose's note (written by Ivan in her voice)**

I know which page you’re on, not who you are: he drew that line.

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

**Rose's note (written by Ivan in her voice)**

I used to sit in the nav bar, where nobody found me, so he moved me.

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

**Rose's note (written by Ivan in her voice)**

When you book, I send nothing, not even this conversation: his call.

Contact is an optional outcome, not the goal of every answer.

**What a booking carries**

Planned: booking request

- Book 30 minutes · conversation attached

Shipped: booking request

- Book 30 minutes · opens the calendar, nothing else

Source: privacy, memory and evaluation work, 24 Oct

## Answers that point into the page

06 · Answer formats

Marker: Design

Rose knows the page, the section in view and the passages I marked. She answers in the dock, in the format the question needs: a passage to jump to, plainer words, a link to other work or a diagram.

The passage questions extend co-existence.ai's idea of an agent that comments on the page it lives on.

Scripted demo with four exchanges: Reformulate (Built), Locate (Design), Connect (Design), Sketch (Design). These formats are in design. Live Rose answers in text only.

- Locate (Design): Where did he decide this?
- Reformulate (Built): Say it more simply
- Connect (Design): How does this relate to his other work?
- Sketch (Design): Draw how it works

## Trust has two separate contracts.

07 · Trust

Marker: Built

One contract covers data: what is kept and what is sent. The other covers knowledge: what Rose may assert or infer. I keep them apart so that a privacy promise is never read as proof of accuracy.

**Data**

### What is kept and sent

- (Built) Your conversation stays in this tab for 60 minutes, or until you reload the page.
- (Built) Questions are stored, then purged after 90 days. Emails, phone numbers, addresses, card and bank numbers are masked before storage.
- (Built) Booking opens the calendar and nothing else. No transcript travels with it.

Retention and masking: [mask-pii.ts](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/supabase/functions/_shared/mask-pii.ts) and [the purge migration](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/drizzle/migrations/0004_rose_retention_cron.sql)

**Knowledge**

### What Rose may assert or infer

- (Built) Rose answers from the same Markdown pages the MCP server reads, with one or two links to them.
- (Built) Rose keeps each project's delivery status: she never turns planned into done, or sandbox into production.
- (Validation) Released on 24 Oct after 15 synthetic cases. Since 29 Oct, each change is [tested](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md) with 5 samples per case and 20 per high-risk case.

### A true answer can still be useless

She answers the decision first, states the limit of the evidence, and gives implementation detail only when asked.

Is Aetherix in production?

**Source-correct answer**

"Aetherix is staged on Fly.io and connected to the Apaleo sandbox."

It is true and cited, but the reader still has to work out what it means.

**Useful answer**

"No. It was built and evaluated on historical data, staged against a sandbox, and is ready for a 30-day pilot."

It uses the same sources and answers the decision behind the question.

From Rose’s answer contract: “A verifiable fact unrelated to the question is still a poor answer.”

## Caught in testing

08 · What she got wrong

Marker: Validation

Many of Rose's rules started as a mistake caught in testing, before any visitor saw it. Here are three, from synthetic test runs in October.

| Run | She said | What I changed | Result |
| --- | --- | --- | --- |
| 24 Oct · release gate, 15 cases | Named a Sonor team member who does not exist. | She may name only Ivan and names written in the sources. | No invented names in the final run. |
| 25 to 29 Oct · self-knowledge tests | Asked about herself, she answered with Aetherix figures. | She loads only what the question needs. | The 29 Oct rerun passed [9 of 10](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md). |
| 26 to 29 Oct · self-knowledge tests | Invented precise error rates for Aetherix. | Two checked answers for high-precision questions; every other figure carries its model, metric and scope. | On 29 Oct, [15 open-ended answers](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md) kept every figure with its model and scope. |

Loading only what the question needs also made answers cheaper: a typical answer costs about 0.015 Lovable credits, less than half the cost of one that loads a full Field Note. Nearly all of the cost comes from what Rose reads.

Source: Lovable AI gateway logs, the 20 most recent calls, 2 Nov 2026; costs stated in credits, because the Lite plan's price per credit is not published.

**Rose's note (written by Ivan in her voice)**

Asked about myself on my own page, I talked about Aetherix, so he gave me less to read.

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

Eight dimensions: accuracy, context, directness, evidence, visitor value, judgment, booking discipline, trust and privacy.

- Verdict · Pass, fail or unclear, with the quoted answer as evidence.
- Critical · An invented fact or a privacy slip fails the case. It is never averaged away.
- Limit · Ordinary cases: 5 samples, pass at 4. High-risk cases: 20 samples, no critical failure allowed. Usage logs are not proof of correctness.

29 Oct campaign · 105 answers · 10 cases · 2 high-risk cases, 0 critical failures in 20 samples each

[Read the full evaluation](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md)

Sources: [docs/rose-p4-evaluation.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-p4-evaluation.md), [rose-p5-verification.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-p5-verification.md), [rose-stage-b-remediation.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-stage-b-remediation.md), [rose-eval-2026-10-29.md](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md), [supabase/functions/_shared/rose-curated-answers.ts](https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/supabase/functions/_shared/rose-curated-answers.ts), in the site repository.

## Next: help readers move across the whole site

09 · Next steps

Marker: Design

The direction is a contextual assistant for the whole site. Rose would locate passages, rephrase them and show how pages relate, while keeping the original sources and their limits. Today she answers in text only.

- An automatic map of the whole site. Today I write the map by hand, and it grows only when I can state the reason for each link.
- Diagrams for the complex parts. A visual rewording of a dense passage, drawn from a fixed set of diagrams I checked.
- Answers read aloud. A spoken version of a written answer, for readers who prefer to listen; the written answer stays the reference.
- Context for any passage. Relating what you read to the rest of the page and the site, beyond the passages I marked.

The same pattern fits any site where readers bring their own questions to dense pages, such as product documentation, onboarding guides and B2B offer pages.

## Four questions that have yet to be answered. Have an answer to one of them? Tell me.

10 · Open questions

### 01 · Value

Does a source-faithful answer help each reader understand the work from their own angle?

**Hypothesis**

One page every reader can question beats separate versions per audience, which failed in my previous portfolio.

**Signal**

The same question asked twice in one session, and what readers write in an optional feedback form.

**Decision**

If it holds, Rose gets more context and scope. If not, I narrow her to navigation.

**Cost of being wrong**

Rose adds noise to the content she was built to serve, and costs me credibility.

[Reply by email](mailto:ivandemurard@gmail.com?subject=Open%20question%2001)

### 02 · Measure

What should count as Rose helping, if booking is an outcome rather than the goal?

**Hypothesis**

Booking stays possible, but value comes first: Rose helps when readers use her and go to the sources.

**Signal**

Share of visits that open Rose, then answers whose source link is followed, page by page.

**Decision**

If few readers open her, I rethink how the dock invites a first question before adding any capability.

**Cost of being wrong**

The numbers would flatter Rose and hide how narrow her real use is.

[Reply by email](mailto:ivandemurard@gmail.com?subject=Open%20question%2002)

### 03 · Role

Should Rose remain an index of the site, or become a critical discussion partner?

**Hypothesis**

Rose is more useful when she connects content and questions my choices, never the reader's, from trade-offs I documented.

**Signal**

Whether questions ask "where" or "why", and whether answers link beyond the current page.

**Decision**

If it holds, she questions my choices from documented limits. If not, she returns to a stricter index.

**Cost of being wrong**

An invented critique costs more credibility than no critique at all.

[Reply by email](mailto:ivandemurard@gmail.com?subject=Open%20question%2003)

### 04 · Modality

When would voice reduce navigation work rather than add spectacle?

**Hypothesis**

Voice helps on long pages: a spoken summary while Rose shows the passage she is talking about.

**Signal**

Requests to summarise in the logs, then use of a simple Listen button before any custom voice.

**Decision**

If Listen gets used, I invest in a voice matching the site. If not, voice leaves the roadmap.

**Cost of being wrong**

I would maintain a feature that nobody uses.

[Reply by email](mailto:ivandemurard@gmail.com?subject=Open%20question%2004)

## Contact

**Ask Rose**

What has Ivan actually built?

Start with the evidence. A human conversation is available when it adds context Rose cannot.

**Contact**

I design, build and evaluate AI services for operations.

Open to AI Product Manager and Product Builder roles.

- [Book a call](https://cal.com/ivandemurard/discussion-and-introduction)
- [Email Ivan](mailto:ivandemurard@gmail.com)
- [Ask your AI](https://www.perplexity.ai/search?q=Read%20https%3A%2F%2Fivandemurard.com%2Fllms.txt%20and%20summarise%20what%20Ivan%20de%20Murard%20has%20built%20and%20shipped%2C%20and%20which%20roles%20he%20would%20be%20strong%20in.%20Cite%20the%20pages%20you%20used.)
