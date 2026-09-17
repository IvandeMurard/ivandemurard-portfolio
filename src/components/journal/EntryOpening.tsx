import { Icon } from "@/components/ui/Icon";

export type EntryGlance = {
  /** Who should read this. */
  audience: string;
  /** What the piece lets the reader do. */
  promise: string;
  /** What the claims are tested on. */
  proof: string;
};

/**
 * Entry sequence for a long field note: qualification first ("is this for
 * me?"), then the decisions in four short points, then one line that carries
 * the argument. Deliberately louder than the body: it has to earn the scroll.
 */
export const EntryOpening = ({
  glance,
  takeaways,
  punch,
  label = "At a glance",
  takeawaysLabel = "What you will decide differently",
}: {
  glance?: EntryGlance;
  takeaways?: string[];
  punch?: string;
  label?: string;
  takeawaysLabel?: string;
}) => {
  if (!glance && !takeaways?.length) return null;

  const rows = glance
    ? ([
        { icon: "person_search", term: "Read this if", def: glance.audience },
        { icon: "target", term: "What it gives you", def: glance.promise },
        { icon: "science", term: "Tested on", def: glance.proof },
      ] as const)
    : [];

  return (
    <div className="mb-12 md:mb-16 not-italic">
      {glance && (
        <dl className="rounded-sm border border-outline bg-surface-container-low p-5 md:p-6 grid gap-4 sm:grid-cols-3">
          {rows.map((row) => (
            <div key={row.term} className="min-w-0">
              <dt className="flex items-center gap-2 mb-2">
                <Icon name={row.icon} className="text-secondary text-[18px] leading-none" />
                <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">
                  {row.term}
                </span>
              </dt>
              <dd className="font-body text-sm leading-relaxed text-on-surface-variant">{row.def}</dd>
            </div>
          ))}
        </dl>
      )}

      {takeaways && takeaways.length > 0 && (
        <section aria-label={takeawaysLabel} className="mt-6 md:mt-8">
          <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
            {takeawaysLabel}
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 list-none p-0 m-0">
            {takeaways.map((point, i) => (
              <li
                key={i}
                className="group flex gap-3 rounded-sm border border-outline-variant bg-surface-container-lowest p-4 transition-colors duration-300 hover:border-secondary"
              >
                <span
                  aria-hidden="true"
                  className="font-label text-[11px] text-secondary pt-0.5 tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-body text-sm leading-relaxed text-on-surface-variant">
                  {point}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {punch && (
        <p className="mt-6 md:mt-8 border-l-2 border-secondary pl-5 font-headline italic text-lg md:text-xl text-primary leading-snug">
          {punch}
        </p>
      )}
    </div>
  );
};

export default EntryOpening;
