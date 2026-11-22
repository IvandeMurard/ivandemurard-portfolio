import { Icon } from "@/components/ui/Icon";
import { LISTEN_SECTION_HEADING, formatClockLength, listenSummaryBySlug, listenSummaryNotice } from "@/content/listenSummaries";
import { ROSE_STATUS } from "@/content/roseStatus";
import { formatClock } from "@/components/rose/listen/listenAlign";
import { useListenOptional, useListenPosition } from "./ListenProvider";
import { summaryRequest, useSummaryBars } from "./summaryRequest";


/** One bar in three of the full waveform, 2 px each: the row's own small waveform. */
const miniBars = (bars: number[]): number[] => bars.filter((_, i) => i % 3 === 0);

/**
 * The Listen row, under the title of a page that has a recorded summary: one line, 64 px, folded. A round play button,
 * "Listen, read by Rose", a small waveform that fills while it plays, the length (or "0:23 / 1:14" while reading).
 * "Transcript" opens the text under the row; it is a plain <details>, so it opens without JavaScript, where the audio
 * file is linked too. Every word comes from src/content/listenSummaries.ts, the same source as the dock, the Markdown
 * mirrors, llms-full.txt and MCP.
 */
export const ListenRow = ({ slug, className = "" }: { slug: string; className?: string }) => {
  const summary = listenSummaryBySlug(slug);
  const L = useListenOptional();
  const position = useListenPosition();
  const fileBars = useSummaryBars(slug);
  if (!summary) return null;

  const id = `summary:${slug}`;
  const mine = L?.current?.id === id && L.phase !== "idle";
  const playing = mine && L!.playing;
  const bars = mine && L!.bars ? L!.bars : fileBars;
  const small = bars ? miniBars(bars) : null;
  const duration = mine && L!.phase === "ready" ? L!.durationMs : summary.durationMs;
  const fraction = mine && duration ? Math.min(1, position / duration) : 0;
  const canPlay = !!L && ROSE_STATUS !== "paused";
  const label = summary.inRoseVoice ? "Listen, in Rose's voice" : "Listen, read by Rose";
  const paragraphs = summary.text.split(/\n{2,}/);

  const onPlay = () => {
    if (!L) return;
    if (mine) L.toggle();
    else L.start(summaryRequest(slug, "row"));
  };

  return (
    <section aria-label={LISTEN_SECTION_HEADING} data-listen-summary={slug} className={className}>
      <div
        data-listen-row
        data-state={!mine ? "rest" : L!.ended ? "ended" : playing ? "playing" : "paused"}
        className="flex h-16 items-center gap-3 rounded-full border border-[var(--listen-line)] bg-[var(--listen-row)] py-2 pl-2.5 pr-5 text-[color:var(--listen-ink)]"
      >
        {canPlay ? (
          <button
            type="button"
            onClick={onPlay}
            aria-label={mine && L!.ended ? "Replay the summary" : playing ? "Pause the summary" : "Play the summary"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--listen-ink)] text-[color:var(--listen-surface)] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)] focus-visible:ring-offset-2"
          >
            <Icon name={mine && L!.ended ? "replay" : playing ? "pause" : "play_arrow"} className="text-[26px]" />
          </button>
        ) : null}
        <p className="min-w-0 shrink text-[15px] font-medium leading-tight">{label}</p>
        <span aria-hidden="true" data-listen-mini-wave className="hidden h-6 min-w-0 flex-1 items-center justify-between gap-[3px] sm:flex">
          {small ? small.map((v, i) => (
            <span
              key={i}
              style={{ width: 2, height: `${Math.round(5 + v * 19)}px`, background: i / small.length < fraction ? "var(--listen-played)" : "var(--listen-unplayed)" }}
              className="shrink-0 rounded-full"
            />
          )) : (
            <span className="relative block h-[2px] w-full rounded-full" style={{ background: "var(--listen-unplayed)" }}>
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${fraction * 100}%`, background: "var(--listen-played)" }} />
            </span>
          )}
        </span>
        <span className="ml-auto shrink-0 text-meta tabular-nums text-[color:var(--listen-soft)] sm:ml-0" data-listen-length>
          {mine && L!.phase === "ready" && !L!.ended ? `${formatClock(position)} / ${formatClock(duration)}` : formatClockLength(summary.durationMs)}
        </span>
      </div>
      <details className="group mt-2">
        <summary className="inline-flex min-h-11 cursor-pointer items-center rounded-sm px-1 text-meta text-[color:var(--listen-soft)] hover:text-[color:var(--listen-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)] [&::-webkit-details-marker]:hidden">
          Transcript <span aria-hidden="true" className="ml-1 transition-transform group-open:rotate-180 motion-reduce:transition-none">▾</span>
        </summary>
        <div className="mt-1 max-w-[42rem] rounded-2xl border border-[var(--listen-line)] bg-[var(--listen-row)] px-5 py-4">
          <h2 className="font-mono text-kicker font-medium uppercase tracking-[0.12em] text-[color:var(--listen-kicker)]">{LISTEN_SECTION_HEADING}</h2>
          <p className="mt-1 text-meta text-[color:var(--listen-soft)]" data-listen-notice>{listenSummaryNotice(summary)}</p>
          <div className="mt-3 space-y-3 font-body text-[15px] leading-relaxed text-[color:var(--listen-ink)]" data-listen-text>
            {paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <p className="mt-3 text-meta">
            <a href={`/listen/${slug}.mp3`} className="text-[color:var(--listen-kicker)] underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]">Audio file (mp3)</a>
          </p>
        </div>
      </details>
    </section>
  );
};

export default ListenRow;
