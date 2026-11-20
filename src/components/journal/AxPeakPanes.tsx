import type { AxPeakPanes as Panes } from "@/content/journalAxFigures";

/**
 * The two panes of the peak moment of "One text, three readers": what a person saw in the browser, what a machine got from
 * curl. They sit inside the navy section, so every colour is a semantic token that section re-scopes. Plain markup, no
 * motion. The text version (the peak's boxes) is what the Markdown mirror and the MCP tool carry.
 */
const LABEL = "font-mono text-meta leading-snug text-secondary";

const Highlighted = ({ line, word }: { line: string; word: string }) => {
  const i = line.indexOf(word);
  if (i < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, i)}
      <mark className="rounded-sm bg-secondary px-1 font-semibold text-inverse-ground">{word}</mark>
      {line.slice(i + word.length)}
    </>
  );
};

export const AxPeakPanes = ({ panes }: { panes: Panes }) => (
  <figure data-ax-panes className="m-0 mt-9">
    <div className="grid items-stretch gap-5 md:grid-cols-2">
      <div className="rounded-[14px] border border-primary/30 p-5 md:p-[22px]">
        <p className={LABEL}>{panes.person.label}</p>
        <p className="m-0 mt-1 font-body text-sm text-on-surface-variant">{panes.person.via}</p>
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="m-0 font-headline text-2xl text-heading">{panes.person.card}</p>
          <p className="m-0 mt-3 inline-flex items-center gap-2 rounded-full border border-primary/50 px-3 py-1 font-body text-sm font-medium text-on-surface">
            <span aria-hidden="true">&#9679;</span>
            {panes.person.badge}
          </p>
        </div>
      </div>
      <div className="rounded-[14px] border border-primary/30 p-5 md:p-[22px]">
        <p className={LABEL}>{panes.machine.label}</p>
        <p className="m-0 mt-1 font-body text-sm text-on-surface-variant">{panes.machine.via}</p>
        <div
          tabIndex={0}
          role="region"
          aria-label="The snapshot, as curl returned it"
          className="mt-4 overflow-x-auto rounded-xl border border-primary/30 bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <pre className="m-0 p-4 font-mono text-meta leading-relaxed text-on-surface">
            <code>
              {panes.machine.code.map((line, i) => (
                <span key={i} className="block whitespace-pre">
                  <Highlighted line={line} word={panes.machine.highlight} />
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
    <figcaption className="mt-5 max-w-[760px] font-mono text-meta leading-snug text-on-surface-variant">{panes.caption}</figcaption>
  </figure>
);
