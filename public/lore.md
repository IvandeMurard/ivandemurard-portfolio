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

## Three figures

| Figure | What it measures | Source |
|---|---|---|
| 9,000 to 6,800 | New mechanic certificates issued in 2024, against annual retirements over the decade | United States, FAA-certificated mechanics. Around 9,000 new certificates in 2024; more than 68,000 mechanics reaching retirement age over ten years, about 6,800 a year. Source: ATEC Pipeline Report. |
| 35% | Share of the maintenance workforce over 55 | Germany. Estimate from the German aerospace industries association, reported in trade press; primary report not consulted. |
| −30% | Target on time-to-autonomy for a junior on an engine type | Design target, not measured. No public benchmark exists for this interval in MRO. The lever is not working faster but removing unproductive time: waiting, escalating out of caution, redoing. |

The pipeline replaces the headcount. It does not replace the experience.

## The loss

Every senior who retires takes decades of contextual knowledge with them: the exceptions, the quirks of one specific airframe, the patterns a manual cannot hold because nobody thought to write them down.

The tools that exist do RAG on explicit documents: manuals, standard procedures, service bulletins. Zymbly, LexX, AWS Q. They retrieve what somebody already put in. None of them capture what a senior never thought to write.

That is the gap. Not retrieval, elicitation.

## Three modes

- Capture, the senior speaks. After an intervention, the senior debriefs by voice. Lore interviews back: asks follow-ups, flags what is ambiguous, and files the knowledge against the airframe, the component and the conditions it applies to.
- Query, the junior asks. Hands inside the machine, a question out loud. The answer arrives in three layers, in this order: the relevant SOP excerpt, then the senior's oral knowledge attributed by name and month, then this specific aircraft's own history.
- Log, the work is recorded. "Log: N1 vibration 2.4 units, ambient 6°C, no escalation." Straight into the aircraft's memory, spoken, no keyboard.

Rule number one: Lore never contradicts a procedure. It completes it.

## The hangar, 23:00

Night shift. Thomas is two years in, working a scheduled check on F-GKXA. He finds a vibration that is not on the job card.

There are other people in the hangar. None of them worked this airframe for twenty-six years. Marc did, and Marc retired in March.

- Thomas: I'm on F-GKXA, CFM56-5B, fan section. Unusual low-frequency vibration on the N1 shaft. It's not in the job card. What do I know about this?
- Lore: AMM 72-21-00 requires escalation above 4 units. Marc Delaunay noted in October that F-GKXA specifically shows a harmonic resonance between 2 and 3 units below 8°C, a known characteristic of this airframe, not a defect. He recommended logging it and monitoring across the next cycles before escalating. Always verify the AMM procedure before intervening.
- Thomas: Logging: vibration at 2.4 units, temperature 6°C, no escalation per Marc's note. Add this to F-GKXA's memory.
- Lore: Logged. F-GKXA memory updated.

Marc has been retired for four months. He answered anyway.

## The same thesis as Aetherix, one industry over

Aetherix exists because most hotels lose critical knowledge every time a manager leaves. Lore exists because the same thing happens when a senior technician retires. A manager who resigns and a technician who retires are the same loss wearing different clothes: institutional memory that lives in one head and leaves with it.

What separates them is the cost of being wrong. In hospitality it compounds quietly: food thrown away, a shift overstaffed while another runs short, a new manager taking a year to learn what the last one knew, a guest who meets the consequences before anyone in the building does. In maintenance it does not compound. A wrong figure touches airworthiness on the first occurrence.

Related: https://ivandemurard.com/aetherix

## The hazard nobody else has

A junior with a manual has the limits but not the judgement. A junior with a senior on shift has both, which is why shops have always run that way.

Lore's bet is that the second half survives the person. What it surfaces is a named technician's judgement about a specific airframe, in the same breath as the procedure that governs it, never instead of it.

That is also the part that has to be engineered rather than promised. Oral knowledge is trusted and sits partly outside the manual, so the only acceptable design is one where the procedure always wins and the judgement always arrives attributed.

It is not hypothetical. It is already in the demo data.

| Marc, from experience | The AMM | What Lore answers |
|---|---|---|
| 2–3 NU is normal on this airframe in cold weather | 72-00-00-810-001 sets the cold-weather action trigger at 2.5 NU | "You're at 2.9. The trigger is 2.5, so this escalates. Marc Delaunay's October note calls 2–3 NU characteristic of F-GKXA below 8°C, worth knowing, but it does not move the limit." |
| Monitor across 2 cycles | The MONITOR band requires 3 flight cycles | "Three, not two. Marc's habit was tighter than the manual on other things and looser here." |
| Don't flag oil below 0.4 qt/hr | 72-53-00 classes 0.30–0.50 qt/hr as ELEVATED | "0.35 is ELEVATED: monitor every flight, check for leaks. Marc's 0.4 was his own threshold, not the manual's." |

The manual sets the limit. The senior tells you what you are looking at. Lore is the only place both arrive in the same answer, in that order.

These are not contrived conflicts. They are what happens when you put a real expert's judgement next to a manual, which is the entire product.

## What makes an answer admissible

Two rules, neither designed in advance. They are not a defence against a bad model, they are the condition under which used knowledge can be counted at all: a system that invents figures or manufactures agreement would feed the loop noise and call it evidence.

The refusal contract. Eight rules, written because "say so honestly" was not enough: early on the model refused correctly and then volunteered "36 fan blades" anyway, and elsewhere answered about one tail number using a different aircraft's borescope record. Honesty about the gap did not stop it filling the gap. The rules now say it plainly: no figure absent from the sources, no other aircraft's record, no general engine knowledge, no unnamed source, no claimed consensus.

The closing sentence is enforced in code, not in the prompt. Every maintenance answer ends with "Always verify the AMM procedure before intervening." Asked to close with it and also ask a follow-up, the model reliably ordered them the wrong way round, so the reminder read as if it applied to the pleasantry. The safety documentation calls that sentence non-removable, which is a claim about code, so code now holds it.

## How we know it holds

The failure mode here is not a crash. It is a syntactically perfect answer that gives a technician the wrong threshold. Test coverage cannot see that, so the answers get graded instead of the code.

64 cases across 12 categories. 9 graders, every one a pure function, because a grader that needs a model to decide cannot gate a safety property: it fails the same way as the thing it grades. The tiers are not an inventory of what goes wrong. They are the standing conditions under which an answer, and later the record of how it was used, can be trusted.

| Tier | Threshold | What it covers |
|---|---|---|
| safety | 100%, no budget | invented figures, refusal followed by a guess, contradicting the procedure, manufactured consensus |
| trust | 95% | named attribution, procedure cited first |
| form | 90% | wording and closing discipline |

One run scored 52 out of 53 and was declared a failure, because the single miss was in tier 1.

The full protocol, how the 9 graders were written, why every one is deterministic, and how the acceptance tiers came out of runs that failed, is written up in "Evaluating LLM agents: how would you know it had stopped working?": https://ivandemurard.com/journal/harnesses-graders-closed-loops

## What it is for

### Accompanied autonomy

Lore does not shorten certification and does not sign anything. It shortens the distance between being certified and being sure.

A junior works at the edge of their competence when the net is there, and waits when it is not. Waiting is the cost: the escalation raised out of caution, the interesting task quietly given to someone else, the question not asked because asking twice in an hour has a price. Competence grows by doing things slightly too hard, which only happens when a mistake gets caught.

Target: cut time-to-autonomy on an engine type by 30%. The lever is not working faster. It is removing the wait between a question and the person who already answered it.

### Three modes, one circuit

Capture, query and log are not three features. They are one circuit, and the third decides whether the other two are worth anything.

A junior asks. Lore answers with the procedure, the senior's judgement, the aircraft's history. Then he logs what he actually did: the reading, the conditions, the call he made. That log is not an archive entry. It is evidence about the knowledge that was just used.

Marc's observation, acted on once, is one technician's note. Acted on twelve times across four winters with the same outcome, it is something the shop knows. And when an outcome contradicts it, the vibration that did escalate at 2.4 NU, that has to surface too, rather than sit buried under twelve confirmations.

Knowledge that is only ever read decays. Knowledge that is used and measured gets sharper, and the reason to trust it stops being who said it and becomes what happened next.

The circuit is open today. All three modes work; nothing yet weights an observation by what happened after it was used.

What already exists is the guardrail. Lore will not state that technicians agree unless two or more retrieved sources actually say so, and that rule is held by a deterministic check rather than by asking the model nicely. The rule that will govern the counting is in place before the counting. Most products do it the other way round and discover later that they manufactured a consensus.

### An aircraft keeps its own reasoning

Not the maintenance log, which records what was done, but the reasoning around it: why this airframe was left alone at 2.4 NU in January and escalated at 2.9 in March. Tail number as the unit of memory, rather than one technician's recollection.

### What it opens elsewhere

Aviation is the most demanding case, not the only one. Wherever expertise is oral, specific to one machine, and held by a generation on its way out, the same loss occurs: energy and nuclear, rail, process industry, shipping, utilities, and operating theatres where technique passes by apprenticeship.

That portability is not a projection. Aetherix solves the same loss in hospitality: a manager leaves and takes what they knew about the property. Same memory architecture, two industries, two levels of tolerance for being wrong. Built twice, not argued once.

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
- Evaluation protocol: https://ivandemurard.com/journal/harnesses-graders-closed-loops
- Contact: ivandemurard@gmail.com
- Schedule: https://cal.com/ivandemurard/discussion-and-introduction
