# What is agent experience (AX)? One text, three readers

Every page on this site has three readers, you, Rose and whatever agent fetched it this morning, and only one of them can read between the lines.

What a person, an assistant and an outside agent each get from the same page.

Product · 2026-11-20 · 8 min read

**Read this if** you want to see what agent experience (AX) means in practice, on a site that had to get it right; you publish pages that people, assistants and AI agents all read; you run an assistant that answers from your own content; you are tempted to show agent traffic as proof that anyone cares.

What you will decide differently:
- **Check what a machine actually receives, byte by byte.** What the browser shows proves nothing.
- **One source per fact, every surface generated from it,** and a test that fails when a surface drifts.
- **Count only what you can verify,** and show what it counts and since when.

The site said Pre-pilot. The browser showed Pre-pilot. A machine reading the raw homepage got "Pilot-ready".

## The day a machine read an old promise

**Pre-pilot on screen, Pilot-ready in the snapshot**

The site said Pre-pilot. The browser showed Pre-pilot. A machine reading the raw homepage got "Pilot-ready".

**What a person saw** In the browser: the Aetherix card, with the badge "Pre-pilot".

**What a machine got** In curl, the prerendered snapshot: the status "Pilot-ready".

Reconstruction: the status words are the real ones; the surrounding markup is illustrative.

It came from a prerendered snapshot, a frozen copy of the homepage made for readers that do not run JavaScript. Nobody had regenerated it after the status changed. People never saw it: the app replaced it as soon as it booted. Machines kept it.

That is the one thing this site promises never to do: round a status up. A stale file did it on its own. The fix was simple, regenerate the snapshot. The question it left was not: what does each reader actually get?

## From one text file to a protocol

The first brick went in on 5 May 2026, a week after the site's first commits: an `llms.txt`, its full version, and a `robots.txt` that names AI crawlers and lets them in. Everything since has been built on that one decision, to treat machines as readers.

5 May: `llms.txt`, `llms-full.txt` and a `robots.txt` open to AI crawlers
21 Jul: The public MCP server and Rose's first dock
14 Sep: The Markdown mirrors
14 Oct: /agents
17 Nov: The static stubs
19 Nov: Reading by section
20 Nov: Rose's signed history

Source: the site's commit history.

## 1. Three readers at once

This site is read by three kinds of reader, and they do not read alike. The visitor scans. Rose, the assistant on the site, quotes. An outside agent fetches, trims and summarises for someone I will never meet.

| Reader | What it reads | What it needs | How it fails |
| --- | --- | --- | --- |
| The visitor | The rendered page, in a browser | Layout, tone, a reason to keep reading | Gets bored, leaves |
| Rose | The site's own Markdown, nothing else | The same facts, in plain text, with their status | Says something the site does not say |
| An outside agent | Whatever the server returns: HTML, Markdown, llms.txt, the MCP server | Clean text, small enough to fit its context | Repeats a wrong page with full confidence |

The visitor forgives a lot. The other two forgive nothing, because they cannot see what you meant, only what you sent.

## 2. Read it like a machine

The stale snapshot was not a one-off. Each time I checked the raw response instead of the screen, something was off.

- **Markdown on request.** Asking the server for Markdown (`Accept: text/markdown`) worked, sort of. The hosting layer converted the page itself: 38,003 bytes for one journal article, menus and footer included, links mangled into strings like `%20[Case%20Studies]`. It was Markdown, and mostly noise.
- **Plain .md files.** Served as `application/octet-stream`, which browsers and some agents treat as a file to download. Some agents read it, some give up. Fixed since: the curated mirrors now come back as `text/markdown`.
- **A route that pointed elsewhere.** Asking for the projects index, /journeys, without JavaScript returned the homepage. The browser corrected it on boot; an agent got no projects at all. A static stub per route fixed it ([PR #50](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/50), then [#51](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/51) to keep the anchors).

The fix in each case: stop trusting the conversion and write the machine version deliberately. Curated Markdown mirrors are now generated at `.md` addresses for every page, from the same content as the site, without the chrome.

The habit that came out of it: fetch your own pages with `curl`, not a browser, at least once per release.

## 3. One source, every surface

Three readers means at least five surfaces saying the same thing: the page, its `.md` mirror, `llms.txt` and `llms-full.txt`, the MCP server, and Rose. Five copies of a fact is four chances to be wrong.

So each fact lives in one place and every surface is generated from it.

One source: `src/content` · `statuses.ts`. Five surfaces: The page; The .md mirror; llms.txt and llms-full.txt; The MCP server; Rose.

Two checks guard the gap. `check:journeys` follows every link and anchor, including those in llms.txt. `mcpBundleFreshness` fails when the MCP bundle is older than the content it serves, on the branch to The MCP server.

- **Statuses** come from one file, `statuses.ts`. Sonor is "MVP shipped · stopped 2022" on the page, in the Markdown, in the MCP answer and in Rose's mouth. Aetherix is Pre-pilot everywhere. No surface may round a status up.
- **Names** are canonical. One name per thing, the same on the page, in the Markdown and in the MCP answers.
- **Rose and the MCP server read the same Markdown.** If Rose says it, an agent can fetch it, and the other way round.
- **Links carry a reason.** The map of how projects relate is written by hand, one line of reason per link ([What Rose can relate](https://ivandemurard.com/rose#ch-06)). A visitor sees a diagram; the Markdown carries the same links as sentences an agent can quote.

Generated is not the same as fresh, so two checks guard the gap. `check:journeys` follows every link and anchor, including those in `llms.txt`. `mcpBundleFreshness` fails when the MCP bundle is older than the content it serves. When it fails, it is doing its job.

## 4. Rose lives in the page

Most site assistants live in an airlock: a chat bubble sealed off from the page, unaware of what you are reading. Rose is built the other way round. She lives in the page, and she reads the same text as the other two readers. [Her case study](https://ivandemurard.com/rose) tells how she got there, decision by decision. Here is only what it means for agent experience.

Four things make that work.

- **Answers that can be audited.** Rose answers from the Markdown the MCP server serves. An outside agent can fetch those sources and compare her answer with them. She can still misread, omit or add something the source does not say.
- **Only what the question needs.** A selector picks the notes to load from the address and the words of the question, and the section in view travels with it. What that changed in accuracy and cost is in [Caught in testing](https://ivandemurard.com/rose#ch-08).
- **A signed conversation.** The conversation lives in the visitor's tab, so it could be edited. Each answer Rose finishes is signed by the server (HMAC-SHA256 over the session, the message, its text and the time). A turn that comes back unsigned, altered, from another session or older than 60 minutes is dropped before the model sees it. The server does not save the conversation as a transcript; a content-free line counts the drops.
- **A character with rules.** Her jokes are tone, never hidden facts, and her instructions stay hers.

Separate interaction records include the questions visitors type, with contact details, links and IP addresses masked by pattern. They are kept for 90 days so I can review usage and failures. No IP address or browser fingerprint is stored in those records, and masking does not guarantee anonymity: names and unusual formats may remain. Listen also keeps the masked answer text and its audio for about 90 days to avoid paying twice for the same reading. [Privacy](https://ivandemurard.com/privacy) explains these records and the providers' retention separately from the conversation in the tab.

The character taught one lesson the hard way. Her self-description once held a sample line, to show the tone. She said it word for word in a live answer. Models copy examples. The sample went; the tone is now described by its qualities, with a word limit.

## 5. Map, outline, section

An agent pays for every word it reads, in context it cannot spend twice. Handing it everything is not generosity.

`llms-full.txt` holds the whole site in one file: 192 KB. Useful for an agent that wants it all, too heavy for one that needs a single answer. So the site offers three sizes:

- **The map.** `llms.txt` lists what exists, with links and statuses, and nothing more.
- **The outline.** The MCP tool `get_case_study` with `outline_only` returns the headings of a case study, so the agent can choose.
- **The section.** The same tool with `section` returns only the part it asked for.

| Document | Size in KB |
| --- | --- |
| llms-full.txt | 192.2 |
| /rose, as HTML | 118.6 |
| rose.md | 19.6 |
| aetherix.md | 13.1 |
| llms.txt | 10.1 |
| One section of aetherix.md | ≈ 2.5 |
| The outline of aetherix.md | < 1 |

Measured on 20 Nov 2026. Sizes as downloaded with curl; the outline and the section through the MCP server.

A visitor does this without thinking: scroll, skim, stop. An agent needs the page to be cut along its joints first. Good headings turn out to be an API.

## 6. What this site counts, and from when

A number about agents is only worth what it counts. So each figure here says what it counts, and since when.

- **MCP calls.** Counted by the server itself, one content-free line per call: which tool, when. Counted since 20 November 2026. The unit is the call: one script can make many.

MCP calls since 20 Nov 2026. No verified count is published here yet. A call does not identify an agent or prove that the content was read.

The first counter did not survive a review: it could be written through the site's public key, by anyone. Its numbers are not used here or anywhere else. Counting moved to the server, where a visitor cannot reach it.

The Markdown mirrors and `llms.txt` are served straight by the hosting, so the site never sees those reads and does not count them. Rose's own measures, what she keeps and for how long, are on [her trust contracts](https://ivandemurard.com/rose#ch-07).

"Agents read my site" is a lovely line for a portfolio. Here it comes with a date, a scope and a number, or it does not come at all.

## Apply this to your project

- Fetch three of your pages with `curl`. Read the response itself.
- Ask for `text/markdown` and look at the size. If the menu is in there, write the Markdown yourself.
- List every surface that states a fact (page, mirror, llms.txt, API, assistant). Pick one source per fact.
- Add one test that fails when a generated surface is older than its source.
- Offer a map, an outline and a section alongside the whole thing.
- If your assistant talks about itself, describe its tone by qualities: sample lines get copied.
- Before you publish an agent-traffic number, ask who could have written it.

## FAQ

Q: Is this SEO with a new name?
A: It overlaps with SEO. SEO asks whether you are found. This asks whether what is found is true and usable once fetched.

Q: Do I need an MCP server?
A: No. Clean Markdown at a stable address and an accurate `llms.txt` cover most of it. The MCP server earns its place when agents need to read in pieces.

Q: Should I count agent visits?
A: Count what you can verify, and say what it is. Here: MCP calls, counted on the server, shown with their start date. A call says nothing about who made it or why.

## Credit

Writing these notes ahead, then publishing them as the work moves, is an idea borrowed from co-existence.ai.

## Sources

- [Rose, the case study](https://ivandemurard.com/rose): her five decisions, trust contracts, tests and relation map
- [What is an LLM evaluation harness?](https://ivandemurard.com/journal/harnesses-graders-closed-loops), the method behind Rose's release tests
- [/agents, how agents can read this site](https://ivandemurard.com/agents)
- [llms.txt](https://ivandemurard.com/llms.txt) and [llms-full.txt](https://ivandemurard.com/llms-full.txt)
- [PR #50, static stubs for /journeys](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/50) and [PR #51, keeping anchors](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/51)
- [The site's repository](https://github.com/IvandeMurard/ivandemurard-portfolio)

## Listen summary

Recorded summary, written by Ivan, validated 21 Nov 2026 · 1 min 05

Who reads your website? You, of course. But also an assistant answering questions about it, and AI agents fetching it on someone else's behalf. This Field Note follows one page and its three readers, and what each of them actually got.

First, the promise. On screen, one of Ivan's projects was clearly marked as not yet piloted. A machine reading the same address received an old copy nobody had refreshed, announcing it was ready for a pilot. Nobody had lied: a forgotten file had.

Then, the missing room. Agents asking for the list of projects were quietly handed the homepage instead. In a browser, it fixed itself in a blink. For a machine, the projects simply did not exist.

The cure is simple to say: one source for every fact, every version built from it, and tests that fail the moment one drifts. Rose reads that same text, so she never knows more than the page.

So open three of your pages the way a machine does. What comes back?

## Continue exploring

- Read the method: [What is an LLM evaluation harness?](https://ivandemurard.com/journal/harnesses-graders-closed-loops) - The method behind Rose's release tests.
- Inspect implementation evidence: [Rose, the case study](https://ivandemurard.com/rose) - Her five decisions, trust contracts, tests and relation map.
- Inspect implementation evidence: [/agents, how agents can read this site](https://ivandemurard.com/agents) - The tools, the files and what each one guarantees.

## Updates

This piece is revised when something it claims stops being true. Each revision says what changed and why.

2026-11-21 · Counter emptied: its first value included a test call and had no reading date. It will be filled with a dated count.

Source: https://ivandemurard.com/journal/one-text-three-readers
