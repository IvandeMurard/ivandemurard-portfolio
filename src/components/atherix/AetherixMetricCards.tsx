const METRICS = [
  {
    value: "Phase 3",
    label: "Pilot · design partner starting",
    caveat: "Staging live on Fly.io (Paris). Apaleo OAuth and MCP read operational. Real-world measurement begins now, no live MAPE yet.",
  },
  {
    value: "−3% to −8%",
    label: "Target labor cost variance",
    caveat: "90 days, live property. Target outcome, not measured yet.",
  },
  {
    value: "14/14",
    label: "Security gates passing",
    caveat: "Multi-tenant RLS, scoped hotel_id, read-only PMS access, server-side resolution.",
  },
];

export const AetherixMetricCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {METRICS.map((m) => (
      <div
        key={m.label}
        className="bg-surface-container-low border border-outline-variant/25 rounded-2xl p-6 md:p-8 flex flex-col gap-3"
      >
        <p className="font-headline italic text-4xl md:text-5xl text-primary leading-none">{m.value}</p>
        <p className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">{m.label}</p>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{m.caveat}</p>
      </div>
    ))}
  </div>
);

export default AetherixMetricCards;
