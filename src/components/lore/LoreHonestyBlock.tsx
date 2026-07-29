const LIMITS = [
  "Synthetic procedures and mock aircraft data. No real EASA-regulated documents, no real tail numbers, no real technician records.",
  "No authentication on the API routes.",
  "Contradiction between two experts is now tested, a second expert was written into the case set specifically to disagree with the first, but it is not a shipped detection feature.",
  "Multi-source confidence scoring remains design intent.",
  "No runtime observability. If the model degrades in production, nothing would notice before a user did.",
];

/**
 * Composed, not apologetic: a plain statement of what is and is not built.
 * No alert colour, no warning banner.
 */
export const LoreHonestyBlock = () => (
  <div data-reveal-child className="border-t border-b border-outline-variant/30 py-10">
    <p className="font-headline italic text-primary text-2xl md:text-3xl leading-tight">
      This is a prototype, not production software.
    </p>
    <ul className="mt-8 space-y-4 max-w-3xl">
      {LIMITS.map((l, i) => (
        <li key={l} className="flex items-baseline gap-4 text-on-surface-variant leading-relaxed">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary tabular-nums shrink-0">
            0{i + 1}
          </span>
          <span>{l}</span>
        </li>
      ))}
    </ul>
    <p className="mt-8 font-headline italic text-primary text-lg leading-snug max-w-3xl">
      The last two lines are the honest ones, and they are why the evaluation write-up exists.
    </p>
  </div>
);

export default LoreHonestyBlock;
