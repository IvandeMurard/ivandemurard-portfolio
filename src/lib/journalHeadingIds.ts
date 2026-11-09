// The ids of a Field Note's headings. One definition, used by the page (JournalEntry) and by the section index
// generator, so a link to "#6-acceptance-criteria-the-part-everyone-skips" means the same thing on both sides.
// Asset-free: it runs under the generator scripts.

export const slugifyHeading = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

/** For each block of the body: the id of its heading (h2, h3), undefined for any other block. Repeats get -2, -3. */
export const journalHeadingIds = (body: ReadonlyArray<{ kind: string; text?: string }>): Array<string | undefined> => {
  const used = new Map<string, number>();
  return body.map((b) => {
    if ((b.kind !== "h2" && b.kind !== "h3") || b.text === undefined) return undefined;
    const base = slugifyHeading(b.text);
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  });
};
