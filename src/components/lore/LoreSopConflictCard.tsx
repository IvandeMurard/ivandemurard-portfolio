import type { ReactNode } from "react";

const ROWS: { expert: ReactNode; manual: ReactNode; lore: ReactNode }[] = [
  {
    expert: "2–3 NU is normal on this airframe in cold weather",
    manual: (
      <>
        72-00-00-810-001 sets the cold-weather action trigger at{" "}
        <strong className="font-semibold text-primary">2.5 NU</strong>
      </>
    ),
    lore: "\u201CYou're at 2.9. The trigger is 2.5, so this escalates. Marc Delaunay's October note calls 2–3 NU characteristic of F-GKXA below 8°C, worth knowing, but it does not move the limit.\u201D",
  },
  {
    expert: "Monitor across 2 cycles",
    manual: (
      <>
        The MONITOR band requires <strong className="font-semibold text-primary">3 flight cycles</strong>
      </>
    ),
    lore: "\u201CThree, not two. Marc's habit was tighter than the manual on other things and looser here.\u201D",
  },
  {
    expert: "Don't flag oil below 0.4 qt/hr",
    manual: (
      <>
        72-53-00 classes <strong className="font-semibold text-primary">0.30–0.50 qt/hr</strong> as ELEVATED
      </>
    ),
    lore: "\u201C0.35 is ELEVATED: monitor every flight, check for leaks. Marc's 0.4 was his own threshold, not the manual's.\u201D",
  },
];

export const LoreSopConflictCard = () => (
  <div
    data-reveal-child
    className="rounded-2xl border border-outline-variant/25 bg-surface-container-low overflow-hidden"
  >
    <div
      className="overflow-x-auto"
      tabIndex={0}
      role="region"
      aria-label="Expert knowledge, manual procedure and Lore's answer table"
    >
      <table className="w-full min-w-[52rem] border-collapse text-left">
        <caption className="sr-only">
          Where the expert's oral knowledge and the manual disagree, and what Lore answers
        </caption>
        <thead>
          <tr className="border-b border-outline">
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4 w-1/4">
              Marc, from experience
            </th>
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4 w-1/4">
              The AMM
            </th>
            <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4 w-1/2">
              What Lore answers
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i} className="border-b border-outline last:border-0 align-top">
              <td className="px-6 py-5 text-on-surface-variant leading-relaxed">{r.expert}</td>
              <td className="px-6 py-5 text-on-surface leading-relaxed">{r.manual}</td>
              <td className="px-6 py-5 font-headline italic text-primary text-base md:text-lg leading-relaxed">
                {r.lore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="px-6 py-6 border-t border-outline-variant/30 font-headline italic text-primary text-lg md:text-xl leading-snug">
      The manual sets the limit. The senior tells you what you are looking at. Lore is the only place both arrive in
      the same answer, in that order.
    </p>
  </div>
);

export default LoreSopConflictCard;
