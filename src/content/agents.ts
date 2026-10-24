// Approved copy of /agents. The page and public/agents.md both render from here.
import { SOCIAL_LINKS_PLAIN } from "./links";

export const MCP_URL = "https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp";

export const AGENTS_DOC = {
  title: "ivandemurard.com · for agents",
  meta: (date: string) => `Public. Read-only. No key. Last updated ${date}.`,
  lead: "Every case study, Field Note, the homepage, the CV and this page have a Markdown mirror, and a public MCP server answers with the text a person reads. Statuses and stated limits included. Nothing is upgraded for machines.",
  connect: [
    { label: "Claude Code:", command: `claude mcp add ivandemurard --transport http ${MCP_URL}` },
    { label: "Any MCP client, over HTTP:", command: MCP_URL },
  ],
  tools: [
    ["list_case_studies", "every case study: slug, label, tagline, status, URL"],
    ["get_case_study", "one case study in full, as Markdown"],
    ["get_about", "bio, CV and contact links"],
    ["list_journal_entries", "every Field Note: title, date, category, excerpt"],
    ["get_journal_entry", "one Field Note in full, as Markdown"],
  ],
  files: [
    ["/llms.txt", "short index of the site, for language models"],
    ["/llms-full.txt", "the whole site in one text file"],
    ["/index.md", "the homepage, statuses included"],
    ["/<page>.md", "the mirror of any page, e.g. /aetherix.md"],
    ["/journal/<slug>.md", "the preferred mirror of a Field Note (legacy /<slug>.md still works)"],
  ],
  exampleIntro: "Ask about a project that stopped. The answer says it stopped.",
  exampleCall: '→ get_case_study { "slug": "sonor" }',
  highlight: "stopped in 2022 after discovery concluded no contract would clear.",
  guarantees: [
    "Pages, Markdown mirrors, llms-full.txt and MCP answers are generated from the same content files at build time. /llms.txt and Rose's instructions are written by hand and checked by tests; Rose reads the published Markdown mirrors.",
    "The /journal landing page has no Markdown mirror; list_journal_entries and /llms.txt carry its index.",
    "Every project carries its status: Pilot-ready, Maintenance, Evaluated, Compliance Gated, Partial or MVP shipped · stopped 2022.",
    "Figures come with their source. Illustrative figures are labelled as such.",
    "Read-only: an agent can read everything here, and change nothing.",
    "Nothing an agent sends to the MCP server is stored.",
  ],
  fieldNotes: {
    intro: "Field Notes teach transferable methods. Case studies and public repositories hold the implementation evidence. Three questions, complementary, read in any order:",
    items: [
      ["01 Evaluate", "How do you know an agent is working?", "/journal/harnesses-graders-closed-loops"],
      ["02 Set boundaries", "Where should an agent's responsibility end?", "/journal/agent-boundaries-aetherix"],
      ["03 Learn", "Whose truth should an agent learn from?", "/journal/whose-truth-is-the-ground-truth"],
    ],
    modes: [
      "Browse summaries: list_journal_entries, or /llms.txt.",
      "Read a method in full: get_journal_entry, or /journal/<slug>.md.",
      "Check the evidence: get_case_study for aetherix or lore, then the public repositories.",
      "Apply a method to another project: each note ends with a copyable brief. Reading this site does not authorise an agent to inspect or change anyone's project; the reader decides.",
    ],
  },
  contactText: "For a human conversation: book 30 minutes or email. The tool get_about returns the same links.",
} as const;

export const renderAgentsMarkdown = (date: string, excerpt: string) =>
  [
    `# ${AGENTS_DOC.title}`, "", AGENTS_DOC.meta(date), "", `> ${AGENTS_DOC.lead}`, "",
    "## Connect", "",
    ...AGENTS_DOC.connect.flatMap((c) => [c.label, "", "```sh", c.command, "```", ""]),
    "## Tools", "", ...AGENTS_DOC.tools.map(([n, d]) => `- ${n} · ${d}`), "",
    "## Files", "", ...AGENTS_DOC.files.map(([n, d]) => `- ${n} · ${d}`), "",
    "## Field Notes", "", AGENTS_DOC.fieldNotes.intro, "",
    ...AGENTS_DOC.fieldNotes.items.map(([l, q, u]) => `- ${l} · ${q} · ${u} (markdown: ${u}.md)`), "",
    ...AGENTS_DOC.fieldNotes.modes.map((m) => `- ${m}`), "",
    "## Example", "", AGENTS_DOC.exampleIntro, "", "```", AGENTS_DOC.exampleCall, "← " + excerpt.split("\n").join("\n  "), "```", "",
    "## Guarantees", "", ...AGENTS_DOC.guarantees.map((g) => `- ${g}`), "",
    "## Contact", "",
    `For a human conversation: [book 30 minutes](${SOCIAL_LINKS_PLAIN.schedule}) or [email](${SOCIAL_LINKS_PLAIN.email}). The tool get_about returns the same links.`, "",
  ].join("\n");
