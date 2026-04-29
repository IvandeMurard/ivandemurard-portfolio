import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useMood } from "./MoodProvider";

const TOOLTIP_FLAG = "mood-tooltip-seen";

/**
 * Analog ambience toggle: brass knob in a recessed track.
 * The track carries a directional gradient hinting where the ambience will go,
 * so the affordance is scannable at a glance.
 */
export const MoodToggle = ({
  size = "md",
  label,
}: {
  size?: "sm" | "md";
  label?: string;
}) => {
  const { mood, toggle } = useMood();
  const isDusk = mood === "dusk";

  const dims =
    size === "sm"
      ? {
          track: "h-6 w-12",
          knob: "h-5 w-5",
          translate: "translate-x-6",
          glyph: 12,
          padX: "px-1",
          glyphLeft: "left-1.5",
          glyphRight: "right-1.5",
        }
      : {
          track: "h-8 w-16",
          knob: "h-7 w-7",
          translate: "translate-x-8",
          glyph: 14,
          padX: "px-1",
          glyphLeft: "left-2",
          glyphRight: "right-2",
        };

  // First-visit tooltip
  const [showTip, setShowTip] = useState(false);
  const dismissTimer = useRef<number | null>(null);

  useEffect(() => {
    if (size === "sm") return; // mobile: skip
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(TOOLTIP_FLAG)) return;
    } catch {
      return;
    }
    const showT = window.setTimeout(() => setShowTip(true), 1200);
    dismissTimer.current = window.setTimeout(() => {
      setShowTip(false);
      try {
        window.localStorage.setItem(TOOLTIP_FLAG, "1");
      } catch {
        // ignore
      }
    }, 1200 + 4000);
    return () => {
      window.clearTimeout(showT);
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
    };
  }, [size]);

  const dismissTip = () => {
    if (!showTip) return;
    setShowTip(false);
    try {
      window.localStorage.setItem(TOOLTIP_FLAG, "1");
    } catch {
      // ignore
    }
  };

  // Track gradient: in day, warm glow on the right (where moon waits).
  // In dusk, cool indigo glow on the left (where sun waits).
  const trackBg = isDusk
    ? "bg-[linear-gradient(90deg,hsl(var(--primary-fixed)/0.35)_0%,hsl(var(--primary-fixed)/0.18)_45%,hsl(var(--surface-container)/0.6)_100%)]"
    : "bg-[linear-gradient(90deg,hsl(var(--surface-container)/0.6)_0%,hsl(var(--secondary-fixed)/0.22)_55%,hsl(var(--secondary-fixed)/0.45)_100%)]";

  return (
    <div className="relative inline-flex items-center gap-2.5">
      {label && size !== "sm" && (
        <span
          className="hidden lg:inline-block font-headline italic text-xs tracking-wide text-on-surface-variant select-none"
          aria-hidden="true"
        >
          {label}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isDusk}
        aria-label={`Ambience: switch to ${isDusk ? "day" : "dusk"} light`}
        title={`Ambience: ${isDusk ? "Dusk" : "Day"}`}
        onClick={() => {
          dismissTip();
          toggle();
        }}
        className={[
          "group relative inline-flex items-center rounded-full",
          "border border-outline-variant/40",
          trackBg,
          "backdrop-blur-sm",
          "shadow-[inset_0_1px_2px_hsl(var(--primary)/0.14),inset_0_-1px_1px_hsl(var(--surface-container-lowest)/0.6)]",
          "transition-[background,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          dims.track,
          dims.padX,
        ].join(" ")}
      >
        {/* Sun glyph, left */}
        <Sun
          size={dims.glyph}
          strokeWidth={1.75}
          className={[
            "absolute transition-opacity duration-700",
            dims.glyphLeft,
            isDusk ? "opacity-55 text-on-surface-variant" : "opacity-100 text-secondary",
          ].join(" ")}
          aria-hidden="true"
        />
        {/* Moon glyph, right */}
        <Moon
          size={dims.glyph - 1}
          strokeWidth={1.75}
          className={[
            "absolute transition-opacity duration-700",
            dims.glyphRight,
            isDusk ? "opacity-100 text-secondary-fixed" : "opacity-70 text-primary",
          ].join(" ")}
          aria-hidden="true"
        />
        {/* Knob, the lit lamp, always warm brass */}
        <span
          className={[
            "relative z-10 inline-block rounded-full",
            dims.knob,
            "bg-[radial-gradient(circle_at_30%_30%,hsl(var(--secondary-fixed))_0%,hsl(var(--secondary-fixed-dim))_55%,hsl(var(--secondary))_100%)]",
            "shadow-[0_1px_2px_hsl(var(--primary)/0.25),0_2px_6px_hsl(var(--primary)/0.18),inset_0_1px_0_hsl(0_0%_100%/0.45)]",
            "transition-transform duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "group-hover:shadow-[0_2px_3px_hsl(var(--primary)/0.3),0_4px_10px_hsl(var(--primary)/0.22),inset_0_1px_0_hsl(0_0%_100%/0.5)]",
            "motion-reduce:transition-none",
            isDusk ? dims.translate : "translate-x-0",
          ].join(" ")}
        />
      </button>

      {/* First-visit tooltip */}
      {showTip && size !== "sm" && (
        <div
          role="tooltip"
          className={[
            "absolute top-full mt-3 right-0",
            "px-3 py-1.5 rounded-md",
            "bg-surface-container/95 backdrop-blur-md",
            "border border-outline-variant/40",
            "shadow-[0_8px_24px_hsl(var(--primary)/0.18)]",
            "text-xs italic font-headline text-on-surface whitespace-nowrap",
            "animate-in fade-in slide-in-from-top-1 duration-700",
          ].join(" ")}
        >
          Switch from afternoon to evening light
          <span
            aria-hidden="true"
            className="absolute -top-1 right-6 h-2 w-2 rotate-45 bg-surface-container border-l border-t border-outline-variant/40"
          />
        </div>
      )}
    </div>
  );
};

export default MoodToggle;
