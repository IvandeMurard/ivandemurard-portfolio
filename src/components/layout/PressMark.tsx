/**
 * PressMark: hairline engraving of a hand screw press, in the spirit of a
 * printer's colophon device. Pure vector, no fills, engraver hatching.
 */
export const PressMark = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 150 170"
    role="img"
    aria-label="Engraved mark of a hand printing press above a compass rose"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Finial and head beam */}
    <circle cx="66" cy="7" r="3" />
    <path d="M66 10v8" />
    <path d="M30 18h72M34 18v6h64v-6" />

    {/* Screw shaft with thread hatching */}
    <path d="M60 24h12v30H60z" />
    <path d="M60 29h12M60 34h12M60 39h12M60 44h12M60 49h12" strokeWidth="0.55" />

    {/* Flywheel and its arm, clear of the frame */}
    <path d="M72 42h32" />
    <circle cx="118" cy="42" r="14" />
    <circle cx="118" cy="42" r="4" strokeWidth="0.8" />
    <path d="M118 28v6M118 50v6M104 42h6M126 42h6" strokeWidth="0.55" />

    {/* Frame uprights with hatching */}
    <path d="M34 24v56M98 24v56" />
    <path d="M34 32h-5M34 42h-5M34 52h-5M98 32h5M98 42h5M98 52h5" strokeWidth="0.5" />

    {/* Platen */}
    <path d="M42 54h48v10H42z" />
    <path d="M47 64v6h38v-6" />

    {/* Bed and sheet */}
    <path d="M30 80h72v10H30z" />
    <path d="M36 85h24M66 85h30" strokeWidth="0.55" />

    {/* Plinth */}
    <path d="M44 90v16h44V90" />
    <path d="M36 106h60l8 8H28z" />
    <path d="M50 96h32" strokeWidth="0.5" />

    {/* Compass rose */}
    <circle cx="66" cy="142" r="19" />
    <circle cx="66" cy="142" r="7" strokeWidth="0.7" />
    <path d="M66 123l4.5 14.5L85 142l-14.5 4.5L66 161l-4.5-14.5L47 142l14.5-4.5z" />
    <path d="M53 129l6.5 6.5M79 129l-6.5 6.5M53 155l6.5-6.5M79 155l-6.5-6.5" strokeWidth="0.5" />
  </svg>
);

export default PressMark;
