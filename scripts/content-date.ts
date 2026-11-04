import { existsSync, readFileSync, writeFileSync } from "fs";

// Date stamps in generated files follow the content, not the clock. A build with no content change rewrites no file.
//
// stableDate keeps the date already in the committed file when rendering the content again with that date gives
// the same file, and uses today's date only when the content changed. No git history is needed, so it works in a
// fresh checkout (CI, Lovable) as well as locally.

/** Today as YYYY-MM-DD. BUILD_TODAY overrides it, so a test can build "on another day". */
export const buildToday = (): string => process.env.BUILD_TODAY ?? new Date().toISOString().slice(0, 10);

/** Line endings differ between a Windows checkout and a build; they are not a content change. */
export const normalizeEol = (text: string): string => text.replace(/\r\n/g, "\n");

/**
 * @param render the file(s) the generator would write, for a given date, as one string
 * @param existing the same file(s) as they are on disk now, joined the same way, or null if one is missing
 * @param existingDate the date stamped in the existing file, or null
 * @param today the date to stamp when the content changed
 */
export function stableDate({ render, existing, existingDate, today }: {
  render: (date: string) => string;
  existing: string | null;
  existingDate: string | null;
  today: string;
}): string {
  if (existing === null || !existingDate) return today;
  return normalizeEol(render(existingDate)) === normalizeEol(existing) ? existingDate : today;
}

/** Writes the file only if its content changed (line endings aside), so an unchanged build touches nothing. */
export function writeIfChanged(path: string, text: string): boolean {
  if (existsSync(path) && normalizeEol(readFileSync(path, "utf8")) === normalizeEol(text)) return false;
  writeFileSync(path, text);
  return true;
}
