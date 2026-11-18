import { useId } from "react";
import { useMoodOptional } from "@/components/MoodProvider";

/**
 * VinylDeck: an SVG turntable platter + tonearm (board L, option 1: no rims, no outlines).
 * Rotation speed follows pitch (33⅓ rpm nominal = 1.8s per turn).
 *
 * The record carries a plain paper label in warm cream. At the size of the popover's deck the label is bigger and
 * carries two lines of the track's name; they are decoration (aria-hidden), the name stays as text above the deck.
 * In the Dusk mood the two reflections take a warm lamplight tint and are lit from the top right.
 */
const LABEL_LINES = {
  track: "Odetta · ATCQ Tribute",
  side: "Side A · 33⅓",
} as const;
/** A disc this wide (px) or wider gets the large label with its two lines. */
const LARGE_DISC = 60;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

export const VinylRecord = ({
  size,
  playing,
  pitch = 1,
  label = true,
}: {
  size: number;
  playing: boolean;
  pitch?: number;
  label?: boolean;
}) => {
  const id = useId().replace(/:/g, "");
  const mood = useMoodOptional();
  const dusk = (mood?.preview ?? mood?.mood) === "dusk";
  const large = size >= LARGE_DISC;
  // A 146 px disc carries a label about 60 px across; a small disc keeps a smaller one.
  const labelR = large ? 20.5 : 17;
  const first = labelR + 3;
  const count = large ? 22 : 6;
  const grooves = Array.from({ length: count }, (_, i) => i);
  // Day: lit from the top left, as before. Dusk: lit from the top right.
  const [x1, y1, x2, y2] = dusk ? [1, 0, 0, 1] : [0, 0, 1, 1];
  const stop = (offset: string, opacity: string) => (
    <stop offset={offset} style={{ stopColor: "hsl(var(--vinyl-sheen))", stopOpacity: opacity }} />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="block">
      <defs>
        {/* Static anisotropic light reflection: stays fixed while the disc spins */}
        <linearGradient id={`s-${id}`} x1={x1} y1={y1} x2={x2} y2={y2}>
          {stop("0%", "0")}
          {stop("38%", "var(--sheen-a)")}
          {stop("50%", "0")}
          {stop("62%", "var(--sheen-b)")}
          {stop("100%", "0")}
        </linearGradient>
      </defs>
      <g
        className="vinyl-spin"
        data-playing={playing ? "true" : "false"}
        style={{ ["--spin" as string]: `${(1.8 / pitch).toFixed(3)}s` }}
      >
        <circle cx="50" cy="50" r="50" fill="hsl(var(--vinyl))" />
        {grooves.map((i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={first + i * ((48 - first) / count)}
            fill="none"
            stroke="hsl(var(--vinyl-groove))"
            strokeWidth={i % 5 === 4 ? 0.9 : 0.35}
            opacity={i % 5 === 4 ? 0.9 : 0.6}
          />
        ))}
        {label && <circle cx="50" cy="50" r={labelR} fill="hsl(var(--paper-label))" />}
        {label && large && (
          <>
            <text x="50" y="46.8" textAnchor="middle" dominantBaseline="middle" fontFamily={MONO} fontSize="2.7" textLength="33" lengthAdjust="spacingAndGlyphs" fill="hsl(var(--label-ink))">{LABEL_LINES.track}</text>
            <text x="50" y="53.4" textAnchor="middle" dominantBaseline="middle" fontFamily={MONO} fontSize="2.7" fill="hsl(var(--label-ink))">{LABEL_LINES.side}</text>
          </>
        )}
      </g>
      <circle cx="50" cy="50" r="50" fill={`url(#s-${id})`} pointerEvents="none" />
      <circle cx="50" cy="50" r="1.6" fill="hsl(var(--vinyl))" />
    </svg>
  );
};

/** Full deck: plinth, record, tonearm. */
export const VinylDeck = ({ playing, pitch }: { playing: boolean; pitch: number }) => {
  const id = useId().replace(/:/g, "");
  return (
    <div
      className="relative h-[172px] w-[200px] rounded-md shadow-[0_10px_24px_-12px_hsl(var(--vinyl)/0.8)]"
      data-plinth
      style={{
        background:
          "repeating-linear-gradient(90deg, hsl(var(--brush-hi) / var(--brush-a)) 0 1px, hsl(var(--brush-lo) / calc(var(--brush-a) * 0.6)) 1px 2px, transparent 2px 3px), linear-gradient(160deg, hsl(var(--plinth-from)), hsl(var(--plinth-to)))",
      }}
    >
      {/* The record sits straight on the plinth: no platter rim */}
      <div className="absolute left-[13px] top-[13px] h-[146px] w-[146px] rounded-full shadow-[0_6px_14px_-6px_hsl(var(--vinyl)/0.9)]">
        <VinylRecord size={146} playing={playing} pitch={pitch} />
      </div>

      {/* Tonearm: pivots from top-right; rests off the record when stopped */}
      <svg
        viewBox="0 0 60 150"
        width="60"
        height="150"
        aria-hidden="true"
        data-tonearm
        className="absolute right-[2px] top-[8px] origin-[42px_14px] transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
        style={{ transform: `rotate(${playing ? 22 : 2}deg)` }}
      >
        <defs>
          <linearGradient id={`a-${id}`} x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--arm-edge))" />
            <stop offset="50%" stopColor="hsl(var(--arm-mid))" />
            <stop offset="100%" stopColor="hsl(var(--arm-edge))" />
          </linearGradient>
        </defs>
        {/* counterweight */}
        <rect x="37" y="0" width="10" height="8" rx="2" fill={`url(#a-${id})`} />
        {/* pivot */}
        <circle cx="42" cy="14" r="7" fill={`url(#a-${id})`} />
        <circle cx="42" cy="14" r="2.5" fill="hsl(var(--plinth-to))" />
        {/* arm with S-bend */}
        <path d="M42 18 L42 98 Q42 112 32 122" fill="none" stroke={`url(#a-${id})`} strokeWidth="2.6" strokeLinecap="round" />
        {/* headshell + cartridge */}
        <g transform="rotate(35 32 122)">
          <rect x="27" y="120" width="10" height="16" rx="1.5" fill="hsl(var(--arm-edge))" />
          <rect x="29" y="132" width="6" height="5" fill="hsl(var(--arm-mid))" />
          <rect x="37" y="122" width="5" height="1.6" fill="hsl(var(--arm-mid))" />
        </g>
      </svg>

      {/* Arm rest */}
      <div className="absolute right-[8px] bottom-[18px] h-[10px] w-[6px] rounded-sm bg-[hsl(var(--arm-edge))]" aria-hidden="true" />
      {/* Power LED */}
      <span
        aria-hidden="true"
        className={[
          "absolute left-[8px] bottom-[6px] h-[5px] w-[5px] rounded-full transition-all duration-500",
          playing ? "bg-[hsl(var(--paper-label))] shadow-[0_0_6px_hsl(var(--paper-label))]" : "bg-[hsl(var(--vinyl))]",
        ].join(" ")}
      />
    </div>
  );
};

export default VinylDeck;
