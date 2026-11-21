import { Icon } from "@/components/ui/Icon";
import { LISTEN_SECTION_HEADING, listenSummaryBySlug, listenSummaryNotice } from "@/content/listenSummaries";

/** The event the dock listens to: open in reading mode on the summary of the page. */
export const LISTEN_OPEN_EVENT = "rose:listen";

/**
 * "Listen summary": the recorded summary of a page, discreet, under its title or in its reference zone. The notice says who
 * wrote it, when it was validated and how long it is; the whole text is there, folded, and open without JavaScript (the
 * `open` attribute is in the markup). The button opens the dock on the audiogram. Every word comes from
 * src/content/listenSummaries.ts, the same source as the dock, the Markdown mirrors, llms-full.txt and MCP.
 */
export const ListenSummaryBlock = ({ slug, className = "" }: { slug: string; className?: string }) => {
  const summary = listenSummaryBySlug(slug);
  if (!summary) return null;
  const paragraphs = summary.text.split(/\n{2,}/);
  return (
    <section aria-label={LISTEN_SECTION_HEADING} data-listen-summary={slug} className={`rounded-xl border border-outline-variant bg-surface-container px-5 py-4 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 className="font-label text-kicker uppercase tracking-[0.18em] text-on-surface-variant">{LISTEN_SECTION_HEADING}</h2>
          <p className="mt-1 font-body text-sm text-on-surface-variant" data-listen-notice>{listenSummaryNotice(summary)}</p>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(LISTEN_OPEN_EVENT, { detail: { slug } }))}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-secondary px-3.5 py-1.5 font-body text-xs text-secondary transition-colors hover:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          <Icon name="play_arrow" className="text-base" />
          Listen
        </button>
      </div>
      <details open className="group mt-3">
        <summary className="cursor-pointer font-body text-sm text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm">
          Read the summary
        </summary>
        <div className="mt-2 space-y-3 font-body text-sm leading-relaxed text-on-surface" data-listen-text>
          {paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      </details>
    </section>
  );
};

export default ListenSummaryBlock;
