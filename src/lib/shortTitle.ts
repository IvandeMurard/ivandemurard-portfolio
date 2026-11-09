// The short title of a Field Note, for a link label: its homepage title if it has one, else the title up to and
// including the first "?", else up to the first ":", else the full title. Asset-free: the generator uses it too.

export const shortNoteTitle = (title: string, homeTitle?: string): string => {
  if (homeTitle?.trim()) return homeTitle.trim();
  const q = title.indexOf("?");
  if (q >= 0) return title.slice(0, q + 1).trim();
  const c = title.indexOf(":");
  if (c > 0) return title.slice(0, c).trim();
  return title;
};
