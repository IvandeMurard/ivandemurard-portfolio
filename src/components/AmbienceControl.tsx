import { useAmbience } from "./AmbienceProvider";

/**
 * AmbienceControl: a tonearm-style mute toggle.
 *
 * Visual language:
 *  - A small circular "platter" with a faint groove ring.
 *  - A tonearm pivoting from the upper-right.
 *  - Playing: tonearm rests on the platter, platter rotates slowly.
 *  - Muted:   tonearm lifts to the rest position, platter still.
 *
 * Hides itself when audio files aren't available, so nothing ships half-built.
 */
export const AmbienceControl = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const { muted, available, toggleMute } = useAmbience();

  if (!available) return null;

  const dim =
    size === "sm"
      ? { box: "h-6 w-6", platter: 18, arm: 16 }
      : { box: "h-7 w-7", platter: 22, arm: 20 };

  // Tonearm angle: lifted (-22deg) when muted, down (8deg) when playing.
  const armRotation = muted ? -22 : 8;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!muted}
      aria-label={muted ? "Play ambience" : "Mute ambience"}
      title={muted ? "Play ambience" : "Mute ambience"}
      onClick={toggleMute}
      className={[
        "group relative inline-flex items-center justify-center rounded-full",
        "border border-outline-variant/40",
        "bg-surface-container/60 backdrop-blur-sm",
        "shadow-[inset_0_1px_2px_hsl(var(--primary)/0.08)]",
        "transition-[background,border-color] duration-500",
        "hover:border-secondary/50 hover:bg-surface-container",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        dim.box,
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        width={size === "sm" ? 16 : 18}
        height={size === "sm" ? 16 : 18}
        fill="none"
        aria-hidden="true"
        className="overflow-visible"
      >
        {/* Platter */}
        <g
          className={[
            "origin-center",
            !muted ? "[animation:ambience-spin_4s_linear_infinite]" : "",
            "motion-reduce:[animation:none]",
          ].join(" ")}
          style={{ transformOrigin: "11px 13px" }}
        >
          <circle
            cx="11"
            cy="13"
            r={dim.platter / 2.6}
            stroke="hsl(var(--on-surface-variant))"
            strokeOpacity="0.55"
            strokeWidth="1"
          />
          {/* Groove */}
          <circle
            cx="11"
            cy="13"
            r={dim.platter / 4.5}
            stroke="hsl(var(--on-surface-variant))"
            strokeOpacity="0.3"
            strokeWidth="0.6"
          />
          {/* Center label dot */}
          <circle
            cx="11"
            cy="13"
            r="1"
            fill="hsl(var(--secondary))"
            opacity={muted ? 0.4 : 0.85}
          />
          {/* Tiny mark so rotation is visible */}
          <circle
            cx="11"
            cy={13 - dim.platter / 4.5 + 0.2}
            r="0.5"
            fill="hsl(var(--secondary))"
            opacity="0.7"
          />
        </g>

        {/* Tonearm: pivot at upper-right, tip drops onto platter */}
        <g
          style={{
            transformOrigin: "18px 6px",
            transform: `rotate(${armRotation}deg)`,
            transition: "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Pivot base */}
          <circle cx="18" cy="6" r="1.6" fill="hsl(var(--secondary-fixed-dim))" />
          <circle cx="18" cy="6" r="0.7" fill="hsl(var(--secondary))" />
          {/* Arm */}
          <line
            x1="18"
            y1="6"
            x2="11"
            y2="13"
            stroke="hsl(var(--secondary-fixed-dim))"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Headshell at the tip */}
          <circle cx="11" cy="13" r="1.1" fill="hsl(var(--secondary))" />
        </g>
      </svg>
    </button>
  );
};

export default AmbienceControl;
