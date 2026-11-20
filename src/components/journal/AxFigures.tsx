import type { ReactNode } from "react";
import {
  AX_BRICKS,
  AX_BRICKS_CAPTION,
  AX_BRICKS_RANGE,
  AX_COUNTER,
  AX_FANOUT,
  AX_NOTE_MCP_CALLS,
  AX_READERS_HEAD,
  AX_READERS_ROWS,
  AX_SIZES,
  AX_SIZES_CAPTION,
  AX_SIZES_DATE,
  axBrickPosition,
  axMonthTicks,
  axShortDate,
  type AxFigureId,
} from "@/content/journalAxFigures";

/**
 * The figures of "One text, three readers". Every one is plain markup: text, lists and bars sized by a percentage, with no
 * script and no motion at all, so the prerender and a reader with reduced motion get the same figure. The text version of
 * each figure (the Markdown mirror, the MCP answers) is built from the same data in journalAxFigures.ts. Colours are the
 * semantic tokens, so Day and Night come from the page. Smallest text: 13 px, and 12 px for an uppercase label.
 */

const KICKER = "font-label text-kicker uppercase tracking-[0.2em] text-secondary";

/** Backticks in a data string become code. */
const Inline = ({ text }: { text: string }): ReactNode =>
  text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") ? <code key={i} className="font-mono text-meta text-primary">{part.slice(1, -1)}</code> : part,
  );

const Fig = ({ label, caption, children, name }: { label?: string; caption?: string; children: ReactNode; name: AxFigureId }) => (
  <figure data-ax-figure={name} className="not-italic m-0 rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
    {label && <p className={`${KICKER} mb-5`}>{label}</p>}
    {children}
    {caption && <figcaption className="mt-5 font-mono text-meta leading-snug text-on-surface-variant">{caption}</figcaption>}
  </figure>
);

// ---------------------------------------------------------------------------------------------------------------

/** The bricks, to scale: each row has its date and its text, and a dot at its true place between 5 May and 20 Nov. */
export const AxBricks = () => {
  const ticks = axMonthTicks();
  const Track = ({ at }: { at?: number }) => (
    <div aria-hidden="true" className="relative mx-1.5 h-5">
      <div className="absolute inset-x-0 top-1/2 h-px bg-outline-variant" />
      {ticks.map((t) => (
        <div key={t.label} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-outline-variant" style={{ left: `${t.at * 100}%` }} />
      ))}
      {at !== undefined && <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary" style={{ left: `${at * 100}%` }} />}
    </div>
  );
  return (
    <Fig name="bricks" caption={AX_BRICKS_CAPTION}>
      <div aria-hidden="true" className="relative mx-1.5 mb-1 h-5 font-mono text-meta text-on-surface-variant">
        {ticks.map((t) => (
          <span key={t.label} className="absolute -translate-x-1/2" style={{ left: `${t.at * 100}%` }}>{t.label}</span>
        ))}
      </div>
      <ol className="m-0 list-none space-y-5 p-0">
        {AX_BRICKS.map((b) => (
          <li key={b.date}>
            <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-body text-base text-on-surface">
              <span className="w-16 shrink-0 font-mono text-meta text-secondary">{b.short}</span>
              <span className="min-w-0 flex-1"><Inline text={b.text} /></span>
            </p>
            <Track at={axBrickPosition(b.date)} />
          </li>
        ))}
      </ol>
      <p className="sr-only">Scale: {axShortDate(AX_BRICKS_RANGE.from)} to {axShortDate(AX_BRICKS_RANGE.to)}, month marks on each line.</p>
    </Fig>
  );
};

// ---------------------------------------------------------------------------------------------------------------

/** Section 1: the three readers as three cards. The Markdown mirror keeps the table. */
export const AxReaders = () => {
  const [, ...labels] = AX_READERS_HEAD;
  return (
    <Fig name="readers">
      <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
        {AX_READERS_ROWS.map(([reader, ...cells]) => (
          <li key={reader} className="rounded-sm border border-outline-variant bg-surface-container-low p-5">
            <p className="m-0 font-headline text-2xl text-heading">{reader}</p>
            <dl className="m-0 mt-4 space-y-3">
              {labels.map((label, i) => (
                <div key={label}>
                  <dt className="font-label text-kicker uppercase tracking-[0.16em] text-secondary">{label}</dt>
                  <dd className="m-0 mt-1 font-body text-base leading-snug text-on-surface">{cells[i]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </Fig>
  );
};

// ---------------------------------------------------------------------------------------------------------------

/** Section 3: one source, five surfaces, the two checks on the links. The MCP branch is the highlighted one. */
export const AxFanout = () => (
  <Fig name="fanout">
    <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
      <div className="flex flex-col justify-center rounded-sm border border-primary bg-surface-container-low p-4 md:w-40 md:shrink-0">
        <p className={KICKER}>{AX_FANOUT.source.label}</p>
        <p className="m-0 mt-2 break-words font-body text-base text-heading"><Inline text={AX_FANOUT.source.files} /></p>
      </div>
      <div className="flex flex-wrap items-center gap-y-1 md:w-36 md:shrink-0 md:flex-col md:justify-center">
        <span aria-hidden="true" className="mr-2 text-secondary md:mr-0">&darr;</span>
        <p className="m-0 rounded-full border border-outline px-3 py-1 font-mono text-meta text-primary">{AX_FANOUT.journeys.name}</p>
        <span className="ml-2 font-mono text-meta text-on-surface-variant md:ml-0 md:mt-2">on the links</span>
      </div>
      <ul className="m-0 min-w-0 flex-1 list-none space-y-3 border-l border-outline-variant p-0 pl-5">
        {AX_FANOUT.surfaces.map((s) => {
          const mcp = s === AX_FANOUT.freshness.on;
          return (
            <li
              key={s}
              className={`relative flex min-w-0 flex-col items-start gap-y-2 rounded-sm border px-4 py-3 before:absolute before:-left-5 before:top-1/2 before:h-px before:w-5 before:bg-outline-variant before:content-[''] ${
                mcp ? "border-2 border-secondary bg-surface-container-low" : "border-outline-variant"
              }`}
            >
              <span className={`font-body text-base ${mcp ? "font-medium text-heading" : "text-on-surface"}`}>{s}</span>
              {mcp && <span className="rounded-full border border-secondary px-3 py-1 font-mono text-meta text-primary">{AX_FANOUT.freshness.name}</span>}
            </li>
          );
        })}
      </ul>
    </div>
    <dl className="m-0 mt-5 space-y-2 border-t border-outline-variant pt-4 font-body text-sm text-on-surface-variant">
      <div><dt className="inline font-mono text-meta text-primary">{AX_FANOUT.journeys.name}</dt><dd className="m-0 inline"> {AX_FANOUT.journeys.does}.</dd></div>
      <div><dt className="inline font-mono text-meta text-primary">{AX_FANOUT.freshness.name}</dt><dd className="m-0 inline"> {AX_FANOUT.freshness.does}.</dd></div>
    </dl>
  </Fig>
);

// ---------------------------------------------------------------------------------------------------------------

/** Section 5: sizes in KB on one scale. The longest bar is the largest file. */
export const AxSizes = () => {
  const max = Math.max(...AX_SIZES.map((s) => s.kb));
  return (
    <Fig name="sizes" label={`Measured on ${AX_SIZES_DATE}`} caption={AX_SIZES_CAPTION}>
      <ul className="m-0 list-none space-y-3 p-0">
        {AX_SIZES.map((s) => (
          <li key={s.label} className="grid items-center gap-x-4 gap-y-1 md:grid-cols-[13rem_1fr_5.5rem]">
            <span className="font-mono text-meta text-on-surface">{s.label}</span>
            <span aria-hidden="true" className="block h-3 w-full">
              <span className="block h-3 rounded-sm bg-secondary" style={{ width: `${(s.kb / max) * 100}%`, minWidth: 3 }} />
            </span>
            <span className="font-mono text-meta text-on-surface md:text-right">{s.shown} KB</span>
          </li>
        ))}
      </ul>
    </Fig>
  );
};

// ---------------------------------------------------------------------------------------------------------------

/** Section 6: the MCP call counter. The number is a constant filled in at publication; a dash until then. */
export const AxCounter = () => (
  <Fig name="counter">
    <p className="m-0 font-headline text-6xl leading-none text-heading md:text-7xl">
      {AX_NOTE_MCP_CALLS === null ? (
        <>
          <span aria-hidden="true">{AX_COUNTER.empty}</span>
          <span className="sr-only">Not filled in yet</span>
        </>
      ) : (
        AX_NOTE_MCP_CALLS.toLocaleString("en-US")
      )}
    </p>
    <p className="m-0 mt-3 font-mono text-meta text-on-surface-variant">{AX_COUNTER.label}</p>
  </Fig>
);

export const AxFigure = ({ id }: { id: AxFigureId }) => {
  switch (id) {
    case "bricks": return <AxBricks />;
    case "readers": return <AxReaders />;
    case "fanout": return <AxFanout />;
    case "sizes": return <AxSizes />;
    case "counter": return <AxCounter />;
  }
};
