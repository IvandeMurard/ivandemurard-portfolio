import type { ReactNode } from "react";

const ROWS: { expert: ReactNode; manual: ReactNode }[] = [
  {
    expert: "Marc's October note: 2–3 NU is normal on F-GKXA in cold weather",
    manual: (
      <>
        AMM 72-00-00-810-001 sets the cold-weather action trigger at{" "}
        <strong className="font-semibold text-primary">2.5 NU</strong>
      </>
    ),
  },
  {
    expert: "Marc: monitor across 2 cycles",
    manual: (
      <>
        The AMM MONITOR band requires <strong className="font-semibold text-primary">3 flight cycles</strong>
      </>
    ),
  },
  {
    expert: "Marc: don't flag oil below 0.4 qt/hr",
    manual: (
      <>
        AMM 72-53-00 classes <strong className="font-semibold text-primary">0.30–0.50 qt/hr</strong> as ELEVATED
      </>
    ),
  },
];

export const LoreSopConflictCard = () => (
  <div
    data-reveal-child
    className="rounded-2xl border border-outline-variant/25 bg-surface-container-low overflow-hidden"
  >
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Expert knowledge versus manual procedure table">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="sr-only">Where the expert's oral knowledge and the manual disagree</caption>
        <thead>
          <tr className="border-b border-outline-variant/30">
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4 w-1/2">
              The expert
            </th>
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4 w-1/2">
              The manual
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i} className="border-b border-outline-variant/20 last:border-0 align-top">
              <td className="px-6 py-5 text-on-surface-variant leading-relaxed">{r.expert}</td>
              <td className="px-6 py-5 text-on-surface leading-relaxed">{r.manual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="px-6 py-6 border-t border-outline-variant/30 font-headline italic text-primary text-lg md:text-xl leading-snug">
      At 2.9 NU they disagree, and the procedure wins. Every time, by construction.
    </p>
  </div>
);

export default LoreSopConflictCard;
