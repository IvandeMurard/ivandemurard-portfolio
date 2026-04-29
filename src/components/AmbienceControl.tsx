import { useAmbience } from "./AmbienceProvider";

/**
 * AmbienceControl: a turntable-style mute toggle.
 *
 * Drawn in a slight 3/4 perspective (squashed ellipse) so it reads
 * unmistakably as a record player rather than a generic disc icon.
 *
 *  - A rectangular plinth with rounded corners.
 *  - A vinyl record with concentric grooves and a coloured center label.
 *  - A spindle pin at the center.
 *  - A tonearm pivoting from the upper-right pillar, dropping onto the
 *    record when playing and lifting to its rest when muted.
 *
 * Hides itself when audio files aren't available.
 */
export const AmbienceControl = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const { muted, available, toggleMute } = useAmbience();

  if (!available) return null;

  // Larger, wider hit area so the turntable shape is legible.
  const dim =
    size === "sm"
      ? { box: "h-9 w-12", svgW: 44, svgH: 32 }
      : { box: "h-11 w-16", svgW: 60, svgH: 40 };

  // Tonearm rotation around its pivot at (50, 6).
  // Muted = lifted off the record. Playing = resting near the outer groove.
  const armRotation = muted ? -32 : -6;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!muted}
      aria-label={muted ? "Play ambience" : "Mute ambience"}
      title={muted ? "Play ambience" : "Mute ambience"}
      onClick={toggleMute}
      className={[
        "group relative inline-flex items-center justify-center rounded-md",
        "border border-outline-variant/40",
        "bg-surface-container/60 backdrop-blur-sm",
        "shadow-[inset_0_1px_2px_hsl(var(--primary)/0.08)]",
        "transition-[background,border-color,transform] duration-500",
        "hover:border-secondary/50 hover:bg-surface-container hover:scale-[1.03]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "px-1.5 py-1",
        dim.box,
      ].join(" ")}
    >
      <svg
        viewBox="0 0 60 40"
        width={dim.svgW}
        height={dim.svgH}
        fill="none"
        aria-hidden="true"
        className="overflow-visible"
      >
        {/* Plinth (record player base), drawn in light 3/4 perspective */}
        <rect
          x="3"
          y="10"
          width="54"
          height="26"
          rx="3"
          fill="hsl(var(--surface-container-high))"
          stroke="hsl(var(--outline-variant))"
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
        {/* Subtle top highlight on the plinth */}
        <rect
          x="3.5"
          y="10.5"
          width="53"
          height="2"
          rx="2"
          fill="hsl(var(--primary) / 0.06)"
        />

        {/* Tonearm pivot pillar (right side of plinth) */}
        <circle cx="50" cy="16" r="2.4" fill="hsl(var(--surface-container-highest))" stroke="hsl(var(--outline-variant))" strokeOpacity="0.6" strokeWidth="0.5" />
        <circle cx="50" cy="16" r="1.1" fill="hsl(var(--secondary-fixed-dim))" />

        {/* Speed/power dot, lower-right of plinth */}
        <circle
          cx="52"
          cy="32"
          r="0.9"
          fill="hsl(var(--secondary))"
          opacity={muted ? 0.35 : 0.9}
          className={!muted ? "[animation:ambience-pulse_2.4s_ease-in-out_infinite]" : ""}
        />

        {/* Vinyl record: ellipse for 3/4 perspective */}
        <g
          className={[
            "origin-center",
            !muted ? "[animation:ambience-spin_4s_linear_infinite]" : "",
            "motion-reduce:[animation:none]",
          ].join(" ")}
          style={{ transformOrigin: "24px 23px", transformBox: "fill-box" as const }}
        >
          {/* Outer disc */}
          <ellipse
            cx="24"
            cy="23"
            rx="11"
            ry="9"
            fill="hsl(var(--on-surface) / 0.85)"
            stroke="hsl(var(--outline-variant))"
            strokeOpacity="0.4"
            strokeWidth="0.4"
          />
          {/* Concentric grooves */}
          <ellipse cx="24" cy="23" rx="9.5" ry="7.6" stroke="hsl(var(--surface) / 0.35)" strokeWidth="0.25" fill="none" />
          <ellipse cx="24" cy="23" rx="8" ry="6.4" stroke="hsl(var(--surface) / 0.3)" strokeWidth="0.25" fill="none" />
          <ellipse cx="24" cy="23" rx="6.5" ry="5.2" stroke="hsl(var(--surface) / 0.3)" strokeWidth="0.25" fill="none" />
          <ellipse cx="24" cy="23" rx="5" ry="4" stroke="hsl(var(--surface) / 0.25)" strokeWidth="0.25" fill="none" />
          {/* Center label */}
          <ellipse
            cx="24"
            cy="23"
            rx="3.4"
            ry="2.7"
            fill="hsl(var(--secondary))"
            opacity={muted ? 0.55 : 1}
          />
          {/* Tiny mark so rotation is visible */}
          <circle cx="24" cy="20.6" r="0.45" fill="hsl(var(--surface))" opacity="0.85" />
          {/* Spindle */}
          <circle cx="24" cy="23" r="0.7" fill="hsl(var(--surface))" />
        </g>

        {/* Tonearm: pivots at the right pillar, sweeps across to the record */}
        <g
          style={{
            transformOrigin: "50px 16px",
            transformBox: "fill-box" as const,
            transform: `rotate(${armRotation}deg)`,
            transition: "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Counterweight nub behind the pivot */}
          <circle cx="53" cy="14.5" r="1.4" fill="hsl(var(--secondary-fixed-dim))" />
          {/* Arm shaft */}
          <line
            x1="50"
            y1="16"
            x2="30"
            y2="22"
            stroke="hsl(var(--secondary-fixed-dim))"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          {/* Bend near the headshell */}
          <line
            x1="30"
            y1="22"
            x2="27"
            y2="24"
            stroke="hsl(var(--secondary-fixed-dim))"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          {/* Headshell */}
          <rect
            x="25.4"
            y="23.2"
            width="2.6"
            height="1.8"
            rx="0.4"
            fill="hsl(var(--secondary))"
          />
        </g>
      </svg>
    </button>
  );
};

export default AmbienceControl;
