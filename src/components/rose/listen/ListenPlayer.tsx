import { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { formatClock, seekFromKey, splitWords } from "./listenAlign";
import { useListenPlayer } from "./useListenPlayer";
import type { ListenData } from "./listenClient";

/** The visitor's "reduce motion" setting, live. */
export const useReducedMotion = (): boolean => {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
};

type Props = {
  /** The small-caps label after "Rose ·". */
  label: "summary of this page" | "answer";
  load: () => Promise<ListenData>;
  /** The text read by the browser's voice when no generated audio is available, and shown while loading. */
  fallbackText: string;
  onStart?: () => void;
  onComplete?: () => void;
};

/**
 * The Listen audiogram (board P): the spoken text with the word being read in dark ink and the rest faded, a waveform
 * that is also the progress bar, play, pause and back to the start, and a Read / Listen switch that keeps the position.
 * The written answer is never replaced: for an answer this card sits under it.
 * No live region: the highlight must not be announced word by word (aria-live="off" also covers the dock's log).
 */
export const ListenPlayer = ({ label, load, fallbackText, onStart, onComplete }: Props) => {
  const reduced = useReducedMotion();
  const p = useListenPlayer({ load, fallbackText, onStart, onComplete, reducedMotion: reduced });
  const [mode, setMode] = useState<"listen" | "read">("listen");
  const barRef = useRef<HTMLDivElement>(null);

  const words = p.words.length ? p.words : splitWords(fallbackText);
  const [from, to] = p.active;
  const fraction = p.durationMs ? Math.min(1, p.positionMs / p.durationMs) : 0;

  const choose = (next: "listen" | "read") => {
    if (next === mode) return;
    // Reading is silent. The position stays where it is, and Listen starts again from there.
    if (next === "read" && p.playing) p.pause();
    setMode(next);
  };

  const onBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    p.seek(((e.clientX - r.left) / r.width) * p.durationMs);
  };

  const wordClass = (i: number) => {
    // Reduced motion: no moving highlight, the progress is the bar.
    if (reduced || mode === "read" || from < 0) return "text-on-surface";
    if (i < from) return "text-on-surface";
    if (i <= to) return "text-on-surface bg-secondary/15 rounded-sm";
    return "text-on-surface-variant";
  };

  return (
    <section aria-label="Rose reads aloud" aria-live="off" data-listen-player data-mode={mode} className="rounded-xl border border-outline-variant bg-surface-container px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-kicker uppercase tracking-[0.18em] text-on-surface-variant">Rose · {label}</span>
        <div role="group" aria-label="Read or listen" className="flex shrink-0 rounded-full border border-outline-variant p-0.5 text-xs">
          {(["read", "listen"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => choose(m)}
              className={cn(
                "rounded-full px-3 py-1 capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
                mode === m ? "bg-secondary text-on-secondary" : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm leading-relaxed" data-listen-text>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span
              data-word={i}
              data-state={mode === "read" || reduced || from < 0 ? undefined : i < from ? "spoken" : i <= to ? "current" : "next"}
              className={cn("transition-colors motion-reduce:transition-none", wordClass(i), mode === "read" && p.positionMs > 0 && i === Math.max(0, from) && "underline decoration-secondary decoration-2 underline-offset-4")}
            >
              {w}
            </span>{" "}
          </Fragment>
        ))}
      </p>

      {mode === "listen" ? (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={p.restart}
            disabled={p.phase !== "ready"}
            aria-label="Back to the start"
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50"
          >
            <Icon name="replay" className="text-lg" />
          </button>
          <button
            type="button"
            onClick={p.toggle}
            disabled={p.phase !== "ready"}
            aria-label={p.playing ? "Pause" : "Play"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <Icon name={p.playing ? "pause" : "play_arrow"} className="text-lg" />
          </button>
          <div
            ref={barRef}
            role="slider"
            tabIndex={p.phase === "ready" ? 0 : -1}
            aria-label="Position in the reading"
            aria-valuemin={0}
            aria-valuemax={Math.round(p.durationMs / 1000)}
            aria-valuenow={Math.round(p.positionMs / 1000)}
            aria-valuetext={`${formatClock(p.positionMs)} of ${formatClock(p.durationMs)}`}
            onClick={onBarClick}
            onKeyDown={(e) => {
              const next = seekFromKey(e.key, p.positionMs, p.durationMs);
              if (next === null) return;
              e.preventDefault();
              p.seek(next);
            }}
            className="flex h-9 min-w-0 flex-1 cursor-pointer items-center gap-[2px] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            {p.peaks.map((h, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{ height: `${Math.round(h * 100)}%` }}
                className={cn("w-full min-w-[2px] rounded-full", i / p.peaks.length < fraction ? "bg-secondary" : "bg-on-surface-variant/55")}
              />
            ))}
          </div>
          <span className="shrink-0 tabular-nums text-meta text-on-surface-variant">
            {p.phase === "ready" ? `${formatClock(p.positionMs)} / ${formatClock(p.durationMs)}` : "Loading"}
          </span>
        </div>
      ) : null}
      {p.phase === "ready" && p.engine === "speech" && mode === "listen" ? (
        <p className="mt-2 text-meta text-on-surface-variant">Read with your browser's voice, sentence by sentence.</p>
      ) : null}
    </section>
  );
};

export default ListenPlayer;
