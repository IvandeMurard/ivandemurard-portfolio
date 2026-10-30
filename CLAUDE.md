# Working rules for Claude Code in this repository

Read `AGENTS.md` too: its project rules apply.

## Rose and the Rose case study
- Before any change related to Rose or `/rose-design-lab`, read `docs/rose-case-study.md` (source of truth) and `docs/rose-case-study-copy.md` (exact copy, use it verbatim).
- Visual reference: `docs/rose-prototype/` (see its README). Open the screenshot of the section you work on, Day and Night, desktop and mobile.
- Work on one section of the brief at a time. Do not touch other sections. Do not create a new concept or variant.
- If the brief is ambiguous for the section, ask before building.
- If two sources contradict each other, stop and list the conflicts before coding.

## Git and deployment
- One branch per task (for example `case-study/6-3`). Commit, push, then stop. Never merge into `main`.
- Never deploy Supabase functions (`rose-chat`, `mcp`) and never publish. Deployment goes through Lovable, with Ivan's explicit approval.
- `qa/` stays out of Git: it can contain Rose's internal prompt. Never commit evaluation outputs.
- Never read or print `.env`.
- After a local build, never commit generated files (`public/`, `supabase/functions/mcp/index.ts`, `src/content/agents.generated.ts`): a Windows build replaces the MCP bundle with a broken stub. Restore them with `git checkout` before committing.

## Quality
- Before every commit: `bun.cmd x vitest run` and `bun.cmd run build`. Report failures, do not hide them.
- When done, list what changed and check it against §9 of the brief (390, 800, 1280, 1440 px; Day and Night; contrast at least 4.5:1; keyboard; reduced motion).
- Site copy: no em-dashes. Never invent metrics, dates, names or sources.
- Use semantic tokens, never hard-coded colours.

## Environment
- Windows, PowerShell. Use `bun.cmd` (PowerShell blocks `bun.ps1`). Give commands in PowerShell syntax.
