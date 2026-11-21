import { metaLine, readLabel, type JournalMeta } from "./journalIndex";
import { formatListenDuration, listenSummaryFor } from "./listenSummaries";

/**
 * The note's meta line on the Field Notes index. A note with a recorded summary says so right after its reading time:
 * "8 min or 1 min to listen · tested on Rose". Notes without a summary keep `metaLine` exactly. The Markdown mirrors keep `metaLine`.
 */
export const metaLineWithListen = (e: JournalMeta): string => {
  const found = listenSummaryFor(`/journal/${e.slug}`);
  const line = metaLine(e);
  if (!found) return line;
  // After the reading time itself ("18 min"), before any other part of the read label ("31 with every detail open").
  const time = readLabel(e).split(" · ")[0];
  return line.replace(time, `${time} or ${formatListenDuration(found.summary.durationMs / 1000)} to listen`);
};
