import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AGENTS_DOC } from "@/content/agents";
import { AGENTS_BUILD_DATE, SONOR_EXCERPT } from "@/content/agents.generated";
import { SOCIAL_LINKS } from "@/content/site";

// Raw-document page: deliberately outside SiteLayout (no header, dock, serif or gold).
const Mk = ({ children }: { children: ReactNode }) => (
  <span aria-hidden="true" className="raw-muted">{children}</span>
);

const RawLink = ({ to, children }: { to: string; children: ReactNode }) =>
  to.startsWith("/") && !to.endsWith(".md") && !to.endsWith(".txt") ? (
    <Link to={to} className="raw-link">{children}</Link>
  ) : (
    <a href={to} className="raw-link">{children}</a>
  );

const Command = ({ text, onCopied }: { text: string; onCopied: (t: string) => void }) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopied("Copied");
    } catch {
      onCopied("Copy unavailable");
    }
    window.setTimeout(() => onCopied(""), 2000);
  };
  return (
    <div className="raw-cmd">
      <code className="break-all">{text}</code>{" "}
      <button type="button" onClick={copy} className="raw-link raw-btn" aria-label={`Copy: ${text}`}>[copy]</button>
    </div>
  );
};

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-10 mb-3 font-medium"><Mk>## </Mk>{children}</h2>
);

const Agents = () => {
  const [announce, setAnnounce] = useState("");
  const [before, after] = SONOR_EXCERPT.split(AGENTS_DOC.highlight);

  return (
    <div className="raw-doc">
      <Seo
        title="For agents: MCP server, Markdown mirrors and llms files"
        description="Public, read-only access for AI agents: a public MCP server, a Markdown mirror of every page and llms files, statuses and stated limits included."
        path="/agents"
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] raw-skip">
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1} className="raw-main focus:outline-none">
        <p className="raw-muted">
          <RawLink to="/">← ivandemurard.com</RawLink> · <RawLink to="/agents.md">this page is also /agents.md</RawLink>
        </p>

        <h1 className="mt-8 font-medium"><Mk># </Mk>{AGENTS_DOC.title}</h1>
        <p className="mt-2">{AGENTS_DOC.meta(AGENTS_BUILD_DATE)}</p>
        <p className="mt-6"><Mk>&gt; </Mk>{AGENTS_DOC.lead}</p>

        <H2>Connect</H2>
        {AGENTS_DOC.connect.map((c) => (
          <div key={c.label} className="mb-4">
            <p>{c.label}</p>
            <Command text={c.command} onCopied={setAnnounce} />
          </div>
        ))}
        <span className="sr-only" role="status" aria-live="polite">{announce}</span>

        <H2>Tools</H2>
        <ul>
          {AGENTS_DOC.tools.map(([n, d]) => (
            <li key={n}><Mk>- </Mk>{n} · {d}</li>
          ))}
        </ul>

        <H2>Files</H2>
        <ul>
          {AGENTS_DOC.files.map(([n, d]) => (
            <li key={n}>
              <Mk>- </Mk>
              {n.includes("<") ? n : <RawLink to={n}>{n}</RawLink>} · {d.includes("/aetherix.md") ? <>the mirror of any page, e.g. <RawLink to="/aetherix.md">/aetherix.md</RawLink></> : d}
            </li>
          ))}
        </ul>

        <H2>Example</H2>
        <p>{AGENTS_DOC.exampleIntro}</p>
        <pre className="raw-cmd mt-3 whitespace-pre-wrap">
          {AGENTS_DOC.exampleCall}{"\n"}← {before}<mark className="raw-mark">{AGENTS_DOC.highlight}</mark>{after}
        </pre>

        <H2>Guarantees</H2>
        <ul>
          {AGENTS_DOC.guarantees.map((g) => (
            <li key={g}><Mk>- </Mk>{g}</li>
          ))}
        </ul>

        <H2>Contact</H2>
        <p>
          For a human conversation: <RawLink to={SOCIAL_LINKS.schedule}>book 30 minutes</RawLink> or{" "}
          <RawLink to={SOCIAL_LINKS.email}>email</RawLink>. The tool get_about returns the same links.
        </p>
      </main>
    </div>
  );
};

export default Agents;
