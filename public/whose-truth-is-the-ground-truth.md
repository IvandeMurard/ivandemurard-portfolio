# Whose truth is the ground truth?

An AI product is only as honest as the answer it learns from. Choosing that answer is a product decision, made before the data arrives.

Product · 2026-10-11 · 6 min read

**Read this if** you own an AI product that recommends, decides or acts. **What it gives you**: name the truth each step returns, who holds it, when, how it can be gamed, and what it is worth. **Tested on**: two products, one that gets a fact back the next day, one that never does. Gaps stated.

What you will decide differently:
- **"Truth" is plural.** Documented, declared, observed, counterfactual: each has an owner, a delay and a way to fool you.
- **A recommendation is a claim.** Nobody knows it was right when it is sent.
- **A "yes" is not a "right".** Optimise acceptance and the product learns to say what is easy to approve.
- **Some truth never comes back.** The plan not taken. The signed record in a hangar.
- **Truth is an asset.** Inside, it is memory that does not leave with the manager. Outside, it is the only basis for pricing on results.
- **Write the verdict before the data.** Aetherix's thresholds are public and frozen. None of its four tests has run yet.

A forecast is a claim. A manager's "yes" is a preference. Real covers are a fact, the next day. The plan you did not choose is never seen. Which of these your product learns from decides what it becomes, and what it is worth.

**Figure.** One recommendation travels through four stations; at each, a different truth comes back, or none.

FIG | What comes back at each station, who holds it, and when

| Line | Station | Kind of truth | What it is | When |
|---|---|---|---|---|
| Aetherix | Before release | Documented | known answers in the case set | before release |
| Aetherix | Recommendation sent | None yet | a forecast is a claim | not a truth |
| Aetherix | Manager replies | Declared | the manager’s reply | same day |
| Aetherix | Next day | Observed | real covers | next day |
| Aetherix | Other staffing (never reached) | Counterfactual | another plan’s outcome | never |
| Lore | Before release | Documented | the procedure (AMM) | wins any conflict |
| Lore | Answer given | Enforced | checked against the band table | at answer time |
| Lore | Technician acts | Not captured | what the technician did | - |
| Lore | Work signed (never reached) | Realized | the signed work record | never returns |

Lamps in this layer: green, a truth you can rely on comes back; amber, a declared truth (a preference); none lit, nothing comes back.

| Line | Station | Kind of truth | What it is | When |
| --- | --- | --- | --- | --- |
| Aetherix | Before release | Documented | known answers in the case set | before release |
| Aetherix | Recommendation sent | None yet | a forecast is a claim | not a truth |
| Aetherix | Manager replies | Declared | the manager's reply | same day |
| Aetherix | Next day | Observed | real covers | next day |
| Aetherix | Other staffing (never reached) | Counterfactual | another plan's outcome | never |
| Lore | Before release | Documented | the procedure (AMM) | wins any conflict |
| Lore | Answer given | Enforced | checked against the band table | at answer time |
| Lore | Technician acts | Not captured | what the technician did | - |
| Lore | Work signed (never reached) | Realized | the signed work record | never returns |

Why is a manager's reply not the truth?
What is the counterfactual problem in staffing?

## 1. What "truth" means here

**SEC. 1** Truth is the answer a product is judged by, or learns from. In a live product there are several, and they disagree. Concrete case: One Aetherix recommendation receives three different answers in two days.

| Kind | Definition | Held by | Arrives | How it fools you |
| --- | --- | --- | --- | --- |
| Documented | what is written as correct before anything happens: a procedure, a case set | regulator, team | before | only as right as the document |
| Declared | what a person says about the output: accept, modify, ignore | the user | same day | measures agreement, not correctness |
| Observed | what actually happened, measured | the till, the system | later | says what happened, not what should have |
| Counterfactual | what the option not taken would have produced | nobody | never | can be modelled, never seen |

- **Not interchangeable.** Learn from declared truth and the product learns to please. Learn only from documented truth and it learns to recite.
- **The product decision:** which truth counts at which step, and which one the system may learn from without a human.

## 2. A Tuesday, station by station

**SEC. 2** Abstract truths become concrete on one ordinary service. Concrete case: An illustrative breakfast. The figures are invented, in the format of Aetherix's daily message.

| When | What happens | Truth | What it tells you | What it does not |
| --- | --- | --- | --- | --- |
| Monday evening | Aetherix: 84 covers, 4 front-of-house staff | none yet | the claim | whether it is right |
| Monday evening | The manager replies "3 is enough" | declared: modified | the manager disagrees on staffing | who was right |
| Tuesday morning | 79 covers are served | observed | the forecast was 6% high | whether 3 staff was enough |
| Never | Tuesday with 4 staff | counterfactual | - | whether the service lost anything |

- **The forecast gets a clean answer:** 6% high. It can be learned from.
- **The staffing gets no clean answer.** Service went fine with 3? Nobody measured it. The disagreement is recorded, not settled.
- **What a product can still do:** price the two mistakes. Short-staffing and over-staffing do not cost the same, so a recommendation can say which way it leans and why. Status: Synthetic PoC, nothing measured on real data.

Who was right on Tuesday?
Why can the forecast learn and the staffing not?

## 3. A "yes" is not a "right"

**SEC. 3** The easiest number to collect is the easiest to game. Concrete case: Acceptance rate.

- **The trap (Goodhart's law):** when a measure becomes a target, it stops measuring. A product optimised on acceptance learns to send recommendations that cost nothing to approve.
- **An approval rate is agreement, not correctness.** A manager can accept a wrong forecast and reject a right one. Only the observed outcome says which.
- **From Aetherix's public benchmark (30 restaurants, Kaggle Recruit data):** the forecast beats "the last four same weekdays" by 0.6 points on the typical day. A product that simply repeated last Tuesday would be accepted often and teach nothing.
- **The counterweight:** read acceptance with **manager minutes per accepted recommendation**. Watch *ignored* hardest: an override engages, an ignore routes around.

## 4. The truth that never comes back

**SEC. 4** Some answers are structurally missing. Concrete case: Lore, in aviation maintenance.

- **The signed work record never returns** to the product.
- **Its truth is a hierarchy of authority:** the procedure wins any conflict, by rule. Where the procedure is silent, the product abstains.
- **The cost:** effort moves before release. Close to a third of Lore's code is its evaluation harness, because nothing downstream will correct it.

| Question | Aetherix (answer returns) | Lore (answer never returns) |
| --- | --- | --- |
| What is the reference? | real covers, next day | the procedure, by rule |
| Who arbitrates a conflict? | the observed outcome | the manual, then abstention |
| Where does the effort go? | the outcome loop | the pre-release harness |
| What may it learn alone? | a calibrated forecast, once measured | nothing; a human certifies |

## 5. What truth is worth to a business

**SEC. 5** Recorded truth is an asset, and so is the discipline of not overstating it. Concrete case: Aetherix's choice to price on results.

|  | Use | Needs | Status in Aetherix |
| --- | --- | --- | --- |
| Inside | A record of recommendation, reply and outcome: memory that does not leave with the manager | observed truth, captured every day | record Built on sandbox data |
| Inside | Calibration: when the product says 80%, it is right 80% of the time | observed truth over time | Synthetic PoC |
| Outside | Pricing on results | an observed truth both sides accept | stated strategy, no client yet |
| Outside | Proof for a buyer, a partner, a marketplace | outcomes measured against a rule fixed in advance | protocol published, tests not run |
| Outside | Patterns shared across hotels | anonymised outcomes from many properties | Research |

- **Pricing on results is impossible without an agreed truth.** Declared truth will not do: the payer would be the judge.
- **Certify the method now, the truth later.** Before outcomes exist, a product can prove how it measures: replayable cases, abstention, no contradiction. Proof of value needs the outcome loop.
- **Ownership is a contract question.** Who owns a hotel's outcome history, and what may leave the property, is decided before the first pilot, not after.

Why does pricing on results need an agreed truth?
What can be certified before any outcome exists?

## 6. Write the verdict before the data

**SEC. 6** Choosing the measure after seeing the result is how products flatter themselves. Concrete case: Aetherix's proof protocol, frozen before any of its tests ran.

| Link | Question | Pass | Fail | Today |
| --- | --- | --- | --- | --- |
| Model | Beats "the last four same weekdays"? | gap ≥ 5 points | gap < 2 points | DARK, not started |
| Decision | Would it change a real decision? | ≥ 3 of 5 managers | ≤ 1 of 5 | DARK, not started |
| Adoption | Do managers act on it? | ≥ 30% acceptance | < 30% | DARK, needs a pilot |
| Economics | Margin on the cost of service? | ≥ 70% at 10 properties | < 70% | WARN, passes on estimates |

- **A fail is published.** On the model or decision link it triggers a written pivot note within five working days.
- **Honest scale:** the earlier public benchmark gap was 0.6 points. Not covered by the protocol; it would sit in the fail band.

## 7. Checklist

- Name, for each step, the truth that comes back, who holds it and when.
- Decide which truth the product may learn from without a human.
- Never read acceptance alone.
- Settle who owns the outcome history before the first pilot.
- Freeze pass and fail thresholds before the first result. Publish the fails.

## 8. FAQ

### Isn't the user always right?

About what they want, yes. Whether the product was correct is answered later, by something else.

### What if the truth never comes back?

Then the product does not learn on its own there. A rule arbitrates, a human certifies, effort moves before release.

### Can a company sell its verified know-how?

It can prove its method today. It can only sell results once outcomes are measured against a rule both sides accepted in advance.

## 9. Sources

- [Proof protocol](https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/PROOF_PROTOCOL.md)
- [VISION.md](https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/VISION.md)
- [What is an LLM evaluation harness?](/journal/harnesses-graders-closed-loops) (this note expands its arm C)
- [Aetherix](/aetherix)
- [Lore](/lore)

## Updates

This piece is revised when something it claims stops being true. Each revision says what changed and why.

2026-10-23 · Stated in section 3 that an approval rate measures agreement, not correctness, and said what the 0.6-point figure was measured on. The figure comes from a public benchmark of 30 restaurants, not from a hotel's own data; the note called it Aetherix's own data.

Licence: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). 

Source: https://ivandemurard.com/journal/whose-truth-is-the-ground-truth
