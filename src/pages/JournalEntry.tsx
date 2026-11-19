import { AetherixServiceBlueprint } from "@/components/journal/AetherixServiceBlueprint";
import { ArticleUpdates } from "@/components/journal/ArticleUpdates";
import { ApplyMethod } from "@/components/journal/ApplyMethod";
import { useMemo, useRef, type ReactNode } from "react";
import { ContinueCards, NoteHook, NoteIntro, NoteMeta, NotePeak, NoteTrap, ReferenceZone } from "@/components/journal/NotePattern";
import { REFERENCE_ZONE, otherNotes, readLabel } from "@/content/journalIndex";
import { displayOrder } from "@/lib/journalOrder";
import { useParams } from "react-router-dom";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { JournalToc, type TocItem } from "@/components/reading/JournalToc";
import { ReadingProgress } from "@/components/reading/ReadingProgress";
import { HeadingAnchor } from "@/components/reading/HeadingAnchor";

import { JOURNAL_ENTRIES, type JournalBlock, type JournalEntry as Entry, type PeakBlock } from "@/content/journal";
import { journalHeadingIds } from "@/lib/journalHeadingIds";
import { getJournalTerms, type TermMark } from "@/content/journalTerms";
import { createTermTaker } from "@/components/journal/TermText";
import { ThreeArmsDiagram } from "@/components/journal/ThreeArmsDiagram";
import { VocabStrip } from "@/components/journal/VocabStrip";
import { SectionKey } from "@/components/journal/SectionKey";
import { SystemAnchors } from "@/components/journal/SystemAnchors";
import { CanaryTimeline } from "@/components/journal/CanaryTimeline";
import { GraderStepper } from "@/components/journal/GraderStepper";
import { CardGrid } from "@/components/journal/CardGrid";
import { AskRose } from "@/components/journal/AskRose";
import { PyramidDiagram } from "@/components/journal/PyramidDiagram";
import { ShareRow } from "@/components/journal/ShareRow";
import { EntryActions } from "@/components/journal/EntryActions";
import { CoverageMatrix } from "@/components/journal/CoverageMatrix";
import { EntryOpening } from "@/components/journal/EntryOpening";
import { SelfDiagnostic } from "@/components/journal/SelfDiagnostic";
import { HarnessConsole } from "@/components/journal/HarnessConsole";
import { McpEndpoint } from "@/components/McpEndpoint";
import { RecommendationLine } from "@/components/journal/RecommendationLine";
import { SignalLamp } from "@/components/journal/SignalLamp";
import { firstSentence } from "@/content/readingTime";
import type { Signal } from "@/content/recoLine";

const VERDICT_SIGNAL: Record<string, Signal> = { PASS: "go", WARN: "warn", FAIL: "stop", ERROR: "dark" };

const RELATED_ROLE = {
  method: "Read the method",
  decision: "Understand the design decision",
  evidence: "Inspect implementation evidence",
} as const;



type Lang = "en" | "fr";

const LABELS: Record<Lang, { locale: string; readTime: (m: number) => string; deployed: string; related: string; dataTable: string }> = {
  en: {
    locale: "en-US",
    readTime: (m) => `${m} min read`,
    deployed: "Deployed",
    related: "Related",
    dataTable: "Data table",
  },
  fr: {
    locale: "fr-FR",
    readTime: (m) => `${m} min de lecture`,
    deployed: "En production",
    related: "À lire aussi",
    dataTable: "Tableau de données",
  },
};

const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });




const blockStrings = (block: JournalBlock): string[] => {
  switch (block.kind) {
    case "p":
    case "h2":
    case "h3":
    case "quote":
    case "code":
      return [block.text];
    case "list":
      return block.items;
    case "table":
      return [...block.head, ...block.rows.flat()];
    case "defs":
      return block.items.map((i) => i.def);
    case "pyramid":
      return block.layers.flatMap((l) => [l.name, l.note ?? ""]);
    case "deployed":
      return block.items.map((i) => i.text);
    case "lines":
      return block.items.flatMap((i) => [i.q, i.a]);
    case "key":
      return [block.oneLine, block.concrete ?? ""];
    case "anchors":
      return block.items.flatMap((i) => [i.what, i.who, i.feedback]);
    case "timeline":
      return block.steps.flatMap((s) => [s.label, s.note ?? ""]);
    case "cards":
      return block.items.map((i) => i.body);
    case "matrix":
      return block.rows.flatMap((r) => r.cells.flatMap((c) => [c.instance, c.cost ?? ""]));
    case "stepper":
      return [block.question, ...block.steps.map((s) => s.reading)];
    case "fold":
      return block.blocks.flatMap(blockStrings);
    case "trap":
      return [block.question, ...block.reveal];
    case "recoLine":
      return [block.caption];
    case "callout":
      return [block.text];

    default:
      return [];
  }
};

const Block = ({
  block,
  labels,
  headingId,
  marks = [],
  standfirst = false,
  diagnostic,
}: {
  block: JournalBlock;
  labels: (typeof LABELS)[Lang];
  headingId?: string;
  marks?: TermMark[];
  /** Each section's verdict line is set as a standfirst (the harness note). */
  standfirst?: boolean;
  /** The note's self-diagnostic, for a `diagnostic` block. */
  diagnostic?: Entry["diagnostic"];
}) => {
  const t = createTermTaker(marks);
  switch (block.kind) {
    case "p":
      return <p className="font-body">{t(block.text)}</p>;
    case "h2":
      return (
        <h2
          id={headingId}
          tabIndex={-1}
          className="group scroll-mt-32 font-headline italic text-2xl md:text-3xl text-heading pt-8"
        >
          {block.aliases?.map((alias) => <span key={alias} id={alias} className="block scroll-mt-32" />)}
          {block.text}
          {headingId && <HeadingAnchor id={headingId} text={block.text} />}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={headingId}
          tabIndex={-1}
          className="group scroll-mt-32 font-label uppercase tracking-[0.2em] text-[11px] text-secondary pt-6"
        >
          {block.text}
          {headingId && <HeadingAnchor id={headingId} text={block.text} />}
        </h3>
      );
    case "apply":
      return <ApplyMethod slug={block.slug} />;
    case "callout":
      return (
        <aside className="border-y border-outline-variant py-6">
          <p className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-3">{block.title}</p>
          <p className="font-body text-base">{t(block.text)}</p>
          <Link
            to={block.link.to}
            className="mt-4 inline-flex items-center gap-2 font-headline italic text-primary border-b border-secondary/60 pb-0.5 hover:text-secondary hover:border-secondary transition-colors"
          >
            {block.link.text}
            <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </aside>
      );
    case "quote":
      return (
        <blockquote className="border-l border-secondary pl-6 font-headline italic text-xl md:text-2xl text-heading leading-relaxed">
          {t(block.text)}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-3 font-body">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="text-secondary select-none">
                &mdash;
              </span>
              <span>{t(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div
          tabIndex={0}
          role="region"
          aria-label="Code sample"
          className="overflow-x-auto rounded-sm border border-outline-variant bg-surface-container-low focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
        >
          <pre className="p-4 md:p-6 text-sm leading-relaxed">
            <code className="font-mono text-on-surface-variant">{block.text}</code>
          </pre>
        </div>
      );
    case "table":
      return (
        <div
          tabIndex={0}
          role="region"
          aria-label={block.caption ?? labels.dataTable}
          className="overflow-x-auto rounded-sm border border-outline-variant focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
        >
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <caption className="sr-only">{block.caption ?? block.head.join(", ")}</caption>
            <thead>
              <tr className="border-b border-outline">
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-3 font-label uppercase tracking-[0.16em] text-[10px] text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-outline last:border-0">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 align-top font-body ${
                        ci === 0 ? "text-primary font-medium" : "text-on-surface-variant font-normal"
                      }`}
                    >
                      {ci === block.lampCol && VERDICT_SIGNAL[cell] ? (
                        <span className="inline-flex items-center gap-2">
                          <SignalLamp state={VERDICT_SIGNAL[cell]} hideWord />
                          {t(cell)}
                        </span>
                      ) : ci === block.foldCol && firstSentence(cell) !== cell ? (
                        <details className="group">
                          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                            {t(firstSentence(cell))}{" "}
                            <span className="font-label text-[11px] uppercase tracking-[0.12em] text-primary group-open:hidden">Read more</span>
                          </summary>
                          {t(cell.slice(firstSentence(cell).length).trim())}
                        </details>
                      ) : (
                        t(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "defs":
      return (
        <dl className="space-y-6">
          {block.items.map((item, i) => (
            <div key={i} className="border-l border-outline-variant pl-5">
              <dt className="font-label uppercase tracking-[0.16em] text-[11px] text-primary mb-1">
                {item.term}
              </dt>
              <dd className="font-body font-normal text-base text-on-surface-variant">{t(item.def)}{item.note && <em className="block mt-2">{item.note}</em>}</dd>
            </div>
          ))}
        </dl>
      );
    case "pyramid":
      return <PyramidDiagram layers={block.layers} renderNote={(text) => t(text)} />;
    case "deployed":
      return (
        <div className="border-t border-outline-variant pt-5">
          <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
            {labels.deployed}
          </div>
          <div className="space-y-3">
            {block.items.map((item, i) => (
              <p key={i} className="font-body font-normal text-base">
                <Link
                  to={item.to}
                  className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
                >
                  {item.project}
                </Link>{" "}
                <span className="text-on-surface-variant">{t(item.text)}</span>
              </p>
            ))}
          </div>
        </div>
      );
    case "lines": {
      const shown = block.visible ? block.items.filter((i) => block.visible!.includes(i.q)) : block.items;
      const folded = block.visible ? block.items.filter((i) => !block.visible!.includes(i.q)) : [];
      const card = (item: { q: string; a: string }, i: number) => (
        <div key={i} className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5">
          <dt className="font-headline italic text-lg text-heading mb-2">{item.q}</dt>
          <dd className="font-body font-normal text-sm text-on-surface-variant">{t(item.a)}</dd>
        </div>
      );
      return (
        <>
          <dl className="grid gap-4 sm:grid-cols-2">{shown.map(card)}</dl>
          {folded.length > 0 && (
            <details data-more-questions className="mt-4 rounded-sm border border-outline-variant px-4 py-3">
              <summary className="cursor-pointer font-label text-[11px] uppercase tracking-[0.14em] text-primary">{block.foldSummary ?? "More questions"}</summary>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">{folded.map(card)}</dl>
            </details>
          )}
        </>
      );
    }
    case "diagnostic":
      return diagnostic ? (
        <SelfDiagnostic label={diagnostic.label} intro={diagnostic.intro} caveat={diagnostic.caveat} allYes={diagnostic.allYes} questions={diagnostic.questions} />
      ) : null;
    case "arms":
      return (
        <>
          <ThreeArmsDiagram label={block.label} />
          {block.link && (
            <p className="font-body mt-4">
              <Link
                to={block.link.to}
                className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
              >
                {block.link.text}
              </Link>
            </p>
          )}
        </>
      );
    case "vocab":
      return <VocabStrip items={block.items} label={block.label} />;
    case "key":
      return (
        <SectionKey
          sigil={block.sigil}
          icon={block.icon}
          minutes={block.minutes}
          oneLine={block.oneLine}
          concrete={block.concrete}
          standfirst={standfirst}
        />
      );
    case "anchors":
      return <SystemAnchors items={block.items} label={block.label} />;
    case "timeline":
      return <CanaryTimeline steps={block.steps} label={block.label} />;
    case "stepper":
      return (
        <GraderStepper
          label={block.label}
          question={block.question}
          rule={block.rule}
          answer={block.answer}
          steps={block.steps}
          reveal={block.reveal}
          note={block.note}
        />
      );
    case "blueprint":
      return <AetherixServiceBlueprint />;
    case "cards":
      return <CardGrid items={block.items} label={block.label} />;
    case "fold":
      return (
        <details className="rounded-sm border border-outline-variant px-4 py-3">
          <summary className="cursor-pointer font-label text-[11px] uppercase tracking-[0.14em] text-primary">{block.summary}</summary>
          <div className="mt-4 space-y-6">
            {block.blocks.map((b, i) => <Block key={i} block={b} labels={labels} marks={marks} standfirst={standfirst} diagnostic={diagnostic} />)}
          </div>
        </details>
      );
    case "recoLine":
      return (
        <>
          <RecommendationLine id={block.id} initialLayer={block.layer} caption={block.caption} />
          {block.link && (
            <p className="font-body mt-4">
              <Link to={block.link.to} className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity">
                {block.link.text}
              </Link>
            </p>
          )}
        </>
      );
    case "askRose":
      return <AskRose prompts={block.prompts} label={block.label} note={block.note} />;
    case "console":
      return <HarnessConsole label={block.label} />;
    case "mcp":
      return <McpEndpoint label={block.label} note={block.note} />;
    case "trap":
      return <NoteTrap block={block} />;
    case "matrix":
      return <CoverageMatrix label={block.label} columns={block.columns} rows={block.rows} />;

    default:
      return null;
  }
};


const JournalEntry = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = JOURNAL_ENTRIES.find((e) => e.slug === slug);
  const lang: Lang = entry?.lang ?? "en";
  const labels = LABELS[lang];
  const articleRef = useRef<HTMLElement>(null);

  const headingIds = useMemo(() => journalHeadingIds(entry?.body ?? []), [entry]);

  // The order the sections are read in: the body's own, unless the note moves a section (heading ids do not change).
  const order = useMemo(() => displayOrder(entry?.body ?? [], entry?.moves), [entry]);

  const tocItems = useMemo<TocItem[]>(
    () =>
      order.flatMap((i) => {
        const b = entry?.body[i];
        return b && b.kind === "h2" && headingIds[i] ? [{ id: headingIds[i] as string, text: b.text }] : [];
      }),
    [entry, headingIds, order]
  );

  const tocLabel = lang === "fr" ? "Sommaire" : "Contents";

  const blockMarks = useMemo<TermMark[][]>(() => {
    const body = entry?.body ?? [];
    const pending = [...getJournalTerms(entry?.slug)];
    const marks: TermMark[][] = body.map(() => []);
    // In the order the reader meets the blocks, so a term is marked where it first appears on the page.
    for (const i of order) {
      if (!pending.length) break;
      const strings = blockStrings(body[i]);
      for (const mark of [...pending]) {
        const re = new RegExp(`\\b${mark.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (strings.some((s) => re.test(s))) {
          marks[i].push(mark);
          pending.splice(pending.indexOf(mark), 1);
        }
      }
    }
    return marks;
  }, [entry, order]);



  if (!entry) {
    return (
      <SiteLayout title="Field Notes">
        <div className="pt-40 px-6 md:px-12 max-w-3xl mx-auto min-h-[60vh]">
          <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block">
            Field Notes
          </span>
          <h1 className="font-headline text-4xl md:text-6xl italic text-heading mb-8">Entry not found.</h1>
          <p className="text-on-surface-variant font-normal mb-12">
            That note may have been moved, renamed, or is still in draft.
          </p>
          <Link
            to="/journal"
            className="font-headline italic text-secondary border-b border-secondary pb-1 hover:opacity-70 transition-opacity"
          >
            Back to Field Notes
          </Link>
        </div>
      </SiteLayout>
    );
  }


  // The note, as a pattern (board J): hook, argument with one peak moment, "Continue exploring", reference zone.
  const reference = REFERENCE_ZONE[entry.slug];
  const refPos = reference ? order.findIndex((i) => headingIds[i] === reference.from) : -1;
  const splitAt = refPos >= 0 ? refPos : order.length;
  const early = entry.body.find((b): b is PeakBlock => b.kind === "peak" && !!b.afterGlance);
  const mainIdx = order.slice(0, splitAt).filter((i) => entry.body[i] !== early);
  const refIdx = order.slice(splitAt);
  // The self-diagnostic sits before the argument unless the note sets it in its body (a `diagnostic` block, in a fold).
  const hasDiagnosticBlock = (blocks: JournalBlock[]): boolean => blocks.some((b) => b.kind === "diagnostic" || (b.kind === "fold" && hasDiagnosticBlock(b.blocks)));
  const diagnosticInBody = hasDiagnosticBlock(entry.body);
  const others = otherNotes(entry.slug);
  const also = (entry.related ?? []).filter((r) => !r.to.startsWith("/journal/"));
  const chips = [
    ...(reference?.chips ?? []),
    ...(entry.updates?.length ? [{ label: `Updates · ${entry.updates.length}`, id: "updates" }] : []),
  ];

  const renderBlockAt = (i: number) => {
    const block = entry.body[i];
    return (
      <Reveal key={i} id={block.kind === "table" ? block.anchor : undefined}>
        <Block block={block} labels={labels} headingId={headingIds[i]} marks={blockMarks[i]} standfirst={entry.standfirst} diagnostic={entry.diagnostic} />
      </Reveal>
    );
  };

  /** Runs of blocks at body width, with each peak moment as a band between them. */
  const renderRun = (indexes: number[]) => {
    const out: ReactNode[] = [];
    let run: number[] = [];
    const flush = () => {
      if (!run.length) return;
      out.push(
        <div key={`run-${run[0]}`} className="max-w-[42rem] space-y-8 text-lg text-on-surface-variant font-normal leading-relaxed">
          {run.map(renderBlockAt)}
        </div>,
      );
      run = [];
    };
    for (const i of indexes) {
      const block = entry.body[i];
      if (block.kind === "peak") {
        flush();
        out.push(<NotePeak key={`peak-${i}`} block={block} />);
      } else run.push(i);
    }
    flush();
    return out;
  };

  const topLink = { to: "/journal", label: `All Field Notes · ${JOURNAL_ENTRIES.length}` };

  return (
    <SiteLayout title={entry.title}>
      <Seo
        title={entry.title}
        description={entry.excerpt}
        path={`/journal/${entry.slug}`}
        type="article"
        markdown={entry.mirror}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.excerpt,
          datePublished: entry.date,
          dateModified: entry.updates?.map((u) => u.date).sort().at(-1) ?? entry.date,
          author: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          articleSection: entry.category,
          ...(entry.license ? { license: entry.license.url } : {}),
          url: `https://ivandemurard.com/journal/${entry.slug}`,
        }}
      />
      <ReadingProgress targetRef={articleRef} />
      <div className="overflow-x-clip px-6 pb-32 pt-32 md:px-12 md:pb-48 md:pt-40">
        <div className="relative mx-auto max-w-[61rem]">
          <header>
            <NoteMeta entry={entry} date={formatDate(entry.date, labels.locale)} />
            <h1 className="mb-6 font-headline text-4xl italic leading-[1.1] text-heading md:text-6xl">{entry.title}</h1>
            <NoteHook entry={entry} />
          </header>
          {tocItems.length > 1 && (
            <aside className="absolute bottom-0 right-0 top-0 hidden w-[15rem] lg:block">
              <JournalToc
                items={tocItems}
                label={tocLabel}
                topLink={topLink}
                meta={entry.readingMinutes ? readLabel(entry) : undefined}
              />
            </aside>
          )}
          <article ref={articleRef} lang={lang} className="min-w-0">
            <div className="max-w-[42rem]">
              <NoteIntro entry={entry} />
              <div className="mt-8">
                <EntryActions title={entry.title} markdownPath={`/journal/${entry.slug}.md`} />
              </div>
              {entry.glance || entry.takeaways?.length ? (
                <EntryOpening glance={entry.glance} takeaways={entry.takeaways} punch={entry.takeawayPunch} />
              ) : null}
            </div>
            {early && <NotePeak block={early} />}
            <div className="max-w-[42rem]">
              {entry.diagnostic && !diagnosticInBody && (
                <SelfDiagnostic
                  label={entry.diagnostic.label}
                  intro={entry.diagnostic.intro}
                  caveat={entry.diagnostic.caveat}
                  allYes={entry.diagnostic.allYes}
                  questions={entry.diagnostic.questions}
                />
              )}
              {tocItems.length > 1 && (
                <JournalToc
                  items={tocItems}
                  label={tocLabel}
                  topLink={topLink}
                  variant="mobile"
                  meta={entry.readingMinutes ? readLabel(entry) : undefined}
                />
              )}
            </div>

            {renderRun(mainIdx)}

            <div className="max-w-[42rem]">
              <ContinueCards notes={others} also={also} />
            </div>

            <ReferenceZone chips={chips}>
              <div className="space-y-8 text-lg text-on-surface-variant font-normal leading-relaxed">{refIdx.map(renderBlockAt)}</div>
              <ArticleUpdates updates={entry.updates} />
            </ReferenceZone>

            <div className="max-w-[42rem]">
              <ShareRow title={entry.title} excerpt={entry.excerpt} mirror={entry.mirror} license={entry.license} />
              <div className="mt-24 flex items-center justify-between border-t border-outline-variant pt-12">
                <Link
                  to="/journal"
                  className="inline-flex items-center gap-2 border-b border-secondary pb-1 font-headline italic text-secondary transition-opacity hover:opacity-70"
                >
                  <Icon name="arrow_back" className="text-sm" />
                  All Field Notes
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </SiteLayout>
  );
};

export default JournalEntry;
