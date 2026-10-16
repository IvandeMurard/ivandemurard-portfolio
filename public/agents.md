# ivandemurard.com · for agents

Public. Read-only. No key. Last updated 2026-10-14.

> Every page on this site has a Markdown mirror, and a public MCP server answers with the text a person reads. Statuses and stated limits included. Nothing is upgraded for machines.

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

## Example

Ask about a project that stopped. The answer says it stopped.

```
→ get_case_study { "slug": "sonor" }
← Status: MVP Shipped · Urban noise SaaS on open data, 0→1 to MVP. No contract signed, stopped in 2022.
  
  # Sonor
  
  B2G SaaS that turned acoustic open data into a decision tool for cities. Taken from discovery to MVP, technical core validated; stopped in 2022 after discovery concluded no contract would clear.
```

## Guarantees

- Same source for pages, Markdown mirrors, llms files, MCP answers and Rose.
- Every project carries its status: Pilot-ready, Maintenance, Evaluated, Compliance Gated, Partial or MVP Shipped.
- Figures come with their source. Illustrative figures are labelled as such.
- Read-only: an agent can read everything here, and change nothing.
- Nothing an agent sends to the MCP server is stored.

## Contact

For a human conversation: [book 30 minutes](https://cal.com/ivandemurard/discussion-and-introduction) or [email](mailto:ivandemurard@gmail.com). The tool get_about returns the same links.
