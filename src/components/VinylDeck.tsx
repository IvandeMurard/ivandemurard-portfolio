import { useId } from "react";
import cover from "@/assets/atcq-low-end-theory.png.asset.json";

/**
 * VinylDeck: a realistic SVG turntable platter + tonearm.
 * Rotation speed follows pitch (33⅓ rpm nominal = 1.8s per turn).
 */
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
  const grooves = Array.from({ length: size > 60 ? 22 : 6 }, (_, i) => i);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="block">
      <defs>
        <radialGradient id={`v-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--vinyl))" />
          <stop offset="96%" stopColor="hsl(var(--vinyl-groove))" />
          <stop offset="100%" stopColor="hsl(var(--vinyl))" />
        </radialGradient>
        {/* Static anisotropic light reflection: stays fixed while the disc spins */}
        <linearGradient id={`s-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--vinyl-sheen))" stopOpacity="0" />
          <stop offset="38%" stopColor="hsl(var(--vinyl-sheen))" stopOpacity="0.16" />
          <stop offset="50%" stopColor="hsl(var(--vinyl-sheen))" stopOpacity="0" />
          <stop offset="62%" stopColor="hsl(var(--vinyl-sheen))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(var(--vinyl-sheen))" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`l-${id}`}>
          <circle cx="50" cy="50" r="17" />
        </clipPath>
      </defs>
      <g
        className="vinyl-spin"
        data-playing={playing ? "true" : "false"}
        style={{ ["--spin" as string]: `${(1.8 / pitch).toFixed(3)}s` }}
      >
        <circle cx="50" cy="50" r="49.5" fill={`url(#v-${id})`} />
        {grooves.map((i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={20 + i * (28 / grooves.length)}
            fill="none"
            stroke="hsl(var(--vinyl-groove))"
            strokeWidth={i % 5 === 4 ? 0.9 : 0.35}
            opacity={i % 5 === 4 ? 0.9 : 0.6}
          />
        ))}
        {label && (
          <image
            href={cover.url}
            x="33"
            y="33"
            width="34"
            height="34"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#l-${id})`}
          />
        )}
        <circle cx="50" cy="50" r="17" fill="none" stroke="hsl(var(--vinyl))" strokeWidth="0.6" />
      </g>
      <circle cx="50" cy="50" r="49.5" fill={`url(#s-${id})`} pointerEvents="none" />
      <circle cx="50" cy="50" r="1.6" fill="hsl(var(--metal-light))" stroke="hsl(var(--metal-dark))" strokeWidth="0.4" />
    </svg>
  );
};

/** Full deck: plinth, platter, record, tonearm. */
export const VinylDeck = ({ playing, pitch }: { playing: boolean; pitch: number }) => {
  const id = useId().replace(/:/g, "");
  return (
    <div
      className="relative h-[172px] w-[200px] rounded-md shadow-[inset_0_1px_0_hsl(var(--metal-light)/0.15),0_10px_24px_-12px_hsl(var(--vinyl)/0.8)]"
      style={{
        background:
          "linear-gradient(160deg, hsl(var(--plinth-light)), hsl(var(--plinth-dark)))",
      }}
    >
      {/* Platter rim */}
      <div
        className="absolute left-[10px] top-[10px] h-[152px] w-[152px] rounded-full p-[3px]"
        style={{
          background:
            "conic-gradient(from 30deg, hsl(var(--metal-light)), hsl(var(--metal-dark)), hsl(var(--metal-light)), hsl(var(--metal-dark)), hsl(var(--metal-light)))",
        }}
      >
        <VinylRecord size={146} playing={playing} pitch={pitch} />
      </div>

      {/* Tonearm: pivots from top-right; rests off the record when stopped */}
      <svg
        viewBox="0 0 60 150"
        width="60"
        height="150"
        aria-hidden="true"
        className="absolute right-[2px] top-[8px] origin-[42px_14px] transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
        style={{ transform: `rotate(${playing ? 22 : 2}deg)` }}
      >
        <defs>
          <linearGradient id={`a-${id}`} x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--metal-dark))" />
            <stop offset="50%" stopColor="hsl(var(--metal-light))" />
            <stop offset="100%" stopColor="hsl(var(--metal-dark))" />
          </linearGradient>
        </defs>
        {/* counterweight */}
        <rect x="37" y="0" width="10" height="8" rx="2" fill={`url(#a-${id})`} />
        {/* pivot */}
        <circle cx="42" cy="14" r="7" fill="hsl(var(--plinth-dark))" stroke={`url(#a-${id})`} strokeWidth="2" />
        <circle cx="42" cy="14" r="2.5" fill="hsl(var(--metal-light))" />
        {/* arm with S-bend */}
        <path d="M42 18 L42 98 Q42 112 32 122" fill="none" stroke={`url(#a-${id})`} strokeWidth="2.6" strokeLinecap="round" />
        {/* headshell + cartridge */}
        <g transform="rotate(35 32 122)">
          <rect x="27" y="120" width="10" height="16" rx="1.5" fill="hsl(var(--metal-dark))" />
          <rect x="29" y="132" width="6" height="5" fill="hsl(var(--vinyl))" />
          <rect x="37" y="122" width="5" height="1.6" fill="hsl(var(--metal-light))" />
        </g>
      </svg>

      {/* Arm rest */}
      <div className="absolute right-[8px] bottom-[18px] h-[10px] w-[6px] rounded-sm bg-[hsl(var(--metal-dark))]" aria-hidden="true" />
      {/* Strobe dot / power LED */}
      <span
        aria-hidden="true"
        className={[
          "absolute left-[8px] bottom-[6px] h-[5px] w-[5px] rounded-full transition-all duration-500",
          playing ? "bg-secondary shadow-[0_0_6px_hsl(var(--secondary))]" : "bg-[hsl(var(--metal-dark))]",
        ].join(" ")}
      />
    </div>
  );
};

export default VinylDeck;
