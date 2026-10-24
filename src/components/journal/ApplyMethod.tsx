import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { APPLY_GUIDES, applyBrief } from "@/content/journalApply";

const BTN =
  "inline-flex items-center gap-2 rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant transition-colors duration-300 hover:bg-transparent hover:border-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary h-auto whitespace-normal text-left";

/** Human checklist first; the agent brief is the secondary action. Rose stays for questioning the article. */
export const ApplyMethod = ({ slug }: { slug: string }) => {
  const g = APPLY_GUIDES[slug];
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!g) return null;
  const brief = applyBrief(g);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  };
  const rows: [string, React.ReactNode][] = [
    ["The decision", g.decision],
    ["Inputs", <ul className="list-disc pl-5 space-y-1">{g.inputs.map((i) => <li key={i}>{i}</li>)}</ul>],
    ["The artifact", g.artifact],
    ["Verification", g.verify],
  ];
  return (
    <div className="border-y border-outline-variant py-6 space-y-6">
      <dl className="grid gap-5 sm:grid-cols-[9rem_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary pt-1">{k}</dt>
            <dd className="font-body text-base">{v}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-2">Ask your agent to apply this method</p>
        <p className="font-body text-sm text-on-surface-variant mb-3">
          A brief for your own coding or research agent, applied to your project. To question this article instead, ask Rose.
        </p>
        <Button type="button" variant="ghost" className={BTN} onClick={copy}>
          <Icon name={copied ? "check" : "content_copy"} className="text-[16px] leading-none" />
          {copied ? "Brief copied" : "Copy implementation brief"}
        </Button>
        <details className="mt-3">
          <summary className="cursor-pointer font-body text-sm text-on-surface-variant hover:text-primary">Read the brief</summary>
          <pre className="mt-2 whitespace-pre-wrap rounded-sm border border-outline-variant bg-surface-container-lowest p-3 font-body text-sm text-on-surface">{brief}</pre>
        </details>
        {failed && (
          <textarea aria-label="Implementation brief" readOnly value={brief} onFocus={(e) => e.currentTarget.select()} className="mt-3 block min-h-40 w-full rounded-sm border border-outline-variant bg-surface-container-lowest p-3 font-body text-sm text-on-surface" />
        )}
        <p aria-live="polite" className="sr-only">{copied ? "Brief copied" : ""}</p>
      </div>
    </div>
  );
};
