import { ConfidenceBadge } from "@/components/compass/CompassFigures";
import { COMPASS_CONFIDENCE, COMPASS_TIMELINE, type CompassConfidence, type CompassSection } from "@/content/compass";

const bold = (s: CompassSection | undefined, i = 0) =>
  s?.blocks.filter((b) => b.kind === "paragraph" && b.bold)[i] as { text: string } | undefined;
const plain = (s: CompassSection | undefined) =>
  (s?.blocks.filter((b) => b.kind === "paragraph" && !b.bold) ?? []) as { text: string }[];

const label = "font-label uppercase tracking-[0.18em] text-[10px] text-secondary";

/** Sec. 01 as one address dossier: timeline on one side, context and comparison on the other. */
export const CompassDossier = ({ section }: { section: CompassSection }) => {
  const [address, surroundings, compare] = section.subsections ?? [];
  const timelineFig = address?.blocks.find((b) => b.kind === "figure") as { caption: string } | undefined;
  const table = compare?.blocks.find((b) => b.kind === "table") as { head: string[]; rows: string[][] } | undefined;
  const addrNotes = plain(address);
  const compareNotes = plain(compare);

  return (
    <figure className="mb-6">
      <div className="rounded-sm border border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-outline-variant px-4 py-3 md:px-6">
          <span className={label}>Fig. 1.1 · Address dossier</span>
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">Server output · 7 October 2026</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* The address: timeline */}
          <section aria-labelledby={address?.id} className="p-4 md:p-6 lg:border-r lg:border-outline-variant">
            <h3 id={address?.id} tabIndex={-1} className={`${label} mb-2 scroll-mt-32`}>{address?.title}</h3>
            <p className="font-headline italic text-2xl text-primary leading-tight mb-5">{bold(address)?.text}</p>
            <ol className="relative m-0 list-none p-0 before:absolute before:bottom-2 before:left-[4.6rem] before:top-2 before:w-px before:bg-outline-variant">
              {COMPASS_TIMELINE.map((item) => (
                <li key={`${item.date}-${item.event}`} className="relative grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-5 py-1.5">
                  <time className="text-right font-label text-[10px] uppercase tracking-[0.12em] text-secondary">{item.date}</time>
                  <span aria-hidden="true" className={`absolute left-[4.33rem] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border bg-surface-container-lowest ${item.withheld ? "border-dashed border-outline" : "border-secondary"}`} />
                  <div className={`flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-sm border px-3 py-2 ${item.withheld ? "border-dashed border-outline-variant bg-[repeating-linear-gradient(135deg,transparent_0_6px,hsl(var(--outline-variant)/0.35)_6px_7px)] opacity-80" : "border-outline-variant"}`}>
                    <p className="min-w-0 font-body text-sm text-primary">
                      {item.event}
                      {item.amount && <span className="ml-2 font-headline italic text-base">{item.amount}</span>}
                    </p>
                    <ConfidenceBadge confidence={item.confidence} />
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 space-y-2 font-body text-sm leading-relaxed text-on-surface-variant">
              {addrNotes.map((n) => <p key={n.text}>{n.text}</p>)}
            </div>
          </section>

          {/* Surroundings + comparison */}
          <div className="border-t border-outline-variant lg:border-t-0">
            <section aria-labelledby={surroundings?.id} className="p-4 md:p-6 border-b border-outline-variant">
              <h3 id={surroundings?.id} tabIndex={-1} className={`${label} mb-2 scroll-mt-32`}>{surroundings?.title}</h3>
              <p className="font-body font-semibold text-primary leading-relaxed">{bold(surroundings)?.text}</p>
              {plain(surroundings).map((n) => <p key={n.text} className="mt-2 font-body text-xs leading-relaxed text-on-surface-variant">{n.text}</p>)}
            </section>
            <section aria-labelledby={compare?.id} className="p-4 md:p-6">
              <h3 id={compare?.id} tabIndex={-1} className={`${label} mb-2 scroll-mt-32`}>{compare?.title}</h3>
              <p className="font-body font-semibold text-primary leading-relaxed mb-4">{bold(compare)?.text}</p>
              {table && (
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">{compare?.title}</caption>
                  <thead>
                    <tr className="border-b border-outline">
                      <th scope="col" className="pb-2 font-label text-[9px] uppercase tracking-[0.14em] text-secondary font-normal">{table.head[0]}</th>
                      <th scope="col" className="pb-2 pl-3 text-right font-label text-[9px] uppercase tracking-[0.14em] text-primary font-normal"><span className="mr-1.5 inline-block h-1.5 w-3 bg-secondary align-middle" />{table.head[1]}</th>
                      <th scope="col" className="pb-2 pl-3 text-right font-label text-[9px] uppercase tracking-[0.14em] text-on-surface-variant font-normal"><span className="mr-1.5 inline-block h-1.5 w-3 bg-outline align-middle" />{table.head[2]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map(([axis, a, b]) => (
                      <tr key={axis} className="border-b border-outline-variant last:border-b-0">
                        <th scope="row" className="py-2.5 pr-2 align-top font-normal">
                          <span className="block font-body text-sm text-on-surface-variant">{axis}</span>
                          <span aria-hidden="true" className="mt-1.5 block space-y-1">
                            <span className="block h-1 bg-secondary" style={{ width: `${a}%` }} />
                            <span className="block h-1 bg-outline" style={{ width: `${b}%` }} />
                          </span>
                        </th>
                        <td className="py-2.5 pl-3 text-right align-top font-headline italic text-lg text-primary">{a}</td>
                        <td className="py-2.5 pl-3 text-right align-top font-headline italic text-lg text-on-surface-variant">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <p className="mt-4 font-body text-sm font-semibold leading-relaxed text-primary">{bold(compare, 1)?.text}</p>
              {compareNotes.map((n) => <p key={n.text} className="mt-2 font-body text-xs leading-relaxed text-on-surface-variant">{n.text}</p>)}
            </section>
          </div>
        </div>

        {/* Confidence key: badges with tooltips on pointer screens, full definitions on touch */}
        <div id="confidence-legend" className="scroll-mt-32 border-t border-outline-variant px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center gap-3 [@media(hover:none)]:hidden">
            <span className={label}>Confidence</span>
            {(Object.keys(COMPASS_CONFIDENCE) as CompassConfidence[]).map((c) => <ConfidenceBadge key={c} confidence={c} />)}
            <span className="font-body text-xs text-on-surface-variant">Hover or focus a level for its definition.</span>
          </div>
          <dl className="hidden [@media(hover:none)]:block">
            {Object.entries(COMPASS_CONFIDENCE).map(([k, v]) => (
              <div key={k} className="grid gap-1 py-2 border-b border-outline-variant last:border-b-0">
                <dt className={label}>{k}</dt>
                <dd className="font-body text-sm leading-relaxed text-on-surface-variant">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <figcaption className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">{timelineFig?.caption}</figcaption>
      {addrNotes.length > 2 && null}
    </figure>
  );
};
