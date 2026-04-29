import { Volume2, VolumeX } from "lucide-react";
import { useAmbience } from "./AmbienceProvider";

/**
 * AmbienceControl: a quiet, glass-style sound toggle.
 *
 * Inspired by silentsongs.com: a small pill that simply swaps between
 * two line icons (muted / playing). When active, an accent dot pulses
 * beside the icon, replacing any decorative motion. Sized to sit as
 * a calm sibling to the day/dusk switch in the header.
 *
 * Hides itself when audio files aren't available.
 */
export const AmbienceControl = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const { muted, available, toggleMute } = useAmbience();

  if (!available) return null;

  const dim =
    size === "sm"
      ? { box: "h-7 w-9", icon: 13 }
      : { box: "h-7 w-10", icon: 14 };

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
        "transition-[background,border-color,transform,color] duration-300",
        "hover:border-secondary/50 hover:bg-surface-container hover:scale-[1.04]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        muted ? "text-on-surface-variant" : "text-secondary",
        dim.box,
      ].join(" ")}
    >
      {/* Stacked icons cross-fade between states */}
      <span className="relative inline-flex items-center justify-center">
        <Volume2
          size={dim.icon}
          strokeWidth={1.5}
          aria-hidden="true"
          className={[
            "transition-all duration-200 ease-out",
            muted ? "opacity-0 scale-90" : "opacity-100 scale-100",
          ].join(" ")}
        />
        <VolumeX
          size={dim.icon}
          strokeWidth={1.5}
          aria-hidden="true"
          className={[
            "absolute inset-0 m-auto transition-all duration-200 ease-out",
            muted ? "opacity-100 scale-100" : "opacity-0 scale-90",
          ].join(" ")}
        />
      </span>

      {/* Active pulse dot, only visible when playing */}
      <span
        aria-hidden="true"
        className={[
          "ml-1 h-[3px] w-[3px] rounded-full bg-secondary",
          "transition-opacity duration-300",
          muted
            ? "opacity-0"
            : "opacity-90 [animation:ambience-pulse_2.4s_ease-in-out_infinite]",
        ].join(" ")}
      />
    </button>
  );
};

export default AmbienceControl;
