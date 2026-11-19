/** "## " headings of a Markdown document, in order. */
export function outline(md: string): string[] {
  return md.split("\n").filter((l) => /^## /.test(l)).map((l) => l.slice(3).trim());
}

/** One "## " section (heading included), matched case-insensitively on part of its title; null when absent. */
export function section(md: string, query: string): string | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^## /.test(l) && l.slice(3).toLowerCase().includes(q));
  if (start < 0) return null;
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end < 0) end = lines.length;
  return lines.slice(start, end).join("\n").trim();
}
