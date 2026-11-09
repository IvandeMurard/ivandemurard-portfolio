import { PROJECTS } from "@/content/site";
import { OTHER_PAGE_TITLES, PAGE_SECTIONS, type PageSection } from "@/content/pageSections";
import { SECTION_INDEX } from "@/content/sectionIndex.generated";
import { inSentence, splitInternal, type SourceLabel } from "@/lib/sourceLinks";

/**
 * The registry behind the "§" labels of Rose's source links, loaded on demand (sourceLinks.loadSourceLabels):
 * pageSections.ts (the section lists of the pages, Compass included), the generated index of the Field Notes
 * and the page names of site.ts. Nothing here is imported statically by the dock.
 */

const NOTES = new Map(SECTION_INDEX.map((e) => [e.path, e]));

/** The sections of a page, wherever the registry keeps them. */
export const sectionsFor = (path: string): PageSection[] => {
  const note = NOTES.get(path);
  if (note) return note.sections.map((s) => ({ id: s.id, label: s.heading, heading: s.heading }));
  return PAGE_SECTIONS[path] ?? [];
};

/** The heading text of a section, or null when no registry has the id. */
export const sectionLabelFor = (path: string, id: string): string | null =>
  sectionsFor(path).find((s) => s.id === id)?.heading ?? null;

/** The page's name. `full` gives a Field Note's whole title; otherwise its short one. */
export const pageTitleFor = (path: string, full = false): string | null => {
  const p = path === "/atherix" ? "/aetherix" : path;
  const note = NOTES.get(p);
  if (note) return full ? note.title : note.short;
  return Object.values(PROJECTS).find((project) => `/${project.slug}` === p)?.name ?? OTHER_PAGE_TITLES[p] ?? null;
};

/**
 * The return name of a page, for "Back to ...": Rose's case study, "the {Name} case study", a Field Note's short title.
 * Null for any other page, which is called by its h1 (sourceLinks.currentReturnName).
 */
export const returnNameFor = (path: string): string | null => {
  if (path === "/rose-design-lab") return "Rose's case study";
  const p = path === "/atherix" ? "/aetherix" : path;
  const note = NOTES.get(p);
  if (note) return inSentence(note.short);
  const project = Object.values(PROJECTS).find((x) => `/${x.slug}` === p);
  return project ? `the ${project.name} case study` : null;
};

/**
 * "§ Section" for a link with a #section, "§ Page title" for a link without one; a final full stop is dropped, the
 * label sits inside Rose's sentence. Where no registry covers the target, or where Rose's own text already is the
 * page's name (a project mention), the text is kept.
 * `full` is the accessible name, without the section sign: "{Section}, in {Page full title}" for a section,
 * "{Full title}" for a page. `title` is the whole title, shown on hover when the label is a short one.
 */
export const internalSourceLabel = (href: string, text: string): SourceLabel => {
  const target = splitInternal(href);
  if (!target) return { text };
  const short = pageTitleFor(target.path);
  const full = pageTitleFor(target.path, true);
  const hover = full && full !== short ? full : undefined;
  if (target.hash) {
    const section = sectionLabelFor(target.path, target.hash);
    if (!section) return { text };
    const name = inSentence(section);
    // "Section, in Page"; after a "?" or "!" the comma would double the punctuation, so it reads "Section? In Page".
    const join = /[?!]$/.test(name) ? " In " : ", in ";
    return { text: `\u00a7 ${name}`, full: full ? `${name}${join}${inSentence(full)}` : name, title: hover };
  }
  if (!short || text.trim().toLowerCase() === inSentence(short).toLowerCase()) return { text };
  return { text: `\u00a7 ${inSentence(short)}`, full: inSentence(full ?? short), title: hover };
};
