import { Icon } from "@/components/ui/Icon";
import { formatClock } from "./listenAlign";
import { useListen, useListenPosition } from "@/components/listen/ListenProvider";

const BTN = "flex shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]";

/**
 * The dock at rest while Rose reads: the bar becomes the mini-player. Pause (40 px), "Rose · title", a thin progress
 * line, the time, ⌃ to open the player, "Ask" to go back to the chat. One object at the bottom of the screen.
 */
export const ListenMini = ({ onAsk, tabIndex }: { onAsk: () => void; tabIndex?: number }) => {
  const L = useListen();
  const positionMs = useListenPosition();
  const ready = L.phase === "ready";
  const fraction = L.durationMs ? Math.min(1, positionMs / L.durationMs) : 0;
  return (
    <div
      data-listen-mini
      aria-label="Rose is reading"
      role="group"
      className="relative flex min-h-[52px] items-center gap-2 bg-[var(--listen-surface)] px-3 py-1.5 text-[color:var(--listen-ink)]"
    >
      <button
        type="button"
        tabIndex={tabIndex}
        onClick={L.toggle}
        disabled={!ready}
        aria-label={L.ended ? "Replay" : L.playing ? "Pause" : "Play"}
        className={`${BTN} h-10 w-10 bg-[var(--listen-ink)] text-[color:var(--listen-surface)] hover:opacity-90 disabled:opacity-50`}
      >
        <Icon name={L.ended ? "replay" : L.playing ? "pause" : "play_arrow"} className="text-[24px]" />
      </button>
      <p className="min-w-0 flex-1 truncate text-meta">
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--listen-kicker)]">Rose</span>{" "}
        <span className="text-[color:var(--listen-ink)]">· {L.current?.title}</span>
      </p>
      <span className="shrink-0 text-meta tabular-nums text-[color:var(--listen-soft)]">
        {ready ? `${formatClock(positionMs)} / ${formatClock(L.durationMs)}` : "Loading"}
      </span>
      <button type="button" tabIndex={tabIndex} onClick={() => L.setPlayerOpen(true)} aria-label="Open the player" className={`${BTN} h-11 w-11 hover:bg-[var(--listen-row)]`}>
        <Icon name="expand_less" className="text-[24px]" />
      </button>
      <button
        type="button"
        tabIndex={tabIndex}
        onClick={onAsk}
        className="min-h-11 shrink-0 rounded-full border border-[var(--listen-line)] px-3.5 text-meta hover:bg-[var(--listen-row)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]"
      >
        Ask
      </button>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--listen-unplayed)" }}>
        <span className="block h-full" style={{ width: `${fraction * 100}%`, background: "var(--listen-played)" }} />
      </span>
    </div>
  );
};

export default ListenMini;
