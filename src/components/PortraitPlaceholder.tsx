interface PortraitPlaceholderProps {
  variant?: "hero" | "inline";
  className?: string;
  caption?: string;
}

/**
 * Editorial empty state used wherever a real portrait will eventually live.
 * Reads as intentional whitespace, not a broken image. Swap one component
 * when the real photo arrives.
 */
export const PortraitPlaceholder = ({
  variant = "hero",
  className = "",
  caption = "Portrait, coming soon",
}: PortraitPlaceholderProps) => {
  const aspect = variant === "hero" ? "h-full" : "aspect-[4/5]";
  return (
    <div
      className={`relative overflow-hidden bg-surface-container-low ring-1 ring-secondary-fixed-dim/30 ${aspect} ${className}`}
      aria-label="Portrait placeholder"
    >
      {/* Warm painterly base */}
      <div className="absolute inset-0 turner-gradient-warm opacity-80" />
      {/* Soft gold halo, recessed */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full gold-halo opacity-60"
      />
      {/* Inner gold frame */}
      <div className="absolute inset-3 border border-secondary pointer-events-none" />
      {/* Caption */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1">
        <span className="font-headline italic text-secondary text-lg leading-tight">
          {caption}
        </span>
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
          A real photo will live here.
        </span>
      </div>
    </div>
  );
};

export default PortraitPlaceholder;
