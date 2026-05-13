/**
 * The Anticipation Ceiling, a tiny editorial SVG motif.
 * Floor line: legacy systems record what happened.
 * Ceiling line: Aetherix predicts what is next.
 */
export const AnticipationCeiling = () => (
  <svg
    viewBox="0 0 400 200"
    className="w-full h-auto"
    role="img"
    aria-label="The Anticipation Ceiling: legacy floor versus predictive ceiling"
  >
    {/* Floor */}
    <line
      x1="20"
      y1="160"
      x2="380"
      y2="160"
      stroke="hsl(var(--outline-variant))"
      strokeWidth="1"
      strokeDasharray="4 4"
    />
    <text
      x="20"
      y="180"
      fontFamily="ui-sans-serif, system-ui"
      fontSize="9"
      letterSpacing="2"
      fill="hsl(var(--on-surface-variant))"
    >
      THE FLOOR · WHAT HAPPENED
    </text>

    {/* Rising ceiling line */}
    <path
      d="M 20 130 Q 120 100 220 70 T 380 30"
      fill="none"
      stroke="hsl(var(--secondary))"
      strokeWidth="1.5"
      className="halo-drift"
    />
    <text
      x="380"
      y="20"
      textAnchor="end"
      fontFamily="ui-sans-serif, system-ui"
      fontSize="9"
      letterSpacing="2"
      fill="hsl(var(--secondary))"
    >
      THE CEILING · WHAT IS NEXT
    </text>

    {/* Anchor dots on the ceiling */}
    <circle cx="20" cy="130" r="2.5" fill="hsl(var(--secondary))" />
    <circle cx="200" cy="78" r="2.5" fill="hsl(var(--secondary))" />
    <circle cx="380" cy="30" r="3" fill="hsl(var(--secondary))" />
  </svg>
);

export default AnticipationCeiling;
