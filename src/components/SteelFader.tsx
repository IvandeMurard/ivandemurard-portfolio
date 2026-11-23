import { useRef } from "react";
import { unlockHapticFeedback, useHaptic } from "@/hooks/useHaptic";
/**
 * SteelFader: Technics SL-1200 style fader.
 * A native range input (transparent, on top) keeps keyboard, screen reader
 * and pointer behaviour; the visible parts are a felt slot and a brushed cap.
 */
type Props = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  orientation?: "vertical" | "horizontal";
  length: number;
  ticks?: { at: number; label: string }[];
  valueText?: string;
  /** A light haptic notch every `detentEvery` units of travel. */
  detentEvery?: number;
  /** A magnetic point: values within `radius` of `at` snap to it and must be pushed out of. */
  snap?: { at: number; radius: number };
};

/** Finger travel is scaled down so the cap moves less than the finger: perceived resistance. */
const DAMPING = 0.8;

// Dark steel on the day popover, aluminium on the dusk one: the cap stays at 3:1 or more against its ground in both moods.
const CAP = "linear-gradient(180deg, hsl(var(--fader-light)) 0%, hsl(var(--fader-dark)) 48%, hsl(var(--fader-light)) 52%, hsl(var(--fader-dark)) 100%)";
const BRUSH = "repeating-linear-gradient(90deg, hsl(var(--fader-mark)/0.18) 0 1px, transparent 1px 2px)";

export const SteelFader = ({ label, min, max, step, value, onChange, orientation = "horizontal", length, ticks = [], valueText, detentEvery, snap }: Props) => {
  const haptic = useHaptic();
  const drag = useRef<{ start: number; origin: number; id: number; travel: number } | null>(null);
  const lastNotch = useRef<number | null>(null);
  const v = orientation === "vertical";
  const t = (value - min) / (max - min); // 0..1
  const capLong = 22, capShort = 14;
  const travel = length - capShort;
  // Vertical: min value at top (Technics: + at the bottom is faster; we show + at top of scale via ticks)
  const offset = t * travel;

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const quantize = (n: number) => Math.round(n / step) * step;
  const emit = (raw: number) => {
    let next = quantize(clamp(raw));
    if (snap && Math.abs(next - snap.at) <= snap.radius) next = snap.at;
    if (detentEvery) {
      const notch = Math.round(next / detentEvery);
      if (lastNotch.current !== null && notch !== lastNotch.current) haptic("detent");
      lastNotch.current = notch;
    }
    if (next !== value) onChange(next);
  };

  // Pointer drags are relative and damped: no jump to the finger, a heavier cap.
  const onPointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    unlockHapticFeedback();
    if (e.pointerType === "mouse") return; // desktop keeps the native behaviour
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
    const bounds = e.currentTarget.getBoundingClientRect();
    drag.current = { start: v ? e.clientY : e.clientX, origin: value, id: e.pointerId, travel: Math.max(1, (v ? bounds.height : bounds.width) - capShort) };
    lastNotch.current = detentEvery ? Math.round(value / detentEvery) : null;
  };
  const onPointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const px = (v ? e.clientY : e.clientX) - d.start;
    emit(d.origin + (px / d.travel) * (max - min) * DAMPING);
  };
  const onPointerEnd = () => {
    drag.current = null;
  };

  return (
    <div className={v ? "relative flex gap-1.5" : "relative max-w-full"} style={v ? { height: length } : { width: length, height: 44 }}>
      <div className={v ? "relative" : "relative top-[11px] max-w-full"} style={v ? { width: capLong, height: length } : { width: length, height: capLong }}>
        {/* felt slot */}
        <div
          aria-hidden="true"
          className="absolute rounded-full bg-[hsl(var(--vinyl))] shadow-[inset_0_1px_2px_hsl(var(--vinyl))]"
          style={v ? { left: capLong / 2 - 2, width: 4, top: 4, bottom: 4 } : { top: capLong / 2 - 2, height: 4, left: 4, right: 4 }}
        />
        {/* brushed steel cap */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[2px] shadow-[0_3px_4px_-1px_hsl(var(--vinyl)/0.8)] transition-[top,left] duration-75"
          style={{
            background: `${BRUSH}, ${CAP}`,
            ...(v ? { left: 0, width: capLong, height: capShort, top: offset } : { top: 0, height: capLong, width: capShort, left: `calc(${t * 100}% - ${t * capShort}px)` }),
          }}
        >
          <span
            className="absolute bg-[hsl(var(--fader-mark))]"
            style={v ? { left: 2, right: 2, top: capShort / 2 - 0.5, height: 1 } : { top: 2, bottom: 2, left: capShort / 2 - 0.5, width: 1 }}
          />
        </div>
        <input
          type="range"
          aria-label={label}
          aria-valuetext={valueText}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            if (!drag.current) emit(Number(e.target.value));
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          data-vaul-no-drag
          className={[
            "touch-none",
            "absolute m-0 w-full cursor-pointer opacity-0 peer",
            v ? "inset-0 h-full" : "-top-[11px] left-0 h-11",
            v ? "[writing-mode:vertical-lr] cursor-ns-resize" : "cursor-ew-resize",
          ].join(" ")}
        />
      </div>
      {v && ticks.length > 0 && (
        <div aria-hidden="true" className="relative w-6" style={{ height: length }}>
          {ticks.map((k) => {
            const y = ((k.at - min) / (max - min)) * travel + capShort / 2;
            const zero = k.at === 0;
            return (
              <span key={k.label} className="absolute left-0 flex items-center gap-1 -translate-y-1/2" style={{ top: y }}>
                <span className={["h-px", zero ? "w-2.5 bg-secondary" : "w-1.5 bg-on-surface-variant"].join(" ")} />
                <span className={["font-mono text-meta tabular-nums leading-none", zero ? "text-secondary" : "text-on-surface-variant"].join(" ")}>{k.label}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SteelFader;
