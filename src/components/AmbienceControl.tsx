import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAmbience, PITCH_RANGE } from "./AmbienceProvider";
import { useHaptic } from "@/hooks/useHaptic";
import { VinylDeck, VinylRecord } from "./VinylDeck";
import { SteelFader } from "./SteelFader";

/**
 * AmbienceControl: a mini record in the header.
 * Click the record to start/stop; the chevron opens an analog deck
 * (platter, tonearm, pitch fader with quartz lock, volume).
 */
export const AmbienceControl = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const { muted, available, toggleMute, pitch, setPitch, volume, setVolume } = useAmbience();
  const haptic = useHaptic();
  const [open, setOpen] = useState(false);
  const wasZero = useRef(true);

  const pct = Math.round((pitch - 1) * 1000) / 10;
  useEffect(() => {
    const zero = Math.abs(pct) < 0.05;
    if (zero && !wasZero.current) haptic("select");
    wasZero.current = zero;
  }, [pct, haptic]);

  if (!available) return null;
  const playing = !muted;
  const disc = size === "sm" ? 26 : 28;

  const toggle = () => {
    haptic("toggle");
    toggleMute();
  };

  return (
    <div className="inline-flex h-8 items-stretch rounded-md border border-outline-variant bg-surface-container/60 shadow-[inset_0_1px_0_hsl(var(--metal-light)/0.12)] transition-colors duration-300 hover:border-secondary">
      <button
        type="button"
        role="switch"
        aria-checked={playing}
        aria-label={playing ? "Stop the record" : "Play the record"}
        title={playing ? "Stop the record" : "Play the record"}
        onClick={toggle}
        className="inline-flex items-center justify-center px-1 rounded-l-md border-r border-outline-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
      >
        <span className={["transition-opacity duration-300", playing ? "opacity-100" : "opacity-70"].join(" ")}>
          <VinylRecord size={disc} playing={playing} pitch={pitch} />
        </span>
      </button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Open turntable controls"
            title="Turntable"
            onClick={() => haptic("tap")}
            className="inline-flex items-center justify-center px-1 rounded-r-md text-on-surface-variant hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
          >
            <ChevronDown size={12} strokeWidth={1.5} className={["transition-transform duration-300", open ? "rotate-180" : ""].join(" ")} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={10} className="w-[300px] p-4 bg-surface-container border-outline-variant">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface">Odetta · ATCQ Tribute</p>
              <p className="font-mono text-[10px] text-on-surface-variant">Sleeve: The Low End Theory, 1991</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Lift the needle" : "Drop the needle"}
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
            >
              <VinylDeck playing={playing} pitch={pitch} />
            </button>

            {/* Pitch fader, vertical, + at top like a Technics */}
            <div className="flex flex-1 flex-col items-center justify-between py-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-on-surface-variant">Pitch</span>
              <SteelFader
                label="Pitch"
                orientation="vertical"
                length={108}
                min={-PITCH_RANGE * 100}
                max={PITCH_RANGE * 100}
                step={0.1}
                value={-pct}
                valueText={`${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`}
                onChange={(v) => setPitch(1 - v / 100)}
                ticks={[{ at: -8, label: "+8" }, { at: -4, label: "+4" }, { at: 0, label: "0" }, { at: 4, label: "-4" }, { at: 8, label: "-8" }]}
              />
              <span className="font-mono text-[10px] tabular-nums text-on-surface">
                {pct > 0 ? "+" : ""}
                {pct.toFixed(1)}%
              </span>
              <button
                type="button"
                onClick={() => {
                  haptic("select");
                  setPitch(1);
                }}
                className="mt-1 inline-flex items-center gap-1 rounded-sm border border-outline-variant px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-on-surface-variant hover:border-secondary hover:text-secondary"
                title="Quartz lock: back to 0%"
              >
                <span className={["h-[5px] w-[5px] rounded-full", Math.abs(pct) < 0.05 ? "bg-secondary" : "bg-outline-variant"].join(" ")} />
                Quartz
              </button>
            </div>
          </div>

          <label className="mt-4 flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-on-surface-variant w-12">Volume</span>
            <span className="flex-1"><SteelFader
              label="Volume"
              length={170}
              min={0}
              max={100}
              step={1}
              value={Math.round(volume * 100)}
              onChange={(v) => setVolume(v / 100)}
            /></span>
            <span className="font-mono text-[10px] tabular-nums text-on-surface w-8 text-right">{Math.round(volume * 100)}</span>
          </label>

          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-on-surface-variant">
            33⅓ rpm · analog pitch, speed and key move together
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AmbienceControl;
