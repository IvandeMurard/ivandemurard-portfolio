// Approved copy of /agents. The page and public/agents.md both render from here.
import { SOCIAL_LINKS_PLAIN } from "./links";

export const MCP_URL = "https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp";

export const AGENTS_DOC = {
  title: "ivandemurard.com · for agents",
  meta: (date: string) => `Public. Read-only. No key. Last updated ${date}.`,
  lead: "Every page on this site has a Markdown mirror, and a public MCP server answers with the text a person reads. Statuses and stated limits included. Nothing is upgraded for machines.",
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
  ],
  exampleIntro: "Ask about a project that stopped. The answer says it stopped.",
  exampleCall: '→ get_case_study { "slug": "sonor" }',
  highlight: "stopped in 2022 after discovery concluded no contract would clear.",
  guarantees: [
    "Same source for pages, Markdown mirrors, llms files, MCP answers and Rose.",
    "Every project carries its status: Pilot-ready, Maintenance, Evaluated, Compliance Gated, Partial or MVP Shipped.",
    "Figures come with their source. Illustrative figures are labelled as such.",
    "Read-only: an agent can read everything here, and change nothing.",
    "Nothing an agent sends to the MCP server is stored.",
  ],
  contactText: "For a human conversation: book 30 minutes or email. The tool get_about returns the same links.",
} as const;

export const renderAgentsMarkdown = (date: string, excerpt: string) =>
  [
    `# ${AGENTS_DOC.title}`, "", AGENTS_DOC.meta(date), "", `> ${AGENTS_DOC.lead}`, "",
    "## Connect", "",
    ...AGENTS_DOC.connect.flatMap((c) => [c.label, "", "```sh", c.command, "```", ""]),
    "## Tools", "", ...AGENTS_DOC.tools.map(([n, d]) => `- ${n} · ${d}`), "",
    "## Files", "", ...AGENTS_DOC.files.map(([n, d]) => `- ${n} · ${d}`), "",
    "## Example", "", AGENTS_DOC.exampleIntro, "", "```", AGENTS_DOC.exampleCall, "← " + excerpt.split("\n").join("\n  "), "```", "",
    "## Guarantees", "", ...AGENTS_DOC.guarantees.map((g) => `- ${g}`), "",
    "## Contact", "",
    `For a human conversation: [book 30 minutes](${SOCIAL_LINKS_PLAIN.schedule}) or [email](${SOCIAL_LINKS_PLAIN.email}). The tool get_about returns the same links.`, "",
  ].join("\n");
