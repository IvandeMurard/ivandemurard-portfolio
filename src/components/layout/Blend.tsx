import type { CSSProperties } from "react";

/**
 * A soft passage between two grounds (site-wide rule: no hard edge between full-width rooms).
 * `from` and `to` are colour token names (e.g. "surface", "surface-stone"), so Day and Dusk each blend their own palette.
 * The gradient is eased (slow start, slow end) like a light change, not a linear ramp.
 */
export const Blend = ({ from, to, height = 240 }: { from: string; to: string; height?: number }) => (
  <div aria-hidden="true" data-blend={`${from}>${to}`} className="room-blend"
    style={{ height, "--blend-from": `var(--${from})`, "--blend-to": `var(--${to})` } as CSSProperties} />
);

export default Blend;
