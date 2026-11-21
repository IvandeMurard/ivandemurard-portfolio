import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatClock, seekFromKey } from "./listenAlign";

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

export const BAR_MIN_PX = 6;
export const BAR_MAX_PX = 44;

type Props = {
  /** 72 bars of the real take (0 to 1), or null for a plain progress line. */
  bars: number[] | null;
  positionMs: number;
  durationMs: number;
  disabled?: boolean;
  onSeek: (ms: number) => void;
  className?: string;
};

/**
 * The waveform, which is also the progress bar and a slider: click to move, arrows step 5 s, Home and End jump.
 * 72 bars from 6 to 44 px, 3 px wide at most (they narrow, down to 2 px, so the row fits a 390 px phone).
 * Without `bars` (a reading in the browser's voice, or a take with no waveform) it is a progress line.
 */
export const ListenWave = ({ bars, positionMs, durationMs, disabled, onSeek, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const fraction = durationMs ? Math.min(1, positionMs / durationMs) : 0;

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    onSeek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * durationMs);
  };

  return (
    <div
      ref={ref}
      role="slider"
      data-listen-wave={bars ? "bars" : "line"}
      tabIndex={disabled ? -1 : 0}
      aria-label="Position in the reading"
      aria-valuemin={0}
      aria-valuemax={Math.round(durationMs / 1000)}
      aria-valuenow={Math.round(positionMs / 1000)}
      aria-valuetext={`${formatClock(positionMs)} of ${formatClock(durationMs)}`}
      aria-disabled={disabled || undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        const next = seekFromKey(e.key, positionMs, durationMs);
        if (next === null) return;
        e.preventDefault();
        onSeek(next);
      }}
      className={cn(
        "flex min-w-0 cursor-pointer items-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--listen-kicker)]",
        bars ? "h-11 justify-between gap-[2px]" : "h-11",
        className,
      )}
    >
      {bars ? bars.map((v, i) => (
        <span
          key={i}
          aria-hidden="true"
          data-bar={i / bars.length < fraction ? "played" : "unplayed"}
          style={{
            height: `${Math.round(BAR_MIN_PX + v * (BAR_MAX_PX - BAR_MIN_PX))}px`,
            background: i / bars.length < fraction ? "var(--listen-played)" : "var(--listen-unplayed)",
          }}
          className="min-w-[2px] max-w-[3px] flex-1 rounded-full"
        />
      )) : (
        <span aria-hidden="true" className="relative block h-1 w-full rounded-full" style={{ background: "var(--listen-unplayed)" }}>
          <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${fraction * 100}%`, background: "var(--listen-played)" }} />
        </span>
      )}
    </div>
  );
};

export default ListenWave;
