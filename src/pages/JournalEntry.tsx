import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { JournalToc, type TocItem } from "@/components/journal/JournalToc";
import { ReadingProgress } from "@/components/journal/ReadingProgress";
import { JOURNAL_ENTRIES, type JournalBlock } from "@/content/journal";
import { getJournalTerms, type TermMark } from "@/content/journalTerms";
import { createTermTaker } from "@/components/journal/TermText";
import { ThreeArmsDiagram } from "@/components/journal/ThreeArmsDiagram";
import { VocabStrip } from "@/components/journal/VocabStrip";

const slugifyHeading = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";


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

const HeadingAnchor = ({ id, text }: { id: string; text: string }) => (
  <a
    href={`#${id}`}
    aria-label={`Link to section: ${text}`}
    onClick={(e) => {
      e.preventDefault();
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      window.history.replaceState(null, "", `#${id}`);
      navigator.clipboard?.writeText(url).catch(() => undefined);
      document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    }}
    className="ml-2 align-middle inline-flex items-center text-secondary opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus:opacity-100 transition-opacity duration-300"
  >
    <Icon name="link" aria-hidden="true" className="text-base not-italic" />
  </a>
);

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
    default:
      return [];
  }
};

const Block = ({
  block,
  labels,
  headingId,
  marks = [],
}: {
  block: JournalBlock;
  labels: (typeof LABELS)[Lang];
  headingId?: string;
  marks?: TermMark[];
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
          className="group scroll-mt-32 font-headline italic text-2xl md:text-3xl text-primary pt-8"
        >
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
    case "quote":
      return (
        <blockquote className="border-l border-secondary pl-6 font-headline italic text-xl md:text-2xl text-primary leading-relaxed">
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
          className="overflow-x-auto rounded-sm border border-outline-variant bg-surface-container-low"
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
          className="overflow-x-auto rounded-sm border border-outline-variant"
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
                        ci === 0 ? "text-primary font-medium" : "text-on-surface-variant font-light"
                      }`}
                    >
                      {t(cell)}
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
              <dd className="font-body font-light text-base text-on-surface-variant">{t(item.def)}</dd>
            </div>
          ))}
        </dl>
      );
    case "pyramid": {
      const total = block.layers.length;
      return (
        <ol
          aria-label="Layered model, from top layer to foundation"
          className="flex flex-col items-center gap-2 list-none p-0 m-0"
        >
          {block.layers.map((layer, i) => {
            const width = 55 + ((i + 1) / total) * 45;
            return (
              <li
                key={i}
                style={{ ["--pw" as string]: `${width}%` }}
                className={`w-full md:w-[var(--pw)] rounded-sm px-4 py-3 text-center transition-[width] duration-500 ease-hospitable ${
                  layer.base
                    ? "bg-surface-container-high border border-secondary"
                    : "bg-surface-container-low border border-outline-variant"
                }`}
              >
                <div className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">
                  {layer.level}
                  {layer.base && <span className="sr-only"> (foundation)</span>}
                </div>
                <div
                  className={`font-headline italic text-lg ${
                    layer.base ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {layer.name}
                </div>
                {layer.note && (
                  <div className="font-body font-light text-xs text-on-surface-variant mt-1">
                    {t(layer.note)}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      );
    }
    case "deployed":
      return (
        <div className="border-t border-outline-variant pt-5">
          <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
            {labels.deployed}
          </div>
          <div className="space-y-3">
            {block.items.map((item, i) => (
              <p key={i} className="font-body font-light text-base">
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
    case "lines":
      return (
        <dl className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5"
            >
              <dt className="font-headline italic text-lg text-primary mb-2">{item.q}</dt>
              <dd className="font-body font-light text-sm text-on-surface-variant">{t(item.a)}</dd>
            </div>
          ))}
        </dl>
      );
    case "arms":
      return <ThreeArmsDiagram label={block.label} />;
    case "vocab":
      return <VocabStrip items={block.items} label={block.label} />;
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

  const headingIds = useMemo(() => {
    const used = new Map<string, number>();
    return (entry?.body ?? []).map((b) => {
      if (b.kind !== "h2" && b.kind !== "h3") return undefined;
      const base = slugifyHeading(b.text);
      const n = used.get(base) ?? 0;
      used.set(base, n + 1);
      return n === 0 ? base : `${base}-${n + 1}`;
    });
  }, [entry]);

  const tocItems = useMemo<TocItem[]>(
    () =>
      (entry?.body ?? []).flatMap((b, i) =>
        b.kind === "h2" && headingIds[i] ? [{ id: headingIds[i] as string, text: b.text }] : []
      ),
    [entry, headingIds]
  );

  const tocLabel = lang === "fr" ? "Sommaire" : "Contents";

  const blockMarks = useMemo<TermMark[][]>(() => {
    const body = entry?.body ?? [];
    const pending = [...getJournalTerms(entry?.slug)];
    return body.map((b) => {
      if (!pending.length) return [];
      const strings = blockStrings(b);
      const taken: TermMark[] = [];
      for (const mark of [...pending]) {
        const re = new RegExp(`\\b${mark.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (strings.some((s) => re.test(s))) {
          taken.push(mark);
          pending.splice(pending.indexOf(mark), 1);
        }
      }
      return taken;
    });
  }, [entry]);



  if (!entry) {
    return (
      <SiteLayout title="Field Notes">
        <div className="pt-40 px-6 md:px-12 max-w-3xl mx-auto min-h-[60vh]">
          <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block">
            Field Notes
          </span>
          <h1 className="font-headline text-4xl md:text-6xl italic text-primary mb-8">Entry not found.</h1>
          <p className="text-on-surface-variant font-light mb-12">
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

  return (
    <SiteLayout title={entry.title}>
      <Seo
        title={entry.title}
        description={entry.excerpt}
        path={`/journal/${entry.slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.excerpt,
          datePublished: entry.date,
          dateModified: entry.date,
          author: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          articleSection: entry.category,
          url: `https://ivandemurard.com/journal/${entry.slug}`,
        }}
      />
      <ReadingProgress targetRef={articleRef} />
      <div className="pt-32 md:pt-40 pb-32 md:pb-48 px-6 md:px-12">
        <div className="max-w-3xl lg:max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,42rem)_minmax(0,15rem)] lg:gap-16 lg:justify-center">
        <article ref={articleRef} lang={lang} className="min-w-0">
          <div className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{entry.category}</span>
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
              {formatDate(entry.date, labels.locale)}
            </span>
            {entry.readingMinutes && (
              <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
                {labels.readTime(entry.readingMinutes)}
              </span>
            )}
          </div>
          <h1 className="font-headline text-4xl md:text-6xl italic text-primary leading-[1.1] mb-6">
            {entry.title}
          </h1>
          {entry.subtitle && (
            <p className="font-body font-light text-lg text-on-surface-variant mb-10">{entry.subtitle}</p>
          )}
          <p className="text-xl md:text-2xl font-headline italic text-on-surface-variant leading-relaxed mb-16">
            {entry.excerpt}
          </p>
          {tocItems.length > 1 && (
            <JournalToc
              items={tocItems}
              label={tocLabel}
              variant="mobile"
              meta={entry.readingMinutes ? labels.readTime(entry.readingMinutes) : undefined}
            />
          )}
          <div className="space-y-8 text-lg text-on-surface-variant font-light leading-relaxed">
            {entry.body.map((block, i) => (
              <Reveal key={i}>
                <Block block={block} labels={labels} headingId={headingIds[i]} marks={blockMarks[i]} />
              </Reveal>
            ))}
          </div>
          {entry.related && entry.related.length > 0 && (
            <div className="mt-20 pt-10 border-t border-outline-variant">
              <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
                {labels.related}
              </div>
              <ul className="space-y-2">
                {entry.related.map((r, i) => (
                  <li key={i}>
                    <Link
                      to={r.to}
                      className="font-headline italic text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-24 pt-12 border-t border-outline-variant flex items-center justify-between">
            <Link
              to="/journal"
              className="font-headline italic text-secondary border-b border-secondary pb-1 hover:opacity-70 transition-opacity inline-flex items-center gap-2"
            >
              <Icon name="arrow_back" className="text-sm" />
              All Field Notes
            </Link>
          </div>
        </article>
        {tocItems.length > 1 && (
          <aside className="hidden lg:block">
            <JournalToc
              items={tocItems}
              label={tocLabel}
              meta={entry.readingMinutes ? labels.readTime(entry.readingMinutes) : undefined}
            />
          </aside>
        )}
        </div>
      </div>
    </SiteLayout>
  );
};

export default JournalEntry;
