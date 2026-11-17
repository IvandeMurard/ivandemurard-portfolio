import type { ReactNode } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { cn } from "@/lib/utils";
import type { JournalEntry, PeakBlock } from "@/content/journal";
import { metaLine, readLabel, revisedLabel, revisionCount } from "@/content/journalIndex";

/**
 * The pattern every Field Note follows (board J of docs/field-notes-prototype): a hook in display serif, one peak moment
 * on a full-viewport section whose background runs from the page colour to navy and back, and the reference matter
 * (apply it, checklist, FAQ, sources, updates) on a flat neutral ground. The body column keeps its width; only the
 * bands run edge to edge. The page wrapper clips the horizontal overflow of a 100vw band (overflow-x: clip, which
 * keeps the contents rail sticky).
 */
const BLEED = "relative ml-[calc(50%-50vw)] w-screen max-w-none";

const CAP = "font-mono text-[12.5px] leading-snug text-on-surface-variant";

/** Above the title: where the note sits, what it helps decide, how long it takes, how often it was revised. */
export const NoteMeta = ({ entry, date }: { entry: JournalEntry; date: string }) => {
  const revised = revisedLabel(revisionCount(entry));
  return (
    <p className={cn(CAP, "mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1")}>
      <Link to="/journal" className="underline decoration-secondary/50 underline-offset-4 hover:text-primary">Field Notes</Link>
      <span aria-hidden>·</span>
      <span>{entry.decision}</span>
      <span aria-hidden>·</span>
      <span>{readLabel(entry)}</span>
      {revised && (
        <>
          <span aria-hidden>·</span>
          <a href="#updates" className="underline decoration-secondary/50 underline-offset-4 hover:text-primary">{revised}</a>
        </>
      )}
      <span aria-hidden>·</span>
      <time dateTime={entry.date}>{date}</time>
    </p>
  );
};

/** The hook, one sentence in display serif at the full content width, then the intro line at body width. */
export const NoteHook = ({ entry }: { entry: JournalEntry }) => (
  <p className="mt-2 max-w-[1000px] font-headline text-[30px] font-normal leading-[1.2] text-primary md:text-[38px]">{entry.hook}</p>
);

export const NoteIntro = ({ entry }: { entry: JournalEntry }) => (
  <>
    <p className="mt-7 font-body text-[17px] leading-relaxed text-on-surface">{entry.intro}</p>
    {entry.subtitle && !entry.subtitle.includes(entry.hook) && (
      <p className="mt-4 font-body text-base leading-relaxed text-on-surface-variant">{entry.subtitle}</p>
    )}
  </>
);

const Ramp = ({ toNavy }: { toNavy: boolean }) => (
  <div
    aria-hidden="true"
    className={cn(BLEED, toNavy ? "h-[140px] bg-gradient-to-b from-surface to-inverse-ground" : "h-[120px] bg-gradient-to-b from-inverse-ground to-surface")}
  />
);

/** The peak moment: page colour, a ramp to navy, a full-viewport section, a ramp back. Static: nothing animates. */
export const NotePeak = ({ block }: { block: PeakBlock }) => (
  <>
    <Ramp toNavy />
    <section aria-label={block.aria} data-peak className={cn(BLEED, "section-inverse flex min-h-[620px] items-center px-6 py-16 md:px-12")}>
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-[13px] uppercase leading-snug tracking-[0.12em] text-secondary">{block.kicker}</p>
        <p className={cn("mt-5 max-w-[900px] font-headline font-normal text-primary", block.leadBig ? "text-[38px] leading-[1.1] md:text-[48px]" : "text-[28px] leading-[1.18] md:text-[40px]")}>
          {block.lead}
        </p>
        <div className={cn("mt-9 grid items-start gap-5", block.cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
          {block.boxes.map((box) => (
            <div key={box.label} className={cn("rounded-[14px] border p-5 md:p-[22px]", box.tone === "fail" ? "border-lamp-stop-on-card" : "border-primary/30")}>
              <p className={cn("font-mono text-[13px] leading-snug", box.tone === "fail" ? "text-lamp-stop-on-card" : "text-secondary")}>{box.label}</p>
              <p className={cn("mt-2.5 text-on-surface", box.big ? "text-[19px]" : "text-[17px]")}>
                {box.text}
              </p>
              {box.bubble && <p className="mt-3.5 inline-flex rounded-xl bg-primary px-3.5 py-2 text-[15px] text-on-primary">{box.bubble}</p>}
              {box.chain && (
                <p className="mt-2.5 text-[14.5px] text-on-surface-variant">
                  {box.chain.steps.map((s, i) => (
                    <span key={s}>
                      {i > 0 && " · "}
                      {s === box.chain!.strong ? <strong className="font-semibold text-primary">{s}</strong> : s}
                    </span>
                  ))}
                </p>
              )}
              {box.note && <p className="mt-2.5 text-[14.5px] leading-snug text-on-surface-variant">{box.note}</p>}
            </div>
          ))}
        </div>
        {block.after && <p className="mt-7 max-w-[760px] text-[18px] leading-relaxed text-on-surface">{block.after}</p>}
        {block.link && (
          <p className="mt-7 text-[15px] leading-snug">
            <a href={`#${block.link.to}`} className="text-on-surface underline decoration-secondary underline-offset-4 hover:text-primary">
              {block.link.text}
            </a>
          </p>
        )}
      </div>
    </section>
    <Ramp toNavy={false} />
  </>
);

export type ReferenceChip = { label: string; id: string };

/** The end matter, grouped on a flat neutral ground, with a link list of what it holds. */
export const ReferenceZone = ({ chips, children }: { chips: ReferenceChip[]; children: ReactNode }) => (
  <section aria-label="Reference" data-reference className={cn(BLEED, "mt-16 border-t border-outline-variant bg-surface-container-low px-6 pb-16 pt-10 md:px-12")}>
    <div className="mx-auto w-full max-w-[61rem]">
      <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-on-surface-variant">Reference · for when you apply it</p>
      <nav aria-label="Reference sections" className="mt-4">
        <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
          {chips.map((c) => (
            <li key={c.id + c.label}>
              <a href={`#${c.id}`} className="inline-flex min-h-10 items-center rounded-full border border-outline-variant px-4 text-[14.5px] text-primary hover:border-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-12 max-w-[42rem]">{children}</div>
    </div>
  </section>
);

/** Between the end of the argument and the reference zone: the other two notes, framed by the decision they help with. */
export const ContinueCards = ({ notes, also }: { notes: JournalEntry[]; also?: { label: string; to: string; why?: string }[] }) => (
  <nav aria-labelledby="continue-exploring" className="mt-20">
    <h2 id="continue-exploring" className="mb-5 font-label text-[11px] uppercase tracking-[0.2em] text-secondary">Continue exploring</h2>
    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
      {notes.map((n) => (
        <li key={n.slug} className="relative flex flex-col gap-3 rounded-[20px] border border-outline-variant bg-surface-container-lowest p-6 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-secondary">
          <p className="font-mono text-[11px] uppercase leading-snug tracking-[0.12em] text-on-surface-variant">{n.decision}</p>
          <p className="font-headline text-[24px] font-normal leading-[1.15] text-primary">{n.title}</p>
          <p className="mt-auto font-mono text-[12.5px] text-on-surface-variant">{metaLine(n)}</p>
          <Link to={`/journal/${n.slug}`} className="text-sm font-medium text-primary underline decoration-secondary underline-offset-4 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            Read the note<span className="sr-only">: {n.title}</span>
          </Link>
        </li>
      ))}
    </ul>
    {also && also.length > 0 && (
      <ul className="mt-6 space-y-3 p-0 list-none">
        {also.map((r) => (
          <li key={r.to} className="text-base">
            <Link to={r.to} className="font-headline text-lg text-primary underline decoration-secondary/60 underline-offset-4 hover:text-secondary">{r.label}</Link>
            {r.why && <p className="mt-1 text-sm text-on-surface-variant">{r.why}</p>}
          </li>
        ))}
      </ul>
    )}
  </nav>
);
