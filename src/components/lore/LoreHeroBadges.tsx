const BADGES = ["Speechmatics × AI Collective Paris", "28 Feb – 1 Mar 2026", "v0.1-hackathon"];

export const LoreHeroBadges = () => (
  <ul className="flex flex-wrap gap-2 mt-8" aria-label="Lore origin and version">
    {BADGES.map((b) => (
      <li
        key={b}
        className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 font-label uppercase tracking-[0.2em] text-[10px] text-secondary"
      >
        {b}
      </li>
    ))}
  </ul>
);

export default LoreHeroBadges;
