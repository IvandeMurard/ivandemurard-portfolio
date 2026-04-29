import { Sun, Moon } from "lucide-react";
import { useMood } from "./MoodProvider";

/**
 * Analog ambience toggle: brass knob in a recessed track.
 * Slides with a slight overshoot, like a real switch with a spring.
 */
export const MoodToggle = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const { mood, toggle } = useMood();
  const isDusk = mood === "dusk";

  const dims =
    size === "sm"
      ? { track: "h-6 w-12", knob: "h-5 w-5", translate: "translate-x-6" }
      : { track: "h-7 w-14", knob: "h-6 w-6", translate: "translate-x-7" };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDusk}
      aria-label="Toggle ambience between day and dusk"
      onClick={toggle}
      className={[
        "group relative inline-flex items-center rounded-full",
        "border border-outline-variant/40",
        "bg-surface-container/60 backdrop-blur-sm",
        // Recessed/inset feel
        "shadow-[inset_0_1px_2px_hsl(var(--primary)/0.12),inset_0_-1px_1px_hsl(var(--surface-container-lowest)/0.6)]",
        "transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        dims.track,
        "px-1",
      ].join(" ")}
    >
      {/* Sun glyph, left */}
      <Sun
        size={12}
        strokeWidth={1.5}
        className={[
          "absolute left-1.5 transition-opacity duration-700",
          isDusk ? "opacity-30 text-on-surface-variant" : "opacity-90 text-secondary",
        ].join(" ")}
        aria-hidden="true"
      />
      {/* Moon glyph, right */}
      <Moon
        size={11}
        strokeWidth={1.5}
        className={[
          "absolute right-1.5 transition-opacity duration-700",
          isDusk ? "opacity-90 text-secondary-fixed" : "opacity-30 text-on-surface-variant",
        ].join(" ")}
        aria-hidden="true"
      />
      {/* Knob */}
      <span
        className={[
          "relative z-10 inline-block rounded-full",
          dims.knob,
          // Brass gradient
          "bg-[radial-gradient(circle_at_30%_30%,hsl(var(--secondary-fixed))_0%,hsl(var(--secondary-fixed-dim))_55%,hsl(var(--secondary))_100%)]",
          "shadow-[0_1px_2px_hsl(var(--primary)/0.25),0_2px_6px_hsl(var(--primary)/0.18),inset_0_1px_0_hsl(0_0%_100%/0.45)]",
          "transition-transform duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "group-hover:shadow-[0_2px_3px_hsl(var(--primary)/0.3),0_4px_10px_hsl(var(--primary)/0.22),inset_0_1px_0_hsl(0_0%_100%/0.5)]",
          "motion-reduce:transition-none",
          isDusk ? dims.translate : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
};

export default MoodToggle;
