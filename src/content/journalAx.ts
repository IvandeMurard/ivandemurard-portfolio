import type { JournalEntry } from "./journal";
import { AX_PEAK_PANES } from "./journalAxFigures";

// The fourth Field Note, "One text, three readers". The text is Ivan's draft of 20 Nov 2026, as validated: it is not
// reworded here. What this file adds to the draft is only the structure the other notes have (decision line, excerpt,
// "Read this if" card, figures, related links). The links to the Rose case study carry the real chapter ids of /rose.

export const AX_ENTRY: JournalEntry = {
  slug: "one-text-three-readers",
  decision: "For deciding what each reader of your product gets",
  hook: "Every page on this site has three readers, you, Rose and whatever agent fetched it this morning, and only one of them can read between the lines.",
  title: "What is agent experience (AX)? One text, three readers",
  subtitle: "What a person, an assistant and an outside agent each get from the same page.",
  date: "2026-11-20",
  category: "Product",
  lang: "en",
  mirror: "/one-text-three-readers.md",
  excerpt:
    'The site said Pre-pilot. The browser showed Pre-pilot. A machine reading the raw homepage got "Pilot-ready".',
  glance: {
    audience:
      "you want to see what agent experience (AX) means in practice, on a site that had to get it right; you publish pages that people, assistants and AI agents all read; you run an assistant that answers from your own content; you are tempted to show agent traffic as proof that anyone cares.",
  },
  takeaways: [
    "**Check what a machine actually receives, byte by byte.** What the browser shows proves nothing.",
    "**One source per fact, every surface generated from it,** and a test that fails when a surface drifts.",
    "**Count only what you can verify,** and show what it counts and since when.",
  ],
  updates: [
    {
      date: "2026-11-21",
      summary: "Counter emptied: its first value included a test call and had no reading date.",
      reason: "It will be filled with a dated count.",
    },
  ],
  related: [
    { role: "method", label: "What is an LLM evaluation harness?", to: "/journal/harnesses-graders-closed-loops", why: "The method behind Rose's release tests." },
    { role: "evidence", label: "Rose, the case study", to: "/rose", why: "Her five decisions, trust contracts, tests and relation map." },
    { role: "evidence", label: "/agents, how agents can read this site", to: "/agents", why: "The tools, the files and what each one guarantees." },
  ],
  body: [
    { kind: "h2", text: "The day a machine read an old promise" },
    {
      kind: "peak",
      aria: "Peak moment: a machine read an old promise",
      kicker: "Pre-pilot on screen, Pilot-ready in the snapshot",
      lead: 'The site said Pre-pilot. The browser showed Pre-pilot. A machine reading the raw homepage got "Pilot-ready".',
      cols: 2,
      boxes: [
        { label: AX_PEAK_PANES.person.label, text: `${AX_PEAK_PANES.person.via}: the ${AX_PEAK_PANES.person.card} card, with the badge "${AX_PEAK_PANES.person.badge}".` },
        { label: AX_PEAK_PANES.machine.label, text: `${AX_PEAK_PANES.machine.via}: the status "${AX_PEAK_PANES.machine.highlight}".` },
      ],
      panes: AX_PEAK_PANES,
    },
    {
      kind: "p",
      text: "It came from a prerendered snapshot, a frozen copy of the homepage made for readers that do not run JavaScript. Nobody had regenerated it after the status changed. People never saw it: the app replaced it as soon as it booted. Machines kept it.",
    },
    {
      kind: "p",
      text: "That is the one thing this site promises never to do: round a status up. A stale file did it on its own. The fix was simple, regenerate the snapshot. The question it left was not: what does each reader actually get?",
    },

    { kind: "h2", text: "From one text file to a protocol" },
    {
      kind: "p",
      text: "The first brick went in on 5 May 2026, a week after the site's first commits: an `llms.txt`, its full version, and a `robots.txt` that names AI crawlers and lets them in. Everything since has been built on that one decision, to treat machines as readers.",
    },
    { kind: "axFigure", figure: "bricks" },

    { kind: "h2", text: "1. Three readers at once" },
    {
      kind: "p",
      text: "This site is read by three kinds of reader, and they do not read alike. The visitor scans. Rose, the assistant on the site, quotes. An outside agent fetches, trims and summarises for someone I will never meet.",
    },
    { kind: "axFigure", figure: "readers" },
    {
      kind: "p",
      text: "The visitor forgives a lot. The other two forgive nothing, because they cannot see what you meant, only what you sent.",
    },

    { kind: "h2", text: "2. Read it like a machine" },
    {
      kind: "p",
      text: "The stale snapshot was not a one-off. Each time I checked the raw response instead of the screen, something was off.",
    },
    {
      kind: "list",
      items: [
        "**Markdown on request.** Asking the server for Markdown (`Accept: text/markdown`) worked, sort of. The hosting layer converted the page itself: 38,003 bytes for one journal article, menus and footer included, links mangled into strings like `%20[Case%20Studies]`. It was Markdown, and mostly noise.",
        "**Plain .md files.** Served as `application/octet-stream`, which browsers and some agents treat as a file to download. Some agents read it, some give up. Fixed since: the curated mirrors now come back as `text/markdown`.",
        "**A route that pointed elsewhere.** Asking for the projects index, /journeys, without JavaScript returned the homepage. The browser corrected it on boot; an agent got no projects at all. A static stub per route fixed it ([PR #50](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/50), then [#51](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/51) to keep the anchors).",
      ],
    },
    {
      kind: "p",
      text: "The fix in each case: stop trusting the conversion and write the machine version deliberately. Curated Markdown mirrors are now generated at `.md` addresses for every page, from the same content as the site, without the chrome.",
    },
    { kind: "p", text: "The habit that came out of it: fetch your own pages with `curl`, not a browser, at least once per release." },

    { kind: "h2", text: "3. One source, every surface" },
    {
      kind: "p",
      text: "Three readers means at least five surfaces saying the same thing: the page, its `.md` mirror, `llms.txt` and `llms-full.txt`, the MCP server, and Rose. Five copies of a fact is four chances to be wrong.",
    },
    { kind: "p", text: "So each fact lives in one place and every surface is generated from it." },
    { kind: "axFigure", figure: "fanout" },
    {
      kind: "list",
      items: [
        '**Statuses** come from one file, `statuses.ts`. Sonor is "MVP shipped · stopped 2022" on the page, in the Markdown, in the MCP answer and in Rose\'s mouth. Aetherix is Pre-pilot everywhere. No surface may round a status up.',
        "**Names** are canonical. One name per thing, the same on the page, in the Markdown and in the MCP answers.",
        "**Rose and the MCP server read the same Markdown.** If Rose says it, an agent can fetch it, and the other way round.",
        "**Links carry a reason.** The map of how projects relate is written by hand, one line of reason per link ([What Rose can relate](/rose#ch-06)). A visitor sees a diagram; the Markdown carries the same links as sentences an agent can quote.",
      ],
    },
    {
      kind: "p",
      text: "Generated is not the same as fresh, so two checks guard the gap. `check:journeys` follows every link and anchor, including those in `llms.txt`. `mcpBundleFreshness` fails when the MCP bundle is older than the content it serves. When it fails, it is doing its job.",
    },

    { kind: "h2", text: "4. Rose lives in the page" },
    {
      kind: "p",
      text: "Most site assistants live in an airlock: a chat bubble sealed off from the page, unaware of what you are reading. Rose is built the other way round. She lives in the page, and she reads the same text as the other two readers. [Her case study](/rose) tells how she got there, decision by decision. Here is only what it means for agent experience.",
    },
    { kind: "p", text: "Four things make that work." },
    {
      kind: "list",
      items: [
        "**The same text as the agents.** Rose answers from the Markdown the MCP server serves. Whatever she says, an outside agent can check.",
        "**Only what the question needs.** A selector picks the notes to load from the address and the words of the question, and the section in view travels with it. What that changed in accuracy and cost is in [Caught in testing](/rose#ch-08).",
        "**A memory nobody can rewrite.** The conversation lives in the visitor's tab, so it could be edited. Each answer Rose finishes is signed by the server (HMAC-SHA256 over the session, the message, its text and the time). A turn that comes back unsigned, altered, from another session or older than 60 minutes is dropped before the model sees it. No conversation content is stored; a content-free line counts the drops.",
        "**A character with rules.** She breaks the fourth wall, as [her notes](/rose#ch-00) show. Her jokes are tone, never hidden facts, and her instructions stay hers.",
      ],
    },
    {
      kind: "p",
      text: "The character taught one lesson the hard way. Her self-description once held a sample line, to show the tone. She said it word for word in a live answer. Models copy examples. The sample went; the tone is now described by its qualities, with a word limit.",
    },

    { kind: "h2", text: "5. Map, outline, section" },
    {
      kind: "p",
      text: "An agent pays for every word it reads, in context it cannot spend twice. Handing it everything is not generosity.",
    },
    {
      kind: "p",
      text: "`llms-full.txt` holds the whole site in one file: 192 KB. Useful for an agent that wants it all, too heavy for one that needs a single answer. So the site offers three sizes:",
    },
    {
      kind: "list",
      items: [
        "**The map.** `llms.txt` lists what exists, with links and statuses, and nothing more.",
        "**The outline.** The MCP tool `get_case_study` with `outline_only` returns the headings of a case study, so the agent can choose.",
        "**The section.** The same tool with `section` returns only the part it asked for.",
      ],
    },
    { kind: "axFigure", figure: "sizes" },
    {
      kind: "p",
      text: "A visitor does this without thinking: scroll, skim, stop. An agent needs the page to be cut along its joints first. Good headings turn out to be an API.",
    },

    { kind: "h2", text: "6. What this site counts, and from when" },
    { kind: "p", text: "A number about agents is only worth what it counts. So each figure here says what it counts, and since when." },
    {
      kind: "list",
      items: [
        "**MCP calls.** Counted by the server itself, one content-free line per call: which tool, when. Counted since 20 November 2026. The unit is the call: one script can make many.",
      ],
    },
    { kind: "axFigure", figure: "counter" },
    {
      kind: "p",
      text: "The first counter did not survive a review: it could be written through the site's public key, by anyone. Its numbers are not used here or anywhere else. Counting moved to the server, where a visitor cannot reach it.",
    },
    {
      kind: "p",
      text: "The Markdown mirrors and `llms.txt` are served straight by the hosting, so the site never sees those reads and does not count them. Rose's own measures, what she keeps and for how long, are on [her trust contracts](/rose#ch-07).",
    },
    {
      kind: "p",
      text: '"Agents read my site" is a lovely line for a portfolio. Here it comes with a date, a scope and a number, or it does not come at all.',
    },

    { kind: "h2", text: "Apply this to your project" },
    {
      kind: "list",
      items: [
        "Fetch three of your pages with `curl`. Read the response itself.",
        "Ask for `text/markdown` and look at the size. If the menu is in there, write the Markdown yourself.",
        "List every surface that states a fact (page, mirror, llms.txt, API, assistant). Pick one source per fact.",
        "Add one test that fails when a generated surface is older than its source.",
        "Offer a map, an outline and a section alongside the whole thing.",
        "If your assistant talks about itself, describe its tone by qualities: sample lines get copied.",
        "Before you publish an agent-traffic number, ask who could have written it.",
      ],
    },

    { kind: "h2", text: "FAQ" },
    {
      kind: "lines",
      items: [
        { q: "Is this SEO with a new name?", a: "It overlaps with SEO. SEO asks whether you are found. This asks whether what is found is true and usable once fetched." },
        { q: "Do I need an MCP server?", a: "No. Clean Markdown at a stable address and an accurate `llms.txt` cover most of it. The MCP server earns its place when agents need to read in pieces." },
        { q: "Should I count agent visits?", a: "Count what you can verify, and say what it is. Here: MCP calls, counted on the server, shown with their start date. A call says nothing about who made it or why." },
      ],
    },

    { kind: "h2", text: "Credit" },
    { kind: "p", text: "Writing these notes ahead, then publishing them as the work moves, is an idea borrowed from co-existence.ai." },

    { kind: "h2", text: "Sources" },
    {
      kind: "list",
      items: [
        "[Rose, the case study](/rose): her five decisions, trust contracts, tests and relation map",
        "[What is an LLM evaluation harness?](/journal/harnesses-graders-closed-loops), the method behind Rose's release tests",
        "[/agents, how agents can read this site](/agents)",
        "[llms.txt](https://ivandemurard.com/llms.txt) and [llms-full.txt](https://ivandemurard.com/llms-full.txt)",
        "[PR #50, static stubs for /journeys](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/50) and [PR #51, keeping anchors](https://github.com/IvandeMurard/ivandemurard-portfolio/pull/51)",
        "[The site's repository](https://github.com/IvandeMurard/ivandemurard-portfolio)",
      ],
    },
  ],
};
