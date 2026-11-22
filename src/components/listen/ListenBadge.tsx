import { Icon } from "@/components/ui/Icon";
import { formatClockLength, listenSummaryBySlug } from "@/content/listenSummaries";
import { ROSE_STATUS } from "@/content/roseStatus";
import { useListenOptional } from "./ListenProvider";
import { summaryRequest } from "./summaryRequest";

/**
 * "▶ 1:04" on an index card that has a recorded summary. It starts the reading without opening the page. A card with no
 * summary gets nothing, not an empty slot. It sits above the card's stretched link, as its own focus stop.
 */
export const ListenBadge = ({ slug, title, tone = "page" }: { slug: string; title: string; tone?: "page" | "card" }) => {
  const summary = listenSummaryBySlug(slug);
  const L = useListenOptional();
  if (!summary || !L || ROSE_STATUS === "paused") return null;
  const mine = L.current?.id === `summary:${slug}` && L.phase !== "idle";
  const playing = mine && L.playing;
  return (
    <button
      type="button"
      data-listen-badge={slug}
      aria-label={`${playing ? "Pause" : "Listen to"} the summary of ${title}, ${formatClockLength(summary.durationMs)}`}
      onClick={() => (mine ? L.toggle() : L.start(summaryRequest(slug, "index_card", { title })))}
      className={`relative z-10 inline-flex min-h-11 items-center gap-1 rounded-full border pl-2 pr-3 text-meta tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)] ${
        tone === "card"
          ? "border-case-ink/40 text-case-ink hover:border-case-ink"
          : "border-[var(--listen-line)] bg-[var(--listen-row)] text-[color:var(--listen-ink)]"
      }`}
    >
      <Icon name={playing ? "pause" : "play_arrow"} className="text-[20px]" />
      {formatClockLength(summary.durationMs)}
    </button>
  );
};

export default ListenBadge;
