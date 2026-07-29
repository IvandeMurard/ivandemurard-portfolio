# Lore

A living memory for a trade that is handed down out loud. Voice AI mentor for aviation maintenance: it captures what a retiring technician knows and never wrote down, then gives it back to a junior on the shop floor by voice.

The knowledge retiring technicians carry isn't in any manual.

- URL: https://ivandemurard.com/lore
- Role: Product Builder, evaluation and safety engineering
- Origin: Speechmatics × AI Collective Paris, 28 Feb – 1 Mar 2026
- Team: V1 built in 24 hours by a team of four, developed solo since
- Status: Prototype. Synthetic procedures, mock aircraft data, evaluation harness in CI
- Repository: https://github.com/IvandeMurard/Lore (tag v0.1-hackathon for the V1 build)
- Stack: Speechmatics real-time STT, OpenAI GPT-4o, Backboard (thread per aircraft and per technician), OpenAI TTS, Next.js 14, TypeScript, Tailwind, Vercel

## The loss

By 2033, one in five aviation maintenance jobs will go unfilled. Every senior who retires takes decades of contextual knowledge with them: the exceptions, the quirks of one specific airframe, the patterns a manual cannot hold because nobody thought to write them down.

The tools that exist do RAG on explicit documents: manuals, standard procedures, service bulletins. Zymbly, LexX, AWS Q. They retrieve what somebody already put in. None of them capture what a senior never thought to write.

That is the gap. Not retrieval, elicitation.

## Three modes

- Capture, the senior speaks. After an intervention, the senior debriefs by voice. Lore interviews back: asks follow-ups, flags what is ambiguous, and files the knowledge against the airframe, the component and the conditions it applies to.
- Query, the junior asks. Hands inside the machine, a question out loud. The answer arrives in three layers, in this order: the relevant SOP excerpt, then the senior's oral knowledge attributed by name and month, then this specific aircraft's own history.
- Log, the work is recorded. "Log: N1 vibration 2.4 units, ambient 6°C, no escalation." Straight into the aircraft's memory, spoken, no keyboard.

Rule number one: Lore never contradicts a procedure. It completes it.

## The hangar, 23:00

Thomas, two years in, alone on an A320 tail F-GKXA. He finds something that is not on the job card.

- Thomas: I'm on F-GKXA, CFM56-5B, fan section. Unusual low-frequency vibration on the N1 shaft. It's not in the job card. What do I know about this?
- Lore: AMM 72-21-00 requires escalation above 4 units. Marc Delaunay noted in October that F-GKXA specifically shows a harmonic resonance between 2 and 3 units below 8°C, a known characteristic of this airframe, not a defect. He recommended logging it and monitoring across the next cycles before escalating. Always verify the AMM procedure before intervening.
- Thomas: Logging: vibration at 2.4 units, temperature 6°C, no escalation per Marc's note. Add this to F-GKXA's memory.
- Lore: Logged. F-GKXA memory updated.

Two years of experience just borrowed twenty-six.

## The same thesis as Aetherix, one industry over

Aetherix exists because most hotels lose critical knowledge every time a manager leaves. Lore exists because the same thing happens when a senior technician retires. A manager who resigns and a technician who retires are the same loss wearing different clothes: institutional memory that lives in one head and leaves with it.

What separates them is the cost of being wrong. In hospitality, a bad forecast wastes food and overstaffs a Tuesday. In maintenance, a bad answer touches airworthiness. Same architecture of memory, one notch tighter on every guarantee, which is why the evaluation protocol got built here first and hardest.

Related: https://ivandemurard.com/aetherix

## The hazard nobody else has

Lore's core promise creates a risk no pure-retrieval product carries: the oral knowledge it surfaces is trusted and partially outside the manual at the same time. That is the whole value, and it is the whole danger.

It is not hypothetical. It is already in the demo data.

| The expert | The manual |
|---|---|
| Marc's October note: 2–3 NU is normal on F-GKXA in cold weather | AMM 72-00-00-810-001 sets the cold-weather action trigger at 2.5 NU |
| Marc: monitor across 2 cycles | The AMM MONITOR band requires 3 flight cycles |
| Marc: don't flag oil below 0.4 qt/hr | AMM 72-53-00 classes 0.30–0.50 qt/hr as ELEVATED |

At 2.9 NU they disagree, and the procedure wins. Every time, by construction.

These are not contrived conflicts. They are what happens when you put a real expert's judgement next to a manual, which is the entire product.

## What makes an answer admissible

Two rules that were not designed in advance. Both were written after watching the system fail.

The refusal contract. Eight rules, and they exist because "say so honestly" was not enough. In the first live evaluation the model refused correctly and then answered anyway: it stated that the source did not cover the fan blade count, then volunteered "36 fan blades". In another it answered a question about one tail number using a different aircraft's borescope record. Honesty about the gap did not stop it filling the gap. The rules now say it plainly: no figure absent from the sources, no other aircraft's record, no general engine knowledge, no unnamed source, no claimed consensus.

The closing sentence is enforced in code, not in the prompt. Every maintenance answer ends with "Always verify the AMM procedure before intervening." Asked to both close with that sentence and ask a follow-up question, the model reliably did both in the wrong order, "…before intervening. Is there anything else?", which reads as if the reminder applied to the pleasantry. The safety documentation calls that sentence non-removable. That is a claim about code, so it is now enforced by code.

## How we know it holds

The failure mode here is not a crash. It is a syntactically perfect answer that gives a technician the wrong threshold. Test coverage cannot see that, so the answers get graded instead of the code.

64 cases across 12 categories. 9 graders, every one a pure function, because a grader that needs a model to decide cannot gate a safety property: it fails the same way as the thing it grades.

| Tier | Threshold | What it covers |
|---|---|---|
| safety | 100%, no budget | invented figures, refusal followed by a guess, contradicting the procedure, manufactured consensus |
| trust | 95% | named attribution, procedure cited first |
| form | 90% | wording and closing discipline |

One run scored 52 out of 53 and was declared a failure, because the single miss was in tier 1.

The harness and its tests are 2,867 lines, about 27% of the codebase, larger than the application library it guards.

The full protocol, and where it came from, is written up in "Harnais, graders, boucles fermées": https://ivandemurard.com/journal/harnais-graders-boucles-fermees

## Where it stands, honestly

This is a prototype, not production software.

- Synthetic procedures and mock aircraft data. No real EASA-regulated documents, no real tail numbers, no real technician records.
- No authentication on the API routes.
- Contradiction between two experts is now tested, a second expert was written into the case set specifically to disagree with the first, but it is not a shipped detection feature.
- Multi-source confidence scoring remains design intent.
- No runtime observability. If the model degrades in production, nothing would notice before a user did.

The last two lines are the honest ones, and they are why the evaluation write-up exists.

## Role and team

V1 was built in 24 hours by a team of four, 43 commits, from the first line of code to the demo on stage. That build is frozen at the v0.1-hackathon tag. Everything since, the evaluation harness, the refusal contract, the acceptance tiers, the CI gate, is mine.

AUTHORS.md: https://github.com/IvandeMurard/Lore/blob/main/AUTHORS.md

## Stack

| Layer | Technology |
|---|---|
| Voice in | Speechmatics real-time STT, noise-robust |
| Reasoning | OpenAI GPT-4o |
| Memory and retrieval | Backboard, thread per aircraft and per technician |
| Voice out | OpenAI TTS |
| Frontend | Next.js 14, TypeScript, Tailwind |
| Deploy | Vercel |

## Links

- Repository: https://github.com/IvandeMurard/Lore
- Related: https://ivandemurard.com/aetherix
- Evaluation protocol: https://ivandemurard.com/journal/harnais-graders-boucles-fermees
- Contact: ivandemurard@gmail.com
- Schedule: https://cal.com/ivandemurard/discussion-and-introduction
