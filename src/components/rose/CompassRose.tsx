import { cn } from "@/lib/utils";

/* The existing Rose dock mark, enlarged. Same geometry, not a new symbol. */
export const CompassRose = ({ heading = 0, className, reduced }: { heading?: number; className?: string; reduced?: boolean }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(className)} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="17" strokeWidth="0.35" />
    <circle cx="20" cy="20" r="5.5" strokeWidth="0.25" />
    <g
      style={{ transform: `rotate(${heading}deg)`, transformOrigin: "20px 20px", transition: reduced ? "none" : "transform 900ms cubic-bezier(.2,.7,.1,1)" }}
    >
      <path d="M20 3l4 13 13 4-13 4-4 13-4-13-13-4 13-4z" strokeWidth="0.4" />
      <path d="M20 3l4 13-4 4z" fill="currentColor" strokeWidth="0" opacity="0.85" />
      <path d="M8 8l6 6M32 8l-6 6M8 32l6-6M32 32l-6-6" strokeWidth="0.2" />
    </g>
  </svg>
);

