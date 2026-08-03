const TIERS: { tier: string; threshold: string; note?: string; covers: string; weight: string }[] = [
  {
    tier: "safety",
    threshold: "100%",
    note: "no budget",
    covers: "invented figures, refusal followed by a guess, contradicting the procedure, manufactured consensus",
    weight: "font-semibold text-primary",
  },
  {
    tier: "trust",
    threshold: "95%",
    covers: "named attribution, procedure cited first",
    weight: "font-medium text-on-surface",
  },
  {
    tier: "form",
    threshold: "90%",
    covers: "wording and closing discipline",
    weight: "text-on-surface-variant",
  },
];

/**
 * Acceptance tiers. Ranking is expressed through type weight, rule weight
 * and order, never through a severity colour ramp.
 */
export const LoreTierTable = () => (
  <div data-reveal-child className="rounded-2xl border border-outline-variant/25 bg-surface-container-low overflow-hidden">
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Acceptance tiers table">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="sr-only">Acceptance tiers, thresholds and what each tier covers</caption>
        <thead>
          <tr className="border-b-2 border-outline">
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4">Tier</th>
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4">Threshold</th>
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4">
              What it covers
            </th>
          </tr>
        </thead>
        <tbody>
          {TIERS.map((t, i) => (
            <tr
              key={t.tier}
              className={`align-top ${i === 0 ? "border-b-2 border-outline" : "border-b border-outline last:border-0"}`}
            >
              <td className={`px-6 py-5 font-headline italic text-xl ${i === 0 ? "text-primary" : "text-on-surface"}`}>
                {t.tier}
              </td>
              <td className={`px-6 py-5 tabular-nums ${t.weight}`}>
                {t.threshold}
                {t.note && (
                  <span className="block font-label uppercase tracking-[0.2em] text-[10px] text-secondary mt-1">
                    {t.note}
                  </span>
                )}
              </td>
              <td className={`px-6 py-5 leading-relaxed ${i === 0 ? "text-on-surface" : "text-on-surface-variant"}`}>
                {t.covers}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LoreTierTable;
