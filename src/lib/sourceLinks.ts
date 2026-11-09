import { PROJECTS } from "@/content/site";
import { COMPASS_SECTIONS, type CompassSection } from "@/content/compass";
import { AETHERIX_SECTIONS, TACET_SECTIONS, type PageSection } from "@/content/pageSections";

/**
 * Labels for the source links in Rose's answers. Everything comes from registries that already exist
 * (site.ts for page titles, the section lists of the case-study pages, the Compass content tree).
 * A page or section no registry covers returns null, and the caller keeps Rose's own link text.
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
  sections.flatMap((s) => [{ id: s.id, label: s.title }, ...flattenCompass(s.subsections ?? [])]);

const SECTION_REGISTRY: Record<string, PageSection[]> = {
  "/aetherix": AETHERIX_SECTIONS,
  "/tacet": TACET_SECTIONS,
  "/compass": flattenCompass(COMPASS_SECTIONS),
};

export const sectionLabelFor = (path: string, id: string): string | null =>
  SECTION_REGISTRY[path]?.find((s) => s.id === id)?.label ?? null;

/** The page's name in site.ts. Pages outside the case studies are not in any registry. */
export const pageTitleFor = (path: string): string | null => {
  const p = path === "/atherix" ? "/aetherix" : path;
  return Object.values(PROJECTS).find((project) => `/${project.slug}` === p)?.name ?? null;
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
