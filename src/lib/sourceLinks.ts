/**
 * Labels for the source links in Rose's answers. This module is light: the registry itself
 * (src/content/sourceLabels.ts: the section lists, the Field Notes index, the page names) is a separate chunk,
 * loaded when the dock opens or Rose is asked. A link that renders before the registry has loaded shows Rose's own
 * text, and keeps it: a label never changes after it has rendered.
 */

export type InternalTarget = { path: string; hash: string };
export type SourceLabel = { text: string; full?: string; title?: string };

type Labels = typeof import("@/content/sourceLabels");
let loaded: Labels | null = null;
let loading: Promise<Labels | null> | null = null;

/** Starts loading the registry (once). Safe to call from anywhere, as often as needed. */
export const loadSourceLabels = (): Promise<Labels | null> => {
  loading ??= import("@/content/sourceLabels").then((m) => (loaded = m)).catch(() => { loading = null; return null; });
  return loading;
};

export const sourceLabelsLoaded = (): boolean => loaded !== null;

/** Splits a site-relative href into path and decoded hash (without "#"). Null for anything else. */
export const splitInternal = (href: string): InternalTarget | null => {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const m = href.match(/^([^?#]*)(?:\?[^#]*)?(?:#(.*))?$/);
  if (!m) return null;
  let hash = m[2] ?? "";
  try { hash = decodeURIComponent(hash); } catch { /* keep the raw id */ }
  return { path: m[1].replace(/\/$/, "") || "/", hash };
};

/** The label of an internal link, or Rose's own text while the registry has not loaded. */
export const internalSourceLabel = (href: string, text: string): SourceLabel =>
  loaded ? loaded.internalSourceLabel(href, text) : { text };

/** The heading of a section from the registry, or null (not loaded, or in no registry). */
export const sectionLabelFor = (path: string, id: string): string | null => loaded?.sectionLabelFor(path, id) ?? null;

/**
 * Title of the page the reader is on: the registry's, else the document title without the site suffix.
 * `full` asks for a Field Note's whole title (the context line); otherwise the short one.
 */
export const currentPageTitle = (path: string, doc: Document = document, full = false): string => {
  const fromRegistry = loaded?.pageTitleFor(path, full);
  if (fromRegistry) return fromRegistry;
  return doc.title.replace(/\s+·\s+Ivan de Murard$/, "").trim() || "this page";
};
