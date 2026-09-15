# A wrong forecast is absorbed. A wrong action reaches a guest.

Prophet is a statistical forecasting library. Claude is a large language model. Keeping them as two components, rather than letting one model both predict and act, is the decision that shaped everything after it.

Published 2026-04-20. Source: https://ivandemurard.com/journal/agent-boundaries-aetherix

When you build an operations layer for boutique hotels, the temptation is to let one large model do everything: predict, decide, act. It looks elegant on a slide. One component, one prompt, one place to improve.
I split it in two. Prophet, an open-source forecasting library built for time series with strong seasonality, reads what is about to happen: how many covers tomorrow, with an uncertainty range. Claude, a large language model, decides what to say about it and to whom. Neither does the other's job, and almost every later decision in the system inherits from that line.
## The asymmetry
The line is not drawn where the technology changes. It is drawn where the consequence changes.
A wrong forecast is absorbed. Order too much and there is waste, too little and there is a run to the supplier. It costs money and nobody's evening. A wrong action reaches a guest, a shift roster, someone's Tuesday. The two failures do not deserve the same amount of freedom, and any component that owns both has to decide, silently, which one it is optimising at any given moment.
That is the argument for the boundary, and it is not really about Prophet or Claude. It is about which failures you are willing to let a model resolve on its own.
## Why one model collapses
Give one component both jobs and it arbitrates between them privately. That is the cost, and it is not a performance cost. A node that owns two domains stops being reviewable: when the recommendation is wrong you cannot tell whether the read of the situation was wrong, or the response to a correct read was wrong. There is one output and one prompt, and the trace tells you nothing you did not already know.
Forecasting and acting also want different feedback. Forecast error computes itself: tomorrow's covers are known the day after, so the number arrives whether or not anyone asks for it. Whether a recommendation should have been made at all is a judgement, and the only thing that returns it is a human. One loop is arithmetic, the other is an opinion. A single component blends them and you lose the ability to measure either.
## Where the line landed
Prophet reads the environment: occupancy, F&B demand, staffing pressure. It produces a number and an error bar and nothing else. It never phrases anything, never recommends, never talks to a manager.
Claude orchestrates the response. It takes that read, plus memory of what worked at this property, and composes one message a day. It never predicts. When it is uncertain it says so.
The manager taps accept, modify or reject. That tap is not politeness. It is the recorded output of a decision node.
## What the split buys
Two things I could not have had otherwise.
The forecast becomes measurable on its own terms: MAPE against realised covers, compared to a frozen baseline, in CI, blocking a merge. That number means something precisely because the component producing it does one thing.
And the action becomes accountable. Every accept, modify or reject is an event with the recommendation stored beside it. A rejection is not lost feedback, it is a new evaluation case. Human in the loop by design rather than by default, and the difference is whether the decision leaves a trace.
The seam is also what lets the system be honest about itself. It flagged a corrupted point-of-sale export rather than training on it. It named its own drift after three consecutive misses and recovered from a 25% regime shift through weekly recalibration. Neither is possible when one component owns the whole path, because there is no seam at which to check.
## What it cost
Two systems instead of one, and a contract between them that has to be maintained, versioned and tested. A forecast that is good and not magic: on a real public benchmark Prophet beats a naive same-weekday baseline on mean error, ties it on the median, and loses the median to a gradient-boosted baseline. Both readings are published.
And a limit I have to keep restating. The comparison runs on its own, but the truth it compares against is still declared by a human. That is a closed loop on a declared truth, which is an engineering statement. "Dual autonomous loop" would be a brochure statement.
## What I would have lost
The guarantee. In a single-model design, "never act on a low-confidence forecast" is a sentence in a prompt, which is a request. Requests are not enforced, they are usually honoured. With the boundary in place the rule lives between the components, in code, where it can be checked and where a violation is a failing test rather than a disappointing output.
A claim about behaviour has to be held by something other than a prompt. The boundary is where I put it.
