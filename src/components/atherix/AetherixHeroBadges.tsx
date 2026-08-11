const BADGES = [
  "Phase 3 · Shadow Mode",
  "Staging Live",
  "MCP-Native",
  "Claude Sonnet",
  "Python 3.12",
  "FastAPI",
  "Fly.io (Paris)",
];

export const AetherixHeroBadges = () => (
  <ul className="flex flex-wrap gap-2 mt-8" aria-label="Aetherix status and stack">
    {BADGES.map((b) => (
      <li
        key={b}
        className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant font-label uppercase tracking-[0.2em] text-[10px] text-secondary"
      >
        {b}
      </li>
    ))}
  </ul>
);

export default AetherixHeroBadges;
