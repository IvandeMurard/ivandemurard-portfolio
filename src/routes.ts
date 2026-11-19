import { createElement, type ComponentType } from "react";

/**
 * The page behind each route, loaded on demand. The homepage (Index) is not here: it stays in the main bundle.
 *
 * This is React.lazy with one change. React.lazy suspends on its first render even when the chunk is already in the
 * module cache, and on the first load that commits a Suspense fallback over the prerendered HTML in #root (measured:
 * 5 frames with no heading on /aetherix, /rose and the journal notes). Here, main.tsx calls load() for the first route
 * before it renders; from then on the component renders at once, with no suspension. On a client navigation the
 * component still suspends until its chunk arrives, exactly like React.lazy.
 */
export interface Page {
  Component: ComponentType;
  /** Fetch the chunk. Resolves when the page is ready to render, rejects when the chunk cannot be fetched. */
  load: () => Promise<void>;
}

const page = (importer: () => Promise<{ default: ComponentType }>): Page => {
  let Loaded: ComponentType | null = null;
  let failure: unknown = null;
  let pending: Promise<void> | null = null;
  const load = () =>
    (pending ??= importer().then(
      (m) => { Loaded = m.default; },
      (e) => { failure = e; throw e; },
    ));
  const Component = () => {
    if (failure) throw failure;
    if (!Loaded) throw load();
    return createElement(Loaded);
  };
  return { Component, load };
};

export const pages = {
  CaseStudies: page(() => import("./pages/CaseStudies.tsx")),
  Sonor: page(() => import("./pages/Sonor.tsx")),
  Atherix: page(() => import("./pages/Atherix.tsx")),
  Tacet: page(() => import("./pages/Tacet.tsx")),
  Lore: page(() => import("./pages/Lore.tsx")),
  Anima: page(() => import("./pages/Anima.tsx")),
  Compass: page(() => import("./pages/Compass.tsx")),
  Architecture: page(() => import("./pages/Architecture.tsx")),
  Atrium: page(() => import("./pages/Atrium.tsx")),
  Contact: page(() => import("./pages/Contact.tsx")),
  Cv: page(() => import("./pages/Cv.tsx")),
  Agents: page(() => import("./pages/Agents.tsx")),
  RoseCasePage: page(() => import("./pages/RoseDesignLab.tsx").then((m) => ({ default: m.RoseCasePage }))),
  RoseDesignLab: page(() => import("./pages/RoseDesignLab.tsx")),
  Privacy: page(() => import("./pages/Privacy.tsx")),
  AdminRose: page(() => import("./pages/AdminRose.tsx")),
  Journal: page(() => import("./pages/Journal.tsx")),
  JournalEntry: page(() => import("./pages/JournalEntry.tsx")),
  NotFound: page(() => import("./pages/NotFound.tsx")),
} satisfies Record<string, Page>;

/** Path to page, one entry per <Route> in App.tsx. A redirect names the page it ends on. "/" is Index, in the main bundle. */
const BY_PATH: Record<string, Page | null> = {
  "/": null,
  "/case-studies": pages.CaseStudies,
  "/journeys": pages.CaseStudies,
  "/sonor": pages.Sonor,
  "/aetherix": pages.Atherix,
  "/atherix": pages.Atherix,
  "/tacet": pages.Tacet,
  "/lore": pages.Lore,
  "/anima": pages.Anima,
  "/compass": pages.Compass,
  "/architecture": pages.Architecture,
  "/atrium": pages.Atrium,
  "/contact": pages.Contact,
  "/cv": pages.Cv,
  "/agents": pages.Agents,
  "/rose": pages.RoseCasePage,
  "/rose/lab": pages.RoseDesignLab,
  "/privacy": pages.Privacy,
  "/admin/rose": pages.AdminRose,
  "/journal": pages.Journal,
};

/** The page a URL ends on, or null when that page is already in the main bundle (the homepage). */
export const pageFor = (pathname: string, search = ""): Page | null => {
  const path = (pathname.replace(/\/+$/, "") || "/").toLowerCase();
  // Same rule as RoseDesignLabRedirect: ?concept= goes to the lab, anything else to the case study.
  if (path === "/rose-design-lab") return new URLSearchParams(search).get("concept") === null ? pages.RoseCasePage : pages.RoseDesignLab;
  if (path in BY_PATH) return BY_PATH[path];
  if (/^\/journal\/[^/]+$/.test(path)) return pages.JournalEntry;
  return pages.NotFound;
};

/** Fetch the chunk of the page a URL ends on. Resolves at once when there is nothing to fetch. */
export const preloadRoute = (pathname: string, search = ""): Promise<void> => pageFor(pathname, search)?.load() ?? Promise.resolve();
