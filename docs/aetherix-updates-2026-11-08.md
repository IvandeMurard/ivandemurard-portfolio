# Aetherix updates for the portfolio: brief for Claude Design

Status: brief, not a decision. Date: 8 Nov 2026. Language: English, like the site.
Source of truth for every fact below: the Aetherix repository (public), merged on `main`. This file proposes. Ivan approves each change.

## 0. How to read this, and what to produce

**Audience.** Claude Design first, then Lovable and Claude Code once a plan is approved.

**Produce.** An action plan in the usual plan format (Goal, Current state verified, What will change, Mirrors and corpus, Verification, Untouched), split into approval checkpoints, to be added to the work in progress. Do not build. Do not publish. Do not deploy. Do not interrupt the Field Note on the recommendation line (plan of 8 Oct 2026): this is a separate stream.

**Rules of the project that apply (from the project knowledge, `AGENTS.md`, `CLAUDE.md` and `docs/style.md`).**
- Never invent metrics, clients, pilots, dates or capabilities. Use only what the repository states.
- Keep every status as published. Never upgrade one. Planned is not done, sandbox is not production.
- One fact, one wording, everywhere. Project statuses live in `src/content/statuses.ts`. When a fact changes, update every surface (page, Markdown mirror, CV, `llms.txt`, `llms-full.txt`, `/agents`, MCP answers, pre-rendered pages, Rose's prompt and curated answers) and list any remaining old wording.
- No em-dashes. Apply the banned patterns of `docs/style.md` §2 (colon reveals, maxims, theatrical fragments, mood words).
- A figure never appears alone: always with its comparison and what it means.
- If something is ambiguous, ask before building. If two sources contradict each other, stop and list the conflicts.
- Never edit generated files (`supabase/functions/mcp/index.ts`, `src/content/agents.generated.ts`, `public/` outputs). A red freshness test means Lovable must regenerate the bundle: report it.
- Changes to Rose's curated answers and to the MCP function are imported only with explicit deployment authorization.

**Three workstreams.** A is small and can start now. B and C are conditional and must not start before their trigger.

## 1. What changed in the Aetherix repository

"Built" in the Aetherix repository means merged on `main` and covered by tests. It does not mean deployed or used. The site must never turn it into "in production".

| # | Fact | Where it is stated (Aetherix repository) | Label | Public wording allowed |
|---|---|---|---|---|
| 1 | The pilot is two weeks to a first written decision (stop, revise, continue), then four weeks if the hotel continues, with a written review at week four | `docs/pilot/onboarding-kit.md`, `docs/planning/phase-3-pilot-validation.md` (gate A1 amended), PR #318, merged 8 Nov 2026 | Decision, written in the pilot kit | "Ready for a pilot of two weeks to a first decision, four weeks if the hotel continues." |
| 2 | Why: the four weeks were the builder's evidence need (the Phase 3 exit criterion), not the hotel's decision need. Two weeks show whether the manager reads, answers and corrects. They do not show forecast accuracy, which needs at least 300 scored points from the hotel's own history | same files; `docs/planning/protocole-de-preuve.md` §4.1 | Decision | May be told as a design decision |
| 3 | A one-page pilot brief exists, and a typed form of it (`docs/pilot/pilot-brief.schema.json`) that a hotel's own agent can read and draft. It admits only the lowest authority level (the system recommends, a human validates), a read-only PMS, and decision points filled by a human only. No agent has used it | `docs/pilot/pilot-brief.schema.json`, `docs/mcp/getting-started.md` (section "Onboarding a hotel through its own agent"), PR #318 | **Design** | "Design. No agent has used it." |
| 4 | 45 numbered architecture decisions | `CLAUDE.md`, decision table, rows 1 to 45 | Count | "45 so far" |
| 5 | A forecast model, own or third party, is admitted only through the same evaluation gate as language models. No second forecast model has passed it | `docs/context/decisions-architecturales.md`, Decision 35, D6, PR #317 | **Design** | Only with the word Design |
| 6 | A read-only "feasibility query" is designed: can the F&B service honour a request of this class, for N covers, at a given time, and until when can it adapt. Nothing is built | `docs/context/fnb-feasibility-query-brief.md`, `docs/context/open-decisions.md`, PR #319 | **Design** | "A read-only feasibility query is designed for the Orchestrator (Design)." |
| 7 | A manager can ask for a forecast in WhatsApp. It runs on a staging system with a fictional hotel, with zero real users | `public-status.yml` (entry "Forecast on request over WhatsApp"), PR #316 | Built, live on staging only | Ivan decides (see A5) |
| 8 | A manager's free-text reply is read as a stance on the proposal, and an uncertain reading is confirmed before anything is recorded. Tested on 52 hand-written cases on one pinned model. Not measured on real replies | `public-status.yml` (entries "Decision capture with confirmation" and "Reply-reading eval on a pinned model") | Built, not live in any hotel | Ivan decides (see A4) |

Still true and unchanged: no hotel connected, no design partner signed, status "Pilot-ready" (do not change the word).

## 2. Workstream A: align the Aetherix case study (start here)

### A1. Pilot duration (safe, no status change)
- **Current wording**, verbatim, from `src/content/statuses.ts` (`aetherix.note`): "Ready for a 30-day pilot."
- **Proposed**: "Ready for a pilot of two weeks to a first decision, four weeks if the hotel continues."
- **Single source**: `src/content/statuses.ts`. Everything else must be derived from it or aligned with it.
- **Surfaces where the old wording was found on the published site on 8 Nov 2026**: `aetherix.md` (the status line and the table, 2 hits), `architecture.md` (2 hits), `llms.txt` (1 hit), `llms-full.txt` (more than 15 matching lines, including "staged for a 30-day pilot" and "ready for a 30-day pilot"). Also check: `src/content/site.ts`, the home page Aetherix blurb, the MCP tool summaries (`src/lib/mcp`), Rose's persona, history and curated answers, `src/content/cv.ts`, `scripts/seo-routes.ts`, the pre-rendered pages.
- **Method**: a repo-wide search for "30-day", "30 day", "thirty" and "four weeks" across `src`, `public`, `scripts`, `supabase`, `docs`. List every hit and every one left unchanged, with the reason.

### A2. A sixth strategy decision (Sec. 03 of the case study)
The table under "Five decisions follow from that." gets a sixth row, and the lead-in becomes "Six decisions follow from that."

| # | Decision | Why |
|---|---|---|
| 6 | A pilot of two weeks, then four if the hotel continues | I first asked for four weeks because I needed the evidence. The hotel needs less to decide. Two weeks show whether the manager reads, answers and corrects. They do not show forecast accuracy, which is read on the hotel's own history. |

The wording avoids the "X, not Y" reflex on purpose (one per page at most). Check the page count before reusing it.

### A3. Number of decisions
- **Current**: "inside the decisions I set for them (34 so far)" (Sec. 07, `aetherix.md`, and every mirror carrying it).
- **Proposed**: "(45 so far)". Source: the decision table in the Aetherix `CLAUDE.md`.

### A4. Free-text replies (needs Ivan's explicit approval)
- **Current**: "Free-text replies are not used yet. Whether the agent gets sharper over time is what a pilot would test."
- **Why it needs approval**: the repository now says free-text replies are read and an uncertain reading is confirmed before recording. Changing "not used" into "built and tested" corrects an understatement, but the site rule is never to upgrade a status without approval.
- **Proposed, if approved**: "Free-text replies are read, and an uncertain reading is confirmed with the manager before anything is recorded. This is built and tested on hand-written cases, not on real replies. Whether the agent gets sharper over time is what a pilot would test."
- Do not add the 52-case figure unless it comes with its comparison and its meaning.

### A5. Forecast on request in WhatsApp (not proposed, for Ivan to decide)
The case study says "Running daily on sandbox data". The repository now also records a forecast on request, on a staging system with a fictional hotel. Candidate wording, only if Ivan approves: "A manager can ask for a day's covers in WhatsApp. This runs on a staging system with a fictional hotel." Do not write it otherwise.

### A6. One sentence on the agent-readable pilot brief
In Sec. 08, "Built to be trusted", one bullet: "The pilot brief is one page, and also a typed record that a hotel's own agent can read and draft. It admits only the lowest authority level and leaves every decision to a human. Status: Design. No agent has used it."
This is not a new section. A standalone "Onboarding for agents" section would claim a capability that no agent has used.

### Verification for A
- `bun.cmd x vitest run` and `bun.cmd run build`, results reported as they are.
- The style check (`bunx tsx scripts/style-check.ts`): no new hit, baseline never raised.
- Freshness of the mirrors and of the MCP bundle: report, never edit generated files.
- A final list: what changed, what was left, what was not verified.

### Checkpoints for A
1. Ivan approves the facts: A1, A2, A3, A6 are low risk. A4 and A5 need an explicit yes.
2. Preview only, on one branch (for example `content/aetherix-pilot-2w`). Never merge into `main`.
3. Mirrors and corpus regenerated, verification run, leftovers listed. No deployment without Ivan's explicit approval in the current message.

## 3. Workstream B: a Field Note on the feasibility query (later, conditional)

**Do not write it now.** Trigger: workstream C verified (the criteria AC1 to AC8 of the feasibility brief), or an explicit decision by Ivan to publish a note labelled Design. Reason: today only a design brief exists, and on this site planned is not done.

**Skeleton, one question per section.**
1. Can the kitchen say yes, and until when? The question, in one request.
2. What a booking tool already answers: tables and slots against declared bookings. What it does not answer: staff, preparation time, demand that is not booked. State only what was checked. Whether tools such as Zenchef or CoverManager already pace by kitchen or staff capacity is **not verified**: say so or leave it out.
3. How the answer is computed: effective capacity is the smaller of seats times turns and the capacity of the team in its tightest role. Extra staff count only if the request arrives before the commitment deadline. The result is compared with a quantile of expected demand, not the average.
4. What it refuses to do: no guest identity, no probability without calibration, never a promise.
5. What is missing: a real history of covers (the PMS does not provide restaurant covers), table reservations as a source, calibration on real data.
6. Status, in one line.

**Figure idea.** Reuse the signal vocabulary planned in the Field Note of 8 Oct (`SignalLamp`, `RecommendationLine`, `src/content/recoLine.ts`; check that they exist on `main` before relying on them). Map the four verdicts to the existing signals: feasible = go, at risk = warn, not feasible = stop, indeterminate = dark, if `dark` is defined there as "no verdict". One request moves across the commitment deadline and its verdict flips. Data labelled synthetic.

**Allowed**: "designed", "Design", "read-only", "not built". **Forbidden**: "Aetherix tells you whether the kitchen can say yes", "integrated with booking tools", any probability of feasibility, any claim about what other vendors lack that was not checked.

## 4. Workstream C: the demonstration (prerequisite is in the Aetherix repository)

**Status: undecided.** The feasibility brief (§8, question 3) asks whether the Orchestrator's first slice should call this query. If yes, the build is a Synthetic PoC: the Orchestrator calls Aetherix and Tacet over MCP on synthetic data and returns one recommendation that a human validates, with a typed trace. The criteria are in `docs/context/orchestrator-v1-brief.md` (AC1 to AC8) and `docs/context/fnb-feasibility-query-brief.md` (§7).

**What the portfolio can do now**: nothing to publish. Prepare, at most, a design for a figure of "the Mesh working" on `/architecture`, labelled Design, with placeholders. Do not show a run before it exists.

**Wording**: before verification, Design. After AC1 to AC8 are verified, the only allowed formulation is "consumed by the Orchestrator over MCP (synthetic data)". Never "live", never "in production", never "Built".

**Assets the build should hand over, so the plan can reserve space**: a reproducible demo command with its expected output (AC7), a typed run trace (AC4).

## 5. Order and dependencies
1. A now. 2. B only after C, or by explicit decision. 3. C depends on a build decision in the Aetherix repository, not on the portfolio.
Every checkpoint needs Ivan's explicit approval. No deployment, no publication, no migration without it.

## 6. Do not
- Upgrade a status word, or write "Built" as "in production".
- Quote a forecast figure without its comparison (the baseline is the mean of the last four same weekdays).
- Claim that any agent uses the pilot brief.
- Claim anything about other vendors that was not checked.
- Touch Rose's deployed functions or the generated MCP bundle.

## 7. Sources (Aetherix repository, `main`)
`docs/pilot/onboarding-kit.md` · `docs/pilot/pilot-brief.schema.json` · `docs/mcp/getting-started.md` · `docs/planning/phase-3-pilot-validation.md` · `docs/planning/protocole-de-preuve.md` · `docs/context/decisions-architecturales.md` (Decision 35, D6) · `docs/context/open-decisions.md` · `docs/context/fnb-feasibility-query-brief.md` · `docs/context/orchestrator-v1-brief.md` · `public-status.yml` · `CLAUDE.md` · PRs #316 to #319 (6 to 8 Nov 2026).
