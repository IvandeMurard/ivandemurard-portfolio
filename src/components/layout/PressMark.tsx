/**
 * PressMark: hairline engraving of a hand screw press, in the spirit of a
 * printer's colophon device. Pure vector, no fills, engraver hatching.
 */
export const PressMark = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 120 150"
    role="img"
    aria-label="Engraved mark of a hand printing press"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
  >
    {/* Top bar and finial */}
    <path d="M60 6v8" />
    <circle cx="60" cy="4" r="2.5" />
    <path d="M26 16h68" />
    <path d="M30 16v4h60v-4" />

    {/* Screw shaft with thread hatching */}
    <path d="M55 20h10v26H55z" />
    <path d="M55 24h10M55 28h10M55 32h10M55 36h10M55 40h10" strokeWidth="0.6" />

    {/* Flywheel with spokes */}
    <circle cx="96" cy="44" r="11" />
    <circle cx="96" cy="44" r="3" />
    <path d="M96 33v5M96 50v5M85 44h5M102 44h5" strokeWidth="0.6" />
    <path d="M65 44h20" />

    {/* Platen */}
    <path d="M34 46h52v9H34z" />
    <path d="M38 55v5h44v-5" />

    {/* Bed and paper */}
    <path d="M28 68h64v8H28z" />
    <path d="M32 71h20M56 71h32" strokeWidth="0.6" />

    {/* Frame uprights with hatching */}
    <path d="M30 20v48M90 20v48" />
    <path d="M30 26h-4M30 34h-4M30 42h-4M90 26h4M90 34h4M90 42h4" strokeWidth="0.5" />

    {/* Base plinth */}
    <path d="M36 76v18h48V76" />
    <path d="M30 94h60l6 8H24z" />
    <path d="M40 82h40M40 88h40" strokeWidth="0.5" />

    {/* Compass rose beneath the press */}
    <circle cx="60" cy="126" r="17" />
    <circle cx="60" cy="126" r="7" strokeWidth="0.6" />
    <path d="M60 109l4 13 13 4-13 4-4 13-4-13-13-4 13-4z" />
    <path d="M48 114l7 7M72 114l-7 7M48 138l7-7M72 138l-7-7" strokeWidth="0.5" />
  </svg>
);

export default PressMark;
