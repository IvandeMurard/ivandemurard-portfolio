# Rose response-level feedback, draft specification (not implemented)

Status: design hypothesis only. No feedback capture, submission endpoint or persistence has been implemented or approved. The earlier "after two completed answers" trigger was an exploratory guess and is **not** an accepted rule.

## Purpose

Learn whether a specific, completed answer helped a visitor understand the work, find evidence or formulate a useful next question. Do not treat conversation length or follow-up frequency as a success or failure proxy.

## Visitor experience

- The invitation is associated with an **actual Rose answer**, not a detached case-study survey or simulated response.
- Suggested optional assessment: **Yes / Partly / Not yet**, with an optional explanation relevant to the selected answer.
- A visitor may decline or dismiss without penalty. Nothing is submitted or inferred from dismissal.
- Feedback must remain unobtrusive and must not impede reading, navigation or the conversation.
- If any proactive prompt is introduced, the conditions, frequency, accessibility and timing require separate usability review. No fixed answer-count trigger is authorized.
- Never interpret "Yes" as necessarily meaning productive curiosity, or "Not yet" as necessarily indicating sales intent. The visitor's actual feedback and context determine the interpretation.
- Human contact remains an independent, visitor-led option under Rose's existing booking policy; a negative rating is not a booking signal.

## Data and privacy gate, before building

- Explicit submission is required; no submission on mere selection, dismissal or page navigation.
- Define and approve the minimal data contract first: answer/request correlation, assessment, optional comment and only strictly justified metadata. Do not collect full transcripts by default.
- Specify whether any selected answer text is needed; prefer identifiers where practical and do not silently attach prompts or transcripts.
- Document consent/legal basis, access authorization, pseudonymity, masking limitations, retention and deletion behavior. An application rule not to store IP addresses does not establish what providers or network infrastructure process.
- Keep feedback separate from existing click and operational telemetry unless a documented, reviewed purpose and join policy justify otherwise.
- Ensure the submission path, access policy, abuse controls and privacy notice are reviewed before activation.

## Learning and evaluation

- Review qualitative explanations instead of optimizing solely for positive ratings.
- Distinguish factual mistakes, missing evidence, unclear explanation, useful follow-up curiosity and expectations that are outside Rose's current capabilities.
- Record changes and re-evaluate under a defined protocol before claiming improvement.
- Any resulting visitor value claims require sufficient actual research or feedback evidence. Synthetic tests alone cannot establish value.

## Dependencies

1. Approved, grounded Rose historical reference and conversational identity.
2. Verified existing dock interaction and answer-level identifiers.
3. Privacy and data-handling design approval.
4. Accessible UI prototype, followed by controlled verification.
5. Explicit deployment approval.

This document describes a future product-learning mechanism; it must never be represented as a working capability in the historical reference or live assistant.
