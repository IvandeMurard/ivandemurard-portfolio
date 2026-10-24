import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Streamdown } from "streamdown";

/**
 * Rose's assistant-message renderer, built on Streamdown (streaming-safe
 * Markdown parser, already used by ai-elements). Raw HTML is never rendered,
 * only https or site-relative links survive, and media/headings/tables are
 * flattened to plain text so model output cannot inject markup.
 */

/** Canonical routes Rose may link. First plain mention of each name is linked. */
export const ROSE_LINKS: Array<{ pattern: RegExp; to: string }> = [
  { pattern: /\bAetherix\b/, to: "/aetherix" },
  { pattern: /\bTacet\b/, to: "/tacet" },
  { pattern: /\bAnima\b/, to: "/anima" },
  { pattern: /\bCompass\b/, to: "/compass" },
  { pattern: /\bSonor\b/, to: "/sonor" },
  { pattern: /\bLore\b/, to: "/lore" },
  { pattern: /\bField Notes\b/, to: "/journal" },
];

const SAFE_HREF = /^(https:\/\/|http:\/\/|\/(?!\/))/i;

/** Links the first unlinked mention of each known project, outside code and existing links. */
export const linkifyProjects = (text: string): string => {
  let out = text;
  for (const { pattern, to } of ROSE_LINKS) {
    if (out.includes(`](${to})`)) continue;
    // Split out code spans and existing links so they are never touched.
    const segments = out.split(/(`[^`\n]*`|\[[^\]\n]*\]\([^)\n]*\))/);
    let done = false;
    out = segments
      .map((seg, i) => {
        if (done || i % 2 === 1) return seg;
        const m = pattern.exec(seg);
        if (!m) return seg;
        done = true;
        return `${seg.slice(0, m.index)}[${m[0]}](${to})${seg.slice(m.index + m[0].length)}`;
      })
      .join("");
  }
  return out;
};

const linkCls = "text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary";

const RoseLink = ({ href, children }: ComponentProps<"a">) => {
  if (!href || !SAFE_HREF.test(href)) return <span>{children}</span>;
  if (href.startsWith("/")) return <Link to={href} className={linkCls}>{children}</Link>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {children}
    </a>
  );
};

const Plain = ({ children }: { children?: ReactNode }) => <p className="font-semibold">{children}</p>;

const components = {
  a: RoseLink,
  p: ({ children }: { children?: ReactNode }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }: { children?: ReactNode }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }: { children?: ReactNode }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-surface-variant px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
  ),
  pre: ({ children }: { children?: ReactNode }) => <div className="my-2">{children}</div>,
  h1: Plain, h2: Plain, h3: Plain, h4: Plain, h5: Plain, h6: Plain,
  img: () => null,
  iframe: () => null,
  table: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
};

export const RoseMarkdown = ({ text, streaming = false }: { text: string; streaming?: boolean }) => (
  <Streamdown
    components={components as never}
    skipHtml
    mode={streaming ? "streaming" : "static"}
    className="text-sm text-on-surface"
  >
    {linkifyProjects(text)}
  </Streamdown>
);

/** Backwards-compatible helper used by tests and callers. */
export const renderRoseMarkdown = (text: string): ReactNode => <RoseMarkdown text={text} />;
