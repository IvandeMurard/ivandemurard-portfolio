import { PROJECTS } from "@/content/site";
import { COMPASS_SECTIONS, type CompassSection } from "@/content/compass";
import { OTHER_PAGE_TITLES, PAGE_SECTIONS, type PageSection } from "@/content/pageSections";
import { SECTION_INDEX } from "@/content/sectionIndex.generated";

/**
 * Labels for the source links in Rose's answers. Everything comes from registries that already exist:
 * pageSections.ts (the case-study pages), site.ts (page titles), the Compass content tree and the generated
 * index of the Field Notes (sectionIndex.generated.ts). Only an id that is in none of them returns null, and the
 * caller then keeps Rose's own link text.
 */

export type InternalTarget = { path: string; hash: string };

/** Splits a site-relative href into path and decoded hash (without "#"). Null for anything else. */
export const splitInternal = (href: string): InternalTarget | null => {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const m = href.match(/^([^?#]*)(?:\?[^#]*)?(?:#(.*))?$/);
  if (!m) return null;
  let hash = m[2] ?? "";
  try { hash = decodeURIComponent(hash); } catch { /* keep the raw id */ }
  return { path: m[1].replace(/\/$/, "") || "/", hash };
};

const flattenCompass = (sections: CompassSection[]): PageSection[] =>
  sections.flatMap((s) => [{ id: s.id, label: s.title, heading: s.title }, ...flattenCompass(s.subsections ?? [])]);

const COMPASS_LIST = flattenCompass(COMPASS_SECTIONS);
const JOURNAL = new Map(SECTION_INDEX.map((e) => [e.path, e]));

/** The sections of a page that have a heading, wherever the registry keeps them. */
export const sectionsFor = (path: string): PageSection[] => {
  if (path === "/compass") return COMPASS_LIST;
  const note = JOURNAL.get(path);
  if (note) return note.sections.map((s) => ({ id: s.id, label: s.heading, heading: s.heading }));
  return PAGE_SECTIONS[path] ?? [];
};

/** The heading text of a section, or null when no registry has the id. */
export const sectionLabelFor = (path: string, id: string): string | null =>
  sectionsFor(path).find((s) => s.id === id)?.heading ?? null;

/** The page's name: site.ts for the case studies, the Field Notes index for the notes, pageSections.ts for the rest. */
export const pageTitleFor = (path: string): string | null => {
  const p = path === "/atherix" ? "/aetherix" : path;
  return (
    Object.values(PROJECTS).find((project) => `/${project.slug}` === p)?.name ??
    JOURNAL.get(p)?.title ??
    OTHER_PAGE_TITLES[p] ??
    null
  );
};

/** Title of the page the reader is on now: the registry, else the document title without the site suffix. */
export const currentPageTitle = (path: string, doc: Document = document): string => {
  const fromRegistry = pageTitleFor(path);
  if (fromRegistry) return fromRegistry;
  return doc.title.replace(/\s+·\s+Ivan de Murard$/, "").trim() || "this page";
};

export type SourceLabel = { text: string; full?: string };

/**
 * "§ Section" for a link with a #section, "§ Page title" for a link without one. Where no registry covers
 * the target, or where Rose's own text already is the page's name (a project mention), the text is kept.
 * `full` is the accessible name: the label plus the page it belongs to.
 */
export const internalSourceLabel = (href: string, text: string): SourceLabel => {
  const target = splitInternal(href);
  if (!target) return { text };
  const title = pageTitleFor(target.path);
  if (target.hash) {
    const section = sectionLabelFor(target.path, target.hash);
    if (!section) return { text };
    return { text: `§ ${section}`, full: `§ ${section}${title ? ` (${title})` : ""}` };
  }
  if (!title || text.trim().toLowerCase() === title.toLowerCase()) return { text };
  return { text: `§ ${title}`, full: `§ ${title}` };
};
