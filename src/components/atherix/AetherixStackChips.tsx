const CHIPS = [
  "FastAPI",
  "Python 3.12",
  "Prophet",
  "pgvector (Mistral 1024d, HNSW)",
  "Claude Sonnet (Gemini/GPT fallback)",
  "Redis (Upstash)",
  "Supabase (PostgreSQL, RLS, EU)",
  "Fly.io (Paris)",
];

export const AetherixStackChips = () => (
  <ul className="flex flex-wrap gap-2" aria-label="Aetherix stack">
    {CHIPS.map((c) => (
      <li
        key={c}
        className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant text-xs text-on-surface"
      >
        {c}
      </li>
    ))}
  </ul>
);

export default AetherixStackChips;
