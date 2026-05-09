import { useReveal } from "@/hooks/useReveal";

interface SectionDividerProps {
  /** Editorial numeral, e.g. "02". Optional. */
  index?: string;
  /** Section label, e.g. "The Problem". Optional. */
  label?: string;
  /** Layout variant. */
  variant?: "center" | "left";
  /** Vertical breathing room around the divider. */
  spacing?: "default" | "tight";
  className?: string;
}

/**
 * Editorial section divider used between case-study sections.
 * A thin animated hairline, optionally accompanied by a numeral and label.
 * Reuses the project's Reveal-on-scroll pattern.
 */
export const SectionDivider = ({
  index,
  label,
  variant = "center",
  spacing = "default",
  className = "",
}: SectionDividerProps) => {
  const ref = useReveal<HTMLDivElement>(0.4);
  const hasMeta = Boolean(index || label);
  const padding = spacing === "tight" ? "py-8 md:py-10" : "py-12 md:py-16";
  const align = variant === "left"
    ? "items-start md:pl-12 lg:pl-24"
    : "items-center";

  return (
    <div
      ref={ref}
      data-reveal
      aria-hidden="true"
      className={`flex flex-col ${align} ${padding} px-6 md:px-12 ${className}`}
    >
      <span
        data-reveal-child
        className="divider-fall h-16 md:h-20"
      />
      {hasMeta && (
        <span
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "200ms" }}
          className={`mt-4 font-label text-[10px] uppercase tracking-[0.25em] text-secondary ${
            variant === "center" ? "text-center" : "text-left"
          }`}
        >
          {index && <span className="text-primary/70">{index}</span>}
          {index && label && <span className="text-outline-variant/60 mx-2">/</span>}
          {label && <span>{label}</span>}
        </span>
      )}
    </div>
  );
};

export default SectionDivider;
