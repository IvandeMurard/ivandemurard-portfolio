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
};

const CAP = "linear-gradient(180deg, hsl(var(--metal-light)) 0%, hsl(var(--metal-dark)) 48%, hsl(var(--metal-light)) 52%, hsl(var(--metal-dark)) 100%)";
const BRUSH = "repeating-linear-gradient(90deg, hsl(var(--metal-light)/0.18) 0 1px, transparent 1px 2px)";

export const SteelFader = ({ label, min, max, step, value, onChange, orientation = "horizontal", length, ticks = [], valueText }: Props) => {
  const v = orientation === "vertical";
  const t = (value - min) / (max - min); // 0..1
  const capLong = 22, capShort = 14;
  const travel = length - capShort;
  // Vertical: min value at top (Technics: + at the bottom is faster; we show + at top of scale via ticks)
  const offset = t * travel;

  return (
    <div className={v ? "relative flex gap-1.5" : "relative"} style={v ? { height: length } : { width: length, height: capLong }}>
      <div className="relative" style={v ? { width: capLong, height: length } : { width: length, height: capLong }}>
        {/* felt slot */}
        <div
          aria-hidden="true"
          className="absolute rounded-full bg-[hsl(var(--vinyl))] shadow-[inset_0_1px_2px_hsl(var(--vinyl)),0_1px_0_hsl(var(--metal-light)/0.25)]"
          style={v ? { left: capLong / 2 - 2, width: 4, top: 4, bottom: 4 } : { top: capLong / 2 - 2, height: 4, left: 4, right: 4 }}
        />
        {/* brushed steel cap */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[2px] shadow-[0_3px_4px_-1px_hsl(var(--vinyl)/0.8),inset_0_1px_0_hsl(var(--metal-light))] transition-[top,left] duration-75"
          style={{
            background: `${BRUSH}, ${CAP}`,
            ...(v ? { left: 0, width: capLong, height: capShort, top: offset } : { top: 0, height: capLong, width: capShort, left: offset }),
          }}
        >
          <span
            className="absolute bg-[hsl(var(--vinyl))]"
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
          onChange={(e) => onChange(Number(e.target.value))}
          className={[
            "absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0 peer",
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
                <span className={["font-mono text-[8px] tabular-nums leading-none", zero ? "text-secondary" : "text-on-surface-variant"].join(" ")}>{k.label}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SteelFader;
