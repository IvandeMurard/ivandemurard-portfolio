// Renders public/rose.md, the Markdown mirror of the Rose case study, from the page's own content
// constants (src/components/rose/RoseCaseStudy.tsx and roseDemoData.ts), so the page and the mirror cannot say
// different things. The runner is scripts/generate-rose-mirror.ts (prebuild).
//
// Every line is a string of the page, or a short label of the page, or one of these structural lines:
// "Status:", "Last updated", "Marker:", "Scripted demo", and the label that marks Rose's notes.
// Labels sit on a line of their own (bold), so no "Label: text" line reads like a colon reveal.
import {
  CHAPTER_MARK, CHAPTER_MARK_QUALIFIER, CLOSE, GOT_WRONG, HERO, HERO_LEAD, IDEA, LEGEND, LEGEND_NOTE, MILESTONES, NEXT, QUESTIONS,
  REPO_FILE, REPO_URL, ROSE_CHAPTERS, SIX, TLDR, TRUST, replyHref,
} from "../src/components/rose/RoseCaseStudy";
import { DESIGN_CAPTION, DESIGN_EXCHANGES, HERO_EXCHANGES, PASSAGE_QUESTIONS } from "../src/components/rose/roseDemoData";
import { CONTACT, SOCIAL_LINKS } from "../src/content/site";
import { ASK_AI, ASSISTANTS } from "../src/content/askAi";
import { HOW_ROSE_WORKS } from "../src/content/howRoseWorks";
import { GRAPH_STANDALONE, RELATIONS_MAP, nodeMarkdown, relationRows, relationSentence } from "../src/content/relationsMap";
import { LISTEN_SECTION_HEADING, listenSummaryBySlug, listenSummaryNotice } from "../src/content/listenSummaries";

/** The label that marks Rose's notes: Ivan writes them in her voice. */
export const ROSE_NOTE_LABEL = "Rose's note (written by Ivan in her voice)";

const label = (text: string) => `**${text}**`;
const link = (text: string, href: string) => `[${text}](${href})`;
const note = (text: string) => `${label(ROSE_NOTE_LABEL)}\n\n${text}`;
const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n");

/** One line per element of the dock mock-up: each chip is its own line, as on the page. */
const vignetteLines = (item: (typeof MILESTONES)[string]["vignette"]["before"][number]): string[] => {
  switch (item.t) {
    case "chips": return item.chips;
    case "card": return [`Book 30 minutes · ${item.text}`];
    case "q": return [`"${item.text}"`];
    default: return [item.text];
  }
};

const marker = (id: string) => (CHAPTER_MARK[id] ? `Marker: ${CHAPTER_MARK[id]}${CHAPTER_MARK_QUALIFIER[id] ? ` (${CHAPTER_MARK_QUALIFIER[id]})` : ""}` : null);
const SITE = "https://ivandemurard.com";

function chapterBody(id: string): string[] {
  if (id === "ch-00") {
    const { p1, p2, p3, name } = IDEA;
    return [
      p1,
      `(Built) ${p2}`,
      `${p3.before}${link(p3.anchor.text, p3.anchor.href)}${p3.middle}${link(p3.second.text, p3.second.href)}${p3.after}`,
      name,
    ];
  }
  const m = MILESTONES[id];
  if (m) {
    const v = m.vignette;
    return [
      label("The brief"), m.brief,
      label("The tension"), m.tension,
      label("What I decided"), m.decision,
      ...(m.result ? [m.result] : []),
      ...(m.tradeoff ? [label("The trade-off"), m.tradeoff] : []),
      label(v.caption),
      `${v.b}: ${v.mb}\n\n${bullets(v.before.flatMap(vignetteLines))}`,
      `${v.a}: ${v.ma}\n\n${bullets(v.after.flatMap(vignetteLines))}`,
      ...(m.link ? [`${m.link.before}${link(m.link.text, `${SITE}${m.link.to}`)}`] : []),
      `Source: ${m.source}`,
    ];
  }
  if (id === "ch-06") {
    const demo = `Scripted demo with four exchanges: ${DESIGN_EXCHANGES.map((e) => `${e.format} (${e.mark})`).join(", ")}. ${DESIGN_CAPTION}`;
    return [
      SIX.intro, SIX.influence, demo,
      bullets(PASSAGE_QUESTIONS.map((p) => `${p.format} (${p.mark}): ${p.q}`)),
      // The loop, as text: the two rules, the centre, then steps 01 to 05 in order (the page's reading order).
      ...HOW_ROSE_WORKS.rules.map((r) => `${label(r.title)}\n\n${r.text}`),
      `${label(HOW_ROSE_WORKS.centre.title)}\n\n${HOW_ROSE_WORKS.centre.text}`,
      // One list item per step: a bold title, then its text (and, for step 04, each Next tag) on following lines.
      HOW_ROSE_WORKS.steps.map((s) => [`${Number(s.n)}. ${label(s.title)}  `, `   ${s.text}`, ..."tags" in s ? s.tags.map((t) => `   ${t}`) : []].join("\n")).join("\n"),
      HOW_ROSE_WORKS.caption,
      // The map of relations: the rows of portfolio-graph.json (the single source), then the standalone nodes.
      [...relationRows().map(relationSentence), ...GRAPH_STANDALONE.map((s) => `- ${nodeMarkdown(s.node)}\n  ${s.reason}`)].join("\n"),
      RELATIONS_MAP.caption,
      RELATIONS_MAP.note,
    ];
  }
  if (id === "ch-07") {
    const t = TRUST;
    const parts = t.contracts.flatMap((c) => {
      const items = c.items.map((it) => `(${it.mark}) ${it.parts.length === 3 ? `${it.parts[0]}${link(it.parts[1], REPO_FILE(t.evalDoc))}${it.parts[2]}` : it.parts[0]}${it.see ? ` ${link(it.see.text, `${SITE}${it.see.to}`)}` : ""}`);
      const sources = "sources" in c && c.sources
        ? [`${c.sourcesLead}${c.sources.map((s) => link(s.label, REPO_FILE(s.path))).join(" and ")}`]
        : [];
      return [label(c.kicker), `### ${c.title}`, bullets(items), ...sources];
    });
    const r = t.rule;
    return [
      t.intro, ...parts,
      `### ${r.heading}`, r.intro, r.question,
      ...r.answers.flatMap((a) => [label(a.label), `"${a.text}"`, a.note]),
      r.caption,
    ];
  }
  if (id === "ch-08") {
    const g = GOT_WRONG;
    const resultCell = (r: string[]) => (r.length === 3 ? `${r[0]}${link(r[1], REPO_FILE(g.evalDoc))}${r[2]}` : r[0]);
    const rows = g.cases.map((c) => `| ${c.meta} | ${c.said} | ${c.changed} | ${resultCell(c.result)} |`);
    return [
      g.intro,
      ["| Run | " + g.labels.join(" | ") + " |", "| --- | --- | --- | --- |", ...rows].join("\n"),
      g.cost.text,
      `${g.cost.sourceLead}${g.cost.source}`,
      `### ${g.judgedLabel}`,
      g.judged,
      g.loop.map((step, i) => `${i + 1}. ${step}`).join("\n"),
      g.loopCaption,
      `Eight dimensions\n\n${bullets(g.dimensions)}`,
      bullets(g.rules.map(([t, d]) => `${t} · ${d}`)),
      g.campaign,
      link(g.campaignLink, REPO_FILE(g.evalDoc)),
      `${g.sourcesLead}${g.sources.map((s) => link(s.label, REPO_FILE(s.path))).join(", ")}${g.sourcesTail}`,
    ];
  }
  if (id === "ch-09") {
    return [NEXT.intro, bullets(NEXT.items.map(([title, text]) => `${title} ${text}`)), NEXT.transfers];
  }
  if (id === "ch-10") {
    return QUESTIONS.flatMap((q) => [
      `### ${q.n} · ${q.title}`,
      q.question,
      label("Hypothesis"), q.hypothesis,
      label("Signal"), q.signal,
      label("Decision"), q.decision,
      label("Cost of being wrong"), q.cost,
      link("Reply by email", `${replyHref(q.n)}`),
    ]);
  }
  return [];
}

/** The mirror, stamped with the date of the last content change. */
export function renderRoseMirror(date: string): string {
  const blocks: string[] = [
    `# ${HERO.headline.join("")}`,
    HERO.label,
    `Status: ${HERO.status}`,
    `Last updated ${date}.`,
    HERO_LEAD,
    "## How to read this case study",
    bullets(LEGEND.map(([glyph, term, def]) => `${glyph} ${term}: ${def}`)),
    `${LEGEND_NOTE.before}${link(LEGEND_NOTE.link, REPO_URL)}${LEGEND_NOTE.after}`,
    "## TL;DR",
    bullets(TLDR.map(([t, d]) => `${t}: ${d}`)),
    `Scripted demo with three built exchanges, in a loop: ${HERO_EXCHANGES.map((e) => `"${e.q}"`).join(", ")}.`,
  ];

  // The recorded summary of this page, from the same source as the page block, the dock and MCP.
  const listen = listenSummaryBySlug("rose");
  if (listen) blocks.push(`## ${LISTEN_SECTION_HEADING}`, listenSummaryNotice(listen), listen.text);

  for (const c of ROSE_CHAPTERS) {
    blocks.push(`## ${c.heading}`, c.kicker);
    const mark = marker(c.id);
    if (mark) blocks.push(mark);
    blocks.push(...chapterBody(c.id));
  }

  blocks.push(
    "## Contact",
    label(CLOSE.askLabel), CLOSE.askQuestion, CLOSE.line,
    label(CONTACT.kicker), CONTACT.heading, CONTACT.subline,
    bullets([
      link(CONTACT.buttons.book, SOCIAL_LINKS.schedule),
      link(CONTACT.buttons.email, SOCIAL_LINKS.email),
      // "Ask your AI" opens a menu: the three assistants (each prefilled with the prompt) and a copy action.
      CONTACT.buttons.askAi,
      ...ASSISTANTS.map((a) => link(a.name, a.href(CONTACT.aiPrompt))),
      ASK_AI.copy,
    ]),
  );
  return blocks.join("\n\n") + "\n";
}
