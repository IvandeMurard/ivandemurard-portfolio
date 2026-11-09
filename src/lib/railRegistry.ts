/**
 * The section the page's own rail says the reader is in, at the moment of a click.
 * A page that has a rail (SectionRail, or the Rose case study's chapter list) registers a function that returns
 * the rail's active item, so "where the reader is" is read from the same logic as the rail's highlight and is
 * never worked out a second time.
 */
export type RailItem = { id: string; label: string };

let current: (() => RailItem | null) | null = null;

/** Registers the rail of the page on screen. Returns the cleanup. */
export const registerRail = (active: () => RailItem | null): (() => void) => {
  current = active;
  return () => { if (current === active) current = null; };
};

/** The rail's active item, or null when the page has no rail or the rail has no active item yet. */
export const activeRailItem = (): RailItem | null => current?.() ?? null;
