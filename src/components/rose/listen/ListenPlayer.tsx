import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { CompassMark } from "../CompassMark";
import { formatClock, segmentIndexOfWord, segmentsOf } from "./listenAlign";
import { LISTEN_RATES, SEEK_STEP_MS, useListen, useListenPosition } from "@/components/listen/ListenProvider";
import { ListenWave, useReducedMotion } from "./ListenWave";

/** What the dock does when the reader goes back to the chat. */
export const OPEN_CONVERSATION_EVENT = "rose:open";

const CTRL = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[color:var(--listen-ink)] hover:bg-[var(--listen-row)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)] disabled:opacity-50";

/**
 * The Listen player (board R), in the dock. One phrase at a time: the words spoken in ink, the words to come lighter,
 * the previous phrase above it. The waveform is also the progress bar. Read shows the whole text, same position.
 * No live region: the highlight must not be announced word by word.
 */
export const ListenPlayer = () => {
  const L = useListen();
  const positionMs = useListenPosition();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"listen" | "read">("listen");
  const currentRef = useRef<HTMLSpanElement>(null);

  const words = L.words;
  const segments = useMemo(() => segmentsOf(words), [words]);
  const [from, to] = L.activeAt(positionMs);
  const started = from >= 0;
  const seg = segmentIndexOfWord(segments, Math.max(0, from));
  const segment = segments[seg];
  const previous = seg > 0 ? segments[seg - 1] : null;
  const ready = L.phase === "ready";
  const answer = L.current?.kind === "answer";
  const device = L.engine === "speech" && ready;

  // Read mode keeps the phrase being read in view.
  useEffect(() => {
    if (mode === "read") currentRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [mode, seg]);

  const wordTone = (i: number): "ink" | "upcoming" => {
    // Reduced motion: the whole phrase in full ink, no word-by-word change. Before the start and at the end too.
    if (reduced || !started || L.ended || i <= to || i < from) return "ink";
    return "upcoming";
  };
  const phrase = (s: { from: number; to: number }) => words.slice(s.from, s.to + 1);

  const rateIndex = LISTEN_RATES.indexOf(L.rate);
  const nextRate = LISTEN_RATES[(rateIndex + 1) % LISTEN_RATES.length];

  return (
    <section
      aria-label="Rose reads aloud"
      aria-live="off"
      data-listen-player
      data-mode={mode}
      className="flex max-h-[min(640px,88vh)] flex-col overflow-y-auto rounded-t-2xl border border-[var(--listen-line)] bg-[var(--listen-surface)] p-5 text-[color:var(--listen-ink)] shadow-xl md:rounded-2xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <CompassMark className="h-8 w-8 shrink-0 text-[color:var(--listen-kicker)]" />
          <div className="min-w-0">
            <p className="font-mono text-[12px] font-medium uppercase leading-tight tracking-[0.12em] text-[color:var(--listen-kicker)]" data-listen-label>
              Rose · {answer ? "answer" : "summary of this page"}
              {device ? <span data-listen-device> · Your device's voice</span> : null}
            </p>
            <p className="mt-0.5 truncate text-meta text-[color:var(--listen-soft)]">{L.current?.title}</p>
          </div>
        </div>
        <div role="group" aria-label="Read or listen" className="flex shrink-0 rounded-full border border-[var(--listen-line)] p-0.5 text-meta">
          {(["listen", "read"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => { if (m === "read" && L.playing) L.pause(); setMode(m); }}
              className={cn(
                "min-h-[36px] rounded-full px-3.5 capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]",
                mode === m ? "bg-[var(--listen-ink)] text-[color:var(--listen-surface)]" : "text-[color:var(--listen-soft)]",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "listen" ? (
        <div className="mt-5 min-h-[150px]" data-listen-text>
          {previous ? (
            <p className="mb-2 font-headline text-[18px] leading-[1.4]" style={{ color: "var(--listen-ghost)" }} data-listen-previous>{phrase(previous).join(" ")}</p>
          ) : null}
          {segment ? (
            <p className="font-headline text-[26px] leading-[1.3] md:text-[31px]" data-listen-phrase>
              {phrase(segment).map((w, k) => {
                const i = segment.from + k;
                return (
                  <Fragment key={i}>
                    <span data-word={i} data-tone={wordTone(i)} style={{ color: wordTone(i) === "ink" ? "var(--listen-ink)" : "var(--listen-upcoming)" }} className="transition-colors motion-reduce:transition-none">{w}</span>{" "}
                  </Fragment>
                );
              })}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 max-h-[260px] overflow-y-auto font-body text-[16px] leading-[1.6]" data-listen-text data-listen-full>
          {segments.map((s, k) => (
            <span key={k} ref={k === seg ? currentRef : undefined} data-current={k === seg || undefined}
              style={{ color: k === seg ? "var(--listen-ink)" : "var(--listen-ghost)", fontWeight: k === seg ? 600 : 400 }}>
              {phrase(s).join(" ")}{" "}
            </span>
          ))}
        </p>
      )}

      <ListenWave
        className="mt-4"
        bars={device ? null : L.bars}
        positionMs={positionMs}
        durationMs={L.durationMs}
        disabled={!ready}
        onSeek={L.seek}
      />
      <p className="mt-1 text-right text-meta tabular-nums text-[color:var(--listen-soft)]">
        {ready ? `${formatClock(positionMs)} / ${formatClock(L.durationMs)}` : "Loading"}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-1">
          <button type="button" className={CTRL} aria-label="Back 10 seconds" disabled={!ready} onClick={() => L.skip(-SEEK_STEP_MS)}>
            <Icon name="replay_10" className="text-[26px]" />
          </button>
          <button
            type="button"
            onClick={L.toggle}
            disabled={!ready}
            aria-label={L.ended ? "Replay" : L.playing ? "Pause" : "Play"}
            className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[var(--listen-ink)] text-[color:var(--listen-surface)] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <Icon name={L.ended ? "replay" : L.playing ? "pause" : "play_arrow"} className="text-[34px]" />
          </button>
          <button type="button" className={CTRL} aria-label="Forward 10 seconds" disabled={!ready} onClick={() => L.skip(SEEK_STEP_MS)}>
            <Icon name="forward_10" className="text-[26px]" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={cn(CTRL, "w-auto min-w-[44px] px-2 text-meta tabular-nums")}
            aria-label={`Speed ${L.rate}, change to ${nextRate}`}
            onClick={() => L.setRate(nextRate)}
          >
            {L.rate}×
          </button>
          <button type="button" className={CTRL} aria-label={L.muted ? "Unmute" : "Mute"} aria-pressed={L.muted} onClick={() => L.setMuted(!L.muted)}>
            <Icon name={L.muted || L.volume === 0 ? "volume_off" : "volume_up"} className="text-[24px]" />
          </button>
          {L.volumeSettable ? (
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={L.muted ? 0 : L.volume}
              onChange={(e) => L.setVolume(Number(e.target.value))}
              aria-label="Volume"
              data-listen-volume
              className="h-11 w-20 cursor-pointer accent-[color:var(--listen-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]"
            />
          ) : null}
        </div>
      </div>

      {L.ended ? (
        <button
          type="button"
          data-listen-ask
          onClick={() => { L.setPlayerOpen(false); window.dispatchEvent(new CustomEvent(OPEN_CONVERSATION_EVENT)); }}
          className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--listen-line)] px-4 text-meta text-[color:var(--listen-ink)] hover:bg-[var(--listen-row)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]"
        >
          Ask Rose about it
        </button>
      ) : null}
      <button
        type="button"
        data-listen-back
        onClick={() => { L.setPlayerOpen(false); window.dispatchEvent(new CustomEvent(OPEN_CONVERSATION_EVENT)); }}
        className="mt-2 inline-flex min-h-11 items-center gap-1 self-start rounded-full px-2 text-meta text-[color:var(--listen-soft)] hover:text-[color:var(--listen-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]"
      >
        <span aria-hidden="true">↩</span> Back to the conversation
      </button>
    </section>
  );
};

export default ListenPlayer;
