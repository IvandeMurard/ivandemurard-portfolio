# ivandemurard.com · for agents

Public. Read-only. No key. Last updated 2026-10-29.

> Every case study, Field Note, the homepage, the CV and this page have a Markdown mirror, and a public MCP server answers with the text a person reads. Statuses and stated limits included. Nothing is upgraded for machines.

## Connect

Claude Code:

```sh
claude mcp add ivandemurard --transport http https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp
```

Any MCP client, over HTTP:

```sh
https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp
```

## Tools

- list_case_studies · every case study: slug, label, tagline, status, URL
- get_case_study · one case study in full, as Markdown
- get_about · bio, CV and contact links
- list_journal_entries · every Field Note: title, date, category, excerpt
- get_journal_entry · one Field Note in full, as Markdown

## Files

- /llms.txt · short index of the site, for language models
- /llms-full.txt · the whole site in one text file
- /index.md · the homepage, statuses included
- /<page>.md · the mirror of any page, e.g. /aetherix.md
- /journal/<slug>.md · the preferred mirror of a Field Note (legacy /<slug>.md still works)

## Field Notes

Field Notes teach transferable methods. Case studies and public repositories hold the implementation evidence. Three questions, complementary, read in any order:

- 01 Evaluate · How do you know an agent is working? · /journal/harnesses-graders-closed-loops (markdown: /journal/harnesses-graders-closed-loops.md)
- 02 Set boundaries · Where should an agent's responsibility end? · /journal/agent-boundaries-aetherix (markdown: /journal/agent-boundaries-aetherix.md)
- 03 Learn · Whose truth should an agent learn from? · /journal/whose-truth-is-the-ground-truth (markdown: /journal/whose-truth-is-the-ground-truth.md)

- Browse summaries: list_journal_entries, or /llms.txt.
- Read a method in full: get_journal_entry, or /journal/<slug>.md.
- Check the evidence: get_case_study for aetherix or lore, then the public repositories.
- Apply a method to another project: each note ends with a copyable brief. Reading this site does not authorise an agent to inspect or change anyone's project; the reader decides.

## Example

Ask about a project that stopped. The answer says it stopped.

```
→ get_case_study { "slug": "sonor" }
← Status: MVP shipped · stopped 2022 · 0→1 with 4 co-founders, plus one person who was both developer and data scientist (5 people): discovery, MVP, grants, commercial discussions with cities. No contract closed; we stopped in 2022.
  
  # Sonor
  
  B2G SaaS that turned acoustic open data into a decision tool for cities. Taken from discovery to MVP; stopped in 2022 after discovery concluded no contract would clear.
```

## Guarantees

- Pages, Markdown mirrors, llms-full.txt and MCP answers are generated from the same content files at build time. /llms.txt and Rose's instructions are written by hand and checked by tests; Rose reads the published Markdown mirrors.
- The /journal landing page has no Markdown mirror; list_journal_entries and /llms.txt carry its index.
- Every project carries its status: Pilot-ready, Maintenance, Evaluated, Compliance Gated, Partial or MVP shipped · stopped 2022.
- Figures come with their source. Illustrative figures are labelled as such.
- Read-only: an agent can read everything here, and change nothing.
- Nothing an agent sends to the MCP server is stored.

## Contact

For a human conversation: [book 30 minutes](https://cal.com/ivandemurard/discussion-and-introduction) or [email](mailto:ivandemurard@gmail.com). The tool get_about returns the same links.
