/**
 * Minimalist horizon illustration for the Aetherix Horizon section.
 * Three concentric arcs (Sandbox, Pilot, Hive Memory), a central node,
 * and orbiting dots representing other agents in the operations mesh.
 */
export const AetherixHorizonIllustration = () => (
  <div className="relative w-full max-w-3xl mx-auto aspect-[2/1] mb-12 md:mb-16">
    <svg
      viewBox="0 0 800 400"
      className="absolute inset-0 w-full h-full"
      role="img"
      aria-label="The Hive Vision: three phases of a shared anticipation mesh"
    >
      {/* Horizon line */}
      <line
        x1="40"
        y1="320"
        x2="760"
        y2="320"
        stroke="hsl(var(--secondary-fixed-dim))"
        strokeWidth="1"
        opacity="0.55"
        className="divider-fall origin-left"
      />

      {/* Three arcs, growing outward */}
      <g fill="none" stroke="hsl(var(--secondary-fixed-dim))" strokeWidth="1" opacity="0.5">
        <path d="M 280 320 A 120 120 0 0 1 520 320" />
        <path d="M 200 320 A 200 200 0 0 1 600 320" opacity="0.7" />
        <path d="M 100 320 A 300 300 0 0 1 700 320" className="halo-drift" />
      </g>

      {/* Phase labels */}
      <g
        fontFamily="ui-sans-serif, system-ui"
        fontSize="10"
        letterSpacing="2"
        fill="hsl(var(--secondary))"
      >
        <text x="400" y="195" textAnchor="middle">PHASE 1 · SANDBOX</text>
        <text x="400" y="115" textAnchor="middle">PHASE 2 · PILOT NETWORK</text>
        <text x="400" y="40" textAnchor="middle">PHASE 3 · THE HIVE MEMORY</text>
      </g>

      {/* Orbiting agent dots */}
      <g fill="hsl(var(--secondary))">
        <circle cx="280" cy="320" r="3" opacity="0.6" />
        <circle cx="520" cy="320" r="3" opacity="0.6" />
        <circle cx="200" cy="320" r="2.5" opacity="0.5" />
        <circle cx="600" cy="320" r="2.5" opacity="0.5" />
        <circle cx="100" cy="320" r="2" opacity="0.4" />
        <circle cx="700" cy="320" r="2" opacity="0.4" />
        <circle cx="350" cy="220" r="2" opacity="0.5" />
        <circle cx="450" cy="220" r="2" opacity="0.5" />
      </g>

      {/* Central Aetherix node */}
      <g>
        <circle cx="400" cy="320" r="14" fill="hsl(var(--surface))" stroke="hsl(var(--secondary))" strokeWidth="1.5" />
        <circle cx="400" cy="320" r="4" fill="hsl(var(--secondary))" />
      </g>
      <text
        x="400"
        y="355"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, serif"
        fontStyle="italic"
        fontSize="14"
        fill="hsl(var(--primary))"
      >
        The Hive
      </text>
    </svg>
  </div>
);

export default AetherixHorizonIllustration;
