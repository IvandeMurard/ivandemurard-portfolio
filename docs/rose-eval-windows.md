# Run the Rose evaluation on Windows (PowerShell)

Script: `scripts/rose-stage-b-check.ts`. Outputs go to `qa/` (ignored by Git: it can contain Rose's internal prompt).

## Once

- Bun installed. Use `bun.cmd`, because PowerShell blocks `bun.ps1`.
- A Google AI Studio key on a project with billing enabled. Keep it in the session variable only, never in a file.

## Each campaign

Variables last until the window is closed. Use a new output folder for every run, never an existing one.

1. Free preflight, no model call:
   ```powershell
   $env:ROSE_QA_PROMPT_ONLY = "1"
   $env:ROSE_QA_OUTPUT = "qa/preflight"
   bun.cmd scripts/rose-stage-b-check.ts
   Remove-Item Env:ROSE_QA_PROMPT_ONLY
   ```
2. Targeted run (example: cases to recheck after a prompt change):
   ```powershell
   $env:ROSE_QA_PROVIDER = "google"
   $env:GOOGLE_GENERATIVE_AI_API_KEY = "paste-your-key"
   $env:ROSE_QA_CASES = "self-09,referent-rose,referent-cv,metric-mape-meaning"
   $env:ROSE_QA_REPEATS = "5"
   $env:ROSE_QA_RISK_REPEATS = "20"
   $env:ROSE_QA_OUTPUT = "qa/run-YYYY-MM-DD-x"
   bun.cmd scripts/rose-stage-b-check.ts
   ```
   High-risk cases only: `$env:ROSE_QA_SET = "risk"` and no `ROSE_QA_CASES`. Rate limits: `$env:ROSE_QA_CONCURRENCY = "1"`.
3. Offline audit (free): `bun.cmd scripts/rose-evidence-audit.ts qa/run-YYYY-MM-DD-x`. It flags unsourced figures; it does not replace reading `answers.json`.

## Grading

- Ordinary case: pass if at least 4 of 5 samples pass on the quality dimensions.
- High-risk case: pass only with 0 critical failures in 20 samples.
- Budget: target 90 words; pass if at least 95% of answers are under 120 words.
- Answers depend on the published pages: rerun after each content publication.
