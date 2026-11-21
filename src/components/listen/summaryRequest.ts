import { useEffect, useState } from "react";
import { listenSummaryBySlug } from "@/content/listenSummaries";
import { loadSummaryAudio } from "@/components/rose/listen/listenClient";
import type { ListenEntry } from "@/components/rose/roseEvents";
import type { ListenRequest } from "./ListenProvider";

/** The title of the page the reader is on, without the site suffix: what the lock screen and the mini-player show. */
export const pageTitle = (): string =>
  (typeof document === "undefined" ? "" : document.title).replace(/\s*[·|]\s*Ivan de Murard.*$/i, "").trim() || "Ivan de Murard";

/** What the provider needs to read the recorded summary `slug`. Throws on an unknown slug: callers check `listenSummaryBySlug` first. */
export const summaryRequest = (slug: string, entry: ListenEntry, opts: { title?: string; openPlayer?: boolean } = {}): ListenRequest => {
  const s = listenSummaryBySlug(slug);
  if (!s) throw new Error(`No Listen summary for ${slug}`);
  return { id: `summary:${slug}`, kind: "summary", title: opts.title ?? pageTitle(), entry, load: () => loadSummaryAudio(slug), fallbackText: s.text, openPlayer: opts.openPlayer };
};

const barsCache = new Map<string, Promise<number[] | null>>();
/** The 72 bars of a recorded summary, for a row that is not playing. null until loaded, and when the take has none. */
export const useSummaryBars = (slug: string): number[] | null => {
  const [bars, setBars] = useState<number[] | null>(null);
  useEffect(() => {
    let dead = false;
    if (!barsCache.has(slug)) barsCache.set(slug, loadSummaryAudio(slug).then((d) => d.bars ?? null).catch(() => null));
    void barsCache.get(slug)!.then((b) => { if (!dead) setBars(b); });
    return () => { dead = true; };
  }, [slug]);
  return bars;
};
