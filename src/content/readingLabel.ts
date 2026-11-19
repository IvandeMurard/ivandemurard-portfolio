// Asset-free and body-free: the Field Notes index reads it without loading any note content.
/** The full count is worth saying when it is at least this many minutes longer than the default one. */
export const FULL_GAP_MINUTES = 5;

/**
 * The reading-time label, computed: "18 min", or "18 min · 36 with every detail open" when the full count is at least
 * five minutes longer. Never typed.
 */
export const readingLabel = (visible: number, full?: number): string =>
  full !== undefined && full - visible >= FULL_GAP_MINUTES ? `${visible} min · ${full} with every detail open` : `${visible} min`;
