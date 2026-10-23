# A wrong forecast is absorbed. A wrong action reaches a guest.

Prophet is a statistical forecasting library. Claude is a large language model. Keeping them as two components, rather than letting one model both predict and act, is the decision that shaped everything after it.

Agentic AI · 2026-04-20

**Read this if** you are deciding how much one model should be allowed to do on its own. **What it gives you**: a rule for where to draw the line (the cost of an error, not the technology), and the trade-offs it brings. **Tested on**: Aetherix, an F&B agent for hotels, built and tested on synthetic and public data. No hotel connected yet.

What you will decide differently:
- **Draw the line where the consequence changes.** A wrong forecast is absorbed; a wrong action reaches a guest.
- **Five jobs, five owners.** Forecast, recommendation, enforcement, approval and outcome are separate, and each is checked differently.
- **A rule in a prompt is a request.** A rule between components is code, and a violation is a failing test.
- **The split has a price.** Two systems, one contract to maintain, and a forecast that is good, not magic.

The boundary is where a claim about behaviour gets held by something other than a prompt.

Prophet is a statistical forecasting library. Claude is a large language model. Keeping them as two components, rather than letting one model both predict and act, is the decision that shaped everything after it.

When you build an operations layer for boutique hotels, the temptation is to let one large model do everything: predict, decide, act. It looks elegant on a slide. One component, one prompt, one place to improve.

I split it in two. Prophet, an open-source forecasting library built for time series with strong seasonality, reads what is about to happen: how many covers tomorrow, with an uncertainty range. Claude, a large language model, decides what to say about it and to whom. Neither does the other's job, and almost every later decision in the system inherits from that line.

## The asymmetry

The line is not drawn where the technology changes. It is drawn where the consequence changes.

A wrong forecast is absorbed. Order too much and there is waste, too little and there is a run to the supplier. It costs money and nobody's evening. A wrong action reaches a guest, a shift roster, someone's Tuesday. The two failures do not deserve the same amount of freedom, and any component that owns both has to decide, silently, which one it is optimising at any given moment.

That is the argument for the boundary, and it is not really about Prophet or Claude. It is about which failures you are willing to let a model resolve on its own.

## Why one model collapses

Give one component both jobs and it arbitrates between them privately. That is the cost, and it is not a performance cost. A node that owns two domains stops being reviewable: when the recommendation is wrong you cannot tell whether the read of the situation was wrong, or the response to a correct read was wrong. There is one output and one prompt, and the trace tells you nothing you did not already know.

Forecasting and acting also want different feedback. Forecast error computes itself: tomorrow's covers are known the day after, so the number arrives whether or not anyone asks for it. Whether a recommendation should have been made at all is a judgement, and the only thing that returns it is a human. One loop is arithmetic, the other is an opinion. A single component blends them and you lose the ability to measure either. Why a manager's approval and the next day's covers are different signals, and which one a system may learn from, is [the ground-truth note](https://ivandemurard.com/journal/whose-truth-is-the-ground-truth).

## Where the line landed

Prophet reads the environment: occupancy, F&B demand, staffing pressure. It produces a number and an error bar and nothing else. It never phrases anything, never recommends, never talks to a manager.

Claude orchestrates the response. It takes that read, plus memory of what worked at this property, and composes one message a day. It never predicts. When it is uncertain it says so.

The manager replies accept, reject, or the right figure. That reply is not politeness. It is the recorded output of a decision node.

| Job | Owner | What it produces | How it is checked | Evidence today |
| --- | --- | --- | --- | --- |
| Statistical forecasting | Prophet | a number and an uncertainty range | error against a frozen baseline | synthetic series in CI; public benchmark |
| Recommendation | Claude | one message a day, uncertainty stated | graders on the reply parser | stand-in parser; model not yet measured |
| Deterministic enforcement | code between the two | a refusal to act on an implausible or low-confidence input | a test that fails on violation | exercised in a simulated 30-day scenario |
| Human approval | the F&B manager | accept, reject or the right figure | recorded as an event | sandbox data; free text not yet mapped |
| Measured outcome | the till, next day | real covers | forecast error computes itself | not yet: needs a connected hotel |

## What the split buys

Two things I could not have had otherwise.

The forecast becomes measurable on its own terms: MAPE compared to a frozen baseline, in CI, blocking a merge. Today that series is synthetic; against realised covers, it starts with the pilot. That number means something precisely because the component producing it does one thing. The gate and its baseline can be inspected in [the public Aetherix repository](https://github.com/IvandeMurard/aetherix-hospitality-ai); the code shows the check exists, not that it works on a real hotel.

And the action becomes accountable. Every recorded accept, reject or correction is an event with the recommendation stored beside it. Today that means an exact accept or reject, or a figure: a free-text reply is not yet mapped to a decision, a gap an audit found in September 2026. A rejection is not lost feedback, it is a new evaluation case. Human in the loop by design rather than by default, and the difference is whether the decision leaves a trace.

The seam is also what lets the system be honest about itself. In a simulated 30-day scenario, it rejected an implausible point-of-sale figure, injected as a test, rather than training on it. After a simulated 25% jump in demand, weekly recalibration cut its forecast error from 15.9% to 12.3%. Neither is possible when one component owns the whole path, because there is no seam at which to check.

## What it cost

Two systems instead of one, and a contract between them that has to be maintained, versioned and tested. A forecast that is good and not magic: on a public benchmark of 30 restaurants (Kaggle Recruit data), Prophet beats a naive same-weekday baseline on mean error, ties it on the median, and loses the median to a gradient-boosted baseline. Both readings are published. The forecast runs in shadow mode: no manager decision has been delivered on it yet.

And a limit I have to keep restating. The comparison runs on its own, but the truth it compares against is still declared by a human. That is a closed loop on a declared truth, which is an engineering statement. "Dual autonomous loop" would be a brochure statement.

## What I would have lost

The guarantee. In a single-model design, "never act on a low-confidence forecast" is a sentence in a prompt, which is a request. Requests are not enforced, they are usually honoured. With the boundary in place the rule lives between the components, in code, where it can be checked and where a violation is a failing test rather than a disappointing output. How such a test is written, graded and allowed to block a release is the subject of [the evaluation note](https://ivandemurard.com/journal/harnesses-graders-closed-loops).

A claim about behaviour has to be held by something other than a prompt. The boundary is where I put it.

**Working on an AI system where a wrong action has real consequences?**
I work on AI product architecture, evaluation and human-agent collaboration, with a focus on measurable, bounded and accountable systems.
[Discuss an AI product or architecture challenge](https://ivandemurard.com/contact)

## Continue exploring

- Read the method: [What is an LLM evaluation harness?](https://ivandemurard.com/journal/harnesses-graders-closed-loops) - How a boundary held in code is tested, graded and allowed to block a release.
- Read the method: [Whose truth is the ground truth?](https://ivandemurard.com/journal/whose-truth-is-the-ground-truth) - Why the manager's reply and the next day's covers are different feedback.
- Inspect implementation evidence: [Aetherix case study](https://ivandemurard.com/aetherix) - The system this decision shaped, its status and what is still to be validated.

## Updates

This piece is revised when something it claims stops being true. Each revision says what changed and why.

2026-10-23 · Linked the two companion notes and the public repository where the text makes a claim they explain or evidence. Readers arriving here had no path to how the boundary is tested, or to why approval and outcome are different signals.
2026-10-23 · Added a reading card, a table separating the five jobs in the loop, and the scope of the public benchmark. The note argued for one boundary but blended five things a reader needs to tell apart: forecasting, recommendation, enforcement in code, human approval and measured outcome. The benchmark sentence now says what it ran on (30 restaurants, Kaggle Recruit data) and that no manager decision has been delivered on the forecast yet, as the repository states.
2026-10-12 · Corrected the drift example. The 'three consecutive misses' alert was narration in the demo script, not a production mechanism, and the post-shift error was reduced, not fully recovered.
2026-09-24 · Corrected what the note said about recorded replies, the CI forecast baseline and the drift example. An audit of the Aetherix repository found that only an exact "accept" or "reject", or a corrected figure, records a decision; that the forecast baseline in CI is computed on a synthetic series, not on realised covers; and that the corrupted export and the regime shift come from a simulated 30-day scenario. The note had said more than that.

Source: https://ivandemurard.com/journal/agent-boundaries-aetherix
