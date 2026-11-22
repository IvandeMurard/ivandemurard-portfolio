import { Icon } from "@/components/ui/Icon";
import { formatClockLength, listenSummaryBySlug } from "@/content/listenSummaries";
import { ROSE_STATUS } from "@/content/roseStatus";
import { formatClock } from "@/components/rose/listen/listenAlign";
import { useListenOptional, useListenPosition } from "./ListenProvider";
import { summaryRequest } from "./summaryRequest";

/**
 * "▶ Listen · 1:14", the first line of the fixed "On this page" list on desktop. On a phone the list folds, and the
 * starter question in the dock is the way in. Nothing here starts by itself.
 */
export const ListenTocLine = ({ slug, className = "" }: { slug: string; className?: string }) => {
  const summary = listenSummaryBySlug(slug);
  const L = useListenOptional();
  const position = useListenPosition();
  if (!summary || !L || ROSE_STATUS === "paused") return null;
  const mine = L.current?.id === `summary:${slug}` && L.phase !== "idle";
  const playing = mine && L.playing;
  const length = mine && L.phase === "ready" && !L.ended ? `${formatClock(position)} / ${formatClock(L.durationMs)}` : formatClockLength(summary.durationMs);
  return (
    <button
      type="button"
      data-listen-toc
      aria-label={playing ? "Pause the summary" : mine && L.ended ? "Replay the summary" : "Listen to the summary of this page"}
      onClick={() => (mine ? L.toggle() : L.start(summaryRequest(slug, "contents")))}
      className={`mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[var(--listen-line)] bg-[var(--listen-row)] pl-2 pr-3.5 text-meta text-[color:var(--listen-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)] ${className}`}
    >
      <Icon name={playing ? "pause" : mine && L.ended ? "replay" : "play_arrow"} className="text-[20px]" />
      <span>Listen · <span className="tabular-nums">{length}</span></span>
    </button>
  );
};

export default ListenTocLine;
